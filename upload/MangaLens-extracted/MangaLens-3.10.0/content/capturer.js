async function captureImageData(img) {
  const w = Math.min(img.naturalWidth || CONFIG.IMG_MAX_W, CONFIG.IMG_MAX_W);
  const h = Math.min(img.naturalHeight || CONFIG.IMG_MAX_H, CONFIG.IMG_MAX_H);

  // Try direct canvas draw first (works for same-origin images)
  try {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (typeof createImageBitmap === 'function') {
      try {
        const bmp = await createImageBitmap(img, {
          resizeWidth: w,
          resizeHeight: h,
          resizeQuality: 'medium',
        });
        ctx.drawImage(bmp, 0, 0);
        bmp.close();
      } catch {
        ctx.drawImage(img, 0, 0, w, h);
      }
    } else {
      ctx.drawImage(img, 0, 0, w, h);
    }
    return canvas.toDataURL('image/jpeg', CONFIG.IMG_QUALITY).split(',')[1];
  } catch (err) {
    // Tainted canvas (CORS) — fetch via background script
    if (err.name === 'SecurityError' || err.message.includes('Tainted')) {
      return await captureViaBackground(img, w, h);
    }
    console.warn('[MangaLens] captureImageData falló:', err.message);
    return null;
  }
}

async function captureViaBackground(img, maxW, maxH) {
  const src = img.currentSrc || img.src;
  if (!src || src.startsWith('data:')) return null;
  try {
    const resp = await sendMsg({ type: 'FETCH_IMAGE', url: src });
    if (!resp?.ok || !resp.base64) return null;
    return await resizeBase64(resp.base64, resp.mime || 'image/jpeg', maxW, maxH);
  } catch (err) {
    console.warn('[MangaLens] captureViaBackground falló:', err.message);
    return null;
  }
}

function resizeBase64(base64, mime, maxW, maxH) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL('image/jpeg', CONFIG.IMG_QUALITY).split(',')[1]);
      } catch (e) { reject(e); }
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = `data:${mime};base64,${base64}`;
  });
}

function wrapText(ctx, text, maxW) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      if (ctx.measureText(word).width > maxW) {
        let partial = '';
        for (const ch of word) {
          const testCh = partial + ch;
          if (ctx.measureText(testCh).width > maxW && partial) {
            lines.push(partial);
            partial = ch;
          } else {
            partial = testCh;
          }
        }
        line = partial;
      } else {
        line = word;
      }
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [text];
}

function inpaintWithCanvas(img, textBlocks) {
  if (!textBlocks || textBlocks.length === 0) return false;
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (!w || !h) return false;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  try {
    ctx.drawImage(img, 0, 0, w, h);
  } catch {
    return false;
  }
  const sorted = [...textBlocks].sort((a, b) => {
    const areaA = (a.bbox[2] - a.bbox[0]) * (a.bbox[3] - a.bbox[1]);
    const areaB = (b.bbox[2] - b.bbox[0]) * (b.bbox[3] - b.bbox[1]);
    return areaB - areaA;
  });
  for (const block of sorted) {
    const text = block.translatedText || block.translated;
    if (!text || !text.trim()) continue;
    if (!block.bbox || block.bbox.length < 4) continue;
    const [yminP, xminP, ymaxP, xmaxP] = block.bbox;
    const x = (xminP / 100) * w;
    const y = (yminP / 100) * h;
    const bw = ((xmaxP - xminP) / 100) * w;
    const bh = ((ymaxP - yminP) / 100) * h;
    if (bw < 8 || bh < 8) continue;
    const isSFX = block.type === 'sfx';
    const isThought = block.type === 'thought';
    const isNarration = block.type === 'narration';
    const isSign = block.type === 'sign';
    let bgColor = '#ffffff';
    let darkBg = false;
    try {
      const sx = Math.max(0, Math.floor(x));
      const sy = Math.max(0, Math.floor(y));
      const sw = Math.min(Math.floor(bw), w - sx);
      const sh = Math.min(Math.floor(bh), h - sy);
      if (sw > 0 && sh > 0) {
        const imgData = ctx.getImageData(sx, sy, sw, sh);
        const data = imgData.data;
        let rS = 0, gS = 0, bS = 0, cnt = 0;
        for (let i = 0; i < data.length; i += 64) {
          rS += data[i]; gS += data[i+1]; bS += data[i+2]; cnt++;
        }
        if (cnt > 0) {
          const r = Math.round(rS / cnt);
          const g = Math.round(gS / cnt);
          const b = Math.round(bS / cnt);
          darkBg = (r * 299 + g * 587 + b * 114) / 1000 < 128;
          bgColor = `rgb(${r},${g},${b})`;
        }
      }
    } catch {}
    const pad = Math.max(4, Math.min(bw, bh) * 0.06);
    const r2 = Math.min(10, bw * 0.12, bh * 0.12);
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.moveTo(x + r2, y);
    ctx.lineTo(x + bw - r2, y);
    ctx.quadraticCurveTo(x + bw, y, x + bw, y + r2);
    ctx.lineTo(x + bw, y + bh - r2);
    ctx.quadraticCurveTo(x + bw, y + bh, x + bw - r2, y + bh);
    ctx.lineTo(x + r2, y + bh);
    ctx.quadraticCurveTo(x, y + bh, x, y + bh - r2);
    ctx.lineTo(x, y + r2);
    ctx.quadraticCurveTo(x, y, x + r2, y);
    ctx.closePath();
    ctx.fill();
    if (isThought) {
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(100,100,200,0.25)';
      ctx.lineWidth = 1;
    } else if (isNarration) {
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1.5;
    } else if (isSign) {
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 2;
    } else {
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
    }
    ctx.stroke();
    ctx.setLineDash([]);
    const maxTextW = bw - pad * 2;
    let fontSize = Math.min(bh * 0.45, maxTextW / (text.length * 0.55));
    fontSize = Math.max(10, Math.min(fontSize, 48));
    let fontWeight, fontStyle, textColor;
    if (isSFX) {
      fontWeight = '900'; fontStyle = 'italic ';
      textColor = darkBg ? '#ffcc80' : '#5a2f00';
    } else if (isThought) {
      fontWeight = '400'; fontStyle = 'italic ';
      textColor = darkBg ? '#b0bec5' : '#555';
    } else if (isNarration) {
      fontWeight = '600'; fontStyle = '';
      textColor = darkBg ? '#e0e0e0' : '#222';
    } else if (isSign) {
      fontWeight = '800'; fontStyle = '';
      textColor = darkBg ? '#fff' : '#111';
    } else {
      fontWeight = '700'; fontStyle = '';
      textColor = darkBg ? '#fff' : '#111';
    }
    ctx.font = `${fontStyle}${fontWeight} ${fontSize}px ${STATE.cachedFont || CONFIG.FONT_DEFAULT}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const cx = x + bw / 2;
    const cy = y + bh / 2;
    const lines = wrapText(ctx, text, maxTextW);
    const lh = fontSize * 1.25;
    const totalH = lines.length * lh;
    const startY = cy - totalH / 2 + lh / 2;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cx, startY + i * lh, maxTextW);
    }
  }
  try {
    img.src = canvas.toDataURL('image/png');
    img.dataset.mangalensTranslated = 'true';
    img.style.outline = '2px solid #4caf50';
    setTimeout(() => { img.style.outline = ''; }, 2000);
    return true;
  } catch {
    return false;
  }
}

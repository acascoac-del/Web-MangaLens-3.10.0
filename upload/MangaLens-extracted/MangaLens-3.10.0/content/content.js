(function () {
  if (window.__mangaLensLoaded) return;
  window.__mangaLensLoaded = true;

  runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'TOGGLE_ACTIVE') {
      STATE.isActive = !STATE.isActive;
      document.body.classList.toggle('manglens-active', STATE.isActive);
      showToast(STATE.isActive ? '🔤 Modo traducción activado' : '🔴 Modo traducción desactivado');
    }
    if (msg.type === 'TRANSLATE_ALL') {
      translateAllImages();
    }
    if (msg.type === 'UPDATE_FAB') {
      STATE.cachedShowFab = msg.showFab !== false;
      applyFabVisibility();
    }
    if (msg.type === 'UPDATE_SETTINGS') {
      if (msg.targetLang) STATE.cachedLang = msg.targetLang;
      if (msg.mangaFont) STATE.cachedFont = msg.mangaFont;
      if (msg.showFab !== undefined) { STATE.cachedShowFab = msg.showFab; applyFabVisibility(); }
    }
    sendResponse({ ok: true });
    return true;
  });

  document.addEventListener('click', async (e) => {
    if (!STATE.isActive) return;
    const img = e.target.closest('img');
    if (img && !img.dataset.mangalensTranslated) {
      e.preventDefault();
      e.stopPropagation();
      await translateOneImage(img);
    }
  }, true);

  document.addEventListener('keydown', e => {
    if (e.altKey && e.key.toLowerCase() === 'a') translateAllImages();
  });

  async function translateOneImage(img, preCaptured) {
    if (img.dataset.mangalensTranslated) return false;
    showImageLoader(img);
    try {
      const imageData = preCaptured || await captureImageData(img);
      const targetLang = await getTargetLang();
      const resp = await sendMsg({ type: 'TRANSLATE_IMAGE', imageData, targetLang });
      return applyResult(img, resp);
    } catch (err) {
      console.error('[MangaLens]', err.message);
      img.style.outline = '2px solid #f44336';
      setTimeout(() => { img.style.outline = ''; }, 3000);
      return false;
    } finally {
      removeImageLoader(img);
    }
  }

  function applyResult(img, resp) {
    if (!resp?.success || !resp.result) return false;
    const r = resp.result;
    if (r.translatedImageBase64) {
      img.src = `data:image/png;base64,${r.translatedImageBase64}`;
      img.dataset.mangalensTranslated = 'true';
      img.style.outline = '2px solid #4caf50';
      setTimeout(() => { img.style.outline = ''; }, 2000);
      return true;
    }
    if (r.textBlocks?.length > 0 && r.needsClientInpaint) {
      const ok = inpaintWithCanvas(img, r.textBlocks);
      if (!ok) {
        const summary = r.textBlocks.map(b =>
          `${b.originalText || b.original || '?'} → ${b.translatedText || b.translated || '?'}`
        ).join('\n');
        console.log('[MangaLens] Traducciones:', summary);
      }
      return ok;
    }
    if (r.noText) {
      img.dataset.mangalensTranslated = 'true';
      img.style.outline = '1px solid #888';
      setTimeout(() => { img.style.outline = ''; }, 1500);
      return true;
    }
    return false;
  }

  async function translateAllImages() {
    updateFAB('busy', 'Buscando…');
    const mangaImgs = await findMangaImages();
    if (mangaImgs.length === 0) {
      updateFAB('idle');
      showToast('✅ No hay imágenes nuevas para traducir');
      return;
    }
    const total = mangaImgs.length;
    const maxConcurrent = Math.min(CONFIG.CONCURRENCY, total);
    let done = 0, errors = 0, nextIdx = 0;
    const results = new Array(total).fill(null);
    let applyPtr = 0;
    const captureQueue = new Array(total).fill(null);

    function ensureCapture(idx) {
      if (idx < total && !captureQueue[idx]) {
        captureQueue[idx] = captureImageData(mangaImgs[idx]);
      }
    }
    for (let i = 0; i < Math.min(maxConcurrent + 2, total); i++) ensureCapture(i);

    const targetLang = await getTargetLang();
    createHUD();
    STATE.hudStartTime = Date.now();
    updateHUD({ done, total, errors });

    async function worker() {
      while (nextIdx < total) {
        const idx = nextIdx++;
        const img = mangaImgs[idx];
        ensureCapture(idx + maxConcurrent);
        ensureCapture(idx + maxConcurrent + 1);
        showImageLoader(img);
        let ok = false;
        try {
          const imageData = await captureQueue[idx];
          const resp = await sendMsg({ type: 'TRANSLATE_IMAGE', imageData, targetLang });
          ok = applyResult(img, resp);
        } catch (err) {
          console.error(`[MangaLens] Imagen ${idx + 1}/${total}:`, err.message);
          img.style.outline = '2px solid #f44336';
          setTimeout(() => { img.style.outline = ''; }, 3000);
        } finally {
          removeImageLoader(img);
        }
        results[idx] = ok;
        flush();
      }
    }

    function flush() {
      while (applyPtr < total && results[applyPtr] !== null) {
        if (!results[applyPtr]) errors++;
        done++;
        applyPtr++;
        updateHUD({ done, total, errors });
      }
    }

    await Promise.all(Array.from({ length: maxConcurrent }, () => worker()));
    hideHUD(errors === 0);
    updateFAB('idle');
    showToast(errors === 0
      ? `✅ ${total} páginas traducidas`
      : `⚠️ ${total - errors}/${total} traducidas · ${errors} con error`);
  }

  injectStyles();
  createHUD();
  createFAB();
  prefetchSettings();
  wakeUpSW();

  async function prefetchSettings() {
    try {
      const s = await sendMsg({ type: 'GET_SETTINGS' });
      if (s) {
        STATE.cachedLang = s.targetLang || 'es';
        STATE.cachedShowFab = s.showFab !== false;
        STATE.cachedFont = s.mangaFont || CONFIG.FONT_DEFAULT;
        applyFabVisibility();
      }
    } catch {}
  }

  async function wakeUpSW() {
    try {
      const resp = await sendMsg({ type: 'SW_PING' });
      if (resp?.settings) {
        STATE.cachedLang = resp.settings.targetLang || STATE.cachedLang;
        STATE.cachedShowFab = resp.settings.showFab !== false;
        STATE.cachedFont = resp.settings.mangaFont || STATE.cachedFont;
        applyFabVisibility();
        updateFAB('idle');
      }
    } catch {}
  }
})();

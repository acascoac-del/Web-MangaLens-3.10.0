function isMangaImage(img) {
  const w = img.naturalWidth || img.width || 0;
  const h = img.naturalHeight || img.height || 0;
  const reasons = [];

  if (w < CONFIG.MANGA_MIN_W || h < CONFIG.MANGA_MIN_H) {
    reasons.push(`tamaño ${w}x${h} < ${CONFIG.MANGA_MIN_W}x${CONFIG.MANGA_MIN_H}`);
  }

  const ratio = h / w;
  if (ratio < CONFIG.MANGA_MIN_RATIO || ratio > CONFIG.MANGA_MAX_RATIO) {
    reasons.push(`ratio ${ratio.toFixed(2)} fuera de [${CONFIG.MANGA_MIN_RATIO}-${CONFIG.MANGA_MAX_RATIO}]`);
  }

  const screenW = window.innerWidth || 1024;
  if (w < screenW * CONFIG.MANGA_MIN_SCREEN) {
    reasons.push(`ancho ${w} < ${Math.round(screenW * CONFIG.MANGA_MIN_SCREEN)}px (${CONFIG.MANGA_MIN_SCREEN * 100}% pantalla)`);
  }

  const src = img.src || img.currentSrc || '';
  if (CONFIG.UI_URL_RE.test(src)) {
    reasons.push(`URL coincide con patrón UI: ${src.match(CONFIG.UI_URL_RE)?.[1]}`);
  }
  if (CONFIG.UI_EXT_RE.test(src)) {
    reasons.push(`extensión UI: ${src.match(CONFIG.UI_EXT_RE)?.[1]}`);
  }

  const cls = (img.className || '') + ' ' + (img.id || '');
  if (CONFIG.UI_CLASS_RE.test(cls)) {
    reasons.push(`clase/ID UI: ${cls.match(CONFIG.UI_CLASS_RE)?.[0]}`);
  }

  const alt = (img.alt || '').toLowerCase();
  if (/^(logo|icon|avatar|profile|banner|advertisement)$/.test(alt)) {
    reasons.push(`alt text UI: "${alt}"`);
  }

  if (reasons.length > 0) {
    img._mlSkipReason = reasons.join('; ');
    return false;
  }
  return true;
}

function forceRealSrc(img) {
  for (const attr of CONFIG.LAZY_ATTRS) {
    const val = img.getAttribute(attr);
    if (val && (!img.src || img.src.startsWith('data:'))) {
      img.src = val;
      break;
    }
  }
  if (img.loading === 'lazy' || img.getAttribute('loading') === 'lazy') {
    img.loading = 'eager';
  }
}

function waitForImageLoad(img, timeoutMs = 8000) {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();
  return new Promise(resolve => {
    const done = () => { img.removeEventListener('load', done); img.removeEventListener('error', done); resolve(); };
    img.addEventListener('load', done);
    img.addEventListener('error', done);
    setTimeout(done, timeoutMs);
  });
}

async function prepareLazyImages() {
  const candidates = [...document.querySelectorAll('img')].filter(img =>
    !img.dataset.mangalensTranslated
  );
  candidates.forEach(forceRealSrc);
  await Promise.all(candidates.map(img => waitForImageLoad(img)));
  return candidates;
}

async function findMangaImages() {
  const all = await prepareLazyImages();
  const manga = [];
  const skipped = [];
  for (const img of all) {
    if (isMangaImage(img)) {
      manga.push(img);
    } else {
      skipped.push(img);
    }
  }
  if (skipped.length > 0) {
    const reasons = {};
    for (const img of skipped) {
      const r = img._mlSkipReason || 'desconocida';
      reasons[r] = (reasons[r] || 0) + 1;
    }
    const summary = Object.entries(reasons).map(([r, c]) => `${c}x ${r}`).join(' | ');
    console.log(`[MangaLens] ${skipped.length} descartadas:`, summary);
    for (const img of skipped) {
      const src = (img.src || img.currentSrc || '').slice(0, 120);
      console.log(`  ✗ ${img.naturalWidth}x${img.naturalHeight} ${src} — ${img._mlSkipReason}`);
    }
  }
  manga.sort((a, b) =>
    (a.getBoundingClientRect().top + window.scrollY) -
    (b.getBoundingClientRect().top + window.scrollY)
  );
  return manga;
}

const CONFIG = {
  IMG_MAX_W: 1000,
  IMG_MAX_H: 1600,
  IMG_QUALITY: 0.62,
  MANGA_MIN_W: 150,
  MANGA_MIN_H: 200,
  MANGA_MIN_RATIO: 0.4,
  MANGA_MAX_RATIO: 5.0,
  MANGA_MIN_SCREEN: 0.10,
  CONCURRENCY: 2,
  CAPTURE_TIMEOUT: 10000,
  FONT_DEFAULT: "'Bangers','Arial Black',sans-serif",
  UI_URL_RE: /\/(avatar|profile|icon|logo|banner|ad|ads|sponsor|button|emoji|sticker|badge|thumb[^/]*\d{1,3}x\d{1,3}|cover[^/]*\d{2,3}x\d{2,3})/i,
  UI_CLASS_RE: /avatar|profile|icon|logo|banner|sponsor|ad[-_]|sidebar|thumbnail|emoji|sticker|cover[-_]sm|cover[-_]xs/i,
  UI_EXT_RE: /\.(svg|gif)(\?|$)/i,
  LAZY_ATTRS: ['data-src', 'data-original', 'data-lazy-src', 'data-echo'],
};

const STATE = {
  isActive: false,
  cachedLang: 'es',
  cachedShowFab: true,
  cachedFont: CONFIG.FONT_DEFAULT,
  hud: null,
  hudStartTime: 0,
  fab: null,
  _swReady: false,
};

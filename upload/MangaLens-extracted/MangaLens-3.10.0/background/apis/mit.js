// ============================================================
// MangaImageTranslator (MIT) API v3.8
// OCR + Inpainting · Local Docker · Público
//
// Mejoras de velocidad v3.8:
//   · Modo OCR-only (/api/ocr): ~3-5x más rápido — devuelve
//     bloques de texto sin hacer inpainting en servidor.
//     Útil cuando NLLB local hace la traducción y content.js
//     hace el inpainting en canvas del browser.
//   · Modo completo (/api/translate): servidor hace todo.
//   · Timeout agresivo local (90s) — el servidor Docker es
//     rápido, si tarda más es que está saturado.
//   · Retry automático en error 5xx (1 reintento).
// ============================================================

export class MITAPI {
  constructor(serverType = 'public', port = 5003) {
    this.serverType = serverType;
    this.port       = port;
    const base      = serverType === 'local'
      ? `http://localhost:${port}`
      : 'https://mangaimagetranslator.com';

    this.endpoint    = `${base}/api/translate`;
    this.ocrEndpoint = `${base}/api/ocr`;

    // Timeouts más agresivos: si el servidor no responde en ese tiempo,
    // no vale la pena seguir esperando — pasar al siguiente proveedor.
    this.timeout = serverType === 'local' ? 90000 : 120000;
  }

  getServerLabel() {
    return this.serverType === 'local'
      ? `MIT Local (localhost:${this.port})`
      : 'MIT Público (mangaimagetranslator.com)';
  }

  // ── Traducción completa (OCR + inpainting en servidor) ──
  async translate({ imageData, imageUrl, targetLang = 'es' }) {
    const langCode = ISO_TO_MIT[targetLang] || 'ESP';
    const blob     = await this._resolveImage(imageData, imageUrl);

    const formData = new FormData();
    formData.append('image', blob, 'manga.jpg');
    formData.append('config_json', JSON.stringify({
      translator:    { translator: 'default', target_lang: langCode },
      font_settings: { font: 'Manga Style', size: 'Medium' },
    }));

    const data = await this._post(this.endpoint, formData);

    if (data.status === 'success' && data.result_image) {
      return {
        provider:              'mit',
        mitServer:             this.serverType,
        translatedImageBase64: data.result_image.replace(/^data:image\/[^;]+;base64,/, ''),
        textBlocks:            [],
        needsClientInpaint:    false,
        success:               true,
      };
    }

    if (data.translation_performed === false) {
      return {
        provider:  'mit',
        mitServer: this.serverType,
        textBlocks: [],
        needsClientInpaint: false,
        noText:    true,
        skipReason: data.skip_reason || 'no text detected',
      };
    }

    throw new Error(data.error || data.message || 'Respuesta inválida de MIT');
  }

  // ── Solo OCR: devuelve bloques de texto con bbox ─────────
  // ~3-5x más rápido porque el servidor no hace inpainting.
  // El caller (NLLB o content.js) se encarga de traducir + dibujar.
  async ocr({ imageData, imageUrl, targetLang = 'es' }) {
    const langCode = ISO_TO_MIT[targetLang] || 'ESP';
    const blob     = await this._resolveImage(imageData, imageUrl);

    const formData = new FormData();
    formData.append('image', blob, 'manga.jpg');
    formData.append('config_json', JSON.stringify({
      ocr_only:    true,
      target_lang: langCode,
    }));

    const data = await this._post(this.ocrEndpoint, formData);

    return {
      provider:   'mit',
      mitServer:  this.serverType,
      textBlocks: data.text_blocks || [],
      srcLang:    data.src_lang    || 'jpn_Jpan',
      noText:     !data.text_blocks?.length,
    };
  }

  // ── POST con retry ───────────────────────────────────────
  async _post(url, body, retries = 1) {
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 800));
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), this.timeout);
      try {
        const res = await fetch(url, { method: 'POST', body, signal: ctrl.signal });
        clearTimeout(timer);
        if (res.status >= 500) {
          lastErr = new Error(`MIT ${res.status}: error del servidor`);
          continue; // reintentar en 5xx
        }
        // 422 puede significar "no-text-detected" — es un resultado válido, no un error
        if (res.status === 422) {
          const data = await res.json().catch(() => ({}));
          if (data.status === 'skipped' || data.skip_reason || data.error?.includes('no-text')) {
            return { translation_performed: false, skip_reason: data.skip_reason || data.error || 'no-text-detected' };
          }
          throw new Error(`MIT API 422: ${JSON.stringify(data).slice(0, 120)}`);
        }
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`MIT API ${res.status}: ${txt.slice(0, 120)}`);
        }
        return await res.json();
      } catch (e) {
        clearTimeout(timer);
        if (e.name === 'AbortError') throw new Error(`MIT (${this.getServerLabel()}): timeout ${this.timeout / 1000}s`);
        lastErr = e;
        if (attempt < retries) continue;
      }
    }
    throw lastErr;
  }

  // ── Resolver imagen a Blob ───────────────────────────────
  async _resolveImage(imageData, imageUrl) {
    if (imageData) return this._base64ToBlob(imageData);
    if (imageUrl) {
      const r = await fetch(imageUrl, { signal: AbortSignal.timeout(15000) });
      if (!r.ok) throw new Error(`No se pudo descargar imagen: ${r.status}`);
      return r.blob();
    }
    throw new Error('Se requiere imageData o imageUrl');
  }

  // ── Verificar servidor ───────────────────────────────────
  static async checkServer(serverType = 'local', port = 5003) {
    const base = serverType === 'local'
      ? `http://localhost:${port}`
      : 'https://mangaimagetranslator.com';
    try {
      const res = await fetch(base, { method: 'GET', signal: AbortSignal.timeout(5000) });
      return { ok: res.ok || res.status === 405, status: res.status };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  _base64ToBlob(base64) {
    const clean = base64.replace(/^data:[^;]+;base64,/, '');
    const bytes = Uint8Array.from(atob(clean), c => c.charCodeAt(0));
    return new Blob([bytes], { type: 'image/jpeg' });
  }
}

// ── Mapas de idioma ──────────────────────────────────────
const ISO_TO_MIT = {
  en: 'ENG', es: 'ESP', pt: 'PTB', fr: 'FRA', de: 'DEU',
  it: 'ITA', ru: 'RUS', zh: 'CHS', ko: 'KOR', ja: 'JPN',
  ar: 'ARA', nl: 'NLD', pl: 'POL', uk: 'UKR', tr: 'TRK',
  vi: 'VIN', id: 'IND', th: 'THA', sr: 'SRP', hr: 'HRV',
};

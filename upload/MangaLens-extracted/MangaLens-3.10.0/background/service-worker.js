import { MITAPI } from './apis/mit.js';

const SW = '[MangaLens SW]';
console.log(SW, 'v3.10.0');

const DEFAULTS = {
  mode:          'mit',
  targetLang:    'es',
  showFab:       true,
  autoTranslate: false,
  mitServer:     'public',
  mitLocalPort:  5003,
  mangaFont:     "'Bangers','Arial Black',sans-serif",
  groqEnabled:   false, groqApiKey: '', groqModel: 'meta-llama/llama-4-scout-17b-16e-instruct',
  mimoEnabled:   false, mimoApiKey: '', mimoModel: 'mimo-v2.5', mimoCluster: 'singapore',
  dockerEnabled: false, dockerHost: 'localhost', dockerPort: 8080, dockerModel: '',
  nllbEnabled:   false, nllbModel: 'nllb-200-distilled-600M',
};

let _cache = null, _cacheExp = 0;
async function getSettings() {
  if (_cache && Date.now() < _cacheExp) return _cache;
  _cache = await new Promise(r => chrome.storage.sync.get(DEFAULTS, r));
  _cacheExp = Date.now() + 5000;
  return _cache;
}
function invalidateCache() { _cache = null; _cacheExp = 0; }

async function warmUp() {
  try {
    const s = await getSettings();
    const base = s.mitServer === 'local'
      ? `http://localhost:${s.mitLocalPort || 5003}`
      : 'https://mangaimagetranslator.com';
    fetch(base, { method: 'HEAD', signal: AbortSignal.timeout(4000) }).catch(() => {});
  } catch {}
}

let keepaliveTimer = null;
function startKeepalive() {
  if (keepaliveTimer) return;
  keepaliveTimer = setInterval(() => {
    fetch('https://mangaimagetranslator.com/api/translate', {
      method: 'HEAD', signal: AbortSignal.timeout(5000),
    }).catch(() => {});
  }, 20000);
}
function stopKeepalive() {
  if (keepaliveTimer) { clearInterval(keepaliveTimer); keepaliveTimer = null; }
}

chrome.runtime.onInstalled.addListener(() => { warmUp(); });
chrome.runtime.onStartup.addListener(() => { warmUp(); });
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    invalidateCache();
    if (changes.mitServer || changes.mitLocalPort) warmUp();
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(DEFAULTS, sendResponse); return true;
  }
  if (msg.type === 'SAVE_SETTINGS') {
    chrome.storage.sync.set(msg.settings, () => { invalidateCache(); sendResponse({ ok: true }); }); return true;
  }
  if (msg.type === 'SW_PING') {
    getSettings().then(s => sendResponse({ ok: true, settings: s })).catch(() => sendResponse({ ok: true }));
    return true;
  }
  if (msg.type === 'KEEPALIVE') {
    startKeepalive();
    sendResponse({ ok: true });
    return true;
  }
  if (msg.type === 'STOP_KEEPALIVE') {
    stopKeepalive();
    sendResponse({ ok: true });
    return true;
  }
  if (msg.type === 'CHECK_MIT_SERVER') {
    MITAPI.checkServer(msg.serverType || 'public', msg.port || 5003)
      .then(sendResponse).catch(e => sendResponse({ ok: false, error: e.message })); return true;
  }
  if (msg.type === 'CHECK_DOCKER_SERVER') {
    checkDockerServer(msg.host || 'localhost', msg.port || 8080)
      .then(sendResponse).catch(e => sendResponse({ ok: false, error: e.message })); return true;
  }
  if (msg.type === 'TEST_MIMO_KEY') {
    testMiMoKey(msg.apiKey, msg.model, msg.cluster)
      .then(sendResponse).catch(e => sendResponse({ ok: false, error: e.message })); return true;
  }
  if (msg.type === 'TRANSLATE_IMAGE') {
    handleTranslate(msg)
      .then(sendResponse)
      .catch(e => { console.error(SW, e); sendResponse({ success: false, error: e.message }); });
    return true;
  }
  if (msg.type === 'FETCH_IMAGE') {
    fetch(msg.url)
      .then(r => r.arrayBuffer())
      .then(buf => {
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        sendResponse({ ok: true, base64: btoa(binary), mime: 'image/jpeg' });
      })
      .catch(e => sendResponse({ ok: false, error: e.message }));
    return true;
  }
});

const MIMO_CLUSTER_URLS = {
  singapore: 'https://token-plan-sgp.xiaomimimo.com/v1',
  europe:    'https://token-plan-ams.xiaomimimo.com/v1',
  china:     'https://token-plan-cn.xiaomimimo.com/v1',
};

async function testMiMoKey(apiKey, model, cluster) {
  const baseUrl = MIMO_CLUSTER_URLS[cluster] || MIMO_CLUSTER_URLS.singapore;
  const t0 = Date.now();
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`, 'api-key': apiKey },
    body: JSON.stringify({ model, max_tokens: 20, messages: [{ role: 'user', content: '¿Funcionás? Respondé solo "sí".' }] }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) { const err = await res.text().catch(() => res.statusText); throw new Error(`HTTP ${res.status}: ${err}`); }
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content?.trim() || '(sin respuesta)';
  return { ok: true, reply, model: data.model || model, latency: Date.now() - t0 };
}

const RECOMMENDED_DOCKER_MODELS = [
  { id: 'qwen2.5-vl-7b-instruct',    label: 'Qwen2.5-VL 7B Instruct',    reason: 'Mejor equilibrio calidad/velocidad para OCR + traducción multilingüe.' },
  { id: 'minicpm-v-2_6',              label: 'MiniCPM-V 2.6',              reason: 'Más liviano (menos VRAM), buena precisión con texto JP/KR/CN.' },
  { id: 'llama3.2-vision',            label: 'Llama 3.2 Vision 11B',       reason: 'Calidad general sólida, requiere más VRAM.' },
];

async function checkDockerServer(host, port) {
  const base = `http://${host}:${port}`;
  const res = await fetch(`${base}/v1/models`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const installed = (data?.data || []).map(m => m.id).filter(Boolean);
  const missingRecommendations = RECOMMENDED_DOCKER_MODELS.filter(
    r => !installed.some(id => id.toLowerCase().includes(r.id.toLowerCase()))
  );
  return { ok: true, installed, recommendations: RECOMMENDED_DOCKER_MODELS, missingRecommendations, hasRecommended: missingRecommendations.length < RECOMMENDED_DOCKER_MODELS.length };
}

async function handleTranslate({ imageData, imageUrl, targetLang }) {
  startKeepalive();
  try {
    const s = await getSettings();
    const lang = targetLang || s.targetLang || 'es';
    const mit = new MITAPI(s.mitServer || 'public', s.mitLocalPort || 5003);
    try {
      const r = await mit.translate({ imageData, imageUrl, targetLang: lang });
      return { success: true, result: r };
    } catch (e) {
      if (s.mitServer === 'local') {
        console.warn(SW, 'MIT local falló, usando público:', e.message);
        try {
          const r = await new MITAPI('public').translate({ imageData, imageUrl, targetLang: lang });
          return { success: true, result: r };
        } catch (e2) {
          throw new Error(`MIT local: ${e.message} | MIT público: ${e2.message}`);
        }
      }
      throw e;
    }
  } finally {
    stopKeepalive();
  }
}

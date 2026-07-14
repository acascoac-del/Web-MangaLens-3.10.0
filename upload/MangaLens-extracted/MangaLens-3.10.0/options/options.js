// ============================================================
// MangaLens — options.js v3.9.2
// MIT · Groq · Xiaomi MiMo (Token Plan) · Docker Local (LocalAI)
// ============================================================

const api = (typeof browser !== 'undefined') ? browser : chrome;

// ── MiMo model notes ─────────────────────────────────────
const MIMO_MODEL_NOTES = {
  'mimo-v2.5':     'Recomendado — mejor relación calidad/velocidad. Modelo principal de MiMo V2.5.',
  'mimo-v2.5-pro': 'Máxima calidad. Ideal para manga con texto complejo. Mayor consumo de créditos.',
};

function updateMiMoNote() {
  const model = document.getElementById('mimo-model').value;
  const note  = document.getElementById('mimo-model-note');
  note.textContent = MIMO_MODEL_NOTES[model] || '';
  note.style.display = MIMO_MODEL_NOTES[model] ? 'block' : 'none';
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const s = await api.runtime.sendMessage({ type: 'GET_SETTINGS' }) || {};

  document.getElementById('target-lang').value  = s.targetLang || 'en';
  document.getElementById('default-mode').value = s.mode || 'hybrid';
  document.getElementById('show-fab').checked   = s.showFab !== false;
  document.getElementById('auto-translate').checked = !!s.autoTranslate;
  const mf = s.mangaFont || "'Bangers','Arial Black',sans-serif";
  const mfSel = document.getElementById('manga-font');
  if (mfSel && [...mfSel.options].some(o => o.value === mf)) mfSel.value = mf;

  // MIT
  const srv = s.mitServer || 'public';
  document.querySelectorAll('#mit-server-grid .cluster-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.server === srv)
  );
  document.getElementById('mit-local-port').value          = s.mitLocalPort || 5003;
  document.getElementById('mit-port-preview').textContent  = s.mitLocalPort || 5003;
  toggleMITLocal();

  // NLLB — solo disponible con MIT Local
  const nllbCb = document.getElementById('nllb-enabled');
  nllbCb.checked = !!s.nllbEnabled;
  function updateNLLBState() {
    const isLocal = document.querySelector('#mit-server-grid .cluster-btn.active')?.dataset.server === 'local';
    nllbCb.disabled = !isLocal;
    const nllbNote = document.getElementById('nllb-local-note');
    if (nllbNote) nllbNote.style.display = isLocal ? 'none' : 'block';
  }
  updateNLLBState();
  if (s.nllbModel && document.querySelector(`#nllb-model option[value="${s.nllbModel}"]`))
    document.getElementById('nllb-model').value = s.nllbModel;

  // Groq
  document.getElementById('groq-enabled').checked = !!s.groqEnabled;
  document.getElementById('groq-api-key').value   = s.groqApiKey || '';
  if (s.groqModel && document.querySelector(`#groq-model option[value="${s.groqModel}"]`))
    document.getElementById('groq-model').value = s.groqModel;

  // Xiaomi MiMo
  document.getElementById('mimo-enabled').checked = !!s.mimoEnabled;
  document.getElementById('mimo-api-key').value   = s.mimoApiKey || '';
  if (s.mimoModel && document.querySelector(`#mimo-model option[value="${s.mimoModel}"]`))
    document.getElementById('mimo-model').value = s.mimoModel;
  // Cluster
  const cluster = s.mimoCluster || 'singapore';
  document.querySelectorAll('#mimo-cluster-grid .cluster-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.cluster === cluster)
  );
  updateMiMoNote();

  // Docker Local (LocalAI)
  document.getElementById('docker-enabled').checked          = !!s.dockerEnabled;
  document.getElementById('docker-host').value                = s.dockerHost || 'localhost';
  document.getElementById('docker-host-preview').textContent   = s.dockerHost || 'localhost';
  document.getElementById('docker-port').value               = s.dockerPort || 8080;
  document.getElementById('docker-port-preview').textContent = s.dockerPort || 8080;
  document.getElementById('docker-model').value              = s.dockerModel || '';

  setupListeners();
  checkMIT();
});

// ── MIT ───────────────────────────────────────────────────
function toggleMITLocal() {
  const server = document.querySelector('#mit-server-grid .cluster-btn.active')?.dataset.server || 'public';
  document.getElementById('mit-local-config').style.display = server === 'local' ? 'block' : 'none';
}
function getMITServer() { return document.querySelector('#mit-server-grid .cluster-btn.active')?.dataset.server || 'public'; }
function getMITPort()   { return parseInt(document.getElementById('mit-local-port').value, 10) || 5003; }
function getMiMoCluster() { return document.querySelector('#mimo-cluster-grid .cluster-btn.active')?.dataset.cluster || 'singapore'; }

async function checkMIT() {
  const dot = document.getElementById('mit-dot');
  const txt = document.getElementById('mit-status-text');
  const srv = getMITServer(); const port = getMITPort();
  dot.className = 'dot checking';
  txt.textContent = `Verificando ${srv === 'local' ? 'localhost:'+port : 'mangaimagetranslator.com'}…`;
  document.getElementById('mit-result').style.display = 'none';
  try {
    const r = await api.runtime.sendMessage({ type:'CHECK_MIT_SERVER', serverType: srv, port });
    dot.className = r?.ok ? 'dot ok' : 'dot err';
    txt.textContent = r?.ok ? 'Disponible ✓' : 'Sin respuesta';
    showResult('mit-result', r?.ok ? 'ok' : 'err',
      r?.ok ? `✅ MIT ${srv === 'local' ? 'Local' : 'Público'} responde correctamente.`
             : `⚠️ Sin respuesta. ${srv === 'local' ? 'Verificá Docker.' : 'Intentá más tarde.'}`);
  } catch (e) {
    dot.className = 'dot err'; txt.textContent = 'Error';
    showResult('mit-result', 'err', `⚠️ ${e.message}`);
  }
}

// ── NLLB ─────────────────────────────────────────────────
async function testNLLB() {
  const port = parseInt(document.getElementById('mit-local-port').value, 10) || 5003;
  const btn  = document.getElementById('btn-test-nllb');
  btn.disabled = true; btn.textContent = '⏳…';
  showResult('nllb-result', 'info', `🔄 Verificando NLLB en localhost:${port}…`);
  try {
    const r = await api.runtime.sendMessage({ type: 'CHECK_NLLB_SERVER', port });
    if (r?.ok && r?.nllbSupported) {
      showResult('nllb-result', 'ok', '✅ <b>Servidor MIT activo y NLLB soportado.</b> Listo para usar.');
    } else if (r?.ok && !r?.nllbSupported) {
      showResult('nllb-result', 'info',
        `⚠️ Servidor MIT activo en localhost:${port}, pero el endpoint NLLB no responde aún.<br>
        El modelo se descarga la primera vez que se usa (~1.2GB). Si ya usaste NLLB antes y sigue fallando, el servidor puede no tener el endpoint <code>/api/translate-text</code>. Verificá que usás la imagen Docker más reciente:<br>
        <code>docker pull zyddnys/manga-image-translator:main</code>`
      );
    } else {
      showResult('nllb-result', 'err',
        `❌ MIT Local no responde en localhost:${port}.<br>
        Iniciá el servidor con:<br>
        <code>docker run -p ${port}:5003 zyddnys/manga-image-translator:main</code>`
      );
    }
  } catch (e) {
    showResult('nllb-result', 'err', `❌ ${e.message}`);
  } finally { btn.disabled = false; btn.textContent = '🔍 Verificar NLLB'; }
}

// ── Groq ──────────────────────────────────────────────────
async function testGroq() {
  const key = document.getElementById('groq-api-key').value.trim();
  const btn = document.getElementById('btn-test-groq');
  if (!key) return showResult('groq-result', 'err', '❌ Ingresá tu API Key de Groq.');
  btn.disabled = true; btn.textContent = '⏳…';
  showResult('groq-result', 'info', '🔄 Conectando con Groq…');
  try {
    const t0 = Date.now();
    const r  = await api.runtime.sendMessage({ type:'TEST_GROQ_KEY', apiKey: key });
    if (!r?.ok) throw new Error(r?.error || 'Error desconocido');
    const model = document.getElementById('groq-model').value;
    showResult('groq-result', 'ok', `✅ <b>Groq OK.</b> Latencia: <b>${Date.now()-t0}ms</b> · Modelo activo: <b>${model}</b>`);
  } catch (e) {
    showResult('groq-result', 'err', `❌ ${e.message}`);
  } finally { btn.disabled = false; btn.textContent = '🧪 Probar API Key'; }
}

// ── Xiaomi MiMo ───────────────────────────────────────────
async function testMiMo() {
  const key     = document.getElementById('mimo-api-key').value.trim();
  const model   = document.getElementById('mimo-model').value;
  const cluster = getMiMoCluster();
  const btn     = document.getElementById('btn-test-mimo');
  if (!key) return showResult('mimo-result', 'err', '❌ Ingresá tu API Key de Xiaomi MiMo Token Plan.');
  btn.disabled = true; btn.textContent = '⏳…';
  showResult('mimo-result', 'info', `🔄 Probando modelo <b>${model}</b> en MiMo (${cluster})…`);
  try {
    const r = await api.runtime.sendMessage({ type:'TEST_MIMO_KEY', apiKey: key, model, cluster });
    if (!r?.ok) throw new Error(r?.error || 'Error desconocido');
    showResult('mimo-result', 'ok',
      `✅ <b>Xiaomi MiMo OK.</b> Modelo: <b>${r.model || model}</b><br>Respuesta: "<i>${r.reply}</i>" · Latencia: <b>${r.latency}ms</b><br>Cluster: <b>${cluster}</b>`);
  } catch (e) {
    showResult('mimo-result', 'err', `❌ ${e.message}`);
  } finally { btn.disabled = false; btn.textContent = '🧪 Probar API Key'; }
}

// ── Docker Local (LocalAI) ────────────────────────────────
function getDockerHost() { return document.getElementById('docker-host').value.trim() || 'localhost'; }
function getDockerPort() { return parseInt(document.getElementById('docker-port').value, 10) || 8080; }

async function checkDocker() {
  const host = getDockerHost();
  const port = getDockerPort();
  const btn  = document.getElementById('btn-test-docker');
  btn.disabled = true; btn.textContent = '⏳…';
  document.getElementById('docker-recommendation').style.display = 'none';
  showResult('docker-result', 'info', `🔄 Consultando modelos en ${host}:${port}…`);
  try {
    const r = await api.runtime.sendMessage({ type:'CHECK_DOCKER_SERVER', host, port });
    if (r?.ok) {
      const installed = r.installed || [];

      // Poblar el datalist con los modelos detectados
      const datalist = document.getElementById('docker-models-list');
      datalist.innerHTML = '';
      installed.forEach(id => {
        const opt = document.createElement('option');
        opt.value = id;
        datalist.appendChild(opt);
      });

      showResult('docker-result', 'ok',
        installed.length
          ? `✅ <b>Contenedor OK.</b> Modelos instalados: <b>${installed.join(', ')}</b>`
          : `⚠️ El contenedor responde pero no tiene modelos instalados todavía.`);

      if (installed.length && !document.getElementById('docker-model').value.trim())
        document.getElementById('docker-model').value = installed[0];

      // Recomendación de modelos para traducción
      const missing = r.missingRecommendations || [];
      if (missing.length) {
        const items = missing.map(m => `<li><b>${m.label}</b> (<code>${m.id}</code>) — ${m.reason}</li>`).join('');
        showResult('docker-recommendation', 'info',
          `💡 <b>Recomendación para traducción:</b> ninguno de estos modelos recomendados está instalado todavía:
           <ul style="margin:8px 0 4px 18px;padding:0">${items}</ul>
           Instalalo en el contenedor, por ejemplo: <code>docker exec -it &lt;contenedor&gt; local-ai models install ${missing[0].id}</code>`);
        document.getElementById('docker-recommendation').style.display = 'block';
      }
    } else {
      showResult('docker-result', 'err', `❌ No responde en ${host}:${port}. Verificá que el contenedor esté corriendo.`);
    }
  } catch (e) {
    showResult('docker-result', 'err', `❌ ${e.message}`);
  } finally { btn.disabled = false; btn.textContent = '🔍 Ver modelos instalados'; }
}

// ── Guardar ───────────────────────────────────────────────
async function saveSettings() {
  await api.runtime.sendMessage({ type:'SAVE_SETTINGS', settings: {
    targetLang:   document.getElementById('target-lang').value,
    mode:         document.getElementById('default-mode').value,
    showFab:      document.getElementById('show-fab').checked,
    autoTranslate:document.getElementById('auto-translate').checked,
    mitServer:    getMITServer(),
    mitLocalPort: getMITPort(),
    nllbEnabled:  document.getElementById('nllb-enabled').checked,
    nllbModel:    document.getElementById('nllb-model').value,
    groqEnabled:  document.getElementById('groq-enabled').checked,
    groqApiKey:   document.getElementById('groq-api-key').value.trim(),
    groqModel:    document.getElementById('groq-model').value,
    mimoEnabled:  document.getElementById('mimo-enabled').checked,
    mimoApiKey:   document.getElementById('mimo-api-key').value.trim(),
    mimoModel:    document.getElementById('mimo-model').value,
    mimoCluster:  getMiMoCluster(),
    dockerEnabled:document.getElementById('docker-enabled').checked,
    dockerHost:   getDockerHost(),
    dockerPort:   getDockerPort(),
    dockerModel:  document.getElementById('docker-model').value.trim(),
    mangaFont:    document.getElementById('manga-font').value,
  }});
  const msg = document.getElementById('save-msg');
  msg.style.display = 'inline';
  setTimeout(() => msg.style.display = 'none', 2500);
}

// ── Shared ────────────────────────────────────────────────
function showResult(id, type, html) {
  const el = document.getElementById(id);
  el.className = `test-result test-${type}`;
  el.innerHTML = html;
  el.style.display = 'block';
}

function setupListeners() {
  document.getElementById('btn-save').addEventListener('click', saveSettings);
  document.getElementById('btn-test-mit').addEventListener('click', checkMIT);
  document.getElementById('btn-test-nllb').addEventListener('click', testNLLB);
  document.getElementById('btn-test-groq').addEventListener('click', testGroq);
  document.getElementById('btn-test-mimo').addEventListener('click', testMiMo);
  document.getElementById('btn-test-docker').addEventListener('click', checkDocker);

  // MIT server toggle
  document.querySelectorAll('#mit-server-grid .cluster-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#mit-server-grid .cluster-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); toggleMITLocal(); checkMIT(); updateNLLBState();
    });
  });
  document.getElementById('mit-local-port').addEventListener('input', e => {
    const v = parseInt(e.target.value, 10);
    if (v > 0 && v <= 65535) document.getElementById('mit-port-preview').textContent = v;
  });

  // MiMo cluster toggle
  document.querySelectorAll('#mimo-cluster-grid .cluster-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#mimo-cluster-grid .cluster-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // MiMo model note
  document.getElementById('mimo-model').addEventListener('change', updateMiMoNote);

  // Docker host/port preview
  document.getElementById('docker-host').addEventListener('input', e => {
    document.getElementById('docker-host-preview').textContent = e.target.value.trim() || 'localhost';
  });
  document.getElementById('docker-port').addEventListener('input', e => {
    const v = parseInt(e.target.value, 10);
    if (v > 0 && v <= 65535) document.getElementById('docker-port-preview').textContent = v;
  });

  // Eye toggles
  [['btn-eye-groq','groq-api-key'],['btn-eye-mimo','mimo-api-key']].forEach(([b,i]) => {
    document.getElementById(b).addEventListener('click', () => {
      const inp = document.getElementById(i);
      inp.type = inp.type === 'password' ? 'text' : 'password';
    });
  });
}

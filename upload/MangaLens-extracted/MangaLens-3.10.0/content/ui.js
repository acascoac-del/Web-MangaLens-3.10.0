function injectStyles() {
  if (document.getElementById('manglens-kf')) return;
  const s = document.createElement('style');
  s.id = 'manglens-kf';
  s.textContent = `
    @keyframes manglens-spin { to { transform: rotate(360deg); } }
    @keyframes manglens-fadein { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
    .manglens-img-ov {
      position:fixed; z-index:2147483645;
      background:rgba(0,0,0,0.42);
      display:flex; align-items:center; justify-content:center;
      pointer-events:none; border-radius:3px; font-size:28px;
    }
  `;
  (document.head || document.documentElement).appendChild(s);
}

function showToast(text, duration = 3500) {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed; top:20px; right:20px; z-index:2147483647;
    background:rgba(15,15,15,0.92); color:#fff;
    padding:10px 18px; border-radius:10px;
    font:600 13px 'Segoe UI',system-ui,sans-serif;
    box-shadow:0 4px 16px rgba(0,0,0,0.45);
    backdrop-filter:blur(6px);
    animation:manglens-fadein .25s ease;
    pointer-events:none; max-width:360px;
  `;
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

function createHUD() {
  if (document.getElementById('manglens-hud')) {
    STATE.hud = document.getElementById('manglens-hud');
    return;
  }
  STATE.hud = document.createElement('div');
  STATE.hud.id = 'manglens-hud';
  STATE.hud.style.cssText = `
    position:fixed; bottom:90px; right:20px; z-index:2147483646;
    background:rgba(15,15,15,0.93); color:#fff;
    padding:12px 18px; border-radius:14px;
    font:600 13px/1.5 'Segoe UI',system-ui,sans-serif;
    box-shadow:0 4px 18px rgba(0,0,0,0.5);
    backdrop-filter:blur(6px);
    min-width:220px; display:none;
    border:1px solid rgba(229,57,53,0.35);
  `;
  document.body.appendChild(STATE.hud);
}

function updateHUD({ done, total, errors }) {
  if (!STATE.hud) createHUD();
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const left = total - done;
  const current = done + 1;
  let eta = '';
  if (done > 0 && STATE.hudStartTime > 0) {
    const elapsed = (Date.now() - STATE.hudStartTime) / 1000;
    const perImg = elapsed / done;
    const remaining = Math.round(perImg * left);
    if (remaining > 60) eta = `~${Math.round(remaining / 60)}m ${remaining % 60}s`;
    else if (remaining > 0) eta = `~${remaining}s`;
  }
  STATE.hud.style.display = 'block';
  STATE.hud.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <span style="font-size:13px">🈯 Traduciendo</span>
      <span style="color:#e53935;font-size:15px;font-weight:800">${pct}%</span>
    </div>
    <div style="background:#333;border-radius:99px;height:6px;overflow:hidden;margin-bottom:8px;">
      <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#e53935,#ff7043);border-radius:99px;transition:width .4s ease"></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#aaa;font-size:12px">
        📄 Página <b style="color:#fff">${done === total ? total : current}</b> de <b style="color:#fff">${total}</b>
        ${errors ? ` · ❌ <b style="color:#f77">${errors}</b>` : ''}
      </span>
      ${eta ? `<span style="color:#888;font-size:11px">⏱ ${eta}</span>` : ''}
    </div>
  `;
}

function hideHUD(success) {
  if (!STATE.hud) return;
  STATE.hud.innerHTML = `<div style="text-align:center;padding:2px 0;">${success ? '✅ <b>¡Todo traducido!</b>' : '⚠️ Finalizado con errores'}</div>`;
  setTimeout(() => { if (STATE.hud) STATE.hud.style.display = 'none'; }, 3000);
}

function showImageLoader(img) {
  const rect = img.getBoundingClientRect();
  const ov = document.createElement('div');
  ov.className = 'manglens-img-ov';
  ov.style.cssText = `
    position:fixed;
    top:${rect.top}px; left:${rect.left}px;
    width:${rect.width}px; height:${rect.height}px;
    background:rgba(0,0,0,0.42); z-index:2147483645;
    display:flex; align-items:center; justify-content:center;
    pointer-events:none; border-radius:3px; font-size:28px;
  `;
  ov.innerHTML = '<span style="animation:manglens-spin 1s linear infinite;display:inline-block">⏳</span>';
  document.body.appendChild(ov);
  img._mlOv = ov;
}

function removeImageLoader(img) {
  if (img._mlOv) { img._mlOv.remove(); img._mlOv = null; }
}

function createFAB() {
  if (document.getElementById('manglens-fab')) {
    STATE.fab = document.getElementById('manglens-fab');
    return;
  }
  STATE.fab = document.createElement('button');
  STATE.fab.id = 'manglens-fab';
  STATE.fab.style.cssText = `
    position:fixed; bottom:20px; right:20px; z-index:2147483647;
    padding:13px 22px; background:#e53935; color:white;
    border:none; border-radius:50px;
    font:700 14px 'Segoe UI',system-ui,sans-serif;
    box-shadow:0 6px 20px rgba(229,57,53,0.4); cursor:pointer;
    transition:background .2s, transform .15s, opacity .3s;
  `;
  STATE.fab.onmouseenter = () => { if (!STATE.fab.dataset.busy) STATE.fab.style.transform = 'scale(1.05)'; };
  STATE.fab.onmouseleave = () => { STATE.fab.style.transform = ''; };
  STATE.fab.onclick = () => { if (STATE.fab.dataset.busy !== '1') translateAllImages(); };
  document.body.appendChild(STATE.fab);
  updateFAB('idle');
  applyFabVisibility();
}

function updateFAB(state, label) {
  if (!STATE.fab) return;
  if (state === 'busy') {
    STATE.fab.dataset.busy = '1';
    STATE.fab.style.background = '#555';
    STATE.fab.innerHTML = `⏳ ${label || 'Traduciendo…'}`;
  } else {
    delete STATE.fab.dataset.busy;
    STATE.fab.style.background = '#e53935';
    STATE.fab.innerHTML = `📄 Traducir todo`;
  }
}

function applyFabVisibility() {
  if (!STATE.fab) return;
  STATE.fab.style.display = STATE.cachedShowFab !== false ? '' : 'none';
}

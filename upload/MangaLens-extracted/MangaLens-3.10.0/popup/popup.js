const api = (typeof browser !== 'undefined') ? browser : chrome;
let S = {};

document.addEventListener('DOMContentLoaded', async () => {
  S = await api.runtime.sendMessage({ type: 'GET_SETTINGS' }) || {};
  document.getElementById('lang-select').value = S.targetLang || 'es';
  document.getElementById('mode-select').value = S.mode || 'hybrid';
  const fontSel = document.getElementById('font-select');
  if (S.mangaFont && fontSel.querySelector(`option[value="${CSS.escape(S.mangaFont)}"]`)) {
    fontSel.value = S.mangaFont;
  }
  document.getElementById('show-fab').checked = S.showFab !== false;
  setupListeners();
});

async function save(patch) {
  Object.assign(S, patch);
  await api.runtime.sendMessage({ type: 'SAVE_SETTINGS', settings: patch });
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'UPDATE_SETTINGS', ...patch }).catch(() => {});
  }
}

function setupListeners() {
  document.getElementById('lang-select').addEventListener('change', e => save({ targetLang: e.target.value }));
  document.getElementById('mode-select').addEventListener('change', e => save({ mode: e.target.value }));
  document.getElementById('font-select').addEventListener('change', e => save({ mangaFont: e.target.value }));
  document.getElementById('show-fab').addEventListener('change', e => save({ showFab: e.target.checked }));
  document.getElementById('btn-activate').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, t =>
      chrome.tabs.sendMessage(t[0].id, { type: 'TOGGLE_ACTIVE' }).catch(() => {})
    );
  });
  document.getElementById('btn-all').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, t =>
      chrome.tabs.sendMessage(t[0].id, { type: 'TRANSLATE_ALL' }).catch(() => {})
    );
  });
  document.getElementById('link-options').addEventListener('click', e => {
    e.preventDefault();
    api.runtime.openOptionsPage();
  });
}

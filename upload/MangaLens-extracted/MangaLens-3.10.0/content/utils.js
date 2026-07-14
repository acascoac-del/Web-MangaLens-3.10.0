const runtime = (typeof browser !== 'undefined' && browser.runtime) ? browser.runtime : chrome.runtime;

function sendMsg(msg) {
  return new Promise((res, rej) => {
    runtime.sendMessage(msg, resp => {
      if (runtime.lastError) return rej(new Error(runtime.lastError.message));
      res(resp);
    });
  });
}

async function getTargetLang() {
  try {
    const s = await sendMsg({ type: 'GET_SETTINGS' });
    return s?.targetLang || 'es';
  } catch {
    try {
      const s = await new Promise(res => {
        const api = typeof browser !== 'undefined' && browser.storage ? browser : chrome;
        api.storage.sync.get({ targetLang: 'es' }, res);
      });
      return s.targetLang || 'es';
    } catch {
      return 'es';
    }
  }
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/* Progress and settings, stored in localStorage of this browser only. MIT License. */
(function () {
  "use strict";

  var KEY = "cherdak-type-lab:v1";
  var available = true;
  var state = load();

  function blank() {
    return { version: 1, lang: null, theme: null, modules: {}, sandbox: null };
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return blank();
      var data = JSON.parse(raw);
      return data && data.version === 1 ? Object.assign(blank(), data) : blank();
    } catch (e) {
      available = false;
      return blank();
    }
  }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { available = false; }
  }

  function mod(id) {
    if (!state.modules[id]) state.modules[id] = { step: 0, maxStep: 0, done: false, quiz: {} };
    return state.modules[id];
  }

  window.Store = {
    get available() { return available; },
    get: function (k) { return state[k]; },
    set: function (k, v) { state[k] = v; save(); },
    module: function (id) { return mod(id); },
    peekModule: function (id) { return state.modules[id] || null; },
    updateModule: function (id, patch) { Object.assign(mod(id), patch); save(); },
    exportJSON: function () { return JSON.stringify(state, null, 2); },
    importJSON: function (text) {
      var data = JSON.parse(text);
      if (!data || data.version !== 1 || typeof data.modules !== "object") throw new Error("bad file");
      state = Object.assign(blank(), data);
      save();
    },
    reset: function () {
      var keep = { lang: state.lang, theme: state.theme };
      state = Object.assign(blank(), keep);
      save();
    }
  };
})();

/* PAKSTAR SARL — safe Local Storage wrapper.
   Local Storage lives only in the visitor's own browser. It is NOT a database and is
   never a substitute for a secure backend. Only non-sensitive UI values are stored here
   (language, a draft of non-identifying inquiry choices). */
window.PXStore = (function () {
  var P = 'pakstar.';
  var mem = {};
  function works(store) {
    try { var k = '__px'; store.setItem(k, '1'); store.removeItem(k); return true; } catch (e) { return false; }
  }
  var LS = works(window.localStorage || {}) ? window.localStorage : null;
  var SS = works(window.sessionStorage || {}) ? window.sessionStorage : null;
  function make(store, bag) {
    return {
      get: function (k, d) {
        try {
          if (!store) return k in bag ? bag[k] : d;
          var v = store.getItem(P + k);
          return v === null ? d : JSON.parse(v);
        } catch (e) { return d; }
      },
      set: function (k, v) {
        try { if (store) store.setItem(P + k, JSON.stringify(v)); else bag[k] = v; } catch (e) { bag[k] = v; }
      },
      remove: function (k) {
        try { if (store) store.removeItem(P + k); } catch (e) {}
        delete bag[k];
      }
    };
  }
  var local = make(LS, mem);
  local.session = make(SS, {});
  return local;
})();

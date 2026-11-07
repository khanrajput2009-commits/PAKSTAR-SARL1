/* PAKSTAR SARL — tiny i18n engine (English / Français).
   Dictionary lives in js/lang-data.js. Any element with data-i18n="key" is re-written on
   language change; data-i18n-ph / -aria / -alt / -title / -content translate attributes. */
(function (w) {
  var D = w.PX_LANG || { en: {}, fr: {} };
  var SUP = ['en', 'fr'];
  var lang = 'en';
  var ATTRS = {
    'data-i18n-ph': 'placeholder',
    'data-i18n-aria': 'aria-label',
    'data-i18n-alt': 'alt',
    'data-i18n-title': 'title',
    'data-i18n-content': 'content'
  };

  function t(key, vars) {
    var v = D[lang] && D[lang][key];
    if (v == null) v = D.en && D.en[key];
    if (v == null) return key;
    if (vars) for (var x in vars) v = v.split('{' + x + '}').join(vars[x]);
    return v;
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (el.hasAttribute('data-i18n-html')) el.innerHTML = v; else el.textContent = v;
    });
    Object.keys(ATTRS).forEach(function (a) {
      root.querySelectorAll('[' + a + ']').forEach(function (el) {
        el.setAttribute(ATTRS[a], t(el.getAttribute(a)));
      });
    });
    if (root === document) {
      document.querySelectorAll('[data-lang-current]').forEach(function (el) { el.textContent = lang.toUpperCase(); });
      document.querySelectorAll('[data-set-lang]').forEach(function (el) {
        var on = el.getAttribute('data-set-lang') === lang;
        el.setAttribute(el.getAttribute('role') === 'menuitemradio' ? 'aria-checked' : 'aria-pressed', on ? 'true' : 'false');
      });
    }
  }

  function detect() {
    var s = w.PXStore && w.PXStore.get('lang');
    if (s && SUP.indexOf(s) > -1) return s;
    var nav = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase();
    return nav.indexOf('fr') === 0 ? 'fr' : 'en';
  }

  function set(l, silent) {
    if (SUP.indexOf(l) < 0) return;
    var changed = l !== lang;
    lang = l;
    if (w.PXStore) w.PXStore.set('lang', l);
    document.documentElement.lang = l;
    apply(document);
    if (changed) document.dispatchEvent(new CustomEvent('px:lang', { detail: { lang: l, silent: !!silent } }));
  }

  function init() {
    lang = detect();
    document.documentElement.lang = lang;
    apply(document);
  }

  w.I18N = { t: t, apply: apply, set: set, init: init, supported: SUP, get lang() { return lang; } };
})(window);

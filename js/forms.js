/* PAKSTAR SARL — form validation, inquiry state & draft handling.
   ----------------------------------------------------------------
   FRONTEND DEMO: unless window.PAKSTAR_CONFIG.formEndpoint is set (see README), a valid
   form is only validated in the browser and a clearly-labelled demonstration confirmation
   is shown. NOTHING is delivered to PAKSTAR SARL in demo mode.
   Draft saving stores ONLY non-identifying choices (model, country, contact method) in
   Local Storage on this device — never names, e-mails, phone numbers or messages. */
(function (w, d) {
  var T = function (k, v) { return w.I18N.t(k, v); };
  var CFG = w.PAKSTAR_CONFIG = w.PAKSTAR_CONFIG || { formEndpoint: '' };
  var ICON_OK = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" style="margin-top:.2rem"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var ICON_WARN = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" style="margin-top:.2rem"><path d="M12 8v5M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/></svg>';

  function fieldOf(el) { return el.closest('.field'); }

  function messageFor(el) {
    var v = el.value.trim();
    if (el.type === 'checkbox') return el.checked ? '' : T('f.err.consent');
    if (el.type === 'radio') return '';
    if (el.required && !v) return T('f.err.required');
    if (!v) return '';
    if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return T('f.err.email');
    if (el.type === 'tel' && !/^\+?[\d\s().-]{6,20}$/.test(v)) return T('f.err.phone');
    var min = parseInt(el.getAttribute('minlength'), 10);
    if (min && v.length < min) return T('f.err.min', { n: min });
    return '';
  }

  function paint(el, msg) {
    var f = fieldOf(el); if (!f) return;
    var m = f.querySelector('.field__msg');
    f.classList.toggle('is-invalid', !!msg);
    f.classList.toggle('is-valid', !msg && el.value.trim() !== '' && el.type !== 'checkbox');
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (m) { m.innerHTML = msg ? ICON_WARN.replace('margin-top:.2rem', 'margin-top:0') + '<span>' + msg + '</span>' : ''; }
  }

  function validateField(el) { var msg = messageFor(el); paint(el, msg); return !msg; }

  function setupField(form, el) {
    var f = fieldOf(el); if (!f) return;
    var m = f.querySelector('.field__msg');
    if (!m) { m = d.createElement('div'); m.className = 'field__msg'; m.setAttribute('role', 'alert'); f.appendChild(m); }
    if (!m.id) m.id = 'err-' + (el.id || el.name);
    var desc = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (desc.indexOf(m.id) < 0) desc.push(m.id);
    el.setAttribute('aria-describedby', desc.join(' '));
    el.addEventListener('blur', function () { if (el.value !== '' || f.classList.contains('is-invalid')) validateField(el); });
    el.addEventListener('input', function () { if (f.classList.contains('is-invalid')) validateField(el); });
    el.addEventListener('change', function () { if (f.classList.contains('is-invalid')) validateField(el); });
  }

  /* ---------- drafts (non-identifying choices only) ---------- */
  function draftKey(form) { return 'draft.' + form.getAttribute('data-draft'); }
  function saveDraft(form) {
    if (!form.hasAttribute('data-draft')) return;
    var o = {};
    form.querySelectorAll('[data-draft-field]').forEach(function (el) {
      if (el.type === 'radio') { if (el.checked) o[el.name] = el.value; } else o[el.name] = el.value;
    });
    w.PXStore.set(draftKey(form), o);
  }
  function restoreDraft(form) {
    if (!form.hasAttribute('data-draft')) return;
    var o = w.PXStore.get(draftKey(form), null); if (!o) return;
    form.querySelectorAll('[data-draft-field]').forEach(function (el) {
      if (!(el.name in o)) return;
      if (el.id === 'model' && new URLSearchParams(location.search).get('model')) return; // URL beats a stored draft
      if (el.type === 'radio') el.checked = el.value === o[el.name];
      else if (el.tagName !== 'SELECT' || Array.prototype.some.call(el.options, function (op) { return op.value === o[el.name]; })) el.value = o[el.name];
    });
  }

  /* ---------- status panels ---------- */
  function show(form, kind, titleKey, bodyKey) {
    var box = form.querySelector('[data-status]'); if (!box) return;
    box.className = 'alert-px alert-px--' + kind + ' is-show';
    box.setAttribute('role', kind === 'err' ? 'alert' : 'status');
    box.innerHTML = (kind === 'err' ? ICON_WARN : ICON_OK) + '<div><b>' + T(titleKey) + '</b><p>' + T(bodyKey) + '</p></div>';
    box.setAttribute('data-keys', titleKey + '|' + bodyKey + '|' + kind);
    box.scrollIntoView({ block: 'nearest', behavior: w.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
  }
  function hide(form) { var box = form.querySelector('[data-status]'); if (box) { box.className = 'alert-px'; box.innerHTML = ''; box.removeAttribute('data-keys'); } }

  function submit(form) {
    var btn = form.querySelector('[type="submit"]');
    var fields = form.querySelectorAll('input:not([type="hidden"]):not([type="radio"]),select,textarea');
    var firstBad = null, ok = true;
    fields.forEach(function (el) { if (!validateField(el)) { ok = false; if (!firstBad) firstBad = el; } });
    if (!ok) {
      hide(form); show(form, 'err', 'f.status.invalid.t', 'f.status.invalid.d');
      if (firstBad) firstBad.focus();
      w.PXUI && w.PXUI.toast(T('f.toast.invalid'), 'err');
      return;
    }
    hide(form);
    btn.classList.add('is-loading'); btn.disabled = true;

    var finish = function (real, error) {
      btn.classList.remove('is-loading'); btn.disabled = false;
      if (error) { show(form, 'err', 'f.status.fail.t', 'f.status.fail.d'); w.PXUI && w.PXUI.toast(T('f.toast.fail'), 'err'); return; }
      show(form, real ? 'ok' : 'demo', real ? 'f.status.ok.t' : 'f.status.demo.t', real ? 'f.status.ok.d' : 'f.status.demo.d');
      w.PXUI && w.PXUI.toast(T(real ? 'f.toast.ok' : 'f.toast.demo'), 'ok');
      var keep = form.hasAttribute('data-draft') ? true : false;
      form.reset();
      form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('is-valid', 'is-invalid'); });
      if (keep) w.PXStore.remove(draftKey(form));
      document.dispatchEvent(new CustomEvent('px:formreset', { detail: { form: form } }));
    };

    if (CFG.formEndpoint) {
      var data = new FormData(form);
      fetch(CFG.formEndpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) { finish(r.ok, !r.ok); })
        .catch(function () { finish(false, true); });
    } else {
      setTimeout(function () { finish(false, false); }, 900); // demo only
    }
  }

  function init() {
    d.querySelectorAll('form[data-form]').forEach(function (form) {
      form.setAttribute('novalidate', '');
      form.querySelectorAll('input:not([type="hidden"]):not([type="radio"]),select,textarea').forEach(function (el) { setupField(form, el); });
      restoreDraft(form);
      form.addEventListener('input', function (e) { if (e.target.hasAttribute('data-draft-field')) saveDraft(form); });
      form.addEventListener('change', function (e) { if (e.target.hasAttribute('data-draft-field')) saveDraft(form); });
      form.addEventListener('submit', function (e) { e.preventDefault(); submit(form); });
      var clear = form.querySelector('[data-clear-draft]');
      if (clear) clear.addEventListener('click', function () { form.reset(); w.PXStore.remove(draftKey(form)); syncModel(); w.PXUI && w.PXUI.toast(T('f.toast.cleared'), 'ok'); });
    });
    syncModel();
  }

  /* ---------- model selector on the inquiry page ---------- */
  function populateModels() {
    var sel = d.getElementById('model'); if (!sel) return;
    var cur = sel.value || sel.getAttribute('data-initial') || '';
    var html = '<option value="">' + w.PX.esc(T('inq.model.general')) + '</option>';
    w.PX.products.forEach(function (p) { html += '<option value="' + p.id + '">' + w.PX.esc(w.PX.name(p) + ' — ' + w.PX.catName(p.cat) + ' · ' + w.PX.price(p)) + '</option>'; });
    sel.innerHTML = html; sel.value = cur;
    if (sel.value !== cur) sel.value = '';
  }
  function syncModel() {
    var sel = d.getElementById('model'), box = d.getElementById('selectedModel'); if (!sel || !box) return;
    var p = w.PX.get(sel.value);
    if (!p) { box.classList.remove('is-show'); box.innerHTML = ''; return; }
    box.classList.add('is-show');
    box.innerHTML = '<span class="bk">' + w.PX.art(p, 'side').replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true"') + '</span>' +
      '<div><div class="p-card__cat">' + w.PX.esc(T('inq.selected')) + '</div><strong style="font-family:var(--ff-d);font-size:1.4rem;text-transform:uppercase;letter-spacing:.03em">' + w.PX.esc(w.PX.name(p)) + '</strong><div style="font-size:.85rem;color:var(--mute)">' + w.PX.esc(w.PX.catName(p.cat)) + ' · ' + w.PX.esc(T('c.from')) + ' ' + w.PX.esc(w.PX.price(p)) + '</div></div>';
    box.querySelector('.bk').style.cssText = 'width:96px;flex:none';
  }
  function initInquiry() {
    var sel = d.getElementById('model'); if (!sel) return;
    var qm = new URLSearchParams(location.search).get('model');
    if (qm && w.PX.get(qm)) sel.setAttribute('data-initial', qm);
    populateModels();
    if (qm && w.PX.get(qm)) sel.value = qm; // URL beats any stored draft
    sel.addEventListener('change', syncModel);
    syncModel();
  }

  d.addEventListener('px:lang', function () {
    populateModels(); syncModel();
    // re-render visible validation messages & status in the new language
    d.querySelectorAll('form[data-form]').forEach(function (form) {
      form.querySelectorAll('.field.is-invalid').forEach(function (f) { var el = f.querySelector('input,select,textarea'); if (el) validateField(el); });
      var box = form.querySelector('[data-status]'), k = box && box.getAttribute('data-keys');
      if (k) { var a = k.split('|'); show(form, a[2], a[0], a[1]); }
    });
  });

  w.PXForms = { init: function () { initInquiry(); init(); } };
})(window, document);

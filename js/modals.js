/* PAKSTAR SARL — accessible product modal + image lightbox.
   One shared overlay of each kind is created lazily (never duplicated).
   Behaviour: focus trap, Esc / backdrop / button close, scroll lock, inert background,
   focus returns to the trigger. Every [data-quick] button on every page opens the
   matching product thanks to event delegation. */
(function (w, d) {
  var PX = w.PX, T = function (k, v) { return w.I18N.t(k, v); };
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  var stack = []; // open overlays, topmost last
  var inerted = [];
  var ICON_X = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_CHECK = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var ICON_ARROW = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
  function focusables(root) { return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), visible); }

  function lockScroll(on) {
    if (on) {
      var sw = w.innerWidth - d.documentElement.clientWidth;
      d.body.style.paddingRight = sw > 0 ? sw + 'px' : '';
      d.body.classList.add('is-locked');
    } else {
      d.body.classList.remove('is-locked');
      d.body.style.paddingRight = '';
    }
  }
  function setInert(root, on) {
    if (on) {
      Array.prototype.forEach.call(d.body.children, function (el) {
        if (el === root || el.tagName === 'SCRIPT' || el.hasAttribute('data-keep-active') || el.inert) return;
        el.inert = true; el.setAttribute('aria-hidden', 'true'); inerted.push(el);
      });
    } else {
      inerted.forEach(function (el) { el.inert = false; el.removeAttribute('aria-hidden'); });
      inerted = [];
    }
  }

  function trapTab(e, root) {
    if (e.key !== 'Tab') return;
    var f = focusables(root);
    if (!f.length) { e.preventDefault(); root.focus(); return; }
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (d.activeElement === first || d.activeElement === root)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ====================================================== product modal */
  var pm = null, pmState = { id: null, view: 'side', trigger: null };

  function buildPM() {
    if (pm) return pm;
    pm = d.createElement('div');
    pm.className = 'pm-root';
    pm.id = 'productModal';
    pm.innerHTML = '<div class="pm-backdrop" data-pm-close></div>' +
      '<div class="pm-dialog"><div class="pm-sheet" role="dialog" aria-modal="true" aria-labelledby="pmTitle" tabindex="-1">' +
      '<button type="button" class="pm-close" data-pm-close aria-label="">' + ICON_X + '</button>' +
      '<div class="pm-grid"></div></div></div>';
    d.body.appendChild(pm);
    pm.addEventListener('click', function (e) {
      if (e.target.closest('[data-pm-close]')) { closePM(); return; }
      var a = e.target.closest('a[href]');
      if (a && a.hasAttribute('data-pm-link')) { closePM(true); }
    });
    // clicking the dim area around the sheet (dialog wrapper) closes as well
    pm.querySelector('.pm-dialog').addEventListener('click', function (e) { if (e.target === e.currentTarget) closePM(); });
    return pm;
  }

  function renderPM() {
    var p = PX.get(pmState.id); if (!p) return;
    var grid = pm.querySelector('.pm-grid');
    var rows = PX.specRows(p);
    grid.innerHTML =
      '<div class="pm-media"><div class="pm-stage">' + PX.art(p, 'side') + '</div></div>' +
      '<div class="pm-info"><span class="pm-cat">' + PX.esc(PX.catName(p.cat)) + '</span>' +
      '<h2 id="pmTitle">' + PX.esc(PX.name(p)) + '</h2><p>' + PX.esc(PX.desc(p)) + '</p>' +
      '<dl class="spec-list">' + rows.map(function (s) { return '<div><dt>' + PX.esc(T(s[0])) + '</dt><dd>' + PX.esc(s[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<ul class="feat">' + p.features.map(function (f) { return '<li>' + ICON_CHECK + '<span>' + PX.esc(PX.tr(f)) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="pm-price"><span>' + PX.esc(T('c.from')) + '</span><strong>' + PX.esc(PX.price(p)) + '</strong></div>' +
      '<p class="demo-note" style="margin:.4rem 0 1.1rem">' + PX.esc(T('c.price.note')) + '</p>' +
      '<div class="pm-actions"><a class="px-btn" data-pm-link href="inquiry.html?model=' + p.id + '"><span>' + PX.esc(T('c.inquire')) + '</span>' + ICON_ARROW + '</a>' +
      '<a class="px-btn px-btn--ghost" data-pm-link href="product-details.html?id=' + p.id + '"><span>' + PX.esc(T('c.fulldetails')) + '</span></a></div></div>';
    pm.querySelector('.pm-close').setAttribute('aria-label', T('c.close'));
  }

  function openPM(id, trigger) {
    if (!PX.get(id)) return;
    buildPM();
    pmState.id = id; pmState.view = 'side';
    if (!pmState.open) pmState.trigger = trigger || d.activeElement;
    renderPM();
    if (!pmState.open) {
      pmState.open = true;
      pm.classList.add('is-mounted');
      lockScroll(true); setInert(pm, true);
      stack.push('pm');
      void pm.offsetWidth; // flush so the transition runs
      pm.classList.add('is-open');
    }
    var sheet = pm.querySelector('.pm-sheet'); sheet.scrollTop = 0;
    setTimeout(function () { var c = pm.querySelector('.pm-close'); c && c.focus(); }, 30);
  }

  function closePM(skipFocus) {
    if (!pmState.open) return;
    pmState.open = false;
    pm.classList.remove('is-open');
    stack = stack.filter(function (x) { return x !== 'pm'; });
    var done = function () {
      pm.classList.remove('is-mounted');
      if (!stack.length) { setInert(pm, false); lockScroll(false); }
      if (!skipFocus && pmState.trigger && d.contains(pmState.trigger)) { try { pmState.trigger.focus(); } catch (e) {} }
    };
    setTimeout(done, w.matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 380);
  }

  /* ====================================================== lightbox */
  var lb = null, lbState = { items: [], i: 0, trigger: null, open: false };

  function buildLB() {
    if (lb) return lb;
    lb = d.createElement('div');
    lb.className = 'lb'; lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('tabindex', '-1');
    lb.innerHTML = '<button type="button" class="lb__close" data-lb-close>' + ICON_X + '</button>' +
      '<button type="button" class="lb__btn lb__prev" data-lb-prev><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<div class="lb__stage" aria-live="polite"></div>' +
      '<button type="button" class="lb__btn lb__next" data-lb-next><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<div class="lb__cap"></div>';
    d.body.appendChild(lb);
    lb.addEventListener('click', function (e) {
      if (e.target.closest('[data-lb-close]') || e.target === lb || e.target.classList.contains('lb__stage')) closeLB();
      else if (e.target.closest('[data-lb-prev]')) stepLB(-1);
      else if (e.target.closest('[data-lb-next]')) stepLB(1);
    });
    // touch swipe
    var sx = null;
    lb.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') sx = e.clientX; });
    lb.addEventListener('pointerup', function (e) {
      if (sx == null) return; var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) stepLB(dx < 0 ? 1 : -1);
    });
    return lb;
  }

  function renderLB() {
    var it = lbState.items[lbState.i]; if (!it) return;
    lb.querySelector('.lb__stage').innerHTML = it.svg;
    lb.querySelector('.lb__cap').textContent = it.caption + '  ·  ' + (lbState.i + 1) + ' / ' + lbState.items.length;
    lb.setAttribute('aria-label', it.caption);
    lb.querySelector('.lb__close').setAttribute('aria-label', T('c.close'));
    lb.querySelector('.lb__prev').setAttribute('aria-label', T('c.prev'));
    lb.querySelector('.lb__next').setAttribute('aria-label', T('c.next'));
    var single = lbState.items.length < 2;
    lb.querySelector('.lb__prev').hidden = single; lb.querySelector('.lb__next').hidden = single;
  }
  function stepLB(n) {
    var len = lbState.items.length; if (len < 2) return;
    lbState.i = (lbState.i + n + len) % len; renderLB();
  }
  function openLB(items, index, trigger) {
    if (!items.length) return;
    buildLB();
    lbState.items = items; lbState.i = index || 0;
    if (!lbState.open) lbState.trigger = trigger || d.activeElement;
    renderLB();
    if (!lbState.open) {
      lbState.open = true;
      lb.classList.add('is-mounted');
      lockScroll(true); setInert(lb, true);
      stack.push('lb');
      void lb.offsetWidth; lb.classList.add('is-open');
    }
    setTimeout(function () { lb.querySelector('.lb__close').focus(); }, 30);
  }
  function closeLB() {
    if (!lbState.open) return;
    lbState.open = false; lb.classList.remove('is-open');
    stack = stack.filter(function (x) { return x !== 'lb'; });
    setTimeout(function () {
      lb.classList.remove('is-mounted');
      if (!stack.length) { setInert(lb, false); lockScroll(false); }
      if (lbState.trigger && d.contains(lbState.trigger)) { try { lbState.trigger.focus(); } catch (e) {} }
    }, w.matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 320);
  }

  /* gallery items helper: [{svg, caption}] from a list of {product, view} */
  function galleryItems(list) {
    return list.map(function (g) {
      var p = PX.get(g.id);
      return { svg: PX.art(p, g.view), caption: PX.name(p) + ' — ' + PX.catName(p.cat) };
    });
  }

  /* ====================================================== wiring */
  d.addEventListener('click', function (e) {
    var q = e.target.closest('[data-quick]');
    if (q) { e.preventDefault(); openPM(q.getAttribute('data-quick'), q); return; }
    var g = e.target.closest('[data-lightbox]');
    if (g) {
      e.preventDefault();
      var groupName = g.getAttribute('data-lightbox');
      var nodes = Array.prototype.slice.call(d.querySelectorAll('[data-lightbox="' + groupName + '"]'));
      var list = nodes.map(function (n) { return { id: n.getAttribute('data-p'), view: n.getAttribute('data-view') }; });
      openLB(galleryItems(list), nodes.indexOf(g), g);
    }
  });

  d.addEventListener('keydown', function (e) {
    var top = stack[stack.length - 1]; if (!top) return;
    if (top === 'lb') {
      if (e.key === 'Escape') { e.preventDefault(); closeLB(); }
      else if (e.key === 'ArrowLeft') stepLB(-1);
      else if (e.key === 'ArrowRight') stepLB(1);
      else trapTab(e, lb);
    } else if (top === 'pm') {
      if (e.key === 'Escape') { e.preventDefault(); closePM(); }
      else trapTab(e, pm.querySelector('.pm-sheet'));
    }
  });

  // refresh visible overlays when the language switches
  d.addEventListener('px:lang', function () {
    if (pmState.open) renderPM();
    if (lbState.open) {
      var cur = lbState.items.map(function (it) { return it; });
      // rebuild captions in the new language
      lbState.items = lbState.items.map(function (it) { return it; });
      renderLB();
    }
  });

  w.PXModal = { openProduct: openPM, closeProduct: closePM, openLightbox: openLB, closeLightbox: closeLB, galleryItems: galleryItems };
})(window, document);

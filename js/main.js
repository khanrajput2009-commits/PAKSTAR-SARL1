/* PAKSTAR SARL — shared UI: header, mega dropdown, language selector, mobile menu,
   footer, loader, reveal / parallax / tilt motion, toasts, page transitions. */
(function (w, d) {
  var T = function (k, v) { return w.I18N.t(k, v); };
  var html = d.documentElement;
  var REDUCE = w.matchMedia('(prefers-reduced-motion:reduce)');
  var FINE = w.matchMedia('(hover:hover) and (pointer:fine)');
  var PXUI = w.PXUI = {};
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function vis(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }

  /* ------------------------------------------------ icons */
  var P = {
    arrow: 'M5 12h14M13 6l6 6-6 6', caret: 'M6 9l6 6 6-6', check: 'M5 12.5l4.5 4.5L19 7.5', up: 'M12 19V5M5 12l7-7 7 7',
    globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c3.2 3 3.2 15 0 18-3.2-3-3.2-15 0-18z',
    bolt: 'M13 3L5 14h6l-1 7 8-11h-6l1-7z',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
    gauge: 'M4 17a8 8 0 1116 0M12 17l4-5M7 17h.01M17 17h.01M12 9v.01',
    pin: 'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z',
    mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
    phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
    users: 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a2.5 2.5 0 100-5M21 19c0-2.3-1.5-4.2-3.5-4.8',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
    cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
    chat: 'M4 5h16v11H9l-5 4z',
    bike: 'M6 18a3 3 0 100-6 3 3 0 000 6zM18 18a3 3 0 100-6 3 3 0 000 6zM6 15l4-7h5l3 7M10 8l3 7',
    zoom: 'M11 17a6 6 0 100-12 6 6 0 000 12zM16 16l5 5M11 8v6M8 11h6',
    route: 'M6 19a2 2 0 100-4 2 2 0 000 4zM18 9a2 2 0 100-4 2 2 0 000 4zM8 17h6a3 3 0 000-6h-4a3 3 0 010-6h6',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
    info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8v.01',
    x: 'M6 6l12 12M18 6L6 18'
  };
  function icon(n, cls) { return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + (P[n] || P.arrow) + '"/></svg>'; }
  PXUI.icon = icon;
  function hydrateIcons(root) { $$('[data-icon]', root).forEach(function (el) { if (!el.firstChild) el.innerHTML = icon(el.getAttribute('data-icon')); }); }
  PXUI.hydrateIcons = hydrateIcons;

  /* ------------------------------------------------ toasts */
  var toastZone;
  PXUI.toast = function (msg, type) {
    if (!toastZone) {
      toastZone = d.createElement('div'); toastZone.className = 'toast-zone';
      toastZone.setAttribute('aria-live', 'polite'); toastZone.setAttribute('aria-atomic', 'false'); toastZone.setAttribute('data-keep-active', '');
      d.body.appendChild(toastZone);
    }
    var t = d.createElement('div'); t.className = 'toast-px toast-px--' + (type || 'ok'); t.setAttribute('role', 'status');
    t.innerHTML = icon(type === 'err' ? 'info' : 'check') + '<span></span>'; t.lastChild.textContent = msg;
    toastZone.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 450); }, 3800);
  };

  /* ------------------------------------------------ layout (header / footer / mobile panel) */
  var page = d.body.getAttribute('data-page') || 'home';
  var NAV = [
    { id: 'home', href: 'index.html', k: 'nav.home' },
    { id: 'about', href: 'about.html', k: 'nav.about' },
    { id: 'motorcycles', mega: true, href: 'motorcycles.html', k: 'nav.motorcycles' },
    { id: 'dealers', href: 'dealers.html', k: 'nav.dealers' },
    { id: 'news', href: 'news.html', k: 'nav.news' },
    { id: 'contact', href: 'contact.html', k: 'nav.contact' }
  ];
  var MARK = '<svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2l17 9.5v17L20 38 3 28.5v-17z" fill="none" stroke="#ff5a28" stroke-width="2"/><path d="M13 29V11h9.2c4.2 0 6.3 2.4 6.3 5.6S26.400 22 22.200 22H13" fill="none" stroke="#ece8e1" stroke-width="3" stroke-linejoin="round"/><path d="M13 29l7-7" stroke="#ff5a28" stroke-width="3"/></svg>';

  function langMenu(id, up) {
    return '<div class="lang' + (up ? ' lang--up' : '') + '" data-lang-root>' +
      '<button type="button" class="lang__btn" id="' + id + 'Btn" aria-haspopup="true" aria-expanded="false" aria-controls="' + id + 'Menu" data-i18n-aria="nav.language">' + icon('globe') + '<span data-lang-current>EN</span>' + icon('caret', 'caret') + '</button>' +
      '<ul class="lang__menu" id="' + id + 'Menu" role="menu" data-i18n-aria="nav.language">' +
      '<li role="none"><button type="button" role="menuitemradio" class="lang__opt" data-set-lang="en" aria-checked="false"><span>English</span>' + icon('check') + '</button></li>' +
      '<li role="none"><button type="button" role="menuitemradio" class="lang__opt" data-set-lang="fr" aria-checked="false"><span>Français</span>' + icon('check') + '</button></li></ul></div>';
  }

  function buildLayout() {
    var cats = w.PX.cats;
    var mega = cats.map(function (c, i) {
      return '<a class="mega-card" style="--i:' + i + '" href="motorcycles.html?cat=' + c.id + '"><div class="mega-card__img">' + w.PX.catImg(c.id) + '</div><h4 data-i18n="cat.' + c.id + '"></h4><p data-i18n="cat.' + c.id + '.d"></p></a>';
    }).join('');
    var items = NAV.map(function (n) {
      var cur = (page === n.id) ? ' aria-current="page"' : '';
      if (n.mega) {
        return '<li class="has-mega" data-mega-root><button type="button" class="nav-link-px" id="megaBtn" aria-expanded="false" aria-haspopup="true" aria-controls="megaPanel"' + cur + '><span data-i18n="' + n.k + '"></span>' + icon('caret', 'caret') + '</button>' +
          '<div class="mega" id="megaPanel" role="region" data-i18n-aria="nav.motorcycles"><div class="container-xl"><div class="mega__grid">' + mega +
          '<div class="mega__all" style="--i:4"><p data-i18n="nav.mega.note"></p><a class="px-btn px-btn--sm" href="motorcycles.html"><span data-i18n="nav.all"></span>' + icon('arrow') + '</a></div></div></div></div></li>';
      }
      return '<li><a class="nav-link-px" href="' + n.href + '"' + cur + ' data-i18n="' + n.k + '"></a></li>';
    }).join('');

    var mItems = NAV.map(function (n, i) {
      if (n.mega) {
        return '<li style="--i:' + i + '"><button type="button" class="m-link" aria-expanded="false" aria-controls="mSub"><span data-i18n="' + n.k + '"></span>' + icon('caret', 'caret') + '</button>' +
          '<ul class="m-sub" id="mSub">' + cats.map(function (c) { return '<li><a href="motorcycles.html?cat=' + c.id + '"><span class="thumb">' + w.PX.catImg(c.id) + '</span><span data-i18n="cat.' + c.id + '"></span></a></li>'; }).join('') +
          '<li><a href="motorcycles.html"><span class="thumb" style="background:none"></span><span data-i18n="nav.all"></span></a></li></ul></li>';
      }
      return '<li style="--i:' + i + '"><a class="m-link" href="' + n.href + '"' + (page === n.id ? ' aria-current="page"' : '') + '><span data-i18n="' + n.k + '"></span>' + icon('arrow') + '</a></li>';
    }).join('');

    var header = '<a class="skip-link" href="#main" data-i18n="nav.skip"></a>' +
      '<header class="site-header" id="siteHeader"><div class="container-xl nav-wrap">' +
      '<a class="brand" href="index.html" aria-label="PAKSTAR SARL — Home">' + '<img class="brand__logo" src="assets/img/logo-wordmark.png" alt="" width="228" height="38"></a>' +
      '<nav aria-label="Main"><ul class="nav-main">' + items + '</ul></nav>' +
      '<div class="nav-actions">' + langMenu('lang') + '<a class="px-btn px-btn--sm" href="inquiry.html"><span data-i18n="nav.inquire"></span>' + icon('arrow') + '</a>' +
      '<button type="button" class="burger" id="burger" aria-expanded="false" aria-controls="mPanel" data-i18n-aria="nav.menu"><span></span><span></span><span></span></button></div>' +
      '</div></header>' +
      '<div class="m-panel" id="mPanel"><div class="container-xl"><ul class="m-nav">' + mItems + '</ul>' +
      '<div class="m-cta"><a class="px-btn" href="inquiry.html"><span data-i18n="nav.inquire"></span>' + icon('arrow') + '</a><a class="px-btn px-btn--ghost" href="become-a-dealer.html"><span data-i18n="nav.dealer"></span></a></div>' +
      '<div class="m-lang" role="group" data-i18n-aria="nav.language"><button type="button" data-set-lang="en" aria-pressed="false">English</button><button type="button" data-set-lang="fr" aria-pressed="false">Français</button></div></div></div>';
    d.body.insertAdjacentHTML('afterbegin', header);

    var footer = '<footer class="site-footer"><div class="container-xl"><div class="f-top">' +
      '<div><a class="brand" href="index.html" aria-label="PAKSTAR SARL"><img class="brand__logo brand__logo--foot" src="assets/img/logo.png" alt="" width="240" height="140" loading="lazy"></a><p style="margin-top:1.2rem;max-width:34ch;font-size:.92rem" data-i18n="foot.about"></p>' + langMenu('flang', true) + '</div>' +
      '<div><h4 data-i18n="foot.explore"></h4><ul class="f-links"><li><a href="index.html" data-i18n="nav.home"></a></li><li><a href="about.html" data-i18n="nav.about"></a></li><li><a href="motorcycles.html" data-i18n="nav.motorcycles"></a></li><li><a href="news.html" data-i18n="nav.news"></a></li><li><a href="contact.html" data-i18n="nav.contact"></a></li></ul></div>' +
      '<div><h4 data-i18n="foot.catalog"></h4><ul class="f-links">' + cats.map(function (c) { return '<li><a href="motorcycles.html?cat=' + c.id + '" data-i18n="cat.' + c.id + '"></a></li>'; }).join('') + '</ul>' +
      '<h4 style="margin-top:1.6rem" data-i18n="foot.business"></h4><ul class="f-links"><li><a href="dealers.html" data-i18n="nav.dealers"></a></li><li><a href="become-a-dealer.html" data-i18n="nav.dealer"></a></li><li><a href="inquiry.html" data-i18n="nav.inquire"></a></li></ul></div>' +
      '<div><h4 data-i18n="foot.contact"></h4><ul class="f-links"><li><span data-i18n="loc.full"></span></li><li><span class="ph" data-i18n="ph.address"></span></li><li><span class="ph" data-i18n="ph.phone"></span></li><li><span class="ph" data-i18n="ph.email"></span></li><li><span class="ph" data-i18n="ph.social"></span></li></ul></div>' +
      '</div><div class="f-bottom"><p>© ' + new Date().getFullYear() + ' PAKSTAR SARL. <span data-i18n="foot.rights"></span></p><p data-i18n="foot.demo"></p></div></div></footer>' +
      '<button type="button" class="to-top" id="toTop" data-i18n-aria="c.top">' + icon('up') + '</button><div class="curtain" id="curtain" aria-hidden="true"></div>';
    d.body.insertAdjacentHTML('beforeend', footer);
    // keep the loader first in tab order logic: it is aria-hidden and removed after finishing
  }

  /* ------------------------------------------------ dropdown engine (mega + language) */
  var dropdowns = [];
  function dropdown(root, btn, panel, o) {
    o = o || {};
    var timer;
    function items() { return $$(o.items, panel).filter(vis); }
    function isOpen() { return btn.getAttribute('aria-expanded') === 'true'; }
    function open(focusFirst) {
      clearTimeout(timer);
      dropdowns.forEach(function (x) { if (x.btn !== btn) x.close(false); });
      panel.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true');
      if (focusFirst) setTimeout(function () { var i = items()[0]; i && i.focus(); }, 40);
    }
    function close(ret) { clearTimeout(timer); panel.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); if (ret) btn.focus(); }
    var byHover = false;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      // a mouse click right after a hover-open "pins" the menu instead of toggling it shut
      if (byHover && isOpen()) { byHover = false; return; }
      byHover = false;
      isOpen() ? close(false) : open(false);
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); open(true); }
      else if (e.key === 'Escape' && isOpen()) { e.preventDefault(); close(true); }
    });
    panel.addEventListener('keydown', function (e) {
      var it = items(), i = it.indexOf(d.activeElement), n = it.length;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); it[(i + 1) % n].focus(); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); it[(i - 1 + n) % n].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); it[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); it[n - 1].focus(); }
    });
    root.addEventListener('focusout', function (e) { if (e.relatedTarget && !root.contains(e.relatedTarget)) close(false); });
    if (o.hover) {
      root.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { if (!isOpen()) byHover = true; open(false); } });
      root.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { byHover = false; clearTimeout(timer); timer = setTimeout(function () { close(false); }, 220); } });
    }
    var api = { btn: btn, close: close, isOpen: isOpen };
    dropdowns.push(api);
    return api;
  }
  function initDropdowns() {
    var mr = $('[data-mega-root]');
    if (mr) dropdown(mr, $('#megaBtn'), $('#megaPanel'), { items: 'a', hover: true });
    $$('[data-lang-root]').forEach(function (r) { dropdown(r, $('.lang__btn', r), $('.lang__menu', r), { items: '.lang__opt' }); });
    d.addEventListener('click', function (e) {
      dropdowns.forEach(function (x) { if (x.isOpen() && !x.btn.closest('[data-mega-root],[data-lang-root]').contains(e.target)) x.close(false); });
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') dropdowns.forEach(function (x) { if (x.isOpen()) x.close(true); });
    });
  }

  /* ------------------------------------------------ mobile menu */
  function initMobile() {
    var b = $('#burger'), pn = $('#mPanel'); if (!b || !pn) return;
    var sub = $('.m-link[aria-controls="mSub"]'), subList = $('#mSub');
    var open = false;
    function others() { return $$('main, .site-footer, #toTop'); }
    function set(on) {
      open = on;
      b.setAttribute('aria-expanded', on ? 'true' : 'false');
      pn.classList.toggle('is-open', on);
      d.body.classList.toggle('is-locked', on);
      others().forEach(function (el) { el.inert = on; });
      $('#siteHeader').classList.toggle('is-solid', on || w.scrollY > 20);
      if (on) setTimeout(function () { var f = $('.m-link', pn); f && f.focus(); }, 120);
    }
    b.addEventListener('click', function () { set(!open); if (!open) b.focus(); });
    if (sub) sub.addEventListener('click', function () {
      var on = sub.getAttribute('aria-expanded') !== 'true';
      sub.setAttribute('aria-expanded', on); subList.classList.toggle('is-open', on);
    });
    pn.addEventListener('click', function (e) { if (e.target.closest('a[href]')) set(false); });
    d.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { set(false); b.focus(); return; }
      if (e.key === 'Tab') {
        var f = [b].concat($$(FOCUSABLE, pn).filter(vis)); var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    w.addEventListener('resize', function () { if (open && w.innerWidth >= 992) set(false); });
  }

  /* ------------------------------------------------ header scroll state + back to top */
  function initScrollUI() {
    var h = $('#siteHeader'), tt = $('#toTop'), ticking = false;
    function upd() {
      ticking = false;
      var y = w.scrollY;
      if (!d.body.classList.contains('is-locked')) h.classList.toggle('is-solid', y > 20);
      tt.classList.toggle('is-show', y > 700);
    }
    w.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
    tt.addEventListener('click', function () { w.scrollTo({ top: 0, behavior: REDUCE.matches ? 'auto' : 'smooth' }); });
  }

  /* ------------------------------------------------ reveal on scroll */
  var io, proxies = new WeakMap();
  function settle(el, delay) { setTimeout(function () { el.classList.add('is-done'); }, 1400 + (delay || 0)); }
  PXUI.settle = settle;
  PXUI.observe = function (root) {
    var els = $$('.reveal:not(.is-in)', root || d);
    $$('[data-stagger]', root || d).forEach(function (c) {
      Array.prototype.forEach.call(c.children, function (ch, i) { if (!ch.style.getPropertyValue('--d')) ch.style.setProperty('--d', i * 90); });
    });
    els.forEach(function (el) { if (el.hasAttribute('data-d')) el.style.setProperty('--d', el.getAttribute('data-d')); });
    if (!('IntersectionObserver' in w) || REDUCE.matches) { els.forEach(function (el) { el.classList.add('is-in', 'is-done'); }); return; }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          // clip-path-masked elements are watched through their parent (a fully clipped
          // element never reports as intersecting)
          var group = proxies.get(en.target) || [en.target];
          group.forEach(function (t) { t.classList.add('is-in'); settle(t, parseInt(t.style.getPropertyValue('--d') || 0, 10)); });
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    }
    els.forEach(function (el) {
      if (el.getAttribute('data-reveal') === 'mask' && el.parentElement) {
        var par = el.parentElement, g = proxies.get(par) || [];
        g.push(el); proxies.set(par, g); io.observe(par);
      } else io.observe(el);
    });
  };

  /* ------------------------------------------------ parallax, tilt, hero depth */
  function initMotion() {
    if (REDUCE.matches) { html.classList.add('reduce-motion'); return; }
    // scroll parallax — parent-relative so the element's own transform never feeds back
    var layers = $$('[data-parallax]'), raf = false;
    function par() {
      raf = false; var vh = w.innerHeight;
      var k = w.innerWidth < 768 ? 0.5 : 1;
      layers.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var off = (r.top + r.height / 2 - vh / 2) * -parseFloat(el.getAttribute('data-parallax')) * k;
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
    }
    if (layers.length) { w.addEventListener('scroll', function () { if (!raf) { raf = true; requestAnimationFrame(par); } }, { passive: true }); w.addEventListener('resize', par); par(); }

    if (!FINE.matches) return;
    // hero depth (mouse only, small angles)
    var hero = $('.hero');
    if (hero) {
      var tilt = $('[data-hero-tilt]', hero), deep = $$('[data-depth]', hero), tx = 0, ty = 0, cx = 0, cy = 0, run = false;
      function loop() {
        cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
        if (tilt) tilt.style.transform = 'rotateY(' + (cx * 6).toFixed(2) + 'deg) rotateX(' + (-cy * 4).toFixed(2) + 'deg)';
        deep.forEach(function (el) { var s = parseFloat(el.getAttribute('data-depth')); el.style.transform = 'translate3d(' + (cx * s).toFixed(1) + 'px,' + (cy * s).toFixed(1) + 'px,0)'; });
        if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) requestAnimationFrame(loop); else run = false;
      }
      hero.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
        if (!run) { run = true; requestAnimationFrame(loop); }
      });
      hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!run) { run = true; requestAnimationFrame(loop); } });
    }
    // gentle card tilt
    var cur = null;
    function reset(el) { el.style.transform = ''; }
    d.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || !e.target.closest) return;
      var el = e.target.closest('[data-tilt]');
      if (cur && cur !== el) { reset(cur); cur = null; }
      if (!el) return;
      cur = el;
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(1000px) rotateX(' + (-y * 4).toFixed(2) + 'deg) rotateY(' + (x * 5).toFixed(2) + 'deg) translateY(-4px)';
    }, { passive: true });
    d.addEventListener('pointerleave', function () { if (cur) { reset(cur); cur = null; } }, true);
    d.documentElement.addEventListener('mouseleave', function () { if (cur) { reset(cur); cur = null; } });
  }

  /* ------------------------------------------------ loader */
  function runLoader() {
    var el = $('#loader');
    function ready() { html.classList.add('is-ready'); }
    if (!el || html.classList.contains('no-loader') || REDUCE.matches) { if (el) el.style.display = 'none'; ready(); return; }
    var bar = $('#loaderBar'), pct = $('#loaderPct'), p = 0, t0 = performance.now(), loaded = d.readyState === 'complete', finished = false;
    w.addEventListener('load', function () { loaded = true; });
    function done() {
      if (finished) return; finished = true;
      bar.style.transform = 'scaleX(1)'; pct.textContent = '100';
      w.PXStore.session.set('seen', 1);
      setTimeout(function () { el.classList.add('is-done'); ready(); setTimeout(function () { el.remove(); }, 1000); }, 180);
    }
    (function tick() {
      if (finished) return;
      var t = performance.now() - t0, target = loaded ? 100 : Math.min(88, t / 14);
      p += (target - p) * 0.14 + 0.35; if (p > 100) p = 100;
      bar.style.transform = 'scaleX(' + (p / 100).toFixed(3) + ')'; pct.textContent = String(Math.round(p));
      if ((p >= 99.5 && t > 650) || t > 3000) done(); else requestAnimationFrame(tick);
    })();
    setTimeout(done, 3600); // hard failsafe — the loader can never get stuck
  }

  /* ------------------------------------------------ page transition curtain */
  function initTransitions() {
    var c = $('#curtain'); if (!c) return;
    w.addEventListener('pageshow', function () { c.classList.remove('is-on'); });
    d.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if ((a.target && a.target !== '_self') || a.hasAttribute('download') || REDUCE.matches) return;
      var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
      if (u.protocol !== location.protocol || u.host !== location.host) return;
      if (u.pathname === location.pathname && u.search === location.search) return; // same page / hash jump
      if (!/\.html?$|\/$/.test(u.pathname)) return;
      e.preventDefault();
      c.classList.add('is-on');
      setTimeout(function () { location.href = a.href; }, 340);
      setTimeout(function () { c.classList.remove('is-on'); }, 3000); // never trap the visitor
    });
  }

  /* ------------------------------------------------ language wiring */
  function initLang() {
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-set-lang]'); if (!b) return;
      var l = b.getAttribute('data-set-lang');
      w.I18N.set(l);
      dropdowns.forEach(function (x) { if (x.isOpen()) x.close(true); });
      PXUI.toast(T('nav.langset'), 'ok');
    });
    d.addEventListener('px:lang', function () { hydrateIcons(d); });
  }

  /* ------------------------------------------------ interactive map (loaded on demand: no third-party request until asked) */
  function initMap() {
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-load-map]'); if (!b) return;
      var box = b.closest('[data-map-src]'); if (!box || box.querySelector('iframe')) return;
      var f = d.createElement('iframe');
      f.className = 'loc__frame'; f.setAttribute('title', T('loc.map')); f.setAttribute('data-i18n-title', 'loc.map');
      f.setAttribute('loading', 'lazy'); f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade'); f.src = box.getAttribute('data-map-src');
      box.insertBefore(f, box.firstChild);
      box.classList.add('is-live');
      var act = box.querySelector('.loc__actions'); if (act) act.remove();
    });
  }

  /* ------------------------------------------------ boot */
  function boot() {
    buildLayout();
    w.I18N.init();
    hydrateIcons(d);
    initDropdowns(); initMobile(); initScrollUI(); initLang(); initTransitions(); initMap();
    PXUI.observe(d);
    initMotion();
    runLoader();
    if (w.PXPages) w.PXPages.init();
    if (w.PXForms) w.PXForms.init();
    hydrateIcons(d);
    w.I18N.apply(d);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})(window, document);

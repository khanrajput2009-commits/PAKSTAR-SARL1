/* PAKSTAR SARL — page-specific rendering (home, catalogue, gallery, product details).
   All dynamic regions re-render on language change. Catalogue data comes from products.js. */
(function (w, d) {
  var PX = w.PX, T = function (k, v) { return w.I18N.t(k, v); };
  function $(s, r) { return (r || d).querySelector(s); }
  function esc(s) { return PX.esc(s); }
  var state = { cat: 'all', sort: 'default' };

  /* ---------- home ---------- */
  function renderHero() {
    var el = $('#heroBike'); if (!el) return;
    el.innerHTML = PX.bikeSVG('street', { accent: '#ff5a28', hero: true, label: T('hero.art') });
  }
  function renderFeatured() {
    var el = $('#featured'); if (el) PX.renderGrid(el, PX.products.slice(0, 3));
  }
  function renderCategories() {
    var el = $('#catGrid'); if (!el) return;
    el.innerHTML = PX.cats.map(function (c, i) {
      var n = PX.products.filter(function (p) { return p.cat === c.id; }).length;
      return '<a class="cat-card reveal is-in" data-reveal="up" href="motorcycles.html?cat=' + c.id + '" style="--acc:' + c.accent + '">' +
        '<span class="cat-card__n">0' + (i + 1) + '</span><h3>' + esc(T('cat.' + c.id)) + '</h3><p>' + esc(T('cat.' + c.id + '.d')) + '</p>' +
        '<span class="cat-card__foot"><span>' + esc(n === 1 ? T('c.model.one') : T('c.models', { n: n })) + '</span><span class="link-arrow">' + esc(T('c.explore')) + w.PXUI.icon('arrow') + '</span></span></a>';
    }).join('');
  }

  /* ---------- decorative artwork slots: <div data-art="street" data-accent="#ff5a28"> ---------- */
  function renderArt() {
    Array.prototype.forEach.call(d.querySelectorAll('[data-art]'), function (el) {
      Array.prototype.forEach.call(el.querySelectorAll('svg'), function (n) { n.remove(); });
      el.insertAdjacentHTML('beforeend', PX.bikeSVG(el.getAttribute('data-art'), { accent: el.getAttribute('data-accent') || '#ff5a28' }));
    });
  }

  /* ---------- news (clearly-labelled DEMONSTRATION content, text only) ---------- */
  var NEWS_ACC = ['#ff5a28', '#d2b37a', '#c8402a', '#3fb6a8', '#ff7d4a', '#d2b37a', '#2f9bff', '#ff5a28', '#d2b37a', '#d9c400', '#2f9bff', '#ff7d4a'];
  var NEWS_CAT = ['products', 'tips', 'tips', 'service', 'company', 'company', 'products', 'service', 'tips', 'products', 'tips', 'company'];
  var NEWS_N = NEWS_CAT.length, newsCat = 'all';
  function newsCard(i, o) {
    o = o || {}; var n = i + 1;
    var paras = o.full ? T('news.' + n + '.b').split('\n\n') : [];
    var more = o.full ? '<div class="n-card__more" id="nb' + n + '" hidden>' + paras.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
      '<button type="button" class="link-arrow n-card__toggle" data-news-toggle="nb' + n + '" aria-expanded="false" aria-controls="nb' + n + '"><span data-more>' + esc(T('news.read')) + '</span>' + w.PXUI.icon('arrow') + '</button>' : '';
    var img = o.feature ? '<div class="n-card__img n-card__img--bike"><img class="p-img" src="assets/img/bike-sprint-250.jpg" alt="PS Sprint 250" loading="lazy" decoding="async"></div>' : '';
    return '<article class="n-card n-card--text' + (o.feature ? ' n-feature n-feature--img' : '') + ' reveal is-in" style="--acc:' + NEWS_ACC[i] + '">' +
      '<div class="n-card__body"><div class="n-card__meta"><b>' + esc(T('news.cat.' + NEWS_CAT[i])) + '</b> · ' + esc(T('news.' + n + '.m')) + ' · ' + esc(T('news.rt')) + ' · ' + esc(T('news.demo.tag')) + '</div><h3>' + esc(T('news.' + n + '.t')) + '</h3><p>' + esc(T('news.' + n + '.d')) + '</p>' + more + '</div>' + img + '</article>';
  }
  function renderNews() {
    var h = $('#newsHome'); if (h) h.innerHTML = [0, 1, 2].map(function (i) { return newsCard(i); }).join('');
    var chips = $('#newsFilters');
    if (chips) chips.innerHTML = ['all', 'products', 'tips', 'service', 'company'].map(function (c) {
      return '<button type="button" class="fchip" data-news-filter="' + c + '" aria-pressed="' + (newsCat === c) + '">' + esc(T('news.cat.' + c)) + '</button>';
    }).join('');
    var f = $('#newsFeature'), l = $('#newsList'); if (!l) return;
    var idx = []; for (var i = 0; i < NEWS_N; i++) if (newsCat === 'all' ? i > 0 : NEWS_CAT[i] === newsCat) idx.push(i);
    if (f) f.innerHTML = newsCat === 'all' ? newsCard(0, { feature: true, full: true }) : '';
    l.innerHTML = idx.length ? idx.map(function (i) { return newsCard(i, { full: true }); }).join('') : '<div class="empty"><h3>' + esc(T('news.empty')) + '</h3></div>';
  }
  d.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-news-toggle]');
    if (t) {
      var b = d.getElementById(t.getAttribute('data-news-toggle')), open = t.getAttribute('aria-expanded') !== 'true';
      t.setAttribute('aria-expanded', open); b.hidden = !open; t.querySelector('[data-more]').textContent = T(open ? 'news.less' : 'news.read');
      return;
    }
    var c = e.target.closest && e.target.closest('[data-news-filter]');
    if (c) { newsCat = c.getAttribute('data-news-filter'); renderNews(); var nb = $('#newsFilters [data-news-filter="' + newsCat + '"]'); nb && nb.focus(); }
  });

  /* ---------- comparison table ---------- */
  function renderCompare() {
    var el = $('#compare'); if (!el) return;
    var P = PX.products, t = T;
    function best(fn, dir) { var v = P.map(fn); return dir === 'min' ? Math.min.apply(null, v) : Math.max.apply(null, v); }
    var minPrice = best(function (p) { return p.price; }, 'min'), maxHp = best(function (p) { return p.hp; }), minKg = best(function (p) { return p.kg; }, 'min'), maxTank = best(function (p) { return p.ev ? 0 : p.tank; });
    var rows = [
      ['sp.category', function (p) { return esc(PX.catName(p.cat)); }],
      ['sp.engine', function (p) { return PX.engineVal(p); }],
      ['sp.power', function (p) { return '<span class="' + (p.hp === maxHp ? 'is-best' : '') + '">' + p.hp + ' hp</span>'; }],
      ['sp.transmission', function (p) { return esc(PX.tr(p.trans)); }],
      ['sp.tank', function (p) { return '<span class="' + (!p.ev && p.tank === maxTank ? 'is-best' : '') + '">' + (p.ev ? esc(PX.num(p.tank)) + ' kWh ⚡' : esc(PX.num(p.tank)) + ' L') + '</span>'; }],
      ['sp.weight', function (p) { return '<span class="' + (p.kg === minKg ? 'is-best' : '') + '">' + p.kg + ' kg</span>'; }],
      ['sp.price', function (p) { return '<strong class="' + (p.price === minPrice ? 'is-best' : '') + '">' + esc(PX.price(p)) + '</strong>'; }]
    ];
    el.innerHTML = '<table class="cmp"><caption class="sr-only">' + esc(t('cmp.h2')) + '</caption><thead><tr><th scope="col"><span class="sr-only">' + esc(t('cmp.spec')) + '</span></th>' +
      P.map(function (p) { return '<th scope="col"><button type="button" class="cmp__name" data-quick="' + p.id + '">' + esc(PX.name(p)) + '</button></th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + esc(t(r[0])) + '</th>' + P.map(function (p) { return '<td>' + r[1](p) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
  }

  /* ---------- catalogue ---------- */
  function filtered() {
    var list = PX.products.filter(function (p) { return state.cat === 'all' || p.cat === state.cat; });
    if (state.sort === 'name') list = list.slice().sort(function (a, b) { return PX.name(a).localeCompare(PX.name(b), w.I18N.lang); });
    else if (state.sort === 'price') list = list.slice().sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === 'priceDesc') list = list.slice().sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === 'cat') list = list.slice().sort(function (a, b) { return PX.catName(a.cat).localeCompare(PX.catName(b.cat), w.I18N.lang) || a.id.localeCompare(b.id); });
    return list;
  }
  function renderChips() {
    var el = $('#filterChips'); if (!el) return;
    var all = [{ id: 'all', label: T('c.all') }].concat(PX.cats.map(function (c) { return { id: c.id, label: T('cat.' + c.id) }; }));
    el.innerHTML = all.map(function (c) {
      return '<button type="button" class="fchip" data-filter="' + c.id + '" aria-pressed="' + (state.cat === c.id) + '">' + esc(c.label) + '</button>';
    }).join('');
  }
  function renderCatalog(announce) {
    var el = $('#catalog'); if (!el) return;
    var list = filtered();
    PX.renderGrid(el, list);
    var cnt = $('#count'); if (cnt) cnt.textContent = T('c.showing', { n: list.length, t: PX.products.length });
    var rs = $('#reset'); if (rs) rs.hidden = state.cat === 'all' && state.sort === 'default';
    var sel = $('#sort'); if (sel) {
      var keys = ['default', 'name', 'cat', 'price', 'priceDesc'];
      Array.prototype.forEach.call(sel.options, function (o, i) { o.textContent = T('c.sort.' + keys[i]); }); sel.value = state.sort;
    }
    if (announce) { /* count is an aria-live region */ }
  }
  function syncURL() {
    try {
      var u = new URL(location.href);
      if (state.cat === 'all') u.searchParams.delete('cat'); else u.searchParams.set('cat', state.cat);
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    } catch (e) { /* file:// origins may refuse — harmless */ }
  }
  function initCatalog() {
    if (!$('#catalog')) return;
    var q = new URLSearchParams(location.search).get('cat');
    if (q && PX.cats.some(function (c) { return c.id === q; })) state.cat = q;
    renderChips(); renderCatalog();
    $('#filterChips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]'); if (!b) return;
      state.cat = b.getAttribute('data-filter'); syncURL(); renderChips(); renderCatalog(true);
      var nb = $('#filterChips [data-filter="' + state.cat + '"]'); nb && nb.focus();
    });
    $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; renderCatalog(true); });
    $('#reset').addEventListener('click', function () { state.cat = 'all'; state.sort = 'default'; syncURL(); renderChips(); renderCatalog(true); w.PXUI.toast(T('c.reset.done'), 'ok'); $('#filterChips [data-filter="all"]').focus(); });
  }

  /* ---------- product details ---------- */
  var pd = { id: null };
  function renderPD() {
    var root = $('#pdRoot'); if (!root) return;
    var p = PX.get(pd.id);
    var crumb = $('#pdCrumb'), h1 = $('#pdTitle');
    if (!p) {
      root.innerHTML = '<div class="empty"><h3>' + esc(T('pd.notfound.t')) + '</h3><p>' + esc(T('pd.notfound.d')) + '</p><a class="px-btn" href="motorcycles.html"><span>' + esc(T('pd.back')) + '</span></a></div>';
      if (h1) h1.textContent = T('pd.notfound.t');
      return;
    }
    if (h1) h1.textContent = PX.name(p);
    var hb = $('#pdHeroBg'); if (hb && p.img) hb.style.backgroundImage = 'url(assets/img/' + p.img + '.jpg)';
    if (crumb) crumb.textContent = PX.name(p);
    d.title = PX.name(p) + ' — PAKSTAR SARL';
    var rows = [['sp.category', PX.catName(p.cat)]].concat(PX.specRows(p));
    root.innerHTML = '<div class="pd"><div class="pd__stage">' +
      '<button type="button" class="pd__main" id="pdMain" aria-label="' + esc(T('c.enlarge') + ': ' + PX.name(p)) + '">' + PX.art(p, 'side').replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true"') + '<span class="pd__hint">' + w.PXUI.icon('zoom') + esc(T('c.enlarge')) + '</span></button>' +
      '<div class="pd__price"><span>' + esc(T('c.from')) + '</span><strong>' + esc(PX.price(p)) + '</strong><small>' + esc(T('c.price.note')) + '</small></div></div>' +
      '<div class="pd__info"><p class="lead-px">' + esc(PX.desc(p)) + '</p>' +
      '<h3 style="margin-top:2rem">' + esc(T('pd.specs')) + '</h3><dl class="spec-list">' + rows.map(function (s) { return '<div><dt>' + esc(T(s[0])) + '</dt><dd>' + esc(s[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<h3>' + esc(T('pd.features')) + '</h3><ul class="feat">' + p.features.map(function (f) { return '<li>' + w.PXUI.icon('check') + '<span>' + esc(PX.tr(f)) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="pm-actions" style="margin-top:1.4rem"><a class="px-btn" href="inquiry.html?model=' + p.id + '"><span>' + esc(T('c.inquire')) + '</span>' + w.PXUI.icon('arrow') + '</a><a class="px-btn px-btn--ghost" href="motorcycles.html?cat=' + p.cat + '"><span>' + esc(T('pd.back')) + '</span></a></div></div></div>';
    var rel = $('#related');
    if (rel) {
      var list = PX.products.filter(function (x) { return x.id !== p.id && x.cat === p.cat; });
      if (list.length < 3) list = list.concat(PX.products.filter(function (x) { return x.id !== p.id && x.cat !== p.cat; })).slice(0, 3);
      PX.renderGrid(rel, list.slice(0, 3));
    }
  }
  function initPD() {
    var root = $('#pdRoot'); if (!root) return;
    pd.id = new URLSearchParams(location.search).get('id') || PX.products[0].id;
    renderPD();
    root.addEventListener('click', function (e) {
      var m = e.target.closest('#pdMain');
      if (m) w.PXModal.openLightbox(w.PXModal.galleryItems([{ id: pd.id, view: 'side' }]), 0, m);
    });
  }

  function renderAll() { renderArt(); renderNews(); renderHero(); renderFeatured(); renderCategories(); renderChips(); if ($('#catalog')) renderCatalog(); renderCompare(); renderPD(); w.PXUI.observe(d); }

  w.PXPages = {
    init: function () {
      renderArt(); renderNews(); renderHero(); renderFeatured(); renderCategories(); renderCompare(); initCatalog(); initPD();
      d.addEventListener('px:lang', renderAll);
      w.PXUI.observe(d);
    }
  };
})(window, document);

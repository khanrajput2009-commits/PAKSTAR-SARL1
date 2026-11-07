/* PAKSTAR SARL — product data + original SVG motorcycle artwork.
   Specifications and prices are INDICATIVE presentation figures written for the site design;
   confirm every value with the business before publishing.
   ------------------------------------------------------------------
   Replace the PRODUCTS array with the verified catalogue when available.
   The artwork is generic, original line-art — it does not depict any real model or brand. */
(function (w) {
  var uid = 0;

  var CATS = [
    { id: 'street', accent: '#ff5a28' },
    { id: 'adventure', accent: '#d2b37a' },
    { id: 'cruiser', accent: '#c8402a' },
    { id: 'urban', accent: '#3fb6a8' }
  ];

  function L(en, fr) { return { en: en, fr: fr }; }
  var AUTO = L('Automatic (CVT)', 'Automatique (CVT)');
  var PRODUCTS = [
    { id: 'ps-classic-150', cat: 'street', accent: '#ff5a28', img: 'bike-classic-150', name: 'PS Classic 150', cc: 149, type: L('single-cylinder, air-cooled', 'monocylindre, refroidi par air'), hp: 12, trans: L('5-speed manual', '5 vitesses manuelle'), tank: 12, kg: 128, price: 225000,
      desc: L('A retro-styled everyday motorcycle with a light, friendly feel — easy to ride in traffic and economical to run.', 'Une moto du quotidien au style rétro, légère et accessible — facile à piloter en ville et économique.'),
      features: [L('Classic metallic tank and chrome exhaust', 'Réservoir métallisé et échappement chromé'), L('Comfortable upright riding position', 'Position de conduite droite et confortable'), L('Front disc brake for confident stopping', 'Frein à disque avant pour un freinage sûr'), L('Round LED headlight', 'Phare rond à LED')] },
    { id: 'ps-trail-200', cat: 'adventure', accent: '#d9c400', img: 'bike-trail-200', name: 'PS Trail 200', cc: 197, type: L('single-cylinder, oil-cooled', 'monocylindre, refroidi par huile'), hp: 18, trans: L('6-speed manual', '6 vitesses manuelle'), tank: 13, kg: 148, price: 360000,
      desc: L('A tall, capable all-rounder for long distances and rough roads, with the ground clearance Djibouti’s back roads demand.', 'Un polyvalent haut et robuste pour les longues distances et les routes difficiles, avec la garde au sol qu’exigent les pistes de Djibouti.'),
      features: [L('Long-travel suspension', 'Suspensions à grand débattement'), L('High ground clearance and bash plate', 'Grande garde au sol et sabot de protection'), L('Wind deflector and luggage rack', 'Bulle et porte-bagages'), L('Dual-purpose spoked wheels', 'Roues à rayons double usage')] },
    { id: 'ps-highway-250', cat: 'cruiser', accent: '#c8402a', img: 'bike-highway-250', name: 'PS Highway 250', cc: 249, type: L('twin-cylinder, liquid-cooled', 'bicylindre, refroidi par liquide'), hp: 20, trans: L('5-speed manual', '5 vitesses manuelle'), tank: 14, kg: 165, price: 520000,
      desc: L('A relaxed, low-slung cruiser with smooth twin-cylinder power for steady, comfortable riding on open roads.', 'Un cruiser détendu et surbaissé, avec la souplesse d’un bicylindre pour rouler sereinement sur route ouverte.'),
      features: [L('Low seat height', 'Selle basse'), L('Smooth V-twin engine', 'Moteur bicylindre en V souple'), L('Chrome exhaust and fenders', 'Échappement et garde-boue chromés'), L('Round LED headlight', 'Phare rond à LED')] },
    { id: 'ps-sprint-250', cat: 'street', accent: '#ff3b30', img: 'bike-sprint-250', name: 'PS Sprint 250', cc: 249, type: L('single-cylinder, liquid-cooled', 'monocylindre, refroidi par liquide'), hp: 27, trans: L('6-speed manual', '6 vitesses manuelle'), tank: 11, kg: 163, price: 540000,
      desc: L('A fully-faired sport motorcycle with sharp looks and quick, confident handling for riders who want more performance.', 'Une moto sportive carénée au look affûté et à la tenue de route vive et sûre, pour ceux qui veulent plus de performance.'),
      features: [L('Full fairing with LED lighting', 'Carénage intégral avec éclairage LED'), L('Gold-finish front suspension', 'Fourche avant à finition dorée'), L('Dual front disc brakes', 'Double frein à disque avant'), L('Sporty riding position', 'Position de conduite sportive')] },
    { id: 'ps-electric-200', cat: 'urban', accent: '#2f9bff', img: 'bike-electric-200', ev: true, name: 'PS Electric 200', cc: 0, type: L('electric motor, 15 kW', 'moteur électrique, 15 kW'), hp: 20, trans: L('Single-speed (direct drive)', 'Mono-vitesse (transmission directe)'), tank: 6, range: 120, kg: 150, price: 480000,
      desc: L('A quiet, modern electric motorcycle for the city: instant torque, no gear changes and low running costs.', 'Une moto électrique moderne et silencieuse pour la ville : couple immédiat, sans changement de vitesse et à faible coût d’usage.'),
      features: [L('Instant electric torque', 'Couple électrique immédiat'), L('Removable-style battery pack (6 kWh)', 'Batterie de 6 kWh'), L('LED lighting and digital display', 'Éclairage LED et écran numérique'), L('Very low running costs', 'Coûts d’usage très faibles')] }
  ];

  /* ------------------------------------------------ artwork */
  function wheel(cx, cy, r, acc) {
    var s = '<g class="wh">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#0b0c0f"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 8) + '" fill="none" stroke="#1c1e23" stroke-width="10"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 20) + '" fill="#13151a" stroke="#aeb3bb" stroke-width="3"/>';
    for (var i = 0; i < 10; i++) {
      var a = i * Math.PI / 5;
      s += '<line x1="' + (cx + 9 * Math.cos(a)).toFixed(1) + '" y1="' + (cy + 9 * Math.sin(a)).toFixed(1) +
        '" x2="' + (cx + (r - 21) * Math.cos(a)).toFixed(1) + '" y2="' + (cy + (r - 21) * Math.sin(a)).toFixed(1) +
        '" stroke="#6b7078" stroke-width="2"/>';
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.42).toFixed(1) + '" fill="none" stroke="#8d939c" stroke-width="4" opacity=".65"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="#2b2e35" stroke="' + acc + '" stroke-width="2"/></g>';
    return s;
  }

  function street(a, g) {
    return wheel(190, 285, 72, a) + wheel(610, 285, 72, a) +
      '<path d="M190 285 L372 258 L380 276 L196 296Z" fill="#2d3138" stroke="#444a55" stroke-width="2"/>' +
      '<path d="M548 146 L474 238 L376 266 M392 206 L376 266" fill="none" stroke="#3f4550" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M420 322 C340 330 250 326 168 306" fill="none" stroke="url(#' + g.mt + ')" stroke-width="17" stroke-linecap="round"/><ellipse cx="168" cy="306" rx="6" ry="9" fill="#08090b"/>' +
      '<path d="M335 248 L478 240 L498 292 L488 322 L372 330 L338 296Z" fill="#2a2e36" stroke="#434955" stroke-width="2"/>' +
      '<path d="M348 262H480M346 276H488M350 290H492M356 304H490" stroke="#363a42" stroke-width="3"/>' +
      '<circle cx="420" cy="288" r="22" fill="#2f333b" stroke="' + a + '" stroke-width="2"/>' +
      '<path d="M385 205 L358 264M498 228 L470 252" stroke="#3b414b" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M392 202 C335 192 262 194 214 214 L222 234 C282 238 342 240 396 232Z" fill="#262a31" stroke="#444a55" stroke-width="2"/>' +
      '<path d="M214 214 C190 208 165 204 148 206 L150 228 C180 232 205 234 224 236Z" fill="' + a + '"/>' +
      '<path d="M392 168 C430 128 505 134 552 160 L538 214 C486 226 430 226 392 214Z" fill="url(#' + g.tk + ')"/>' +
      '<path d="M420 150 C460 138 505 142 535 158" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M610 285 L548 128" stroke="url(#' + g.mt + ')" stroke-width="10" stroke-linecap="round"/><path d="M599 285 L540 132" stroke="#6f747d" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M552 240 C577 205 645 205 668 242" fill="none" stroke="' + a + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M548 126 C575 108 600 126 592 160 C572 172 552 166 546 150Z" fill="#1f2228" stroke="#444a55" stroke-width="2"/><ellipse cx="581" cy="146" rx="13" ry="18" fill="#f6f2e4"/><circle cx="581" cy="146" r="36" fill="url(#' + g.gl + ')"/>' +
      '<path d="M520 118 L560 106 L594 112" fill="none" stroke="#4a505b" stroke-width="8" stroke-linecap="round"/><path d="M562 106 L550 80" stroke="#4a505b" stroke-width="5" stroke-linecap="round"/>';
  }

  function adventure(a, g) {
    return wheel(180, 275, 82, a) + wheel(620, 275, 82, a) +
      '<path d="M180 275 L372 248 L380 268 L188 290Z" fill="#2d3138" stroke="#444a55" stroke-width="2"/>' +
      '<path d="M556 126 L478 230 L376 258 M384 190 L372 256" fill="none" stroke="#3f4550" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M410 308 C340 316 270 302 196 268" fill="none" stroke="url(#' + g.mt + ')" stroke-width="18" stroke-linecap="round"/><ellipse cx="196" cy="268" rx="6" ry="10" fill="#08090b"/>' +
      '<path d="M335 232 L482 226 L502 280 L490 312 L372 320 L338 288Z" fill="#2a2e36" stroke="#434955" stroke-width="2"/>' +
      '<path d="M348 248H484M346 262H492M350 276H496M356 292H494" stroke="#363a42" stroke-width="3"/>' +
      '<circle cx="424" cy="274" r="22" fill="#2f333b" stroke="' + a + '" stroke-width="2"/>' +
      '<path d="M522 232 C504 262 494 292 474 314" fill="none" stroke="#3a3e46" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M382 190 L350 252" stroke="#3b414b" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M340 184 C290 176 215 178 160 192 L166 214 C230 218 300 220 346 212Z" fill="#262a31" stroke="#444a55" stroke-width="2"/>' +
      '<path d="M160 192 L146 178 M170 194 L158 168 M190 190 L184 164" stroke="#4a505b" stroke-width="5" stroke-linecap="round"/><path d="M142 168H250" stroke="#4a505b" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M380 150 C420 108 500 114 548 138 L538 196 C486 208 420 208 380 196Z" fill="url(#' + g.tk + ')"/>' +
      '<path d="M410 130 C455 116 505 122 535 138" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M620 275 L558 112" stroke="url(#' + g.mt + ')" stroke-width="11" stroke-linecap="round"/><path d="M608 275 L550 116" stroke="#6f747d" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M562 214 C590 186 652 190 680 224" fill="none" stroke="' + a + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M586 110 L676 150 L668 164 L584 130Z" fill="' + a + '"/>' +
      '<path d="M560 126 L588 66 L618 70 L602 132Z" fill="#9cc7e0" fill-opacity=".34" stroke="#c9e3f1" stroke-opacity=".5"/>' +
      '<path d="M556 108 C580 92 606 108 598 140 C578 150 560 144 554 128Z" fill="#1f2228" stroke="#444a55" stroke-width="2"/><ellipse cx="582" cy="120" rx="12" ry="16" fill="#f6f2e4"/><circle cx="582" cy="120" r="34" fill="url(#' + g.gl + ')"/>' +
      '<path d="M516 100 L556 90 L592 96" fill="none" stroke="#4a505b" stroke-width="8" stroke-linecap="round"/>';
  }

  function cruiser(a, g) {
    return wheel(185, 282, 76, a) + wheel(640, 282, 76, a) +
      '<path d="M185 282 L372 262 L380 280 L192 296Z" fill="#2d3138" stroke="#444a55" stroke-width="2"/>' +
      '<path d="M562 158 L476 258 L372 268 M384 200 L372 268 M240 220 L372 268" fill="none" stroke="#3f4550" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M112 280 C112 205 262 200 262 280 L250 280 C248 224 126 224 124 280Z" fill="' + a + '"/>' +
      '<path d="M440 304 C345 318 262 312 176 298" fill="none" stroke="url(#' + g.mt + ')" stroke-width="15" stroke-linecap="round"/><path d="M450 318 C350 330 270 326 190 316" fill="none" stroke="url(#' + g.mt + ')" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M350 252 L395 198 L428 216 L392 270Z" fill="url(#' + g.mt + ')"/><path d="M412 264 L456 208 L488 228 L452 280Z" fill="url(#' + g.mt + ')"/>' +
      '<path d="M340 262 L470 258 L476 306 L350 312Z" fill="#2a2e36" stroke="#434955" stroke-width="2"/><circle cx="405" cy="286" r="20" fill="#2f333b" stroke="#aeb3bb" stroke-width="2"/>' +
      '<path d="M380 196 C340 200 280 204 232 212 L238 234 C290 234 340 234 384 228Z" fill="#262a31" stroke="#444a55" stroke-width="2"/>' +
      '<path d="M380 160 C420 128 485 134 524 158 C536 178 524 198 502 206 C452 216 412 214 380 198Z" fill="url(#' + g.tk + ')"/>' +
      '<path d="M410 146 C445 136 485 140 512 156" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M640 282 L560 148" stroke="url(#' + g.mt + ')" stroke-width="10" stroke-linecap="round"/><path d="M628 284 L550 152" stroke="#6f747d" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M574 262 C600 220 682 224 706 268 L694 270 C676 238 612 238 590 270Z" fill="' + a + '"/>' +
      '<circle cx="568" cy="160" r="20" fill="#1f2228" stroke="#444a55" stroke-width="2" stroke="url(#' + g.mt + ')" stroke-width="4"/><circle cx="568" cy="160" r="12" fill="#f6f2e4"/><circle cx="568" cy="160" r="40" fill="url(#' + g.gl + ')"/>' +
      '<path d="M546 150 C540 110 556 78 604 80" fill="none" stroke="url(#' + g.mt + ')" stroke-width="7" stroke-linecap="round"/>';
  }

  function urban(a, g) {
    return wheel(210, 301, 56, a) + wheel(590, 301, 56, a) +
      '<path d="M290 262 L515 262 L515 292 C430 302 360 302 290 292Z" fill="#2d3138" stroke="#444a55" stroke-width="2"/>' +
      '<path d="M330 236 L300 296 M205 284 L330 262" fill="none" stroke="#3f4550" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M110 232 C150 172 282 170 332 212 L332 262 L204 272 C152 270 120 256 110 232Z" fill="' + a + '"/>' +
      '<path d="M206 236 C230 224 280 224 306 240" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="210" cy="301" r="26" fill="#2a2e36" stroke="#434955" stroke-width="2" stroke="#363a42" stroke-width="3"/>' +
      '<path d="M150 180 C200 160 302 160 342 190 L332 206 C282 190 202 192 160 204Z" fill="#262a31" stroke="#444a55" stroke-width="2"/>' +
      '<path d="M505 130 C545 124 574 150 576 200 L568 298 L520 298 C512 240 506 180 505 130Z" fill="url(#' + g.tk + ')"/>' +
      '<path d="M590 301 L552 150" stroke="url(#' + g.mt + ')" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M548 264 C568 240 622 242 642 270" fill="none" stroke="' + a + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M546 142 L558 92" stroke="#4a505b" stroke-width="7" stroke-linecap="round"/><path d="M528 88 L586 80" stroke="#4a505b" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M552 118 C566 96 592 104 588 128 C576 136 560 134 552 118Z" fill="#1f2228" stroke="#444a55" stroke-width="2"/><ellipse cx="578" cy="114" rx="9" ry="12" fill="#f6f2e4"/><circle cx="578" cy="114" r="30" fill="url(#' + g.gl + ')"/>';
  }

  var BODIES = { street: street, adventure: adventure, cruiser: cruiser, urban: urban };
  var VIEWS = {
    side: '50 30 700 350',
    front: '400 40 340 320',
    engine: '250 120 320 260'
  };

  /* bikeSVG(type, {accent, view, label}) → SVG markup string */
  function bikeSVG(type, o) {
    o = o || {};
    var a = o.accent || '#ff5a28';
    var n = ++uid;
    var g = { tk: 'tk' + n, mt: 'mt' + n, gl: 'gl' + n };
    var view = VIEWS[o.view] || VIEWS.side;
    var label = o.label ? ' role="img" aria-label="' + String(o.label).replace(/"/g, '&quot;') + '"' : ' aria-hidden="true"';
    var body = (BODIES[type] || street)(a, g);
    var rim = o.hero ? '<path d="M150 200 C260 120 420 100 560 120" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + view + '"' + label + ' focusable="false">' +
      '<defs>' +
      '<linearGradient id="' + g.tk + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>' +
      '<linearGradient id="' + g.mt + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8dce2"/><stop offset="1" stop-color="#5d626b"/></linearGradient>' +
      '<radialGradient id="' + g.gl + '"><stop offset="0" stop-color="#fff7d6" stop-opacity=".55"/><stop offset="1" stop-color="#fff7d6" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      '<ellipse cx="400" cy="362" rx="340" ry="13" fill="#000" opacity=".55"/>' +
      body + rim + '</svg>';
  }

  /* ------------------------------------------------ helpers */
  function get(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function tr(o) { return o[w.I18N.lang] || o.en; }
  function nm(p) { return p.name; }
  function ds(p) { return tr(p.desc); }
  function catName(id) { return w.I18N.t('cat.' + id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function num(n) { return Number(n).toLocaleString(w.I18N.lang === 'fr' ? 'fr-FR' : 'en-US'); }
  function price(p) { return num(p.price) + ' DJF'; }
  /* [labelKey, text] rows used by cards, modal, detail page and comparison */
  function specRows(p) {
    var t = w.I18N.t;
    return [
      ['sp.engine', p.ev ? tr(p.type) : p.cc + ' cc · ' + tr(p.type)],
      ['sp.power', p.hp + ' hp'],
      ['sp.transmission', tr(p.trans)],
      ['sp.fuel', p.ev ? t('fuel.electric') : t('fuel.petrol')]
    ].concat(p.ev ? [['sp.battery', num(p.tank) + ' kWh'], ['sp.range', '≈ ' + p.range + ' km']] : [['sp.tank', num(p.tank) + ' L']]).concat([['sp.weight', p.kg + ' kg']]);
  }
  function engineVal(p) { return p.ev ? w.I18N.t('sp.motor.short') : p.cc + ' cc'; }
  function tankRow(p) { return p.ev ? [w.I18N.t('sp.battery'), num(p.tank) + ' kWh'] : [w.I18N.t('sp.tank'), num(p.tank) + ' L']; }
  function catImg(id) {
    var p = PRODUCTS.filter(function (x) { return x.cat === id; })[0];
    return p ? '<img class="p-img" src="assets/img/' + p.img + '.jpg" alt="" loading="lazy" decoding="async">' : '';
  }
  function art(p, view, hero) {
    if (p.img) return '<img class="p-img" src="assets/img/' + p.img + '.jpg" alt="' + esc(nm(p)) + '" width="666" height="375" loading="lazy" decoding="async">';
    return bikeSVG(p.cat, { accent: p.accent, view: view || 'side', hero: hero, label: nm(p) });
  }

  function cardHTML(p, i) {
    var t = w.I18N.t;
    return '<article class="p-card reveal" data-reveal="up" data-d="' + ((i % 3) * 110) + '" data-tilt data-product="' + p.id + '" data-cat="' + p.cat + '">' +
      '<button type="button" class="p-card__media" data-quick="' + p.id + '" aria-label="' + esc(t('c.quick') + ': ' + nm(p)) + '">' +
      '<span class="p-card__badge chip">' + esc(catName(p.cat)) + '</span>' + art(p, 'side') + '</button>' +
      '<div class="p-card__body"><div class="p-card__cat">' + esc(catName(p.cat)) + '</div>' +
      '<h3>' + esc(nm(p)) + '</h3><p class="p-card__desc">' + esc(ds(p)) + '</p>' +
      '<ul class="p-card__specs"><li><span>' + esc(t('sp.engine')) + '</span>' + engineVal(p) + '</li><li><span>' + esc(t('sp.power')) + '</span>' + p.hp + ' hp</li>' +
      '<li><span>' + esc(t('sp.transmission')) + '</span>' + esc(tr(p.trans)) + '</li><li><span>' + esc(t('sp.tank')) + '</span>' + esc(num(p.tank)) + ' L</li></ul>' +
      '<div class="p-card__price"><span>' + esc(t('c.from')) + '</span><strong>' + esc(price(p)) + '</strong></div>' +
      '<div class="p-card__actions"><button type="button" class="px-btn px-btn--sm" data-quick="' + p.id + '">' + esc(t('c.quick')) + '</button>' +
      '<a class="px-btn px-btn--sm px-btn--ghost" href="inquiry.html?model=' + p.id + '">' + esc(t('c.inquire')) + '</a></div></div></article>';
  }

  function renderGrid(el, list) {
    if (!el) return;
    if (!list.length) {
      el.innerHTML = '<div class="empty"><h3>' + w.I18N.t('c.empty.t') + '</h3><p>' + w.I18N.t('c.empty.d') + '</p></div>';
      return;
    }
    el.innerHTML = list.map(cardHTML).join('');
    // newly inserted cards are revealed immediately (they were requested by the visitor)
    el.querySelectorAll('.reveal').forEach(function (n, k) { setTimeout(function () { n.classList.add('is-in'); if (w.PXUI) w.PXUI.settle(n); }, 40 + k * 70); });
  }

  w.PX = { products: PRODUCTS, cats: CATS, get: get, bikeSVG: bikeSVG, art: art, name: nm, desc: ds, tr: tr, catName: catName, esc: esc, num: num, price: price, specRows: specRows, catImg: catImg, engineVal: engineVal, tankRow: tankRow, cardHTML: cardHTML, renderGrid: renderGrid };
})(window);

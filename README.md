# PAKSTAR SARL — Cinematic Motorcycle Website

A multi-page, animated, bilingual (English / Français) website for PAKSTAR SARL, targeting the motorcycle market in Djibouti.
HTML5 + CSS3 + Bootstrap 5 + vanilla JavaScript only — no build step, no backend.

## Run it

Open `index.html` in a browser (works straight from the folder). To mimic a real host, serve it:

```bash
cd PAKSTAR-SARL
python3 -m http.server 8000      # then visit http://localhost:8000
```

## Pages

| File | Content |
|---|---|
| `index.html` | Hero · intro · featured models with prices · categories · "why us" · built-for-Djibouti · how it works · location map · CTA · FAQ · news |
| `about.html` | Overview · what we offer · principles · facts to be confirmed · location map |
| `motorcycles.html` | Catalogue (filter, sort by name / category / price) · quick-view modals · **side-by-side comparison table** · buying guide |
| `product-details.html?id=…` | One page per model: image, price, full specifications, features, related models |
| `dealers.html` | Honest dealer-network page · location map · what each dealer card will show |
| `news.html` | Editorial layout (demonstration articles, text only) |
| `contact.html` | Contact form · contact details · location map |
| `inquiry.html?model=…` | Product inquiry; the selected motorcycle and its price are carried through |
| `become-a-dealer.html` | Business / dealer inquiry |

## Models, specifications and prices — READ THIS

You asked for the cards to be filled in, so `js/products.js` contains five models matching the supplied photos (PS Classic 150, PS Trail 200, PS Highway 250, PS Sprint 250, PS Electric 200) with engine, power, transmission, tank, weight, features and a price in **DJF**.

**All of these values were written for the website design — they are indicative, not verified product data.** The site says so ("Specifications and prices are indicative… confirm with PAKSTAR SARL"). Before launching, replace the `PRODUCTS` array with your real models, specs and prices. The model names are original (not another brand's), and each model uses its supplied photo from `assets/img/` (set with the `img` field). The PS Electric 200 uses `ev: true` (battery kWh and range instead of fuel tank).

Each product is one object: `id, cat, accent, name, cc, type, hp, trans, tank, kg, price, desc{en,fr}, features[{en,fr}]`. Cards, modal, detail page, comparison table, sorting and the inquiry form all read from it automatically.

## Location (Djibouti)

Every location section shows a Djibouti City card (pin, coordinates 11.59°N 43.15°E, Gulf of Tadjoura). The **Load interactive map** button loads a real OpenStreetMap view only when pressed (so no third-party request is made until the visitor asks). The showroom street address is still a placeholder: `[Official Company Address]`. Search `ph.` in `js/lang-data.js` for all placeholders (address, phone, email, hours, social accounts).

## Language (EN / FR)

Selector in the header, mobile menu and footer. It rewrites every string — page text, form labels and validation messages, cards, modals, spec values, number formats, document title. The choice is remembered; the first visit follows the browser language. All text is in `js/lang-data.js` (use `data-i18n="key"` in HTML).

## Forms — demo vs. real delivery

Forms validate in the browser. **By default nothing is sent anywhere**; a valid submit shows "Demonstration only — not sent". To deliver messages connect a real service and set, before `js/forms.js` loads:

```html
<script>window.PAKSTAR_CONFIG = { formEndpoint: 'https://your-endpoint.example/submit' };</script>
```

## Local Storage

Only non-sensitive conveniences (language, the inquiry page's model / country / contact-method choices, "loader already seen" for the session). Names, e-mails, phones and messages are never stored. Local Storage is per-browser and is not a substitute for a secure backend.

## Features

* Cinematic hero with parallax / mouse depth, preloader, scroll reveals, tilt and hover effects, page-transition curtain — all disabled under `prefers-reduced-motion`
* Accessible mega-menu dropdown (hover, click, touch, keyboard, Esc, outside-click) and full-screen mobile menu
* Product modal on **every** card (focus trap, Esc / backdrop close, scroll lock, focus returns to the opener, bottom-sheet on phones)
* Home hero plays `assets/video/hero.mp4` (muted, looping, paused under reduced motion); every other page has its own header photo (`assets/img/hero-*.jpg`, bike photos)
* Logo (header, footer, loader, browser-tab icon) in `assets/img/` and `assets/icons/`
* One photo per model plus a zoom lightbox on the detail page
* Expanded News (9 demo articles) and Dealer Network (how it works, regions, standards, partner criteria, FAQ — all marked as to-be-confirmed)
* Sorting by price, category filters, comparison table with best-value highlights (scrolls sideways on phones)
* Semantic HTML, skip link, visible focus, labelled forms, no horizontal overflow

## Fonts and libraries

* Bootstrap 5.3.2 is included locally in `assets/vendor/` (works offline).
* Barlow Condensed and Inter load from Google Fonts when online; the CSS falls back to condensed / system sans fonts offline.
* Icons are inline SVG.

## Structure

```
index.html about.html motorcycles.html product-details.html dealers.html news.html contact.html inquiry.html become-a-dealer.html
css/   style.css · animations.css · responsive.css
js/    lang-data.js i18n.js storage.js products.js modals.js forms.js pages.js main.js
assets/ icons/*.png · img/ · video/ · vendor/bootstrap.min.css · vendor/bootstrap.bundle.min.js
```

`js/main.js` builds the shared header, menus and footer on every page, so navigation is edited in one place.

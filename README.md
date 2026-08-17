# Maa Baroma Hardware — Business Website

A complete, static, mobile-first business website for **Maa Baroma Hardware**
(Hardware Store — Kalna Road, Khalasi Para, Bardhaman, West Bengal 713407),
built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build
step, no server — it works by uploading the folder to any static host,
including GitHub Pages.

---

## 1. What's real vs. what's a placeholder

Everything below was taken directly from the client's Google Maps listing
and is **real, verified data**:

| Field | Value | Source |
|---|---|---|
| Business name | Maa Baroma Hardware | Google Maps listing |
| Category | Hardware store | Google Maps listing |
| Address | Kalna Road, Khalasi Para, Bardhaman, West Bengal 713407 | Google Maps listing |
| Phone | +91 86175 35369 | Shop signboard photo (matches Maps "Call" action) |
| Rating | 5.0 ★ (5 reviews) | Google Maps listing |
| Reviews | Anit Rudra, Babusona Roy, Riyajul Sekh (with owner reply to Babusona Roy) | Google Maps "Reviews" tab |
| WhatsApp | Available (same number used) | Google Maps listing shows a WhatsApp action button |

The following are **clearly marked placeholders** because the source data
either wasn't fully available or needs the client's confirmation:

- **Full weekly opening hours** — the listing only showed a live snapshot
  ("Closes soon · 2pm · Reopens 5pm"). The site currently shows an
  editable placeholder schedule based on that single data point, labelled
  *"(placeholder — confirm)"* in the Hours table. **You must confirm and
  update the real weekly hours** — see Section 5 below.
- **Product/service names, descriptions and prices** — the listing didn't
  provide a structured product list, only photos of the shelves (paints,
  PVC pipes/fittings, ropes, chains, general hardware). Sample product
  cards were created from what's visible in the photos; three cards are
  explicitly marked `[Add Product Name]` for you to fill in.
- **Photos** — the images in `/images/` are placeholder graphics labelled
  with the exact filename to replace (e.g. "REPLACE: images/shop-1.jpg").
  Swap in the client's real photos — see Section 4.
- **Social media links** (Facebook/Instagram) — not available in the
  listing, so the icons link to `#`. Add real URLs once available.
- **"About" story paragraph** — a short placeholder paragraph invites you
  to add real background (how long the shop has operated, the owner,
  etc.) once confirmed with the client.

Nothing in the structured data (JSON-LD), contact links, or address was
invented — only clearly labelled placeholders were used where information
was missing, per your instructions.

---

## 2. File structure

```
business-website/
│
├── index.html          → page structure & content
├── style.css            → all design/styling
├── script.js             → all interactivity (vanilla JS)
├── README.md              → this file
│
├── images/                → replace these to update all photos
│   ├── logo.png
│   ├── hero.jpg
│   ├── shop-1.jpg
│   ├── shop-2.jpg
│   ├── shop-3.jpg
│   ├── shop-4.jpg
│   ├── shop-5.jpg
│   └── shop-6.jpg
│
└── assets/
    └── icons/
        └── favicon.png
```

All paths in the code are **relative** (e.g. `images/hero.jpg`, not
`/images/hero.jpg`), so the site works correctly both locally and on
GitHub Pages without any path changes.

---

## 3. Preview it locally

Because the page uses `fetch`-free, plain relative paths, you can simply
double-click `index.html` to open it in a browser. For the most accurate
preview (especially the Google Maps embed), serve it with a simple local
server instead:

```bash
cd business-website
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

---

## 4. How to replace the images

Every image file keeps the **same filename** — just overwrite the file in
`/images/` with your real photo saved under that exact name. You do not
need to edit any HTML.

| File | Used for |
|---|---|
| `images/logo.png` | Header logo + footer logo (square image works best, transparent background ideal) |
| `images/hero.jpg` | Big hero background photo (wide image, ideally 1920×1080 or larger) |
| `images/shop-1.jpg` … `images/shop-6.jpg` | Gallery grid + reused across product cards and the About section |

Steps:
1. Prepare your photos (JPG or PNG). Recommended: compress them (e.g. with
   [Squoosh.app](https://squoosh.app)) to keep the site fast — aim for
   under 300 KB per photo.
2. Rename each photo to match the filename it's replacing (e.g. your best
   storefront shot → `hero.jpg`).
3. Copy the files into the `images/` folder, overwriting the placeholders.
4. Refresh the page — no code changes needed.

If you want to add **more** than 6 gallery photos, duplicate one
`<button class="gallery-item">…</button>` block inside the `#gallery`
section of `index.html`, point `data-full` and the `<img src>` at your new
file, and update the `alt` text and `data-caption`.

---

## 5. How to change the phone number

The phone number `+91 86175 35369` (used as `tel:+918617535369` in links)
appears in several places. Use **Find & Replace** in your code editor to
replace every instance of:

```
+918617535369
```

with the new number (no spaces, no dashes, country code first, e.g.
`+919876543210`), and every instance of the human-readable version:

```
+91 86175 35369
```

with the new formatted number. This covers:
- Header "Call Now" button
- Hero "Call Now" button
- Mobile nav "Call Now" button
- Floating mobile "Call" button
- Contact section "Call Us" card
- Location section phone row
- Footer contact list
- JSON-LD structured data (`telephone` field, near the top of `index.html`)

---

## 6. How to change the WhatsApp number

WhatsApp links use the format `https://wa.me/918617535369` (country code +
number, no `+`, no spaces). Find & Replace every instance of:

```
918617535369
```

in `https://wa.me/918617535369` with the new number in the same format
(e.g. `919876543210`). This covers:
- Hero WhatsApp button
- Mobile nav WhatsApp button
- Floating mobile WhatsApp button
- Contact section WhatsApp card
- Footer WhatsApp link
- Social icon row WhatsApp button

---

## 7. How to change the Google Maps location

Three things use the location and should be updated together if the
business moves or you get a more precise pin:

**A. The "Get Directions" buttons** (hero, location section, floating
button, reviews section) all use:
```
https://www.google.com/maps/dir/?api=1&destination=Maa+Baroma+Hardware%2C+Kalna+Road%2C+Khalasi+Para%2C+Bardhaman%2C+West+Bengal+713407
```
Replace the `destination=` value with the new address (URL-encoded), or
with exact `latitude,longitude` for pinpoint accuracy, e.g.
`destination=23.2510,87.8600`.

**B. The embedded map iframes** (main Location section + footer mini-map)
use:
```
https://www.google.com/maps?q=Maa+Baroma+Hardware,+Kalna+Road,+Khalasi+Para,+Bardhaman,+West+Bengal+713407&output=embed
```
Replace the `q=` value the same way. This embed method needs no API key.

**C. For a pinpoint-exact embed** (recommended once you can access Google
Maps directly): open the business listing on Google Maps → **Share** →
**Embed a map** → copy the provided `<iframe>` `src` URL → paste it in as
the `src` for both map iframes in `index.html`.

**D. The JSON-LD structured data** near the top of `index.html` has an
`address` object — update `streetAddress`, `addressLocality`,
`addressRegion`, and `postalCode` if the address changes. Adding a `geo`
field with `latitude`/`longitude` (once you have the exact coordinates)
will further improve local SEO.

---

## 8. How to update opening hours

Two places need to stay in sync:

**A. The visible table** — in `index.html`, inside `<section id="hours">`,
edit the text in each `<tr data-day="N">` row (N = 0 for Sunday … 6 for
Saturday).

**B. The live "Open Now / Closed" logic** — in `script.js`, edit the
`HOURS_DATA` array near the top of Section 5. Each day takes 24-hour
`"HH:MM"` times. Example for a shop open 9:30–14:00 and 17:00–21:00:

```js
{ day: "Monday", closed: false, ranges: [["09:30", "14:00"], ["17:00", "21:00"]] }
```

For a day with no midday break, use a single range:
```js
{ day: "Monday", closed: false, ranges: [["09:30", "21:00"]] }
```

For a closed day (e.g. Sunday), set:
```js
{ day: "Sunday", closed: true, ranges: [] }
```

Once confirmed, remove the "(placeholder — confirm)" text from each row
in the HTML table.

---

## 9. How to edit products/services

In `index.html`, inside `<section id="products">`, each product is one
`<article class="product-card">` block. To edit one:
1. Change the `<img src="...">` to the product photo (from `/images/`).
2. Update the `alt` text to describe the photo.
3. Edit the `<h3>` name and `<p>` description.
4. Edit or remove the price in `.product-price` (defaults to "Ask for
   price" since exact prices weren't provided).

To add a new product, copy an entire `<article class="product-card">…
</article>` block and edit it. To remove one, delete the block.

---

## 10. Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `maa-baroma-hardware`).
2. Upload all files and folders from this project — keeping the same
   structure — to the root of the repository (do **not** put them inside
   a subfolder unless you plan to adjust paths).
3. Commit and push (or use GitHub's "Add file → Upload files" in the
   browser if you're not using Git directly).
4. In the repository, go to **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **Deploy from a
   branch**.
6. Under **Branch**, choose **`main`** and folder **`/ (root)`**, then
   **Save**.
7. Wait 1–2 minutes. GitHub will show your live URL, typically:
   ```
   https://<your-github-username>.github.io/<repository-name>/
   ```
8. Update the `<link rel="canonical">` and Open Graph `og:url` /
   `og:image` tags near the top of `index.html` with this final URL for
   best SEO results.

No further configuration is required — the site is 100% static and has
no dependency on PHP, Node.js, databases, or any backend service.

---

## 11. Performance & accessibility notes

- Images use `loading="lazy"` (except the hero, which loads eagerly with
  `fetchpriority="high"`) to keep the initial page load fast.
- All images include descriptive `alt` text and explicit `width`/`height`
  to prevent layout shift.
- No external JavaScript libraries or frameworks are loaded — only one
  Google Fonts stylesheet request and the site's own `style.css`/`script.js`.
- The site respects `prefers-reduced-motion` and includes visible
  keyboard focus states throughout.
- The gallery lightbox is fully keyboard-operable (Tab to reach a photo,
  Enter/Space to open, Arrow keys to navigate, Escape to close) and traps
  focus sensibly on open/close.
- Dark mode is optional and toggled from the header; the choice is saved
  in the visitor's browser (`localStorage`) so it persists on return
  visits.

---

## 12. Support

This is a static template — any code editor (VS Code, Sublime, even
GitHub's web editor) can be used to make the edits above. If you get
stuck, the most common fixes are:
- **Image not showing** → check the filename in `/images/` exactly
  matches what's referenced in `index.html` (case-sensitive).
- **Map not loading** → check the `q=` or `destination=` value in the
  map URLs is correctly URL-encoded (spaces become `+`).
- **Phone/WhatsApp link not working on desktop** → this is expected;
  `tel:` and `wa.me` links are designed to open the Phone/WhatsApp app on
  mobile devices and may prompt an app-chooser or do nothing on a desktop
  browser without the app installed.

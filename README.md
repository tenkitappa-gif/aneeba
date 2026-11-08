# for aneeba — v2

A hand-built, multi-page love letter site. No frameworks, no build step at runtime — just open `index.html`. The pages are generated from one small script so every page shares the same nav, player and modals.

Live: **https://tenkitappa-gif.github.io/aneeba/**

## Run it

Double-click `index.html`, or serve the folder over HTTP (needed for the music player's seek offsets):

```powershell
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## The pages

| Page | File | What lives there |
| --- | --- | --- |
| Home | `index.html` | Hero portrait + a card for every chapter |
| The letter | `letter.html` | Envelope that opens into the letter |
| Our story | `story.html` | Timeline |
| Reasons | `reasons.html` | Flip cards (tap to reveal the back) |
| Promises | `promises.html` | Constellation — each star opens a promise and remembers it |
| Your photos | `gallery.html` | 8 photo frames with a lightbox |
| Our songs | `music.html` | Player; each song starts at its own sweet spot |
| Forever | `forever.html` | Closing "i love you" with a heart burst |

Every page has a previous/next link at the bottom, so she can read it like a book.

## Editing pages

`tools/build-pages.js` is the **source of truth** for the HTML. It contains the shared chrome (rail nav, mobile menu, player, modals, footer) and each page's body. Edit it, then rebuild:

```powershell
node tools/build-pages.js
```

That overwrites all eight `.html` files. After changing `css/style.css`, `js/app.js` or `js/data.js`, bump `const V = "6";` at the top of the builder and rebuild — the `?v=` cache-buster keeps phones from serving stale files.

If you only want to change wording, edit `js/data.js` directly; no rebuild needed.

## Add the photos

Drop images into `assets/photos/` using these exact file names:

| File | Where it shows up |
| --- | --- |
| `hero.jpg` | Big portrait in the opening section |
| `photo-1.jpg` … `photo-8.jpg` | The gallery (in that order) |

Notes:

- `.jpg` is preferred. If you only have `.png`, either rename/convert them or edit `js/data.js` (gallery) and the hero path in `js/app.js` (`heroImg.src`).
- A gallery frame with `src: null` in `js/data.js` is an empty "add photo" slot — no broken request. To fill it permanently, drop the file in and set its `src`, e.g. `{ src: "assets/photos/photo-4.jpg", caption: "…", wide: true }`.
- Portraits look best around **1200 × 1500 px** (4:5). Gallery shots can be any orientation; wide and tall ones get special layout treatment.
- Captions live in `js/data.js` under `gallery` — edit the `caption` strings freely.
- On a phone/desktop you can also tap any photo frame to upload one straight from the device. Those uploads are downscaled and saved in `localStorage`, so they stay only in that browser (good for previewing, not for sharing the site).

## What's inside

```
index.html …          generated pages (do not hand-edit; edit tools/build-pages.js)
tools/build-pages.js  page builder — shared chrome + all page bodies
css/style.css         all styling, responsive breakpoints, animations
js/data.js            letter, story, reasons, promises, gallery + track metadata
js/app.js             preloader, nav, renderers, modals, gallery upload, player
assets/photos/        your photos go here
assets/songs/         local tracks (barbaad plays from YouTube — see below)
```

## Editing the words

Everything romantic lives in `js/data.js`:

- `letter` — greeting, paragraphs, sign-off
- `story` — timeline entries
- `reasons` — front/back of each flip card
- `promises` — the 9 stars
- `tracks` — song title, artist, file, and `startAt` offset in seconds. A track with `youtube: "VIDEO_ID"` (instead of `file`) opens in the YouTube modal, e.g. `barbaad`.

## Small notes

- Light pink palette: background `#fff1f6`, ink `#4a2233`, accent rose `#c05a83`, with lavender kept for the sky. Variables live at the top of `css/style.css`.
- Music starts only after a tap (browser autoplay rules). Each track seeks to its `startAt` value on load.
- `barbaad` has no local MP3 — it streams from an official YouTube embed. Drop a real `barbaad-saiyaara.mp3` in `assets/songs/` and swap the `youtube` key for `file` + `startAt` to play it locally.
- Mobile mode drops the particle count, freezes heavy looping animations, and disables the custom cursor.
- Reduced-motion is respected.
- Works offline once all assets are local.

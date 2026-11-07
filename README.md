# for aneeba — v2

A hand-built, one-page love letter site. No frameworks, no build step — just open `index.html`.

## Run it

Double-click `index.html`, or serve the folder over HTTP (needed for the music player's seek offsets):

```powershell
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Add the photos

Drop images into `assets/photos/` using these exact file names:

| File | Where it shows up |
| --- | --- |
| `hero.jpg` | Big portrait in the opening section |
| `photo-1.jpg` … `photo-8.jpg` | The gallery (in that order) |

Notes:

- `.jpg` is preferred. If you only have `.png`, either rename/convert them or edit `js/data.js` (gallery) and the hero path in `js/app.js` (`heroImg.src`).
- Any missing file automatically shows a designed placeholder — nothing breaks.
- Portraits look best around **1200 × 1500 px** (4:5). Gallery shots can be any orientation; wide and tall ones get special layout treatment.
- Captions live in `js/data.js` under `gallery` — edit the `caption` strings freely.
- On a phone/desktop you can also tap any photo frame to upload one straight from the device. Those uploads are downscaled and saved in `localStorage`, so they stay only in that browser (good for previewing, not for sharing the site).

## What's inside

```
index.html            markup for every section
css/style.css         all styling, responsive breakpoints, animations
js/data.js            letter, story, reasons, promises, gallery + track metadata
js/app.js             preloader, nav, renderers, modals, gallery upload, player
assets/photos/        your photos go here
assets/songs/         background tracks (barbaad-saiyaara.mp3 not included yet — drop it here)
```

### Sections

1. **Hero** — portrait, name, little intro, music nudge
2. **The letter** — an envelope that opens into a scrollable letter
3. **Our story** — timeline
4. **Reasons** — flip cards (tap to reveal the back)
5. **Promises** — a constellation; each star opens a promise and remembers it
6. **Gallery** — 8 photo slots with lightbox
7. **Music** — custom player, each song starts at its own sweet spot
8. **Forever** — closing "i love you" with a heart burst

## Editing the words

Everything romantic lives in `js/data.js`:

- `letter` — greeting, paragraphs, sign-off
- `story` — timeline entries
- `reasons` — front/back of each flip card
- `promises` — the 9 stars
- `tracks` — song title, artist, file, and `start` offset in seconds

## Small notes

- Music starts only after a tap (browser autoplay rules). Each track seeks to its `start` value on load.
- Reduced-motion is respected; the particle canvas and heavy animations settle down.
- Works offline once all assets are local.

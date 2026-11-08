/* =========================================================
   PAGE BUILDER — for aneeba
   Every page shares the same chrome (nav, player, modals).
   Run:  node tools/build-pages.js
   ========================================================= */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const V = "10";

/* ---------------- navigation ---------------- */
const NAV = [
  { file: "index.html",   id: "home",     icon: "home",     label: "Home",         menu: "Home",         num: "01" },
  { file: "letter.html",  id: "letter",   icon: "mail",     label: "Letter",       menu: "The letter",   num: "02" },
  { file: "story.html",   id: "story",    icon: "book",     label: "Our story",    menu: "Our story",    num: "03" },
  { file: "reasons.html", id: "reasons",  icon: "heart",    label: "Reasons",      menu: "Reasons",      num: "04" },
  { file: "promises.html",id: "sky",      icon: "star",     label: "Promises",     menu: "Promises",     num: "05" },
  { file: "gallery.html", id: "gallery",  icon: "image",    label: "Gallery",      menu: "Your photos",  num: "06" },
  { file: "music.html",   id: "music",    icon: "music",    label: "Music",        menu: "Our songs",    num: "07" },
  { file: "forever.html", id: "forever",  icon: "infinity", label: "Forever",      menu: "Forever",      num: "08" }
];

function rail(active) {
  return `<aside class="rail" aria-label="Main navigation">
  <a class="rail__logo" href="index.html" aria-label="Back to the start"><span>A</span></a>
  <nav class="rail__nav">
${NAV.map((n) => `    <a class="rail__link${n.id === active ? " is-active" : ""}" href="${n.file}" aria-label="${n.label}"${n.id === active ? ' aria-current="page"' : ""}><svg class="ico"><use href="#i-${n.icon}"/></svg><span class="rail__tip">${n.label}</span></a>`).join("\n")}
  </nav>
  <span class="rail__foot">est. forever</span>
</aside>`;
}

function menu(active) {
  return `<header class="topbar">
  <a class="topbar__logo" href="index.html" aria-label="Back to the start">A</a>
  <span class="topbar__tag">for Aneeba</span>
  <button class="topbar__burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu">
    <svg class="ico"><use href="#i-menu"/></svg>
  </button>
</header>

<div class="menu" id="menu" aria-hidden="true">
  <div class="menu__inner">
    <p class="menu__kicker">where would you like to go?</p>
    <nav class="menu__nav" aria-label="Mobile navigation">
${NAV.map((n) => `      <a href="${n.file}"${n.id === active ? ' aria-current="page"' : ""}><em>${n.num}</em><span>${n.menu}</span></a>`).join("\n")}
    </nav>
    <p class="menu__foot">made with everything i have</p>
  </div>
</div>`;
}

/* ---------------- shared chunks ---------------- */
const SPRITE = `<svg class="sprite" aria-hidden="true" focusable="false">
  <symbol id="i-home" viewBox="0 0 24 24"><path d="M3 10.7 12 3l9 7.7V21H3z"/><path d="M9.5 21v-6h5v6"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/></symbol>
  <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20.3S3.8 15.6 3.8 9.7A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.2 2.7c0 5.9-8.2 10.6-8.2 10.6z"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3 2.6 5.6 6.1.8-4.5 4.3 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z"/></symbol>
  <symbol id="i-image" viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 17 4.7-4.7 3.3 3.2 2.9-2.7L20 17"/></symbol>
  <symbol id="i-music" viewBox="0 0 24 24"><path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.6"/><circle cx="17.5" cy="16" r="2.6"/></symbol>
  <symbol id="i-infinity" viewBox="0 0 24 24"><path d="M8.2 8.2a5.4 5.4 0 1 0 0 7.6c2.3-2.3 5.3-5.3 7.6-7.6a5.4 5.4 0 1 1 0 7.6c-2.3-2.3-5.3-5.3-7.6-7.6z"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-pause" viewBox="0 0 24 24"><rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-prev" viewBox="0 0 24 24"><path d="M6 5v14"/><path d="M19 5.5v13L9 12z" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-next" viewBox="0 0 24 24"><path d="M18 5v14"/><path d="M5 5.5v13L15 12z" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="m5.5 5.5 13 13M18.5 5.5l-13 13"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-down" viewBox="0 0 24 24"><path d="M12 4v15M6 13l6 6 6-6"/></symbol>
  <symbol id="i-left" viewBox="0 0 24 24"><path d="m14.5 5-7 7 7 7"/></symbol>
  <symbol id="i-right" viewBox="0 0 24 24"><path d="m9.5 5 7 7-7 7"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></symbol>
  <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3.5c.8 4.4 2.1 5.7 6.5 6.5-4.4.8-5.7 2.1-6.5 6.5-.8-4.4-2.1-5.7-6.5-6.5 4.4-.8 5.7-2.1 6.5-6.5z"/><path d="M18.5 15.5c.4 2.1 1 2.7 3.1 3.1-2.1.4-2.7 1-3.1 3.1-.4-2.1-1-2.7-3.1-3.1 2.1-.4 2.7-1 3.1-3.1z"/></symbol>
  <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4.5" y="10" width="15" height="10.5" rx="2.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/></symbol>
</svg>`;

const AURORA = `<div class="aurora" aria-hidden="true">
  <span class="orb orb--1"></span>
  <span class="orb orb--2"></span>
  <span class="orb orb--3"></span>
  <span class="orb orb--4"></span>
  <div class="aurora__grain"></div>
</div>
<canvas id="canvas" aria-hidden="true"></canvas>
<div class="cursor" id="cursor" aria-hidden="true"><span class="cursor__dot"></span><span class="cursor__ring"></span></div>
<div class="progress" aria-hidden="true"><span id="progressFill"></span></div>`;

const VEIL = `<div class="veil" id="veil" role="status" aria-live="polite">
  <div class="veil__core">
    <div class="veil__ring">
      <svg viewBox="0 0 120 120"><circle class="veil__bg" cx="60" cy="60" r="54"/><circle class="veil__fg" id="veilArc" cx="60" cy="60" r="54"/></svg>
      <span class="veil__mono">A</span>
    </div>
    <p class="veil__name">For Aneeba</p>
    <p class="veil__pct" id="veilPct">0%</p>
  </div>
</div>`;

const MINI = `<div class="mini" id="mini" aria-hidden="true">
  <div class="mini__cover" id="miniCover"><span class="mini__eq"><i></i><i></i><i></i></span></div>
  <div class="mini__meta">
    <strong id="miniTitle">&mdash;</strong>
    <span id="miniArtist">&mdash;</span>
  </div>
  <div class="mini__controls">
    <button class="mini__btn" type="button" id="miniPrev" aria-label="Previous song"><svg class="ico"><use href="#i-prev"/></svg></button>
    <button class="mini__btn mini__btn--play" type="button" id="miniPlay" aria-label="Play or pause"><svg class="ico" id="miniPlayIcon"><use href="#i-play"/></svg></button>
    <button class="mini__btn" type="button" id="miniNext" aria-label="Next song"><svg class="ico"><use href="#i-next"/></svg></button>
  </div>
  <div class="mini__bar" id="miniBar" role="slider" aria-label="Song progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
    <span id="miniFill"></span>
  </div>
</div>
<audio id="audio" preload="metadata"></audio>`;

const MODALS = `<!-- letter modal -->
<div class="modal" id="letterModal" aria-hidden="true">
  <div class="modal__scrim" data-close></div>
  <article class="paper" role="dialog" aria-modal="true" aria-labelledby="letterTitle">
    <button class="modal__close" type="button" data-close aria-label="Close the letter"><svg class="ico"><use href="#i-close"/></svg></button>
    <div class="paper__grain" aria-hidden="true"></div>
    <div class="paper__inner">
      <p class="paper__kicker">a letter, in ink &amp; light</p>
      <h2 class="paper__title" id="letterTitle">Aneeba,</h2>
      <div class="paper__body" id="letterBody"></div>
      <p class="paper__sign" id="letterSign"></p>
      <span class="paper__seal" aria-hidden="true">A</span>
    </div>
  </article>
</div>

<!-- promise modal -->
<div class="modal" id="promiseModal" aria-hidden="true">
  <div class="modal__scrim" data-close></div>
  <article class="promise" role="dialog" aria-modal="true" aria-labelledby="promiseTitle">
    <button class="modal__close" type="button" data-close aria-label="Close the promise"><svg class="ico"><use href="#i-close"/></svg></button>
    <span class="promise__no" id="promiseNo">01</span>
    <span class="promise__star" aria-hidden="true"><svg class="ico"><use href="#i-star"/></svg></span>
    <h3 class="promise__title" id="promiseTitle"></h3>
    <p class="promise__text" id="promiseText"></p>
    <p class="promise__sealed"><svg class="ico"><use href="#i-lock"/></svg> sealed &amp; kept, forever</p>
  </article>
</div>

<!-- video modal -->
<div class="modal modal--video" id="videoModal" aria-hidden="true">
  <div class="modal__scrim" data-close></div>
  <div class="video" role="dialog" aria-modal="true" aria-label="Barbaad — Jubin Nautiyal, The Rish">
    <button class="modal__close" type="button" data-close aria-label="Close video"><svg class="ico"><use href="#i-close"/></svg></button>
    <div class="video__frame">
      <iframe id="videoFrame" title="Barbaad — Jubin Nautiyal, The Rish" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
    <p class="video__note">barbaad &middot; jubin nautiyal, the rish</p>
  </div>
</div>

<!-- lightbox -->
<div class="lightbox" id="lightbox" aria-hidden="true">
  <button class="lightbox__close" type="button" id="lbClose" aria-label="Close photo"><svg class="ico"><use href="#i-close"/></svg></button>
  <button class="lightbox__nav lightbox__nav--prev" type="button" id="lbPrev" aria-label="Previous photo"><svg class="ico"><use href="#i-left"/></svg></button>
  <figure class="lightbox__fig">
    <img id="lbImg" alt="" />
  </figure>
  <button class="lightbox__nav lightbox__nav--next" type="button" id="lbNext" aria-label="Next photo"><svg class="ico"><use href="#i-right"/></svg></button>
</div>

<input type="file" id="photoInput" accept="image/*" hidden />
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="hearts" id="hearts" aria-hidden="true"></div>`;

const FOOTER = `<footer class="footer">
    <span>A</span>
    <p>made with everything i have &mdash; for Aneeba</p>
    <span class="footer__year">forever</span>
  </footer>`;

/* ---------------- page content ---------------- */
const HERO = `<section class="hero" id="home">
    <div class="shell hero__grid">
      <div class="hero__copy">
        <p class="kicker" data-reveal><span class="kicker__line"></span>a little universe, made for one person</p>
        <h1 class="hero__title">
          <span class="hero__pre" data-reveal style="--d:.08s">For</span>
          <span class="hero__name" data-reveal style="--d:.16s">Aneeba</span>
        </h1>
        <p class="hero__lede" data-reveal style="--d:.26s">Not just a website. A place I built with my own hands, where every corner knows your name.</p>
        <div class="hero__actions" data-reveal style="--d:.34s">
          <a class="btn btn--ghost" href="gallery.html">
            <span>Your photos</span>
            <svg class="ico"><use href="#i-image"/></svg>
          </a>
        </div>
        <ul class="hero__chips" data-reveal style="--d:.42s">
          <li><b>9</b><span>songs</span></li>
          <li><b>9</b><span>promises</span></li>
          <li><b>1</b><span>person</span></li>
          <li><b>&infin;</b><span>lifetimes</span></li>
        </ul>
      </div>

      <div class="hero__art" data-reveal style="--d:.2s">
        <div class="portrait" id="portrait">
          <div class="portrait__halo"></div>
          <div class="portrait__ring"></div>
          <div class="portrait__inner">
            <div class="portrait__photo" data-photo-slot="hero">
              <img class="portrait__blur" alt="" aria-hidden="true" loading="eager" />
              <img alt="Aneeba" data-photo-img loading="eager" />
              <div class="photo-fallback">
                <span class="photo-fallback__mono">A</span>
                <span class="photo-fallback__hint">a photo of you belongs here</span>
              </div>
              <div class="portrait__sheen"></div>
            </div>
          </div>
          <span class="portrait__orbit portrait__orbit--a" aria-hidden="true">&#10084;</span>
          <span class="portrait__orbit portrait__orbit--b" aria-hidden="true">&#10022;</span>
          <span class="portrait__orbit portrait__orbit--c" aria-hidden="true">&#10023;</span>
          <div class="portrait__tag">
            <span>my favourite person</span>
            <strong>Aneeba</strong>
          </div>
          <button class="portrait__add" type="button" data-photo-pick="hero" aria-label="Add a photo to the portrait">
            <svg class="ico"><use href="#i-plus"/></svg> photo
          </button>
        </div>
      </div>
    </div>
    <a class="scroll-cue" href="#chapters" aria-label="See all the chapters">
      <span>keep going, my love</span>
      <svg class="ico"><use href="#i-down"/></svg>
    </a>
  </section>

  <div class="band" aria-hidden="true">
    <div class="band__track">
      <span>you are my home</span><i>&#10022;</i><span>always yours</span><i>&#10022;</i><span>every lifetime</span><i>&#10022;</i><span>meri jaan</span><i>&#10022;</i>
      <span>you are my home</span><i>&#10022;</i><span>always yours</span><i>&#10022;</i><span>every lifetime</span><i>&#10022;</i><span>meri jaan</span><i>&#10022;</i>
    </div>
  </div>

  <section class="section" id="chapters">
    <div class="shell">
      <div class="head head--center">
        <p class="kicker" data-reveal><span class="kicker__line"></span>the whole story</p>
        <h2 class="head__title" data-reveal style="--d:.08s">Every chapter has <em>its own page</em></h2>
        <p class="head__sub" data-reveal style="--d:.16s">Take your time. There is no wrong order.</p>
      </div>
      <div class="chapters">
        <a class="chapter-card" href="letter.html" data-reveal style="--d:.04s">
          <span class="chapter-card__no">01</span>
          <span class="chapter-card__ico"><svg class="ico"><use href="#i-mail"/></svg></span>
          <span class="chapter-card__title">The letter</span>
          <span class="chapter-card__line">the things i couldn't say out loud</span>
          <span class="chapter-card__go">open it <svg class="ico"><use href="#i-right"/></svg></span>
        </a>
        <a class="chapter-card" href="story.html" data-reveal style="--d:.08s">
          <span class="chapter-card__no">02</span>
          <span class="chapter-card__ico"><svg class="ico"><use href="#i-book"/></svg></span>
          <span class="chapter-card__title">Our story</span>
          <span class="chapter-card__line">how you became my favourite habit</span>
          <span class="chapter-card__go">read it <svg class="ico"><use href="#i-right"/></svg></span>
        </a>
        <a class="chapter-card" href="reasons.html" data-reveal style="--d:.12s">
          <span class="chapter-card__no">03</span>
          <span class="chapter-card__ico"><svg class="ico"><use href="#i-heart"/></svg></span>
          <span class="chapter-card__title">Reasons</span>
          <span class="chapter-card__line">six reasons it's always been you</span>
          <span class="chapter-card__go">flip the cards <svg class="ico"><use href="#i-right"/></svg></span>
        </a>
        <a class="chapter-card" href="promises.html" data-reveal style="--d:.16s">
          <span class="chapter-card__no">04</span>
          <span class="chapter-card__ico"><svg class="ico"><use href="#i-star"/></svg></span>
          <span class="chapter-card__title">Promises</span>
          <span class="chapter-card__line">nine stars, nine promises</span>
          <span class="chapter-card__go">open the sky <svg class="ico"><use href="#i-right"/></svg></span>
        </a>
        <a class="chapter-card" href="gallery.html" data-reveal style="--d:.2s">
          <span class="chapter-card__no">05</span>
          <span class="chapter-card__ico"><svg class="ico"><use href="#i-image"/></svg></span>
          <span class="chapter-card__title">Your photos</span>
          <span class="chapter-card__line">my favourite person, frame by frame</span>
          <span class="chapter-card__go">see them <svg class="ico"><use href="#i-right"/></svg></span>
        </a>
        <a class="chapter-card" href="music.html" data-reveal style="--d:.24s">
          <span class="chapter-card__no">06</span>
          <span class="chapter-card__ico"><svg class="ico"><use href="#i-music"/></svg></span>
          <span class="chapter-card__title">Our songs</span>
          <span class="chapter-card__line">nine songs that sound like you</span>
          <span class="chapter-card__go">press play <svg class="ico"><use href="#i-right"/></svg></span>
        </a>
        <a class="chapter-card" href="forever.html" data-reveal style="--d:.28s">
          <span class="chapter-card__no">07</span>
          <span class="chapter-card__ico"><svg class="ico"><use href="#i-infinity"/></svg></span>
          <span class="chapter-card__title">Forever</span>
          <span class="chapter-card__line">one last thing, and then again</span>
          <span class="chapter-card__go">the end <svg class="ico"><use href="#i-right"/></svg></span>
        </a>
      </div>
    </div>
  </section>`;

const LETTER = `<section class="section" id="letter">
    <div class="shell">
      <div class="head head--center">
        <p class="kicker" data-reveal><span class="kicker__line"></span>chapter one</p>
        <h2 class="head__title" data-reveal style="--d:.08s">Words I kept <em>for you</em></h2>
        <p class="head__sub" data-reveal style="--d:.16s">Some things are too big for a text message, so I put them here instead. Open it slowly.</p>
      </div>

      <div class="envelope-wrap" data-reveal style="--d:.2s">
        <button class="envelope" type="button" data-open-letter aria-label="Open the letter">
          <span class="envelope__back"></span>
          <span class="envelope__letter">
            <span class="envelope__script">For Aneeba</span>
            <span class="envelope__line"></span>
            <span class="envelope__line envelope__line--short"></span>
            <span class="envelope__line"></span>
          </span>
          <span class="envelope__front"></span>
          <span class="envelope__flap"></span>
          <span class="envelope__seal">A</span>
        </button>
        <p class="envelope__caption">sealed with wax &amp; everything i have</p>
      </div>
    </div>
  </section>`;

const STORY = `<section class="section" id="story">
    <div class="shell">
      <div class="head head--center">
        <p class="kicker" data-reveal><span class="kicker__line"></span>chapter two</p>
        <h2 class="head__title" data-reveal style="--d:.08s">Our little <em>story</em></h2>
        <p class="head__sub" data-reveal style="--d:.16s">No dates, no timelines. Just the chapters that made you my person.</p>
      </div>
      <div class="timeline" id="timeline"></div>
    </div>
  </section>`;

const REASONS = `<section class="section" id="reasons">
    <div class="shell">
      <div class="head head--center">
        <p class="kicker" data-reveal><span class="kicker__line"></span>chapter three</p>
        <h2 class="head__title" data-reveal style="--d:.08s">Reasons it's <em>always you</em></h2>
        <p class="head__sub" data-reveal style="--d:.16s">Tap any card. Every single one of them is true.</p>
      </div>
      <div class="reasons" id="reasonsGrid"></div>
      <p class="hint" data-reveal><svg class="ico"><use href="#i-sparkle"/></svg> tap a card to flip it</p>
    </div>
  </section>`;

const PROMISES = `<section class="section" id="sky">
    <div class="shell">
      <div class="head head--center">
        <p class="kicker" data-reveal><span class="kicker__line"></span>chapter four</p>
        <h2 class="head__title" data-reveal style="--d:.08s">Nine promises in <em>the sky</em></h2>
        <p class="head__sub" data-reveal style="--d:.16s">Every star is a promise. Open one and keep it forever.</p>
      </div>

      <div class="sky-wrap" data-reveal style="--d:.2s">
        <div class="sky" id="sky">
          <div class="sky__glow"></div>
          <span class="sky__moon" aria-hidden="true"></span>
          <svg class="sky__lines" id="skyLines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>
          <div class="sky__stars" id="skyStars"></div>
        </div>
        <div class="sky__meta">
          <span class="sky__count"><b id="skyOpen">0</b> / 9 promises opened</span>
          <span class="sky__note" id="skyNote">the stars are listening</span>
        </div>
      </div>
    </div>
  </section>`;

const GALLERY = `<section class="section" id="gallery">
    <div class="shell">
      <div class="head head--center">
        <p class="kicker" data-reveal><span class="kicker__line"></span>chapter five</p>
        <h2 class="head__title" data-reveal style="--d:.08s">My favourite person, <em>frame by frame</em></h2>
        <p class="head__sub" data-reveal style="--d:.16s">The little moments I want to keep forever. Tap a photo to see it bigger.</p>
      </div>

      <div class="gallery-bar" data-reveal>
        <span class="gallery-bar__hint"><svg class="ico"><use href="#i-plus"/></svg> tap an empty frame to add your own photo</span>
        <button class="btn btn--tiny" type="button" id="addPhotosBtn">Add photos</button>
      </div>

      <div class="gallery" id="galleryGrid"></div>
      <p class="gallery__note">photos you add are saved on this device only &mdash; no one else can see them.</p>
    </div>
  </section>`;

const MUSIC = `<section class="section" id="music">
    <div class="shell">
      <div class="head head--center">
        <p class="kicker" data-reveal><span class="kicker__line"></span>chapter six</p>
        <h2 class="head__title" data-reveal style="--d:.08s">Songs that sound like <em>you</em></h2>
        <p class="head__sub" data-reveal style="--d:.16s">Each one starts at the part that reminds me of you.</p>
      </div>
      <div class="playlist" id="playlist"></div>
    </div>
  </section>`;

const FOREVER = `<section class="section forever" id="forever">
    <div class="forever__glow" aria-hidden="true"></div>
    <div class="shell forever__inner">
      <p class="kicker" data-reveal><span class="kicker__line"></span>one last thing</p>
      <h2 class="forever__title" data-reveal style="--d:.1s">I love you,<br /><span>Aneeba</span></h2>
      <p class="forever__text" data-reveal style="--d:.2s">
        Whatever happens, wherever life takes us, I want the same boring, beautiful forever with you.
        The late-night calls. The good morning texts. The countdowns to the next time I see you.
        The silence that never feels empty, even through a screen.
        You don't have to be okay all the time &mdash; just stay. I'll meet you wherever you are, however far that is.
      </p>
      <p class="forever__sign" data-reveal style="--d:.28s">always &amp; completely yours,<br /><span>Haris</span></p>
      <button class="btn btn--heart" type="button" id="loveBtn" data-reveal style="--d:.36s">
        <svg class="ico"><use href="#i-heart"/></svg>
        <span>press for a little love</span>
      </button>
      <p class="forever__foot" data-reveal style="--d:.44s">there was nobody like you before. there will never be anyone like you after.</p>
    </div>
  </section>`;

function pagenav(prev, next) {
  const left = prev
    ? `<a class="pagenav__link pagenav__link--prev" href="${prev.file}"><span>previous</span><strong>${prev.label}</strong></a>`
    : "";
  const right = next
    ? `<a class="pagenav__link pagenav__link--next" href="${next.file}"><span>${next.kicker || "next chapter"}</span><strong>${next.label}</strong></a>`
    : "";
  return `<nav class="pagenav" aria-label="Page navigation">\n  ${left}\n  ${right}\n</nav>`;
}

const PAGES = [
  {
    file: "index.html",
    id: "home",
    title: "For Aneeba — my favourite person",
    desc: "A little universe built for one person. A letter, a story, nine promises, photos of you and our songs.",
    veil: true,
    body: HERO
  },
  {
    file: "letter.html",
    id: "letter",
    title: "The letter — For Aneeba",
    desc: "Some things are too big for a text message.",
    body: LETTER + pagenav(
      { file: "index.html", label: "Home" },
      { file: "story.html", label: "Our story" }
    )
  },
  {
    file: "story.html",
    id: "story",
    title: "Our story — For Aneeba",
    desc: "The chapters that made you my person.",
    body: STORY + pagenav(
      { file: "letter.html", label: "The letter" },
      { file: "reasons.html", label: "Reasons" }
    )
  },
  {
    file: "reasons.html",
    id: "reasons",
    title: "Reasons — For Aneeba",
    desc: "Six little reasons it's always you.",
    body: REASONS + pagenav(
      { file: "story.html", label: "Our story" },
      { file: "promises.html", label: "Promises" }
    )
  },
  {
    file: "promises.html",
    id: "sky",
    title: "Promises — For Aneeba",
    desc: "Nine stars, nine promises.",
    body: PROMISES + pagenav(
      { file: "reasons.html", label: "Reasons" },
      { file: "gallery.html", label: "Your photos" }
    )
  },
  {
    file: "gallery.html",
    id: "gallery",
    title: "Your photos — For Aneeba",
    desc: "My favourite person, frame by frame.",
    body: GALLERY + pagenav(
      { file: "promises.html", label: "Promises" },
      { file: "music.html", label: "Our songs" }
    )
  },
  {
    file: "music.html",
    id: "music",
    title: "Our songs — For Aneeba",
    desc: "Nine songs that sound like you.",
    body: MUSIC + pagenav(
      { file: "gallery.html", label: "Your photos" },
      { file: "forever.html", label: "Forever" }
    )
  },
  {
    file: "forever.html",
    id: "forever",
    title: "Forever — For Aneeba",
    desc: "One last thing, and then again.",
    body: FOREVER + pagenav(
      { file: "music.html", label: "Our songs" },
      { file: "index.html", label: "Back to the start", kicker: "one more time" }
    )
  }
];

/* ---------------- write ---------------- */
let count = 0;
for (const page of PAGES) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${page.title}</title>
<meta name="description" content="${page.desc}" />
<meta name="theme-color" content="#fff1f6" />
<meta property="og:title" content="${page.title}" />
<meta property="og:description" content="${page.desc}" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E2%9D%A4%EF%B8%8F%3C/text%3E%3C/svg%3E" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Great+Vibes&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="css/style.css?v=${V}" />
<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}.veil{display:none!important}body{overflow:auto!important}</style></noscript>
</head>
<body${page.veil ? ' class="is-loading"' : ""}>

<a class="skip" href="#main">Skip to content</a>

${SPRITE}

${page.veil ? VEIL + "\n\n" : ""}${AURORA}

${rail(page.id)}

${menu(page.id)}

<div class="page" id="main">

  ${page.body}

  ${FOOTER}
</div>

${MINI}

${MODALS}

<script src="js/data.js?v=${V}"></script>
<script src="js/app.js?v=${V}"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, page.file), html, "utf8");
  count++;
}

console.log("built " + count + " pages");

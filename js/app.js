/* =========================================================
   FOR ANEEBA — interactions
   vanilla JS, no libraries. everything here is for her.
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------------- storage helpers ---------------- */
  const STORE = {
    photo: (key) => "aneeba.photo." + key,
    promises: "aneeba.promises"
  };
  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : raw;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); return true; }
    catch (e) { return false; }
  }

  /* ---------------- toast ---------------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 3200);
  }

  /* ---------------- scroll lock ---------------- */
  const locks = new Set();
  function lock(key) { locks.add(key); document.body.classList.add("no-scroll"); }
  function unlock(key) { locks.delete(key); if (!locks.size) document.body.classList.remove("no-scroll"); }

  /* ---------------- preloader ---------------- */
  const veil = $("#veil");
  const veilPct = $("#veilPct");
  const veilArc = $("#veilArc");
  const CIRC = 339.3;
  let veilDone = false;

  function dismissVeil() {
    if (veilDone) return;
    veilDone = true;
    document.body.classList.remove("is-loading");
    if (veil) veil.classList.add("is-done");
    initReveals();
    setTimeout(() => { if (veil) veil.remove(); }, 1200);
  }

  function runVeil() {
    if (!veil || !veilPct || !veilArc) { dismissVeil(); return; }
    if (reduced) { dismissVeil(); return; }
    const start = performance.now();
    const dur = 1350;
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      veilPct.textContent = Math.round(eased * 100) + "%";
      veilArc.style.strokeDashoffset = String(CIRC * (1 - eased));
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(dismissVeil, 280);
    }
    requestAnimationFrame(tick);
    setTimeout(dismissVeil, 3600); // safety net
  }

  /* ---------------- reveal on scroll ---------------- */
  let revealObserver = null;
  function initReveals() {
    const items = $$("[data-reveal]");
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    }
    items.forEach((el) => {
      if (el.dataset.revealBound === "1" || el.classList.contains("is-in")) return;
      el.dataset.revealBound = "1";
      revealObserver.observe(el);
    });
  }

  /* ---------------- background canvas ---------------- */
  const canvas = $("#canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let particles = [];
  let vw = 0, vh = 0, dpr = 1;
  let lite = false;

  function spawn(initial) {
    const rose = Math.random() < 0.55;
    return {
      x: Math.random() * vw,
      y: initial ? Math.random() * vh : vh + 10,
      r: Math.random() * 1.9 + 0.5,
      speed: Math.random() * 0.32 + 0.08,
      drift: (Math.random() - 0.5) * 0.22,
      alpha: Math.random() * 0.45 + 0.12,
      color: rose ? "255,111,156" : "243,201,139",
      sparkle: Math.random() < 0.14,
      phase: Math.random() * Math.PI * 2
    };
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    lite = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;
    dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.35 : 2);
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = vw < 700 ? (lite ? 16 : 28) : vw < 1200 ? (lite ? 26 : 44) : 62;
    particles = Array.from({ length: count }, () => spawn(true));
  }

  function drawFrame(t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, vw, vh);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.speed;
      p.x += p.drift + Math.sin(t / 2600 + p.phase) * 0.08;
      if (p.y < -14) { particles[i] = spawn(false); continue; }
      if (p.x < -14) p.x = vw + 12;
      if (p.x > vw + 14) p.x = -12;
      if (p.sparkle) {
        const s = p.r * 2.2;
        ctx.strokeStyle = "rgba(" + p.color + "," + (p.alpha + 0.2) + ")";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(p.x - s, p.y);
        ctx.lineTo(p.x + s, p.y);
        ctx.moveTo(p.x, p.y - s);
        ctx.lineTo(p.x, p.y + s);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + p.color + "," + p.alpha + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  let canvasRaf = null;
  let lastDraw = 0;
  function loopCanvas(t) {
    // light devices: cap the fixed background at ~30fps
    if (lite && t - lastDraw < 31) {
      canvasRaf = requestAnimationFrame(loopCanvas);
      return;
    }
    lastDraw = t;
    drawFrame(t);
    canvasRaf = requestAnimationFrame(loopCanvas);
  }
  function startCanvas() {
    if (!canvas || !ctx) return;
    // phones / small screens: skip the animated canvas entirely — biggest scroll win
    lite = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;
    if (lite) {
      if (canvasRaf) { cancelAnimationFrame(canvasRaf); canvasRaf = null; }
      canvas.style.display = "none";
      return;
    }
    canvas.style.display = "";
    resizeCanvas();
    if (reduced) { drawFrame(0); return; }
    if (canvasRaf) cancelAnimationFrame(canvasRaf);
    canvasRaf = requestAnimationFrame(loopCanvas);
  }

  /* ---------------- cursor glow ---------------- */
  const cursor = $("#cursor");
  if (cursor && finePointer && !reduced) {
    const dot = $(".cursor__dot", cursor);
    const ring = $(".cursor__ring", cursor);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, shown = false;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; cursor.style.opacity = "1"; }
      if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
    }, { passive: true });

    (function follow() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
      requestAnimationFrame(follow);
    })();

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .tile, .reason, .star, .envelope, .portrait__photo")) {
        cursor.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, .tile, .reason, .star, .envelope, .portrait__photo")) {
        cursor.classList.remove("is-hover");
      }
    });
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ---------------- progress bar ---------------- */
  const progressFill = $("#progressFill");
  let progressRaf = null;
  function updateProgress() {
    if (!progressFill) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressFill.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + "%";
  }
  window.addEventListener("scroll", () => {
    if (progressRaf) return;
    progressRaf = requestAnimationFrame(() => { updateProgress(); progressRaf = null; });
  }, { passive: true });

  /* ---------------- mobile menu ---------------- */
  const menu = $("#menu");
  const burger = $("#burger");
  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) { lock("menu"); }
    else { unlock("menu"); }
  }
  if (burger && menu) {
    const burgerUse = $("use", burger);
    burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    $$("a", menu).forEach((link) => link.addEventListener("click", () => setMenu(false)));
    // keep the icon in sync no matter where the menu is closed from
    const iconSync = new MutationObserver(() => {
      if (burgerUse) burgerUse.setAttribute("href", menu.classList.contains("is-open") ? "#i-close" : "#i-menu");
    });
    iconSync.observe(menu, { attributes: true, attributeFilter: ["class"] });
  }

  /* ---------------- build the page content ---------------- */
  const data = typeof DATA !== "undefined" ? DATA : {};

  /* story */
  const timeline = $("#timeline");
  if (timeline && data.story) {
    timeline.innerHTML = data.story.map((s, i) =>
      '<div class="tl-item" data-reveal style="--d:' + (i * 0.06) + 's">' +
        '<span class="tl-dot" aria-hidden="true"></span>' +
        '<div class="tl-card">' +
          '<span class="tl-tag">' + s.tag + '</span>' +
          '<h3 class="tl-title">' + s.title + '</h3>' +
          '<p class="tl-text">' + s.text + '</p>' +
        '</div>' +
      '</div>'
    ).join("");
  }

  /* reasons */
  const reasonsGrid = $("#reasonsGrid");
  if (reasonsGrid && data.reasons) {
    reasonsGrid.innerHTML = data.reasons.map((r, i) => {
      const icon = '<svg class="ico"><use href="#i-' + (r.icon || "heart") + '"/></svg>';
      return '<button class="reason" type="button" aria-pressed="false" data-reveal style="--d:' + (i * 0.05) + 's" aria-label="' + r.title + ' — tap to read">' +
        '<span class="reason__inner">' +
          '<span class="reason__face reason__front">' +
            '<span class="reason__no">' + String(i + 1).padStart(2, "0") + '</span>' +
            '<span class="reason__ico">' + icon + '</span>' +
            '<span class="reason__foot">' +
              '<span class="reason__title">' + r.title + '</span>' +
              '<span class="reason__hint"><svg class="ico"><use href="#i-sparkle"/></svg> tap to reveal</span>' +
            '</span>' +
          '</span>' +
          '<span class="reason__face reason__back">' +
            '<span class="reason__ico">' + icon + '</span>' +
            '<span class="reason__title">' + r.title + '</span>' +
            '<span class="reason__text">' + r.text + '</span>' +
          '</span>' +
        '</span>' +
      '</button>';
    }).join("");
    $$(".reason", reasonsGrid).forEach((card) => {
      card.addEventListener("click", () => {
        const flipped = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", flipped ? "true" : "false");
      });
    });
  }

  /* ---------------- promise sky ---------------- */
  const skyStars = $("#skyStars");
  const skyLines = $("#skyLines");
  const skyOpenEl = $("#skyOpen");
  const skyNote = $("#skyNote");
  const promiseModal = $("#promiseModal");
  let openedPromises = [];
  try { openedPromises = JSON.parse(read(STORE.promises, "[]")) || []; } catch (e) { openedPromises = []; }

  function savePromises() {
    if (!write(STORE.promises, JSON.stringify(openedPromises))) {
      // storage may be blocked; the stars still work for this visit
    }
  }
  function updateSkyMeta() {
    if (skyOpenEl) skyOpenEl.textContent = String(openedPromises.length);
    if (skyNote) {
      skyNote.textContent = openedPromises.length >= 9
        ? "all nine kept. every single one."
        : "the stars are listening";
    }
  }
  function openPromise(index) {
    const p = data.promises[index];
    if (!p) return;
    if (!openedPromises.includes(index)) {
      openedPromises.push(index);
      savePromises();
      const btn = $('.star[data-promise="' + index + '"]');
      if (btn) btn.classList.add("is-open");
      updateSkyMeta();
    }
    $("#promiseNo").textContent = String(index + 1).padStart(2, "0");
    $("#promiseTitle").textContent = p.title;
    $("#promiseText").textContent = p.text;
    showModal(promiseModal);
  }

  if (skyStars && data.promises) {
    skyStars.innerHTML = data.promises.map((p, i) =>
      '<button class="star' + (openedPromises.includes(i) ? " is-open" : "") + '" type="button" data-promise="' + i + '" ' +
        'style="left:' + p.x + '%;top:' + p.y + '%" title="' + p.title + '" aria-label="Promise ' + (i + 1) + ': ' + p.title + '">' +
        '<svg class="ico"><use href="#i-star"/></svg>' +
      '</button>'
    ).join("");

    if (skyLines) {
      const pts = data.promises.map((p) => "L " + p.x + " " + p.y).join(" ");
      const first = data.promises[0];
      let d = "M " + first.x + " " + first.y + " " + pts;
      // a couple of delicate branch lines
      d += " M " + data.promises[1].x + " " + data.promises[1].y + " L " + data.promises[3].x + " " + data.promises[3].y;
      d += " M " + data.promises[5].x + " " + data.promises[5].y + " L " + data.promises[7].x + " " + data.promises[7].y;
      skyLines.innerHTML = '<path d="' + d + '"/>';
    }

    $$(".star", skyStars).forEach((btn) => {
      btn.addEventListener("click", () => openPromise(Number(btn.dataset.promise)));
    });
    updateSkyMeta();
  }

  /* ---------------- gallery ---------------- */
  const gallery = $("#galleryGrid");
  const photoInput = $("#photoInput");
  let photoTarget = null;

  function tileMarkup(item, i) {
    const classes = "tile" + (item.tall ? " tile--tall" : "") + (item.wide ? " tile--wide" : "");
    return '<button class="' + classes + '" type="button" data-gallery="' + i + '" aria-label="Add a photo">' +
      '<img class="tile__img" alt="" />' +
      '<span class="tile__fallback">' +
        '<span class="tile__plus"><svg class="ico"><use href="#i-plus"/></svg></span>' +
        '<span>add photo</span>' +
      '</span>' +
      '<span class="tile__cap">' + item.caption + '</span>' +
      '<span class="tile__zoom" aria-hidden="true"><svg class="ico"><use href="#i-image"/></svg></span>' +
    '</button>';
  }

  function applyPhoto(key, src) {
    if (key === "hero") {
      setHeroSrc(src);
      return;
    }
    const tile = $('.tile[data-gallery="' + key + '"]');
    if (!tile) return;
    const img = $(".tile__img", tile);
    img.src = src;
    img.alt = $(".tile__cap", tile).textContent;
    tile.classList.add("is-filled");
    tile.setAttribute("aria-label", "Open photo: " + $(".tile__cap", tile).textContent);
  }

  if (gallery && data.gallery) {
    gallery.innerHTML = data.gallery.map(tileMarkup).join("");
    $$(".tile", gallery).forEach((tile) => {
      const i = tile.dataset.gallery;
      const img = $(".tile__img", tile);
      const saved = read(STORE.photo(i), null);
      img.addEventListener("load", () => {
        tile.classList.add("is-filled");
        const cap = $(".tile__cap", tile).textContent;
        tile.setAttribute("aria-label", "Open photo: " + cap);
      });
      img.addEventListener("error", () => {
        tile.classList.remove("is-filled");
        tile.setAttribute("aria-label", "Add a photo here");
      });
      img.src = saved || data.gallery[i].src;

      tile.addEventListener("click", () => {
        if (tile.classList.contains("is-filled")) openLightbox(tile);
        else pickPhoto(i);
      });
    });
  }

  function pickPhoto(key) {
    if (!photoInput) return;
    photoTarget = String(key);
    photoInput.value = "";
    photoInput.click();
  }

  /* portrait photo */
  const heroPhoto = $('[data-photo-slot="hero"]');
  const heroImg = heroPhoto ? $("[data-photo-img]", heroPhoto) : null;
  const heroBlur = heroPhoto ? $(".portrait__blur", heroPhoto) : null;

  function setHeroSrc(src) {
    if (!heroImg) return;
    heroPhoto.classList.remove("is-filled", "is-landscape");
    heroImg.src = src;
  }

  if (heroImg) {
    heroImg.addEventListener("load", () => {
      heroImg.classList.remove("is-missing");
      heroPhoto.classList.add("is-filled");
      if (heroBlur) heroBlur.src = heroImg.currentSrc || heroImg.src;
      const ratio = heroImg.naturalWidth / heroImg.naturalHeight;
      heroPhoto.classList.toggle("is-landscape", ratio > 1.1);
    });
    heroImg.addEventListener("error", () => {
      heroImg.classList.add("is-missing");
      heroPhoto.classList.remove("is-filled", "is-landscape");
      if (heroBlur) heroBlur.removeAttribute("src");
    });
    const saved = read(STORE.photo("hero"), null);
    setHeroSrc(saved || "assets/photos/hero.jpg");
    if (heroPhoto) heroPhoto.addEventListener("click", () => pickPhoto("hero"));
  }

  $$("[data-photo-pick]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      pickPhoto(btn.dataset.photoPick);
    });
  });

  function fileToDataURL(file, maxSize) {
    maxSize = maxSize || 1500;
    return new Promise((resolve, reject) => {
      if (!/^image\//.test(file.type)) { reject(new Error("not an image")); return; }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const c = document.createElement("canvas");
          c.width = w; c.height = h;
          const cx = c.getContext("2d");
          cx.drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(url);
          resolve(c.toDataURL("image/jpeg", 0.84));
        } catch (err) { URL.revokeObjectURL(url); reject(err); }
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("could not read image")); };
      img.src = url;
    });
  }

  if (photoInput) {
    photoInput.addEventListener("change", async () => {
      const file = photoInput.files && photoInput.files[0];
      const target = photoTarget;
      photoInput.value = "";
      if (!file || target === null) return;
      toast("adding your photo…");
      let dataUrl;
      try {
        dataUrl = await fileToDataURL(file, 1600);
      } catch (e) {
        toast("couldn't read that photo — try a JPG or PNG.");
        return;
      }
      if (write(STORE.photo(target), dataUrl)) {
        applyPhoto(target, dataUrl);
        toast("photo added — saved on this device only.");
      } else {
        toast("storage is full. try a smaller photo.");
      }
    });
  }

  const addPhotosBtn = $("#addPhotosBtn");
  if (addPhotosBtn) {
    addPhotosBtn.addEventListener("click", () => {
      const empty = $(".tile:not(.is-filled)");
      const target = empty ? empty.dataset.gallery : "0";
      pickPhoto(target);
    });
  }

  /* ---------------- lightbox ---------------- */
  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCap = $("#lbCap");
  const lbCount = $("#lbCount");
  let lbList = [], lbIndex = 0;

  function renderLightbox() {
    if (!lbList.length) return;
    const item = lbList[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.cap;
    lbCap.textContent = item.cap;
    lbCount.textContent = (lbIndex + 1) + " / " + lbList.length;
  }
  function openLightbox(tile) {
    if (!lightbox) return;
    const tiles = $$(".tile.is-filled");
    lbList = tiles.map((t) => ({
      src: $(".tile__img", t).src,
      cap: $(".tile__cap", t).textContent
    }));
    lbIndex = Math.max(0, tiles.indexOf(tile));
    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lock("lightbox");
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    unlock("lightbox");
  }
  function stepLightbox(dir) {
    if (!lbList.length) return;
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    renderLightbox();
  }
  if (lightbox) {
    $("#lbClose").addEventListener("click", closeLightbox);
    $("#lbPrev").addEventListener("click", () => stepLightbox(-1));
    $("#lbNext").addEventListener("click", () => stepLightbox(1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  }

  /* ---------------- modals ---------------- */
  let activeModal = null;
  function showModal(el) {
    if (!el) return;
    if (activeModal && activeModal !== el) hideModal(activeModal);
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    activeModal = el;
    lock("modal");
    const close = $(".modal__close", el);
    if (close) setTimeout(() => close.focus(), 120);
  }
  function hideModal(el) {
    const target = el || activeModal;
    if (!target) return;
    target.classList.remove("is-open");
    target.setAttribute("aria-hidden", "true");
    if (activeModal === target) activeModal = null;
    unlock("modal");
  }
  $$(".modal").forEach((modal) => {
    $$("[data-close]", modal).forEach((btn) => btn.addEventListener("click", () => hideModal(modal)));
  });

  /* letter */
  const letterModal = $("#letterModal");
  if (data.letter) {
    const body = $("#letterBody");
    if (body) body.innerHTML = data.letter.paragraphs.map((p) => "<p>" + p + "</p>").join("");
    const sign = $("#letterSign");
    if (sign) sign.textContent = data.letter.sign;
    const title = $("#letterTitle");
    if (title) title.textContent = data.letter.title;
  }
  $$("[data-open-letter]").forEach((btn) => {
    btn.addEventListener("click", () => showModal(letterModal));
  });

  /* ---------------- music player ---------------- */
  const audio = $("#audio");
  const playlist = $("#playlist");
  const mini = $("#mini");
  const miniCover = $("#miniCover");
  const miniTitle = $("#miniTitle");
  const miniArtist = $("#miniArtist");
  const miniPlay = $("#miniPlay");
  const miniFill = $("#miniFill");
  const miniBar = $("#miniBar");
  const miniPlayUse = miniPlay ? $("use", miniPlay) : null;
  let currentTrack = -1;
  let failedSrc = "";

  function fmt(sec) {
    sec = Math.max(0, Math.round(sec));
    return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
  }

  if (playlist && data.tracks) {
    playlist.innerHTML = data.tracks.map((t, i) =>
      '<button class="track" type="button" data-track="' + i + '" data-reveal style="--from:' + t.from + ';--to:' + t.to + ';--d:' + (i * 0.04) + 's" aria-label="Play ' + t.title + ' by ' + t.artist + '">' +
        '<span class="track__cover">' +
          '<svg class="ico"><use href="#i-play"/></svg>' +
          '<span class="track__eq"><i></i><i></i><i></i></span>' +
        '</span>' +
        '<span class="track__meta">' +
          '<span class="track__title">' + t.title + '</span>' +
          '<span class="track__artist">' + t.artist + '</span>' +
        '</span>' +
        '<span class="track__at">' + (t.startAt > 0 ? fmt(t.startAt) : "") + '</span>' +
      '</button>'
    ).join("");

    $$(".track", playlist).forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.track);
        if (i === currentTrack) togglePlay();
        else playTrack(i);
      });
    });
  }

  function setPlayIcon(playing) {
    if (miniPlayUse) miniPlayUse.setAttribute("href", playing ? "#i-pause" : "#i-play");
    if (miniPlay) miniPlay.setAttribute("aria-label", playing ? "Pause song" : "Play song");
    if (mini) mini.classList.toggle("is-paused", !playing);
  }

  function markTracks() {
    $$(".track", playlist || document).forEach((el) => {
      el.classList.toggle("is-active", Number(el.dataset.track) === currentTrack);
    });
  }

  function showMini() {
    if (!mini) return;
    mini.classList.add("is-visible");
    mini.setAttribute("aria-hidden", "false");
  }

  function playTrack(i, autoplay) {
    if (!audio || !data.tracks || !data.tracks[i]) return;
    autoplay = autoplay !== false;
    const t = data.tracks[i];
    currentTrack = i;
    const src = "assets/songs/" + t.file;
    const sameSrc = audio.src && audio.src.indexOf(t.file) !== -1;
    if (!sameSrc) {
      audio.src = src;
      audio.dataset.start = String(t.startAt || 0);
      audio.load();
    } else if (audio.ended) {
      audio.currentTime = t.startAt || 0;
    }
    if (miniCover) {
      miniCover.style.setProperty("--from", t.from);
      miniCover.style.setProperty("--to", t.to);
    }
    if (miniTitle) miniTitle.textContent = t.title;
    if (miniArtist) miniArtist.textContent = t.artist;
    markTracks();
    showMini();
    if (autoplay) {
      const p = audio.play();
      if (p && p.catch) {
        p.catch(() => {
          setPlayIcon(false);
          toast("tap play once more — your browser needs a gesture.");
        });
      }
    }
  }

  function togglePlay() {
    if (!audio || currentTrack < 0) return;
    if (audio.paused) {
      const p = audio.play();
      if (p && p.catch) p.catch(() => toast("this song couldn't start. check the file."));
    } else {
      audio.pause();
    }
  }
  function nextTrack() {
    if (!data.tracks || !data.tracks.length) return;
    playTrack((currentTrack + 1) % data.tracks.length);
  }
  function prevTrack() {
    if (!data.tracks || !data.tracks.length) return;
    if (audio && audio.currentTime > 5) { audio.currentTime = 0; return; }
    playTrack((currentTrack - 1 + data.tracks.length) % data.tracks.length);
  }

  if (audio) {
    audio.addEventListener("loadedmetadata", () => {
      const start = Number(audio.dataset.start || 0);
      if (start > 0 && audio.currentTime < start) {
        try { audio.currentTime = start; } catch (e) {}
      }
    });
    audio.addEventListener("play", () => setPlayIcon(true));
    audio.addEventListener("pause", () => setPlayIcon(false));
    audio.addEventListener("ended", () => nextTrack());
    audio.addEventListener("timeupdate", () => {
      if (!miniFill || !miniBar) return;
      const dur = audio.duration || 0;
      const pct = dur ? Math.min(100, (audio.currentTime / dur) * 100) : 0;
      miniFill.style.width = pct + "%";
      miniBar.setAttribute("aria-valuenow", String(Math.round(pct)));
    });
    audio.addEventListener("error", () => {
      if (!audio.src || audio.src === failedSrc) return;
      failedSrc = audio.src;
      setPlayIcon(false);
      toast("that song file couldn't be found.");
    });
  }

  if (miniPlay) miniPlay.addEventListener("click", togglePlay);
  const miniNext = $("#miniNext");
  const miniPrev = $("#miniPrev");
  if (miniNext) miniNext.addEventListener("click", nextTrack);
  if (miniPrev) miniPrev.addEventListener("click", prevTrack);

  function seekTo(ratio) {
    if (!audio || !isFinite(audio.duration) || !audio.duration) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.duration * ratio));
  }
  if (miniBar) {
    miniBar.addEventListener("click", (e) => {
      const r = miniBar.getBoundingClientRect();
      seekTo((e.clientX - r.left) / r.width);
    });
    miniBar.addEventListener("keydown", (e) => {
      if (!audio) return;
      if (e.key === "ArrowRight") { e.preventDefault(); audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5); }
      if (e.key === "ArrowLeft") { e.preventDefault(); audio.currentTime = Math.max(0, audio.currentTime - 5); }
    });
  }

  /* ---------------- love button ---------------- */
  const heartsEl = $("#hearts");
  const loveBtn = $("#loveBtn");
  const heartSet = ["❤️", "💖", "💕", "💗", "💘", "💝", "✨", "💞"];
  function burst(count) {
    if (!heartsEl || reduced) return;
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");
      h.className = "heart-fly";
      h.textContent = heartSet[Math.floor(Math.random() * heartSet.length)];
      h.style.left = (6 + Math.random() * 88) + "vw";
      h.style.fontSize = (14 + Math.random() * 22) + "px";
      h.style.setProperty("--dur", (2.7 + Math.random() * 2.2) + "s");
      h.style.setProperty("--rot", (Math.random() * 140 - 70) + "deg");
      h.style.animationDelay = (Math.random() * 0.55) + "s";
      heartsEl.appendChild(h);
      setTimeout(() => h.remove(), 5600);
    }
  }
  if (loveBtn) loveBtn.addEventListener("click", () => burst(30));

  /* ---------------- hero tilt ---------------- */
  const portrait = $("#portrait");
  const heroArt = $(".hero__art");
  if (portrait && heroArt && finePointer && !reduced) {
    heroArt.addEventListener("mousemove", (e) => {
      const r = heroArt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      portrait.style.transform = "perspective(900px) rotateY(" + (px * 7) + "deg) rotateX(" + (-py * 7) + "deg)";
    });
    heroArt.addEventListener("mouseleave", () => { portrait.style.transform = ""; });
  }

  /* ---------------- scroll spy ---------------- */
  const railLinks = $$(".rail__link");
  const sections = $$(".page section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        railLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------- escape / keys ---------------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && lightbox.classList.contains("is-open")) { closeLightbox(); return; }
      if (activeModal) { hideModal(); return; }
      if (menu && menu.classList.contains("is-open")) setMenu(false);
      return;
    }
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); stepLightbox(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); stepLightbox(-1); }
  });

  /* ---------------- boot ---------------- */
  function onResize() {
    if (canvas && ctx) {
      if (reduced) { resizeCanvas(); drawFrame(0); }
      else if (!canvasRaf) startCanvas();
    }
    updateProgress();
  }
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 180);
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && canvasRaf) { cancelAnimationFrame(canvasRaf); canvasRaf = null; }
    else if (!document.hidden && canvas && ctx && !reduced && !canvasRaf) startCanvas();
  });

  // initial paint
  startCanvas();
  updateProgress();
  runVeil();

  // if anything above failed, never leave the page locked
  setTimeout(() => {
    if (document.body.classList.contains("is-loading")) dismissVeil();
  }, 5000);
})();

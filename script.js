/* ==========================================================================
   MAA BAROMA HARDWARE — script.js
   Vanilla JS only. No frameworks, no build step. Safe for GitHub Pages.
   Sections:
     1. Dark mode toggle (persisted in localStorage)
     2. Mobile navigation drawer
     3. Sticky header active-link highlighting
     4. Gallery lightbox (click to open, prev/next, keyboard, swipe-friendly)
     5. Opening-hours status ("open now" / "closed" + today highlight)
     6. Footer copyright year
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. DARK MODE TOGGLE
     ------------------------------------------------------------------ */
  const root = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const STORAGE_KEY = "mbh-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  /* ------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
     ------------------------------------------------------------------ */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    hamburgerBtn.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    hamburgerBtn.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener("click", function () {
      const isOpen = mobileNav.classList.contains("open");
      isOpen ? closeMobileNav() : openMobileNav();
    });

    // Close the drawer whenever a nav link is tapped
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });
  }

  /* ------------------------------------------------------------------
     3. ACTIVE NAV LINK ON SCROLL
     ------------------------------------------------------------------ */
  const sections = document.querySelectorAll("main section[id], .hero[id]");
  const navLinks = document.querySelectorAll(".main-nav a");

  function setActiveLink() {
    let currentId = "";
    const scrollPos = window.scrollY + 140;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const targetId = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", targetId === currentId);
    });
  }

  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();
  }

  /* ------------------------------------------------------------------
     4. GALLERY LIGHTBOX
     ------------------------------------------------------------------ */
  const galleryItems = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentIndex = 0;
  let lastFocusedElement = null;

  function updateLightboxContent(index) {
    const item = galleryItems[index];
    if (!item) return;
    const fullSrc = item.getAttribute("data-full");
    const caption = item.getAttribute("data-caption") || "";
    const altText = item.querySelector("img") ? item.querySelector("img").getAttribute("alt") : caption;

    lightboxImage.setAttribute("src", fullSrc);
    lightboxImage.setAttribute("alt", altText);
    lightboxCaption.textContent = caption;
    lightboxCounter.textContent = (index + 1) + " / " + galleryItems.length;
  }

  function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;
    updateLightboxContent(currentIndex);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lastFocusedElement = document.activeElement;
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxImage.setAttribute("src", "");
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightboxContent(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent(currentIndex);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () {
      openLightbox(index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener("click", showNext);
  if (lightboxPrev) lightboxPrev.addEventListener("click", showPrev);

  if (lightbox) {
    // Click outside the image to close
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard controls: Escape, Left, Right
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });

    // Basic touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener("touchend", function (e) {
      const touchEndX = e.changedTouches[0].clientX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        delta > 0 ? showPrev() : showNext();
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     5. OPENING HOURS STATUS
     ------------------------------------------------------------------
     Reads simple "open/close" pairs per weekday from HOURS_DATA below
     and highlights today's row + shows a live open/closed badge.

     HOW TO EDIT:
     Update the "open" and "close" values (24-hour "HH:MM" format) for
     each day. Set a day's "closed" to true if the shop does not open.
     If the shop has a midday break, list two ranges in "ranges".
     ------------------------------------------------------------------ */
  const HOURS_DATA = [
    /* 0 = Sunday ... 6 = Saturday */
    { day: "Sunday",    closed: false, ranges: [["10:00", "14:00"], ["17:00", "20:30"]] },
    { day: "Monday",    closed: false, ranges: [["09:30", "14:00"], ["17:00", "21:00"]] },
    { day: "Tuesday",   closed: false, ranges: [["09:30", "14:00"], ["17:00", "21:00"]] },
    { day: "Wednesday", closed: false, ranges: [["09:30", "14:00"], ["17:00", "21:00"]] },
    { day: "Thursday",  closed: false, ranges: [["09:30", "14:00"], ["17:00", "21:00"]] },
    { day: "Friday",    closed: false, ranges: [["09:30", "14:00"], ["17:00", "21:00"]] },
    { day: "Saturday",  closed: false, ranges: [["09:30", "14:00"], ["17:00", "21:00"]] }
  ];

  const hoursTable = document.getElementById("hoursTable");
  const statusPill = document.getElementById("statusPill");
  const statusText = document.getElementById("statusText");
  const statusDetail = document.getElementById("statusDetail");
  const heroStatusBadge = document.getElementById("heroStatusBadge");

  function toMinutes(hhmm) {
    const parts = hhmm.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function formatTime(hhmm) {
    const parts = hhmm.split(":");
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return h + ":" + m + " " + suffix;
  }

  function getOpenStatus(now) {
    const dayIndex = now.getDay();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const today = HOURS_DATA[dayIndex];

    if (!today || today.closed) {
      return { isOpen: false, message: "Closed today", nextChange: null };
    }

    for (let i = 0; i < today.ranges.length; i++) {
      const start = toMinutes(today.ranges[i][0]);
      const end = toMinutes(today.ranges[i][1]);
      if (nowMinutes >= start && nowMinutes < end) {
        return { isOpen: true, message: "Closes at " + formatTime(today.ranges[i][1]), nextChange: today.ranges[i][1] };
      }
    }

    // Not currently open — find the next opening time today, if any
    for (let i = 0; i < today.ranges.length; i++) {
      const start = toMinutes(today.ranges[i][0]);
      if (nowMinutes < start) {
        return { isOpen: false, message: "Opens at " + formatTime(today.ranges[i][0]), nextChange: today.ranges[i][0] };
      }
    }

    return { isOpen: false, message: "Closed now", nextChange: null };
  }

  function renderHoursStatus() {
    if (!hoursTable) return;
    const now = new Date();
    const dayIndex = now.getDay();

    // Highlight today's row
    const rows = hoursTable.querySelectorAll("tr[data-day]");
    rows.forEach(function (row) {
      const rowDay = parseInt(row.getAttribute("data-day"), 10);
      row.classList.toggle("today", rowDay === dayIndex);
    });

    const status = getOpenStatus(now);

    if (statusPill && statusText && statusDetail) {
      statusPill.classList.toggle("open", status.isOpen);
      statusPill.classList.toggle("closed", !status.isOpen);
      statusText.textContent = status.isOpen ? "Open Now" : "Closed Now";
      statusDetail.textContent = status.message;
    }

    if (heroStatusBadge) {
      heroStatusBadge.classList.toggle("status-open", status.isOpen);
      heroStatusBadge.innerHTML = '<span class="dot"></span> ' + (status.isOpen ? "Open Now" : "Closed Now");
    }
  }

  renderHoursStatus();
  // Refresh status every minute in case the page is left open
  setInterval(renderHoursStatus, 60000);

  /* ------------------------------------------------------------------
     6. FOOTER COPYRIGHT YEAR
     ------------------------------------------------------------------ */
  const copyrightYear = document.getElementById("copyrightYear");
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }
})();

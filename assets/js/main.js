(function () {
  "use strict";
  var root = document.documentElement;

  // 1. Theme toggle
  var themeBtn = document.getElementById("themeToggle");
  function getSaved() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem("theme", v); } catch (e) {} }
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    if (themeBtn) themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(getSaved() || (prefersLight ? "light" : "dark"));
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next); save(next);
  });

  // 2. Mobile menu
  var nav = document.getElementById("siteNav");
  var menuBtn = document.getElementById("menuToggle");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  }

  // 3. Project filters
  var cards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
  document.querySelectorAll(".chip[data-filter]").forEach(function (chip, _, all) {
    chip.addEventListener("click", function () {
      all.forEach(function (c) { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("is-active"); chip.setAttribute("aria-pressed", "true");
      var f = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(" ");
        card.classList.toggle("is-hidden", f !== "all" && tags.indexOf(f) === -1);
      });
    });
  });

  // 4. Details popup
  var modal = document.getElementById("projectModal");
  var modalImg = document.getElementById("modalImg");
  var modalContent = document.getElementById("modalContent");
  var lastCard = null;
  function openProject(card) {
    var detail = card.querySelector(".project-detail");
    var img = card.querySelector(".project-thumb img");
    modalContent.innerHTML = detail.innerHTML;
    var t = modalContent.querySelector(".pd-title"); if (t) t.id = "modalTitle";
    modalImg.src = img.getAttribute("src"); modalImg.alt = img.alt;
    modal.hidden = false; document.body.classList.add("modal-open");
    modal.querySelector(".modal-panel").scrollTop = 0;
    modal.querySelector(".modal-close").focus();
    lastCard = card;
  }
  function closeProject() {
    if (modal.hidden) return;
    modal.hidden = true; document.body.classList.remove("modal-open");
    if (lastCard) lastCard.focus();
  }
  cards.forEach(function (card) {
    card.addEventListener("click", function (e) { if (!e.target.closest("a")) openProject(card); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProject(card); }
    });
  });
  modal.querySelectorAll("[data-close]").forEach(function (el) { el.addEventListener("click", closeProject); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeProject(); });

  // 5. Sticky header shadow + back to top
  var header = document.querySelector(".site-header");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    toTop.classList.toggle("is-visible", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0 }); });

  // 6. Active menu link
  if ("IntersectionObserver" in window) {
    var links = {};
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("is-active"); });
          links[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { io.observe(s); });
  }

  // 7. Reveal on scroll
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".section-title, .section-sub, .about-grid, .service-card, .stat-row, .help-box, .project-card, .timeline-item, .contact-card, .edu-card");
  if (!reduce && "IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); ro.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { el.classList.add("reveal"); ro.observe(el); });
  }

  // 8. Footer year
  var yr = document.getElementById("year"); if (yr) yr.textContent = new Date().getFullYear();
})();

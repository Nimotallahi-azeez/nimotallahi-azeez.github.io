// ============================================================
//  ENHANCED PORTFOLIO — script.js
//  Nimotallahi Azeez | Technical Communication Specialist
//  M.A. Candidate · English Dept · Tennessee Tech
// ============================================================

// ============================================================
//  UTILITY
// ============================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const backTop = $("#back-top");
// ============================================================
//  DARK MODE
// ============================================================
const darkToggle = $("#dark-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function setDarkMode(on) {
  document.body.classList.toggle("dark-mode", on);
  localStorage.setItem("darkMode", on ? "1" : "0");
}

const saved = localStorage.getItem("darkMode");
if (saved !== null) {
  setDarkMode(saved === "1");
} else {
  setDarkMode(prefersDark.matches);
}

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    setDarkMode(!document.body.classList.contains("dark-mode"));
  });
}

// ============================================================
//  NAVIGATION — scroll effect, active link, mobile menu
// ============================================================
const navbar = $("#navbar");
const hamburger = $("#hamburger");
const navMenu = $("#nav-menu");
const navLinks = $$(".nav-link");
const progressBar = $("#progress-bar");
const backTopBtn = backTop; // reuse the ref declared above

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;

    if (navbar) navbar.classList.toggle("scrolled", y > 60);
    if (progressBar)
      progressBar.style.width =
        (y / (document.documentElement.scrollHeight - window.innerHeight)) *
          100 +
        "%";
    if (backTopBtn) backTopBtn.classList.toggle("visible", y > 500);

    let current = "";
    $$("section[id]").forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`,
      );
    });
  },
  { passive: true },
);

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target)
      window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
    navMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open navigation menu");
  });
});

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("open");
  navMenu.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburger.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    hamburger.classList.remove("open");
    navMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open navigation menu");
  }
});

// ============================================================
//  BACK TO TOP
// ============================================================

if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ============================================================
//  SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
);

$$(".reveal").forEach((el) => revealObserver.observe(el));

const childObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const children = $$(".reveal-child", entry.target.parentElement);
        const idx = children.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add("visible"), idx * 120);
        childObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);

$$(".reveal-child").forEach((el) => childObserver.observe(el));

// ============================================================
//  ANIMATED STATS COUNTER
// ============================================================
function animateCount(el, target, duration = 1800) {
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $$(".stat-num", entry.target).forEach((el) =>
          animateCount(el, parseInt(el.dataset.target)),
        );
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

const aboutSection = $("#about");
if (aboutSection) statsObserver.observe(aboutSection);

// ============================================================
//  HERO FLOATING ORBS
// ============================================================
function createOrbs() {
  const container = $("#hero-orbs");
  if (!container) return;

  // Build per-orb keyframe rules so each orb travels a unique random path
  const styleEl = document.createElement("style");
  styleEl.id = "orb-style";
  let keyframes = "";

  for (let i = 0; i < 12; i++) {
    const name = `orbFloat${i}`;
    const x1 = (Math.random() * 80 - 40).toFixed(1);
    const y1 = (Math.random() * 80 - 40).toFixed(1);
    const x2 = (Math.random() * 60 - 30).toFixed(1);
    const y2 = (Math.random() * 60 - 30).toFixed(1);
    keyframes += `
      @keyframes ${name} {
        0%,100% { transform:translate(0,0); opacity:.4; }
        25%      { transform:translate(${x1}px,${y1}px); opacity:.9; }
        75%      { transform:translate(${x2}px,${y2}px); opacity:.6; }
      }
    `;

    const orb = document.createElement("div");
    const size = (Math.random() * 4 + 1.5).toFixed(1);
    orb.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:rgba(200,150,62,${(Math.random() * 0.4 + 0.1).toFixed(2)});
      left:${(Math.random() * 100).toFixed(1)}%;
      top:${(Math.random() * 100).toFixed(1)}%;
      animation:${name} ${(Math.random() * 12 + 10).toFixed(1)}s ease-in-out infinite;
      animation-delay:${(Math.random() * 5).toFixed(1)}s;
    `;
    container.appendChild(orb);
  }

  if (!document.getElementById("orb-style")) {
    styleEl.textContent = keyframes;
    document.head.appendChild(styleEl);
  }
}
window.addEventListener("load", createOrbs);

// ============================================================
//  HERO PARALLAX (rAF-throttled for smooth mobile performance)
// ============================================================
let parallaxTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!parallaxTicking) {
      parallaxTicking = true; // set immediately, before rAF, to block duplicate queuing
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const heroContent = $(".hero-content");
        if (heroContent && scrolled < window.innerHeight) {
          heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
          heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.6;
        }
        parallaxTicking = false;
      });
    }
  },
  { passive: true },
);

// ============================================================
//  EXPERIENCE VIEW TOGGLE
// ============================================================
const toggleBtns = $$(".toggle-btn");
const listView = $("#list-view");
const timelineView = $("#timeline-view");

toggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleBtns.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    if (btn.dataset.view === "list") {
      listView.style.display = "grid";
      timelineView.style.display = "none";
    } else {
      listView.style.display = "none";
      timelineView.style.display = "block";
      $$(".tl-card").forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        setTimeout(() => {
          el.style.transition = "all .5s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, i * 150);
      });
    }
  });
});

// ============================================================
//  ABSTRACT ACCORDIONS
// ============================================================
$$(".abstract-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const body = btn.nextElementSibling;
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    btn.querySelector("span").textContent = expanded
      ? "Read Abstract"
      : "Hide Abstract";
    body.hidden = expanded;
  });
});

// ============================================================
//  PDF INLINE VIEWER
// ============================================================
const pdfTabs = $$(".pdf-tab");
const pdfFrame = $("#pdf-frame");
const pdfFallback = $(".pdf-fallback");
const pdfFallbackLink = $("#pdf-fallback-link");

function loadPdfTab(url) {
  if (!pdfFrame) return;
  // DOI and external URLs can't render in iframes — show fallback link immediately
  const isExternal = url.startsWith("http://") || url.startsWith("https://");
  if (isExternal) {
    pdfFrame.removeAttribute("src");
    if (pdfFallback) pdfFallback.style.display = "flex";
    if (pdfFallbackLink) pdfFallbackLink.href = url;
  } else {
    if (pdfFallback) pdfFallback.style.display = "none";
    pdfFrame.src = url;
    if (pdfFallbackLink) pdfFallbackLink.href = url;
  }
}

pdfTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    pdfTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    loadPdfTab(tab.dataset.pdf);
  });
});

// Load the initially active tab on page load
if (pdfFrame) {
  const activeTab = $(".pdf-tab.active");
  if (activeTab) loadPdfTab(activeTab.dataset.pdf);

  pdfFrame.addEventListener("error", () => {
    if (pdfFallback) pdfFallback.style.display = "flex";
  });
}

// ============================================================
//  GALLERY FILTER & LIGHTBOX
// ============================================================
const gfBtns = $$(".gf-btn");
const galleryItems = $$(".gallery-item");
const lightbox = $("#lightbox");
const lbImg = $("#lb-img");
const lbCaption = $("#lb-caption");
const lbClose = $("#lb-close");

gfBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    gfBtns.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    const filter = btn.dataset.filter;
    galleryItems.forEach((item) => {
      item.classList.toggle(
        "hidden",
        filter !== "all" && item.dataset.category !== filter,
      );
    });
  });
});

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    if (!img) return;
    const caption = item.querySelector(".gallery-caption");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.innerHTML = caption ? caption.innerHTML : "";
    openLightbox();
  });
});

if (lbClose) lbClose.addEventListener("click", closeLightbox);
if (lightbox)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ============================================================
//  CONTACT FORM (Formspree)
// ============================================================
const contactForm = $("#contact-form");
const formStatus = $("#form-status");
const formBtnText = $("#form-btn-text");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formBtnText.textContent = "Sending…";

    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        formStatus.textContent = "✓ Message sent! I'll be in touch soon.";
        formStatus.className = "form-status success";
        contactForm.reset();
      } else {
        throw new Error("Server error");
      }
    } catch {
      formStatus.textContent =
        "✗ Something went wrong. Please email nazeez42@tntech.edu directly.";
      formStatus.className = "form-status error";
    } finally {
      formBtnText.textContent = "Send Message";
    }
  });
}

// ============================================================
//  BUTTON RIPPLE
// ============================================================
if (!document.getElementById("ripple-style")) {
  const s = document.createElement("style");
  s.id = "ripple-style";
  s.textContent = `@keyframes ripple { to { transform: scale(3); opacity: 0; } }`;
  document.head.appendChild(s);
}

$$(".btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const sz = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; pointer-events:none;
      width:${sz}px; height:${sz}px; border-radius:50%;
      background:rgba(255,255,255,.35);
      left:${e.clientX - rect.left - sz / 2}px;
      top:${e.clientY - rect.top - sz / 2}px;
      transform:scale(0); animation:ripple .6s ease-out forwards;
    `;
    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ============================================================
//  INIT
// ============================================================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  // Auto-update footer copyright year
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  console.log(
    "%c📄 Nimotallahi Azeez — Portfolio",
    "font-size:16px;font-weight:bold;color:#c8963e;",
  );
  console.log(
    "%cM.A. Candidate | English Dept | Technical Communication",
    "color:#7a7d87;",
  );
});

// ============================================================
//  LIGHTBOX — focus trap & keyboard nav
// ============================================================
function openLightbox() {
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
  // Move focus to close button for keyboard users
  requestAnimationFrame(() => lbClose.focus());
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  lbImg.src = "";
}

// Trap focus inside lightbox when open
lightbox.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    lbClose.focus();
  }
});

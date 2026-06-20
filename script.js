// Theme toggle (dark / light)
(function initTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  const prefersLight =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

  const initial = stored || (prefersLight ? "light" : "dark");
  applyTheme(initial);

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    document
      .querySelectorAll(".theme-toggle")
      .forEach((btn) => btn.setAttribute("aria-pressed", theme === "light"));
  }

  function toggleTheme() {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("theme", next);
  }

  document
    .querySelectorAll(".theme-toggle")
    .forEach((btn) => btn.addEventListener("click", toggleTheme));
})();

const words = [
  "Web Developer",
  "Youth Advocate",
  "Social Strategist",
  "Problem Solver",
  "CS Student",
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const textElement = document.getElementById("typing-text");

function type() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    textElement.textContent = currentWord.substring(0, charIndex--);
  } else {
    textElement.textContent = currentWord.substring(0, charIndex++);
  }

  let speed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex > currentWord.length) {
    speed = 1500;
    isDeleting = true;
  }

  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 500;
  }

  setTimeout(type, speed);
}

type();

// Scroll progress indicator
const scrollProgress = document.getElementById("scrollProgress");

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + "%";
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const fadeBar = document.querySelector(".fade-bottom");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const fullHeight = document.body.scrollHeight;

  const nearBottom = scrollY + viewportHeight >= fullHeight - 500;

  if (nearBottom) {
    fadeBar.style.opacity = "0";
  } else {
    fadeBar.style.opacity = "1";
  }
});

function sendEmail(message) {
  const receiver = "p.esposado.528632@umindanao.edu.ph";
  const subject = "New Message from Website";

  const mailtoLink = `mailto:${receiver}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  window.location.href = mailtoLink;
}

// Mobile hamburger menu
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("mobileNavOverlay");
const closeBtn = document.getElementById("closeBtn");

function openMenu() {
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

menuBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);

// Close when any nav link is tapped
document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// ── AMBIENT MINI-GAME: "SIGNALS" ──
// Tap the drifting geometric marks in the background. Purely optional;
// never intercepts clicks meant for real content.
(function initSignalGame() {
  const hud = document.getElementById("signalHud");
  const countEl = document.getElementById("signalCount");
  const targets = Array.from(document.querySelectorAll(".bg-target"));
  if (!hud || !countEl || !targets.length) return;

  let score = parseInt(localStorage.getItem("signalScore") || "0", 10);
  countEl.textContent = String(score).padStart(2, "0");

  let armed = false;
  function arm() {
    if (armed) return;
    armed = true;
    hud.classList.add("armed");
  }
  window.addEventListener("scroll", arm, { once: true, passive: true });
  targets.forEach((t) => t.addEventListener("mouseenter", arm, { once: true }));

  function randomSpot() {
    return {
      top: 6 + Math.random() * 86 + "%",
      left: 4 + Math.random() * 90 + "%",
    };
  }

  function spawnRipple(x, y) {
    const ripple = document.createElement("div");
    ripple.className = "signal-ripple";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    document.body.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }

  function spawnToast(x, y) {
    const toast = document.createElement("div");
    toast.className = "signal-toast";
    toast.textContent = "+1";
    toast.style.left = x + "px";
    toast.style.top = y + "px";
    document.body.appendChild(toast);
    toast.addEventListener("animationend", () => toast.remove());
  }

  targets.forEach((mark) => {
    mark.addEventListener("click", (e) => {
      if (mark.classList.contains("popped")) return;
      arm();

      const rect = mark.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      spawnRipple(x, y);
      spawnToast(x, y);

      score += 1;
      localStorage.setItem("signalScore", String(score));
      countEl.textContent = String(score).padStart(2, "0");
      countEl.classList.remove("signal-pulse");
      void countEl.offsetWidth;
      countEl.classList.add("signal-pulse");

      mark.classList.add("popped");
      setTimeout(
        () => {
          const spot = randomSpot();
          mark.style.top = spot.top;
          mark.style.left = spot.left;
          mark.classList.remove("popped");
        },
        900 + Math.random() * 1200,
      );
    });
  });
})();

// ── CARD TILT ──
// Subtle pointer-follow tilt on project and certificate cards, switched
// off for touch devices and reduced-motion users.
(function initCardTilt() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (prefersReduced || isTouch) return;

  const cards = document.querySelectorAll(".project-grid, .certificate");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--rx", px * 6 + "deg");
      card.style.setProperty("--ry", py * -6 + "deg");
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
})();

// Scroll reveal animations (fade + slide in from left/right/up)
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        } else {
          entry.target.classList.remove("in-view");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback for browsers without IntersectionObserver support
  revealEls.forEach((el) => el.classList.add("in-view"));
}

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

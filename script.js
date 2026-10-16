(() => {
  const intro = document.getElementById("introScreen");
  const symbol = document.getElementById("introSymbol");
  const skip = document.getElementById("skipIntro");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let introFinished = false;

  document.body.classList.add("intro-active");

  function enterPortfolio() {
    if (introFinished) return;
    introFinished = true;
    if (reducedMotion) {
      intro.classList.add("is-hidden");
      document.body.classList.remove("intro-active");
      return;
    }
    intro.classList.add("is-zooming");
    window.setTimeout(() => {
      intro.classList.add("is-hidden");
      document.body.classList.remove("intro-active");
    }, 720);
  }

  symbol.addEventListener("click", enterPortfolio);
  skip.addEventListener("click", enterPortfolio);
  document.addEventListener("keydown", (event) => {
    if (!introFinished && event.key === "Escape") enterPortfolio();
  });

  // Mobile navigation
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });

  // Reveal selected sections as they enter view.
  const revealTargets = document.querySelectorAll(
    ".hero-content, .hero-visual, .section-heading, .about-text, .about-stats, .skill-card, .project-card, .engineering-box, .timeline-item, .cert-item, .contact-content"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  // Highlight the navigation item for the section currently in view.
  const sections = document.querySelectorAll("main section[id]");
  const navItems = navLinks.querySelectorAll("a[href^='#']");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((link) => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-25% 0px -60% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();

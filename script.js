(() => {
  "use strict";

  const config = window.PORTFOLIO_CONFIG || {};
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const numberFormat = new Intl.NumberFormat();

  function validWebUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value.trim());
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function configureExternalLink(element, value) {
    if (!element) return false;
    const href = validWebUrl(value);
    if (!href) {
      element.removeAttribute("href");
      element.setAttribute("aria-disabled", "true");
      return false;
    }
    element.href = href;
    element.removeAttribute("aria-disabled");
    if (element.target === "_blank") element.rel = "noopener noreferrer";
    return true;
  }

  function configurePersonalDetails() {
    const personal = config.personal || {};
    const name = typeof personal.name === "string" && personal.name.trim() ? personal.name.trim() : "Shradhay";
    document.querySelectorAll("[data-person-name]").forEach((element) => {
      element.textContent = name;
    });
    document.querySelectorAll("[data-person-brand]").forEach((element) => {
      element.textContent = name.toUpperCase();
    });

    const email = typeof personal.email === "string" ? personal.email.trim() : "";
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    document.querySelectorAll("[data-email]").forEach((element) => {
      element.textContent = validEmail ? email : "Add an email in config.js";
    });
    const emailLink = document.querySelector("[data-email-link]");
    if (emailLink) {
      if (validEmail) {
        emailLink.href = `mailto:${email}`;
        emailLink.removeAttribute("aria-disabled");
      } else {
        emailLink.removeAttribute("href");
        emailLink.setAttribute("aria-disabled", "true");
      }
    }

    document.querySelectorAll("[data-social]").forEach((element) => {
      const network = element.dataset.social;
      const configured = configureExternalLink(element, personal[network]);
      element.classList.toggle("is-unconfigured", !configured);
      if (network === "instagram") {
        const state = document.querySelector(`[data-social-state="${network}"]`);
        if (state) state.textContent = configured ? "" : "URL not configured";
        if (configured && state) state.hidden = true;
        if (!configured && state) state.hidden = false;
        if (!configured) element.title = "Add your Instagram URL in config.js";
      }
    });

    return { email: validEmail ? email : "" };
  }

  function configureProjectLinks() {
    const projects = config.projects || {};
    const profileUrl = validWebUrl(config.personal?.github) || validWebUrl(config.github?.profileUrl);
    document.querySelectorAll("[data-project-link]").forEach((link) => {
      const key = link.dataset.projectLink;
      const project = projects[key] || {};
      const repositoryConfigured = configureExternalLink(link, project.repositoryUrl);
      const linkAvailable = repositoryConfigured || configureExternalLink(link, profileUrl);
      const label = link.querySelector("[data-project-link-label]");
      const missing = document.querySelector(`[data-project-missing="${key}"]`);
      if (label && linkAvailable) {
        label.textContent = repositoryConfigured ? "View repository" : "Explore GitHub profile";
      }
      link.hidden = !linkAvailable;
      if (missing) missing.hidden = linkAvailable;
    });
  }

  function configureGithubLinks() {
    const profileUrl = validWebUrl(config.github?.profileUrl) || validWebUrl(config.personal?.github);
    document.querySelectorAll("[data-github-profile]").forEach((link) => {
      configureExternalLink(link, profileUrl);
    });
    document.querySelectorAll("[data-github-activity]").forEach((link) => {
      configureExternalLink(link, profileUrl);
    });
  }

  function initNavigation() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("primaryNav");
    if (!toggle || !nav) return;

    const navLinks = [...nav.querySelectorAll("a[href^='#']")];
    const closeMenu = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (nav.classList.contains("is-open") && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });

    const sections = [...document.querySelectorAll("main .section-anchor[id]")];
    if (!("IntersectionObserver" in window)) return;
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-27% 0px -60% 0px", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  function initRevealAnimations() {
    const targets = [...document.querySelectorAll("[data-reveal]")];
    if (!targets.length) return;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    targets.forEach((target, index) => {
      target.classList.add("reveal-ready");
      target.style.setProperty("--reveal-delay", `${(index % 4) * 55}ms`);
    });

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
    targets.forEach((target) => observer.observe(target));

    const timeline = document.querySelector(".timeline");
    if (timeline) {
      const timelineObserver = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          timeline.classList.add("is-active");
          activeObserver.unobserve(timeline);
        });
      }, { threshold: 0.14 });
      timelineObserver.observe(timeline);
    }
  }

  function initCounters() {
    const counters = [...document.querySelectorAll("[data-count]")];
    const renderFinalValue = (counter) => {
      const count = Number(counter.dataset.count);
      const pad = Number(counter.dataset.countPad || 0);
      counter.textContent = Number.isFinite(count) ? String(count).padStart(pad, "0") : "0";
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      counters.forEach(renderFinalValue);
      return;
    }

    const countObserver = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        const end = Number(counter.dataset.count);
        const pad = Number(counter.dataset.countPad || 0);
        if (!Number.isFinite(end)) {
          renderFinalValue(counter);
          activeObserver.unobserve(counter);
          return;
        }
        const startedAt = performance.now();
        const duration = 680;
        const tick = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = String(Math.round(end * eased)).padStart(pad, "0");
          if (progress < 1) requestAnimationFrame(tick);
          else counter.textContent = String(end).padStart(pad, "0");
        };
        requestAnimationFrame(tick);
        activeObserver.unobserve(counter);
      });
    }, { threshold: 0.6 });
    counters.forEach((counter) => countObserver.observe(counter));
  }

  function initPointerInteractions() {
    if (!hasFinePointer || prefersReducedMotion) return;
    const glow = document.getElementById("cursorGlow");
    let pointerFrame = 0;
    let pointerX = -1000;
    let pointerY = -1000;

    if (glow) {
      document.body.classList.add("has-pointer");
      window.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (pointerFrame) return;
        pointerFrame = requestAnimationFrame(() => {
          glow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
          pointerFrame = 0;
        });
      }, { passive: true });
    }

    const stage = document.querySelector("[data-parallax]");
    const portrait = stage?.querySelector(".portrait-frame");
    if (stage && portrait) {
      stage.addEventListener("pointermove", (event) => {
        const bounds = stage.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        portrait.style.setProperty("--tilt-x", `${(0.5 - y) * 2.1}deg`);
        portrait.style.setProperty("--tilt-y", `${(x - 0.5) * 2.1}deg`);
      }, { passive: true });
      stage.addEventListener("pointerleave", () => {
        portrait.style.setProperty("--tilt-x", "0deg");
        portrait.style.setProperty("--tilt-y", "0deg");
      });
    }

    document.querySelectorAll("[data-magnetic]").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        element.style.transform = `translate3d(${x * 5}px, ${y * 4}px, 0)`;
      }, { passive: true });
      element.addEventListener("pointerleave", () => {
        element.style.transform = "translate3d(0, 0, 0)";
      });
    });

    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--card-pointer-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--card-pointer-y", `${event.clientY - bounds.top}px`);
      }, { passive: true });
    });
  }

  function setGithubStatus(message, online) {
    const status = document.getElementById("githubStatus");
    if (!status) return;
    status.classList.toggle("is-offline", !online);
    const dot = document.createElement("span");
    dot.className = "status-dot";
    dot.setAttribute("aria-hidden", "true");
    status.replaceChildren(dot, document.createTextNode(message));
  }

  function setRepositoryMessage(message) {
    const list = document.getElementById("githubRepositories");
    if (!list) return;
    const paragraph = document.createElement("p");
    paragraph.className = "repository-message";
    paragraph.textContent = message;
    list.replaceChildren(paragraph);
  }

  function allowedRepositoryUrl(rawUrl, username) {
    try {
      const url = new URL(rawUrl);
      const ownerPrefix = `/${username}/`.toLowerCase();
      if (url.protocol !== "https:" || url.hostname !== "github.com" || !url.pathname.toLowerCase().startsWith(ownerPrefix)) return "";
      return url.href;
    } catch {
      return "";
    }
  }

  function renderRepositories(repositories, username) {
    const list = document.getElementById("githubRepositories");
    if (!list) return [];
    const owned = Array.isArray(repositories) ? repositories.filter((repo) => repo && !repo.fork).slice(0, 3) : [];
    if (!owned.length) {
      setRepositoryMessage("No public repositories are available to show yet.");
      return [];
    }

    const fragment = document.createDocumentFragment();
    owned.forEach((repo) => {
      const href = allowedRepositoryUrl(repo.html_url, username);
      if (!href) return;
      const link = document.createElement("a");
      link.className = "repository-item";
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const top = document.createElement("span");
      top.className = "repository-item-top";
      const name = document.createElement("strong");
      name.textContent = typeof repo.name === "string" ? repo.name : "Public repository";
      top.append(name);
      if (typeof repo.language === "string" && repo.language.trim()) {
        const language = document.createElement("span");
        language.className = "repository-language";
        const dot = document.createElement("i");
        dot.setAttribute("aria-hidden", "true");
        language.append(dot, document.createTextNode(repo.language));
        top.append(language);
      }
      link.append(top);

      const description = document.createElement("p");
      description.textContent = typeof repo.description === "string" && repo.description.trim()
        ? repo.description.trim()
        : "No description added on GitHub.";
      link.append(description);
      fragment.append(link);
    });

    if (!fragment.childNodes.length) {
      setRepositoryMessage("Repository links could not be validated. Check the GitHub username in config.js.");
      return [];
    }
    list.replaceChildren(fragment);
    return owned;
  }

  function renderLanguages(repositories) {
    const container = document.getElementById("githubLanguages");
    if (!container) return;
    const languages = [...new Set(repositories.map((repo) => repo.language).filter((language) => typeof language === "string" && language.trim()))];
    if (!languages.length) {
      const placeholder = document.createElement("span");
      placeholder.className = "language-placeholder";
      placeholder.textContent = "No language data returned for these repositories.";
      container.replaceChildren(placeholder);
      return;
    }
    const fragment = document.createDocumentFragment();
    languages.forEach((language) => {
      const chip = document.createElement("span");
      chip.className = "language-chip";
      chip.textContent = language;
      fragment.append(chip);
    });
    container.replaceChildren(fragment);
  }

  async function fetchJson(url, signal) {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/vnd.github+json" },
      signal
    });
    if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);
    return response.json();
  }

  async function loadGithubData() {
    const username = typeof config.github?.username === "string" ? config.github.username.trim() : "";
    const apiBase = validWebUrl(config.github?.apiBase);
    if (!username || !/^[A-Za-z0-9-]+$/.test(username) || !apiBase || new URL(apiBase).hostname !== "api.github.com") {
      setGithubStatus("Add a GitHub username and API base in config.js", false);
      setRepositoryMessage("Configure a public GitHub username in config.js to load repositories.");
      renderLanguages([]);
      return;
    }

    setGithubStatus("Fetching live public profile data…", true);
    const base = apiBase.replace(/\/$/, "");
    const profileUrl = `${base}/users/${encodeURIComponent(username)}`;
    const reposUrl = `${base}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10&type=owner`;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 9000);

    try {
      const results = await Promise.allSettled([
        fetchJson(profileUrl, controller.signal),
        fetchJson(reposUrl, controller.signal)
      ]);
      let hasLiveData = false;
      let repoList = [];

      const profileResult = results[0];
      if (profileResult.status === "fulfilled") {
        const profile = profileResult.value;
        const stats = {
          public_repos: profile.public_repos,
          followers: profile.followers,
          following: profile.following
        };
        document.querySelectorAll("[data-gh-stat]").forEach((element) => {
          const value = stats[element.dataset.ghStat];
          element.textContent = Number.isFinite(value) ? numberFormat.format(value) : "—";
        });
        hasLiveData = true;
      }

      const reposResult = results[1];
      if (reposResult.status === "fulfilled" && Array.isArray(reposResult.value)) {
        repoList = renderRepositories(reposResult.value, username);
        renderLanguages(repoList);
        hasLiveData = true;
      } else if (reposResult.status === "rejected") {
        setRepositoryMessage("Couldn’t load repositories right now. Use the profile link to browse GitHub.");
        renderLanguages([]);
      }

      if (hasLiveData) setGithubStatus("Live data · GitHub public API", true);
      else setGithubStatus("GitHub data is temporarily unavailable", false);
    } catch {
      setRepositoryMessage("Couldn’t load repositories right now. Use the profile link to browse GitHub.");
      renderLanguages([]);
      setGithubStatus("GitHub data is temporarily unavailable", false);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function initContributionPlaceholder() {
    const grid = document.querySelector(".contribution-cells");
    if (!grid) return;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 182; index += 1) {
      const cell = document.createElement("span");
      fragment.append(cell);
    }
    grid.append(fragment);
  }

  function initContactForm(email) {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    if (!form || !status) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.textContent = "";
      if (!form.reportValidity()) return;
      if (!email) {
        status.textContent = "Add a valid email address in config.js before using the form.";
        return;
      }

      const values = new FormData(form);
      const name = String(values.get("name") || "").trim();
      const sender = String(values.get("email") || "").trim();
      const subject = String(values.get("subject") || "").trim();
      const message = String(values.get("message") || "").trim();
      const body = [
        `Name: ${name}`,
        `Email: ${sender}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message
      ].join("\n");
      const mailto = `mailto:${email}?subject=${encodeURIComponent(subject || "Portfolio inquiry")}&body=${encodeURIComponent(body)}`;
      status.textContent = "Opening an email draft with your message…";
      window.location.href = mailto;
    });
  }

  function setCurrentYear() {
    const year = document.getElementById("currentYear");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  const contact = configurePersonalDetails();
  configureProjectLinks();
  configureGithubLinks();
  initNavigation();
  initRevealAnimations();
  initCounters();
  initPointerInteractions();
  initContributionPlaceholder();
  initContactForm(contact.email);
  setCurrentYear();
  loadGithubData();
})();

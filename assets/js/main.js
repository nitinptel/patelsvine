(() => {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("patelsvine-theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    root.dataset.theme = storedTheme;
  }

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
  }

  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("patelsvine-theme", next);
    });
  }

  const searchInput = document.querySelector("[data-post-search]");
  const cards = Array.from(document.querySelectorAll("[data-post-card]"));
  const filters = Array.from(document.querySelectorAll("[data-category-filter]"));
  const emptyState = document.querySelector("[data-empty-state]");
  let activeCategory = new URLSearchParams(location.search).get("category") || "all";
  const q = new URLSearchParams(location.search).get("q");
  if (searchInput && q) searchInput.value = q;

  function applyFilters() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matchesTerm = !term || card.dataset.title.includes(term);
      const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      const show = matchesTerm && matchesCategory;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  }

  if (filters.length) {
    filters.forEach((button) => {
      if (button.dataset.categoryFilter === activeCategory) {
        filters.forEach((candidate) => candidate.classList.remove("active"));
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        activeCategory = button.dataset.categoryFilter;
        filters.forEach((candidate) => candidate.classList.toggle("active", candidate === button));
        applyFilters();
      });
    });
  }
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  applyFilters();

  const progress = document.querySelector("[data-reading-progress]");
  if (progress) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const width = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      progress.style.width = width + "%";
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  const copyButton = document.querySelector("[data-copy-link]");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        const original = copyButton.textContent;
        copyButton.textContent = "Copied";
        setTimeout(() => { copyButton.textContent = original; }, 1600);
      } catch {
        copyButton.textContent = "Copy failed";
      }
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const name = data.get("name") || "";
      const email = data.get("email") || "";
      const message = data.get("message") || "";
      const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
      location.href = "mailto:editor@patelsvine.in?subject=PatelsVine%20Website%20Message&body=" + body;
    });
  }
})();

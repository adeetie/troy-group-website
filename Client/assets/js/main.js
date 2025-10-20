/* ===== Troy Groups — components.js (stable injection + behavior) ===== */

(async () => {
  // ---------- small helpers ----------
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pageFile = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  // Resolve a file path relative to the current page (works in Live Server and on VPS)
  const rel = (p) => new URL(p, location.href).toString();

  // Inject HTML into a host
  const inject = async (host, file) => {
    if (!host) return false;
    try {
      const res = await fetch(rel(file), { cache: "no-store" });
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      host.innerHTML = await res.text();
      return true;
    } catch (e) {
      console.error("[include] failed:", file, e);
      host.innerHTML = `<!-- failed to load: ${file} -->`;
      return false;
    }
  };

  // ---------- 1) Decide which header to use ----------
  // Priority:
  //   a) If page has [data-include="header-services"] → services header
  //   b) Else if filename is services.html → services header
  //   c) Else → default header
  const wantsServices =
    !!document.querySelector('[data-include="header-services"]') ||
    /(^|\/)services\.html$/i.test(pageFile);

  const PATHS = {
    headerDefault:  "Components/header.html",
    headerServices: "Components/header.services.html",
    footer:         "Components/footer.html",
  };
  const headerFile = wantsServices ? PATHS.headerServices : PATHS.headerDefault;

  // ---------- 2) Inject into both API styles you’ve used ----------
  // (A) ID placeholders: #site-header / #site-footer
  await inject($("#site-header"), headerFile);
  await inject($("#site-footer"), PATHS.footer);

  // (B) data-include placeholders: header / header-services / footer
  await Promise.all(
    $$("[data-include]").map(async (el) => {
      const k = el.getAttribute("data-include");
      const file =
        k === "header" ? headerFile :
        k === "header-services" ? PATHS.headerServices :
        k === "footer" ? PATHS.footer : null;
      if (file) await inject(el, file);
    })
  );

  // ---------- 3) After injection: enhance header ----------
  // 3a) Active link styling (adds .is-current to matching [data-link])
  const linkMap = {
    "index.html": "home",
    "about.html": "about",
    "clients.html": "clients",
    "digital-roadmap.html": "digital-roadmap",
    "contact.html": "contact",
    "services.html": "services",
    "privacy-policy.html": "privacy-policy",
    "our-active-businesses.html": "our-active-businesses",
    "our-opportunities.html": "our-opportunities",
    "our-strategies.html": "our-strategies",
  };
  const activeKey = linkMap[pageFile];
  if (activeKey) {
    const link = document.querySelector(`[data-link="${activeKey}"]`);
    if (link) link.classList.add("is-current");
  }

  // 3b) Sticky header shadow toggle (.is-scrolled)
  const head = document.querySelector(".tg-header");
  if (head) {
    const onScroll = () => head.classList.toggle("is-scrolled", scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // 3c) Mega dropdown (custom) — click + hover on desktop
  const toggle = document.querySelector('.nav__toggle[data-link="allpages"]');
  const panel  = document.getElementById("mega-allpages");
  if (toggle && panel) {
    const chev = toggle.querySelector(".chev");
    const open = (yes) => {
      panel.classList.toggle("is-open", yes);
      toggle.classList.toggle("is-current", yes);
      toggle.setAttribute("aria-expanded", String(yes));
      if (chev) chev.style.transform = yes ? "rotate(180deg)" : "rotate(0deg)";
    };

    // click to toggle
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      open(!panel.classList.contains("is-open"));
    });

    // close on outside click / Esc
    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("is-open")) return;
      if (!panel.contains(e.target) && !toggle.contains(e.target)) open(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") open(false);
    });

    // desktop hover (no effect on touch)
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      let inside = 0;
      const enter = () => { inside++; open(true);  };
      const leave = () => { inside--; setTimeout(() => { if (inside <= 0) open(false); }, 60); };
      [toggle, panel].forEach((el) => {
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });
    }

    // close when clicking any link inside mega
    Array.from(panel.querySelectorAll("a[href]")).forEach((a) =>
      a.addEventListener("click", () => open(false))
    );
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const megas = Array.from(document.querySelectorAll('.tg-mega'));

  function closeAll(except = null) {
    megas.forEach(m => {
      if (m === except) return;
      const t = m.querySelector('.nav__toggle');
      const p = m.querySelector('.tg-megamenu');
      if (t) t.classList.remove('is-current');
      if (p) p.classList.remove('is-open');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  megas.forEach(mega => {
    const toggle = mega.querySelector('.nav__toggle');
    const panel  = mega.querySelector('.tg-megamenu');
    if (!toggle || !panel) return;

    // CLICK to toggle; stays open until outside click or Esc
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !panel.classList.contains('is-open');
      closeAll(willOpen ? mega : null);
      panel.classList.toggle('is-open', willOpen);
      toggle.classList.toggle('is-current', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });

    // Prevent inside clicks from closing
    panel.addEventListener('click', (e) => e.stopPropagation());
  });

  // Close when clicking outside
  document.addEventListener('click', () => closeAll());

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
});




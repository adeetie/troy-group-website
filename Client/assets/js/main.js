// ===== TGX — components include + header mega (single source of truth) =====
(() => {
  const $ = (s, r=document) => r.querySelector(s);

  function ready(fn){
    document.readyState !== 'loading'
      ? fn()
      : document.addEventListener('DOMContentLoaded', fn);
  }

  // Position mega just under header (works with fixed headers)
  function placePanel() {
    const h = document.querySelector('.tgx-scope .tgx-header');
    const y = h ? (h.getBoundingClientRect().bottom + window.scrollY) : 110;
    document.documentElement.style.setProperty('--tgx-header-bottom', `${y}px`);
  }

  // Inject header/footer from /Components/*.html if placeholders exist
  async function includePart(selector, url){
    const host = $(selector);
    if (!host) return false;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return false;
      host.innerHTML = await res.text();
      return true;
    } catch { return false; }
  }

  // Bind mega-menu toggle (id + panel are required)
  function bindMenu() {
    const toggle = $('#allpagesToggle');
    const panel  = $('#mega-allpages');
    if (!toggle || !panel) return;

    if (toggle.dataset.bound === '1') return; // avoid duplicates
    toggle.dataset.bound = '1';

    function openPanel(yes) {
      panel.classList.toggle('is-open', !!yes);
      toggle.classList.toggle('is-current', !!yes);
      toggle.setAttribute('aria-expanded', String(!!yes));
    }

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPanel(!panel.classList.contains('is-open'));
    });

    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('is-open')) return;
      if (!panel.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        openPanel(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') openPanel(false);
    });

    placePanel();
    window.addEventListener('scroll', placePanel, { passive: true });
    window.addEventListener('resize', placePanel);
  }

  ready(async () => {
    // 1) inject components if placeholders exist
    const didHeader = await includePart('#site-header', 'Components/header.html');
    const didFooter = await includePart('#site-footer', 'Components/footer.html');

    // 2) after header injection, bind mega
    bindMenu();

    // 3) safety retries in case of race conditions on slower pages
    let tries = 0, max = 10;
    const t = setInterval(() => {
      bindMenu();
      tries++;
      if (tries >= max || document.querySelector('#allpagesToggle')) clearInterval(t);
    }, 150);
  });
})();

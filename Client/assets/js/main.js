// --- header behavior: active link + mega toggle ---
document.addEventListener("DOMContentLoaded", () => {
  // 1) Active state by path (Services page spec: highlight "Services")
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const map = {
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
  const activeKey = map[path] || null;
  if (activeKey) {
    const link = document.querySelector(`[data-link="${activeKey}"]`);
    if (link) link.classList.add("is-current");
  }

  // 2) Mega dropdown toggle for "All pages"
  const toggle = document.querySelector('.nav__toggle[data-link="allpages"]');
  const panel  = document.getElementById("mega-allpages");
  if (toggle && panel) {
    const open = (yes) => {
      panel.classList.toggle("is-open", yes);
      toggle.classList.toggle("is-current", yes);
      toggle.setAttribute("aria-expanded", String(yes));
      const chev = toggle.querySelector(".chev");
      if (chev) chev.style.transform = yes ? "rotate(180deg)" : "rotate(0deg)";
    };
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      open(!panel.classList.contains("is-open"));
    });
    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("is-open")) return;
      if (!panel.contains(e.target) && !toggle.contains(e.target)) open(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") open(false);
    });
  }
});
document.addEventListener("DOMContentLoaded",()=>{
  const toggle=document.querySelector('.nav__toggle[data-link="allpages"]');
  const panel=document.getElementById('mega-allpages');
  if(toggle&&panel){
    toggle.addEventListener('click',(e)=>{
      e.stopPropagation();
      const open=!panel.classList.contains('is-open');
      panel.classList.toggle('is-open',open);
      toggle.classList.toggle('is-current',open);
      toggle.querySelector('.chev').style.transform=open?'rotate(180deg)':'rotate(0deg)';
    });
    document.addEventListener('click',(e)=>{
      if(panel.classList.contains('is-open') && !panel.contains(e.target) && !toggle.contains(e.target))
        panel.classList.remove('is-open'),toggle.classList.remove('is-current');
    });
  }
});
// Load shared components with RELATIVE paths (works in Live Server)
document.addEventListener("DOMContentLoaded", () => {
  const load = async (id, file) => {
    const host = document.getElementById(id);
    if (!host) return;
    try {
      const res = await fetch(file, { cache: "no-store" });
      host.innerHTML = await res.text();
    } catch (e) {
      console.error("Failed to load component:", file, e);
    }
  };
  // Components folder in this repo is `Components` (capital C). Use that to avoid
  // failing to load on case-sensitive filesystems or hosting platforms.
  load("site-header", "Components/header.html");
  load("site-footer", "Components/footer.html");

  // Active state for Services page (your image 3 spec)
  const map = { "index.html":"home", "about.html":"about", "contact.html":"contact", "services.html":"services", "our-opportunities.html":"our-opportunities" };
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const key = map[page];
  if (key) {
    const el = document.querySelector(`[data-link="${key}"]`);
    if (el) el.classList.add("is-current");
  }

 
});

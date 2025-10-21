// ===== AUTH (frontend-only; dummy users) =====

// Built-in demo users (you can add more)
const DEFAULT_USERS = [
  { name: "Demo User",   email: "demo@troy.com",   password: "Demo@123" },
  { name: "Investor One", email: "investor@troy.com", password: "Invest@123" }
];

const LS_USERS_KEY   = "troy_auth_users_v1";
const SS_SESSION_KEY = "troy_auth_session_v1";

// ----- helpers
const readUsers = () => {
  const fromLS = JSON.parse(localStorage.getItem(LS_USERS_KEY) || "[]");
  if (!fromLS.length) {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return [...DEFAULT_USERS];
  }
  // Merge defaults if missing, without dupes by email
  const map = new Map(fromLS.map(u => [u.email.toLowerCase(), u]));
  DEFAULT_USERS.forEach(u => { if (!map.has(u.email.toLowerCase())) map.set(u.email.toLowerCase(), u); });
  const merged = Array.from(map.values());
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(merged));
  return merged;
};

const writeUsers = (users) => localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
const findUser = (email) => readUsers().find(u => u.email.toLowerCase() === email.toLowerCase());

const createSession = (email, remember) => {
  const payload = { email, ts: Date.now() };
  const val = JSON.stringify(payload);
  if (remember) localStorage.setItem(SS_SESSION_KEY, val);
  else sessionStorage.setItem(SS_SESSION_KEY, val);
};

const clearSession = () => {
  localStorage.removeItem(SS_SESSION_KEY);
  sessionStorage.removeItem(SS_SESSION_KEY);
};

const getSession = () => {
  const val = sessionStorage.getItem(SS_SESSION_KEY) || localStorage.getItem(SS_SESSION_KEY);
  return val ? JSON.parse(val) : null;
};

// ----- validators
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const strongPass = (v) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/.test(v);

// ----- UI helpers
function setStatus(el, msg, ok=false) {
  if (!el) return;
  el.textContent = msg;
  el.className = ok ? "form-status text-success small mt-2" : "form-status text-danger small mt-2";
  el.style.display = msg ? "block" : "none";
}

// ----- SIGNUP
window.initSignup = function initSignup() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  const nameEl  = document.getElementById("suName");
  const emailEl = document.getElementById("suEmail");
  const passEl  = document.getElementById("suPassword");
  const rememberEl = document.getElementById("suRemember");
  const statusEl = document.getElementById("suStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setStatus(statusEl, "");

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const pass = passEl.value;

    if (!name)  return setStatus(statusEl, "Please enter your full name.");
    if (!isEmail(email)) return setStatus(statusEl, "Please enter a valid email address.");
    if (!strongPass(pass)) return setStatus(statusEl, "Password must be 8+ chars with upper, lower, number and symbol.");

    if (findUser(email)) return setStatus(statusEl, "An account already exists for this email.");

    const users = readUsers();
    users.push({ name, email, password: pass });
    writeUsers(users);

    createSession(email, rememberEl.checked);
    // redirect with query for thankyou copy
    window.location.href = "./thankyou.html?from=signup&name=" + encodeURIComponent(name);
  });

  // Fake Google sign-in
  const googleBtn = document.getElementById("suGoogle");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      const email = "google.demo@troy.com";
      if (!findUser(email)) {
        const users = readUsers();
        users.push({ name: "Google Demo", email, password: "Google@123" });
        writeUsers(users);
      }
      createSession(email, true);
      window.location.href = "./thankyou.html?from=google&name=" + encodeURIComponent("Google Demo");
    });
  }
};

// ----- LOGIN
window.initLogin = function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const emailEl = document.getElementById("liEmail");
  const passEl  = document.getElementById("liPassword");
  const rememberEl = document.getElementById("liRemember");
  const statusEl = document.getElementById("liStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setStatus(statusEl, "");

    const email = emailEl.value.trim();
    const pass  = passEl.value;

    if (!isEmail(email)) return setStatus(statusEl, "Enter a valid email.");
    const user = findUser(email);
    if (!user || user.password !== pass) return setStatus(statusEl, "Invalid email or password.");

    createSession(email, rememberEl.checked);
    window.location.href = "./thankyou.html?from=login&name=" + encodeURIComponent(user.name || "Friend");
  });

  const googleBtn = document.getElementById("liGoogle");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      const email = "google.demo@troy.com";
      if (!findUser(email)) {
        const users = readUsers();
        users.push({ name: "Google Demo", email, password: "Google@123" });
        writeUsers(users);
      }
      createSession(email, true);
      window.location.href = "./thankyou.html?from=google&name=" + encodeURIComponent("Google Demo");
    });
  }

  const forgot = document.getElementById("liForgot");
  if (forgot) {
    forgot.addEventListener("click", (e) => {
      e.preventDefault();
      const email = emailEl.value.trim();
      if (!isEmail(email)) return setStatus(statusEl, "Enter your email above, then click Forgot.");
      setStatus(statusEl, "Password reset link sent to " + email + " (simulated).", true);
    });
  }
};

// ----- THANK YOU
window.initThankyou = function initThankyou() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || (getSession()?.email || "");
  const who = document.getElementById("tyName");
  if (who && name) who.textContent = name;

  const backHome = document.getElementById("tyBack");
  if (backHome) backHome.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "./index.html";
  });
};

// Optional: expose logout for testing
window.troyLogout = function troyLogout() {
  clearSession();
  alert("Signed out (frontend only).");
};

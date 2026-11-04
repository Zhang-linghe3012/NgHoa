"use strict";

const CONFIG = {
  password: "love you",
  hint: "Gợi ý: ba từ thật ngọt ngào",
};

const screenEls = {
  login: document.getElementById("loginScreen"),
  envelope: document.getElementById("envelopeScreen"),
  celebration: document.getElementById("celebrationScreen"),
};

const loginForm = document.getElementById("loginForm");
const loginCard = document.getElementById("loginCard");
const passwordInput = document.getElementById("password");
const passwordField = document.getElementById("passwordField");
const togglePassword = document.getElementById("togglePassword");
const loginMessage = document.getElementById("loginMessage");
const loginHint = document.getElementById("loginHint");
const envelope = document.getElementById("envelope");
const restartButton = document.getElementById("restart");
const balloonsLayer = document.getElementById("balloons");
const sparklesLayer = document.getElementById("sparkles");
const ambientHearts = document.getElementById("ambientHearts");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  screen: "login",
  submitting: false,
  envelopeOpening: false,
  celebrating: false,
};

const timers = {
  balloons: null,
  sparkles: null,
};

const balloonPalette = [
  { light: "#ffd3de", dark: "#f18fae" },
  { light: "#ffe2d4", dark: "#f2ac85" },
  { light: "#ffd9e8", dark: "#e885aa" },
  { light: "#eadcff", dark: "#b79adf" },
  { light: "#fff0cf", dark: "#e8c477" },
  { light: "#ffcbd7", dark: "#df6389" },
  { light: "#f9dcea", dark: "#d68ab4" },
  { light: "#ffe9e2", dark: "#e6a096" },
];

const sparklePalette = ["#e26a8d", "#f2a985", "#d7a57d", "#b79adf", "#ffb8cc", "#fff1c9"];

function setScreen(name) {
  Object.entries(screenEls).forEach(([key, element]) => {
    element.classList.toggle("is-active", key === name);
  });
  state.screen = name;

  if (name === "celebration") {
    startCelebration();
  } else {
    stopCelebration();
  }
}

function showLoginMessage(text, type) {
  loginMessage.textContent = text;
  loginMessage.classList.toggle("is-success", type === "success");
  loginMessage.classList.toggle("is-visible", Boolean(text));
}

function markInvalid() {
  passwordField.classList.add("is-invalid");
  loginCard.classList.remove("shake");
  void loginCard.offsetWidth;
  loginCard.classList.add("shake");
  passwordInput.focus({ preventScroll: true });
  passwordInput.select();
}

function clearInvalid() {
  passwordField.classList.remove("is-invalid");
}

function createAmbientHearts() {
  if (reducedMotion) return;

  const palette = [
    "rgba(226, 106, 141, 0.42)",
    "rgba(245, 143, 174, 0.34)",
    "rgba(215, 165, 125, 0.32)",
    "rgba(255, 184, 204, 0.5)",
  ];

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 18; i += 1) {
    const heart = document.createElement("span");
    heart.className = "ambient-heart";
    heart.style.left = `${2 + Math.random() * 96}%`;
    heart.style.top = `${4 + Math.random() * 92}%`;
    heart.style.setProperty("--size", `${7 + Math.random() * 13}px`);
    heart.style.setProperty("--color", palette[Math.floor(Math.random() * palette.length)]);
    heart.style.setProperty("--duration", `${10 + Math.random() * 10}s`);
    heart.style.setProperty("--delay", `${-Math.random() * 18}s`);
    heart.style.setProperty("--alpha", (0.45 + Math.random() * 0.45).toFixed(2));
    fragment.appendChild(heart);
  }

  ambientHearts.appendChild(fragment);
}

function createBalloon(initial) {
  const balloon = document.createElement("span");
  balloon.className = "balloon";

  const mobile = window.innerWidth < 600;
  const size = (mobile ? 32 : 40) + Math.random() * (mobile ? 32 : 46);
  const color = balloonPalette[Math.floor(Math.random() * balloonPalette.length)];
  const duration = 9 + Math.random() * 7;
  const delay = initial ? -Math.random() * duration : 0;
  const drift = (Math.random() * 2 - 1) * (mobile ? 34 : 62);

  balloon.style.setProperty("--left", `${2 + Math.random() * 93}%`);
  balloon.style.setProperty("--width", `${size.toFixed(1)}px`);
  balloon.style.setProperty("--light", color.light);
  balloon.style.setProperty("--dark", color.dark);
  balloon.style.setProperty("--duration", `${duration.toFixed(2)}s`);
  balloon.style.setProperty("--delay", `${delay.toFixed(2)}s`);
  balloon.style.setProperty("--drift", `${drift.toFixed(1)}px`);
  balloon.style.setProperty("--alpha", (0.72 + Math.random() * 0.24).toFixed(2));
  balloon.style.setProperty("--top", `${Math.random() * 80}%`);

  balloon.addEventListener("animationend", () => balloon.remove(), { once: true });
  balloonsLayer.appendChild(balloon);
}

function createSpark(initial) {
  const spark = document.createElement("span");
  spark.className = "spark";

  const duration = 3.6 + Math.random() * 4.2;
  const delay = initial ? -Math.random() * duration : 0;

  spark.style.setProperty("--left", `${1 + Math.random() * 97}%`);
  spark.style.setProperty("--size", `${5 + Math.random() * 8}px`);
  spark.style.setProperty("--color", sparklePalette[Math.floor(Math.random() * sparklePalette.length)]);
  spark.style.setProperty("--duration", `${duration.toFixed(2)}s`);
  spark.style.setProperty("--delay", `${delay.toFixed(2)}s`);
  spark.style.setProperty("--drift", `${(Math.random() * 2 - 1) * 70}px`);

  spark.addEventListener("animationend", () => spark.remove(), { once: true });
  sparklesLayer.appendChild(spark);
}

function startCelebration() {
  if (state.celebrating || reducedMotion) return;
  state.celebrating = true;

  balloonsLayer.replaceChildren();
  sparklesLayer.replaceChildren();

  const mobile = window.innerWidth < 600;
  const initialBalloons = mobile ? 10 : 16;
  const maxBalloons = mobile ? 20 : 32;

  for (let i = 0; i < initialBalloons; i += 1) {
    createBalloon(true);
  }

  for (let i = 0; i < 16; i += 1) {
    createSpark(true);
  }

  timers.balloons = window.setInterval(() => {
    if (balloonsLayer.childElementCount < maxBalloons) {
      createBalloon(false);
      if (window.innerWidth >= 600) createBalloon(false);
    }
  }, mobile ? 900 : 700);

  timers.sparkles = window.setInterval(() => {
    if (sparklesLayer.childElementCount < 40) {
      createSpark(false);
      createSpark(false);
    }
  }, 900);
}

function stopCelebration() {
  state.celebrating = false;

  if (timers.balloons) {
    window.clearInterval(timers.balloons);
    timers.balloons = null;
  }

  if (timers.sparkles) {
    window.clearInterval(timers.sparkles);
    timers.sparkles = null;
  }

  balloonsLayer.replaceChildren();
  sparklesLayer.replaceChildren();
}

function resetEnvelope() {
  envelope.classList.remove("is-open");
  state.envelopeOpening = false;
}

function restartExperience() {
  stopCelebration();
  resetEnvelope();
  state.submitting = false;
  passwordInput.value = "";
  passwordInput.type = "password";
  togglePassword.setAttribute("aria-pressed", "false");
  togglePassword.setAttribute("aria-label", "Hiện mật khẩu");
  clearInvalid();
  showLoginMessage("");
  setScreen("login");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (state.submitting) return;

  const value = passwordInput.value.trim();

  if (!value) {
    showLoginMessage("Anh nhập mật khẩu giúp em nhé!");
    markInvalid();
    return;
  }

  if (value.toLocaleLowerCase("vi") !== CONFIG.password.toLocaleLowerCase("vi")) {
    showLoginMessage("Mật khẩu chưa đúng rồi, thử lại nhé! ❤️");
    markInvalid();
    return;
  }

  state.submitting = true;
  clearInvalid();
  showLoginMessage("Đúng rồi, mở món quà nhé!", "success");
  passwordInput.blur();

  window.setTimeout(() => {
    state.submitting = false;
    setScreen("envelope");
  }, 480);
});

passwordInput.addEventListener("input", () => {
  clearInvalid();
  if (!loginMessage.classList.contains("is-success")) {
    showLoginMessage("");
  }
});

togglePassword.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  togglePassword.setAttribute("aria-pressed", String(!showing));
  togglePassword.setAttribute("aria-label", showing ? "Hiện mật khẩu" : "Ẩn mật khẩu");
  passwordInput.focus({ preventScroll: true });
});

envelope.addEventListener("click", () => {
  if (state.envelopeOpening) return;
  state.envelopeOpening = true;
  envelope.classList.add("is-open");

  window.setTimeout(() => {
    setScreen("celebration");
  }, 1150);
});

restartButton.addEventListener("click", restartExperience);

loginHint.textContent = CONFIG.hint;
createAmbientHearts();

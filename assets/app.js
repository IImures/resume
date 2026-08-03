const key = "resume-theme";
const defaultTheme = "dark";

const root = document.documentElement;
const btn = document.getElementById("themeToggle");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function applyTheme(theme, persist = true) {
  root.dataset.theme = theme;

  if (persist) {
    localStorage.setItem(key, theme);
  }
}

function initAmbientGradientMotion() {
  const blobs = Array.from(document.querySelectorAll(".ambient__blob"));

  if (!blobs.length) {
    return;
  }

  let frameId = 0;

  const states = [
    {
      element: blobs[0],
      ax: 8,
      ay: 6,
      sx: 0.42,
      sy: 0.35,
      px: 0.2,
      py: 1.1,
      po: 0.4,
      baseScale: 1,
      ampScale: 0.14,
      baseOpacity: 0.92,
      ampOpacity: 0.08,
    },
    {
      element: blobs[1],
      ax: 10,
      ay: 8,
      sx: 0.34,
      sy: 0.28,
      px: 1.6,
      py: 0.5,
      po: 1.2,
      baseScale: 1.04,
      ampScale: 0.18,
      baseOpacity: 0.78,
      ampOpacity: 0.12,
    },
    {
      element: blobs[2],
      ax: 9,
      ay: 7,
      sx: 0.26,
      sy: 0.31,
      px: 2.4,
      py: 0.9,
      po: 2.1,
      baseScale: 1.08,
      ampScale: 0.16,
      baseOpacity: 0.72,
      ampOpacity: 0.14,
    },
    {
      element: blobs[3],
      ax: 7,
      ay: 9,
      sx: 0.38,
      sy: 0.24,
      px: 3.1,
      py: 1.8,
      po: 2.8,
      baseScale: 0.96,
      ampScale: 0.2,
      baseOpacity: 0.56,
      ampOpacity: 0.12,
    },
  ];

  const animate = (time) => {
    const motionFactor = reduceMotionQuery.matches ? 0.00035 : 0.0012;
    const movementFactor = reduceMotionQuery.matches ? 0.35 : 1;
    const opacityFactor = reduceMotionQuery.matches ? 0.45 : 1;
    const t = time * motionFactor;

    for (const state of states) {
      const x = Math.sin(t * state.sx + state.px) * state.ax * movementFactor;
      const y = Math.cos(t * state.sy + state.py) * state.ay * movementFactor;
      const scale = state.baseScale + Math.sin(t * 0.55 + state.px) * state.ampScale * movementFactor;
      const opacity = state.baseOpacity + Math.sin(t * 0.7 + state.po) * state.ampOpacity * opacityFactor;

      state.element.style.transform = `translate3d(${x}vw, ${y}vh, 0) scale(${scale.toFixed(3)})`;
      state.element.style.opacity = opacity.toFixed(3);
    }

    frameId = window.requestAnimationFrame(animate);
  };

  const start = () => {
    if (!frameId) {
      frameId = window.requestAnimationFrame(animate);
    }
  };

  const stop = () => {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  reduceMotionQuery.addEventListener("change", () => {
    stop();
    start();
  });

  start();
}

const savedTheme = localStorage.getItem(key);
applyTheme(savedTheme || defaultTheme, Boolean(savedTheme));

btn?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
});

initAmbientGradientMotion();
document.getElementById("year").textContent = new Date().getFullYear();
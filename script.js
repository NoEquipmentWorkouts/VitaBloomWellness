// === VITA BLOOM COUNTDOWN SCRIPT ===
// - Starts at random: 827–999
// - Drops 1 every 30–45 seconds
// - Never goes below 682
// - Persists on refresh
// - Embedded safely in HTML or external .js

document.addEventListener("DOMContentLoaded", function () {
  const MIN_SAFE = 682;        // Hard floor — never go below
  const START_MIN = 827;       // Min starting value
  const START_MAX = 999;       // Max starting value
  const MIN_INTERVAL = 30000;  // 30 seconds
  const MAX_INTERVAL = 45000;  // 45 seconds

  const spotsElement = document.getElementById('spots');
  if (!spotsElement) {
    console.warn("Countdown element #spots not found.");
    return;
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function loadState() {
    try {
      const saved = localStorage.getItem('vitabloom_count');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not read localStorage.", e);
    }
    return null;
  }

  function saveState(state) {
    try {
      localStorage.setItem('vitabloom_count', JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save to localStorage.", e);
    }
  }

  let state = loadState();

  // Initialize or reset state if invalid
  if (!state || typeof state.count !== 'number' || state.count < MIN_SAFE) {
    state = {
      count: randomBetween(START_MIN, START_MAX),
      nextDrop: Date.now() + randomBetween(MIN_INTERVAL, MAX_INTERVAL)
    };
    saveState(state);
  }

  // Force stop at MIN_SAFE
  if (state.count <= MIN_SAFE) {
    state.count = MIN_SAFE;
    spotsElement.textContent = MIN_SAFE;
    return; // Stop all future drops
  }

  // Display current count
  spotsElement.textContent = state.count;

  // Recursive function to schedule next drop
  function scheduleNextDrop() {
    if (state.count <= MIN_SAFE) return;

    const now = Date.now();
    const delay = Math.max(state.nextDrop - now, 0);

    setTimeout(() => {
      if (state.count > MIN_SAFE) {
        state.count -= 1;
        state.nextDrop = now + randomBetween(MIN_INTERVAL, MAX_INTERVAL);
        spotsElement.textContent = state.count;
        saveState(state);
      }
      if (state.count > MIN_SAFE) {
        scheduleNextDrop();
      }
    }, delay);
  }

  // Start countdown
  scheduleNextDrop();
});
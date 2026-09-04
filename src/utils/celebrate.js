import confetti from "canvas-confetti";

const GOLD_COLORS = ["#ffd700", "#ffb300", "#ff8f00", "#fff8e1", "#ffffff"];
const PURPLE_COLORS = ["#7651a8", "#9b73cf", "#e2d2ff", "#ffffff", "#b39ddb"];
const ADVENTURE_COLORS = [
  "#ffd700", "#ff8f00", "#7651a8", "#4f8a63", "#ffffff",
];

export function celebrate() {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = [
    "#2563eb",
    "#22c55e",
    "#facc15",
    "#ffffff",
  ];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 80,
      origin: { x: 0 },
      colors,
      shapes: ["circle", "square"],
    });

    confetti({
      particleCount: 4,
      angle: 120,
      spread: 80,
      origin: { x: 1 },
      colors,
      shapes: ["circle", "square"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  confetti({
    particleCount: 120,
    spread: 110,
    startVelocity: 55,
    origin: { y: 0.6 },
    colors,
    scalar: 1.2,
  });
}

export function celebrateQuestComplete() {
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 40,
    origin: { y: 0.65 },
    colors: PURPLE_COLORS,
    shapes: ["circle", "square"],
    scalar: 1.1,
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 90,
      startVelocity: 35,
      origin: { y: 0.7, x: 0.3 },
      colors: GOLD_COLORS,
      shapes: ["circle"],
    });
    confetti({
      particleCount: 50,
      spread: 90,
      startVelocity: 35,
      origin: { y: 0.7, x: 0.7 },
      colors: GOLD_COLORS,
      shapes: ["circle"],
    });
  }, 200);
}

export function celebrateAdventureComplete() {
  const duration = 4000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 85,
      origin: { x: 0, y: 0.6 },
      colors: ADVENTURE_COLORS,
      shapes: ["circle", "square"],
    });

    confetti({
      particleCount: 5,
      angle: 120,
      spread: 85,
      origin: { x: 1, y: 0.6 },
      colors: ADVENTURE_COLORS,
      shapes: ["circle", "square"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 120,
      startVelocity: 60,
      origin: { y: 0.55 },
      colors: ADVENTURE_COLORS,
      scalar: 1.3,
      shapes: ["circle", "square"],
    });
  }, 300);

  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 140,
      startVelocity: 50,
      origin: { y: 0.6 },
      colors: GOLD_COLORS,
      scalar: 1.5,
    });
  }, 800);
}

export function celebrateStreak(milestone) {
  const count = milestone >= 10 ? 60 : milestone >= 5 ? 40 : 25;

  confetti({
    particleCount: count,
    spread: 60,
    startVelocity: 30,
    origin: { y: 0.4 },
    colors: GOLD_COLORS,
    shapes: ["circle"],
    scalar: 0.9,
    gravity: 1.2,
  });
}

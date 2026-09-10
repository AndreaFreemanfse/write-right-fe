import "./QuestHUD.css";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getTimerClass(seconds) {
  if (seconds <= 5) return "hud-timer critical";
  if (seconds <= 10) return "hud-timer danger";
  if (seconds <= 30) return "hud-timer warning";
  return "hud-timer";
}

function QuestHUD({ lives, streak, timer, xp }) {
  const maxLives = 3;
  const hearts = [];

  for (let i = 0; i < maxLives; i++) {
    hearts.push(
      <span
        key={i}
        className={i < lives ? "hud-heart full" : "hud-heart empty"}
        aria-hidden="true"
      >
        {i < lives ? "❤️" : "🤍"}
      </span>,
    );
  }

  const multiplier = streak >= 10 ? 5 : streak >= 5 ? 3 : streak >= 3 ? 2 : 1;

  return (
    <div className="quest-hud" role="status" aria-label="Quest status">
      <div className="hud-hearts" aria-label={`${lives} lives remaining`}>
        {hearts}
      </div>

      {streak > 0 && (
        <div
          className={`hud-streak ${streak >= 3 ? "hot" : ""}`}
          key={streak}
        >
          <span className="hud-streak-icon" aria-hidden="true">🔥</span>
          <span className="hud-streak-count">x{streak}</span>
          {multiplier > 1 && (
            <span className="hud-streak-multi">{multiplier}x</span>
          )}
        </div>
      )}

      <div className={getTimerClass(timer)}>
        <span className="hud-timer-icon" aria-hidden="true">⏱️</span>
        <span className="hud-timer-value">{formatTime(timer)}</span>
      </div>

      <div className="hud-xp" aria-label={`${xp} experience points`}>
        <span className="hud-xp-icon" aria-hidden="true">★</span>
        <span className="hud-xp-value">{xp}</span>
      </div>
    </div>
  );
}

export default QuestHUD;

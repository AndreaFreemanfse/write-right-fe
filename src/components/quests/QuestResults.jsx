import { useEffect } from "react";
import { celebrateAdventureComplete } from "../../utils/celebrate";
import "./QuestResults.css";

function QuestResults({
  stats,
  targetLanguage,
  lives,
  bestStreak,
  xp,
  onClose,
  onPlayAgain,
}) {
  const totalAttempts =
    stats.correct + stats.incorrect;

  const accuracy =
    totalAttempts === 0
      ? 0
      : Math.round(
          (stats.correct / totalAttempts) * 100,
        );

  const isPerfect = accuracy === 100 && totalAttempts > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      celebrateAdventureComplete();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="quest-results-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-results-title"
    >
      <div className="quest-results-card">
        <div
          className={`quest-results-icon ${isPerfect ? "perfect" : ""}`}
          aria-hidden="true"
        >
          🏆
        </div>

        <p className="quest-results-eyebrow">
          ADVENTURE COMPLETE
        </p>

        <h2 id="quest-results-title">
          Quest Complete!
        </h2>

        <p className="quest-results-language">
          {targetLanguage} Practice
        </p>

        <div className="quest-results-score">
          <strong>{accuracy}%</strong>
          <span>Accuracy</span>
        </div>

        <div className="quest-results-game-stats">
          <div className="quest-results-stat">
            <span className="stat-icon" aria-hidden="true">★</span>
            <strong>{xp}</strong>
            <span>XP Earned</span>
          </div>

          <div className="quest-results-stat">
            <span className="stat-icon" aria-hidden="true">🔥</span>
            <strong>{bestStreak}x</strong>
            <span>Best Streak</span>
          </div>

          <div className="quest-results-stat">
            <span className="stat-icon" aria-hidden="true">❤️</span>
            <strong>{lives}</strong>
            <span>Hearts Left</span>
          </div>
        </div>

        <div className="quest-results-summary">
          <div>
            <strong>{stats.correct}</strong>
            <span>Correct</span>
          </div>

          <div>
            <strong>{stats.incorrect}</strong>
            <span>Mistakes</span>
          </div>

          <div>
            <strong>{totalAttempts}</strong>
            <span>Attempts</span>
          </div>
        </div>

        <div className="quest-results-breakdown">
          <h3>Quest Breakdown</h3>

          <div>
            <span>✍️ Fill in the Blank</span>
            <strong>
              {stats.fillBlankAttempts} attempts
            </strong>
          </div>

          <div>
            <span>✨ Spelling Challenge</span>
            <strong>
              {stats.spellingAttempts} attempts
            </strong>
          </div>

          <div>
            <span>🧩 Matching Game</span>
            <strong>
              {stats.matchingAttempts} attempts
            </strong>
          </div>
        </div>

        {isPerfect && (
          <div className="quest-results-perfect">
            ⭐ Perfect Score! You aced every question!
          </div>
        )}

        <div className="quest-results-actions">
          <button
            type="button"
            className="quest-results-again"
            onClick={onPlayAgain}
          >
            Play Again
          </button>

          <button
            type="button"
            className="quest-results-finish"
            onClick={onClose}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestResults;

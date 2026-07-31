import { useEffect, useState } from "react";
import "./AccuracyModal.css";

function AccuracyCategory({
  label,
  value,
  color,
  isOpen,
}) {
  const [displayValue, setDisplayValue] = useState(0);

  const safeValue = Math.min(
    100,
    Math.max(0, value ?? 0),
  );

  useEffect(() => {
    if (!isOpen) {
      setDisplayValue(0);
      return;
    }

    const delay = 250;
    const animationDuration = 700;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      let animationFrame;

      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(
          elapsed / animationDuration,
          1,
        );

        const easedProgress =
          1 - Math.pow(1 - progress, 3);

        setDisplayValue(
          Math.round(safeValue * easedProgress),
        );

        if (progress < 1) {
          animationFrame =
            requestAnimationFrame(animate);
        }
      }

      animationFrame =
        requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen, safeValue]);

  return (
    <div className="accuracy-category">
      <div className="accuracy-category-header">
        <span>{label}</span>
        <strong>{displayValue}%</strong>
      </div>

      <div className="accuracy-category-track">
        <div
          className="accuracy-category-progress"
          style={{
            width: `${displayValue}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function AccuracyModal({ isOpen, onClose, accuracy }) {
  const [displayScore, setDisplayScore] = useState(0);

  const score = Math.min(
    100,
    Math.max(0, accuracy?.score ?? 0),
  );

  const categories = {
    grammar: accuracy?.categories?.grammar ?? 0,
    vocabulary: accuracy?.categories?.vocabulary ?? 0,
    spelling: accuracy?.categories?.spelling ?? 0,
    sentenceStructure:
      accuracy?.categories?.sentenceStructure ?? 0,
  };

  function getScoreLabel() {
    if (score < 50) return "Keep Building";
    if (score < 75) return "Good Progress";
    if (score < 99) return "Strong Writing";

    return "Excellent Accuracy";
  }

  function getRingColor() {
    if (score < 50) return "#ef4444";
    if (score < 75) return "#f59e0b";
    if (score < 99) return "#22c55e";

    return "#059669";
  }

  useEffect(() => {
    if (!isOpen) {
      setDisplayScore(0);
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    const animationDuration = 900;
    const startTime = performance.now();
    let animationFrame;

    function animateScore(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(
        elapsed / animationDuration,
        1,
      );

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setDisplayScore(
        Math.round(score * easedProgress),
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animateScore);
      }
    }

    animationFrame =
      requestAnimationFrame(animateScore);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      cancelAnimationFrame(animationFrame);
    };
  }, [isOpen, onClose, score]);

  if (!isOpen) {
    return null;
  }

  const ringColor = getRingColor();

  return (
    <div
      className="accuracy-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="accuracy-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accuracy-modal-title"
      >
        <button
          type="button"
          className="accuracy-close-button"
          onClick={onClose}
          aria-label="Close accuracy details"
        >
          ✕
        </button>

        <h2 id="accuracy-modal-title">
          Writing Accuracy
        </h2>

        <div
          className="accuracy-progress-ring"
          style={{
            background: `conic-gradient(
              ${ringColor} ${displayScore * 3.6}deg,
              #e5e7eb ${displayScore * 3.6}deg
            )`,
          }}
        >
          <div className="accuracy-progress-ring-center">
            <span className="accuracy-progress-score">
              {displayScore}%
            </span>

            <span className="accuracy-progress-label">
              {getScoreLabel()}
            </span>
          </div>
        </div>

        <p className="accuracy-modal-summary">
          {accuracy?.summary ??
            "Review your writing strengths and areas for improvement."}
        </p>

        <div className="accuracy-category-list">
          <AccuracyCategory
            label="Grammar"
            value={categories.grammar}
            color={ringColor}
            isOpen={isOpen}
          />

          <AccuracyCategory
            label="Vocabulary"
            value={categories.vocabulary}
            color={ringColor}
            isOpen={isOpen}
          />

          <AccuracyCategory
            label="Spelling"
            value={categories.spelling}
            color={ringColor}
            isOpen={isOpen}
          />

          <AccuracyCategory
            label="Sentence Structure"
            value={categories.sentenceStructure}
            color={ringColor}
            isOpen={isOpen}
          />
        </div>

        <p className="accuracy-improvement-note">
          <strong>Next step:</strong>{" "}
          {accuracy?.improvementNote ??
            "Continue practicing with another journal entry."}
        </p>
      </div>
    </div>
  );
}

export default AccuracyModal;
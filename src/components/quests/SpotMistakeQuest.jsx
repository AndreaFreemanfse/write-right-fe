import { useMemo, useState } from "react";

import QuestHUD from "./QuestHUD";

import "./SpotMistakeQuest.css";

function buildSentenceParts(sentence, incorrect) {
  if (!sentence || !incorrect) {
    return [];
  }

  const sentenceLower = sentence.toLowerCase();
  const incorrectLower = incorrect.toLowerCase();

  const incorrectStart = sentenceLower.indexOf(incorrectLower);

  // Fallback if the saved mistake cannot be found exactly
  // inside the stored full sentence.
  if (incorrectStart === -1) {
    return sentence
      .split(/\s+/)
      .filter(Boolean)
      .map((text, index) => ({
        id: `word-${index}`,
        text,
        isIncorrect: false,
      }));
  }

  const incorrectEnd = incorrectStart + incorrect.length;

  const before = sentence.slice(0, incorrectStart).trim();
  const incorrectText = sentence.slice(
    incorrectStart,
    incorrectEnd,
  );
  const after = sentence.slice(incorrectEnd).trim();

  const parts = [];

  if (before) {
    before
      .split(/\s+/)
      .filter(Boolean)
      .forEach((text, index) => {
        parts.push({
          id: `before-${index}`,
          text,
          isIncorrect: false,
        });
      });
  }

  parts.push({
    id: "incorrect",
    text: incorrectText,
    isIncorrect: true,
  });

  if (after) {
    after
      .split(/\s+/)
      .filter(Boolean)
      .forEach((text, index) => {
        parts.push({
          id: `after-${index}`,
          text,
          isIncorrect: false,
        });
      });
  }

  return parts;
}

function SpotMistakeQuest({
  quest,
  onClose,
  onComplete,
  onAttempt,
  lives,
  streak,
  timer,
  xp,
}) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");

  const sentenceParts = useMemo(
    () =>
      buildSentenceParts(
        quest.sentence,
        quest.incorrect,
      ),
    [quest.sentence, quest.incorrect],
  );

  function handlePartClick(part) {
    if (solved) {
      return;
    }

    setSelectedPart(part.id);

    if (part.isIncorrect) {
      onAttempt(true);
      setSolved(true);
      setFeedback("You found it!");
      return;
    }

    onAttempt(false);
    setFeedback("Not quite — try another part of the sentence.");
  }

  return (
    <div
      className="spot-mistake-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spot-mistake-title"
    >
      <QuestHUD
        lives={lives}
        streak={streak}
        timer={timer}
        xp={xp}
      />

      <div className="spot-mistake-card">
        <button
          type="button"
          className="spot-mistake-close"
          onClick={onClose}
          aria-label="Close Quest Mode"
        >
          ×
        </button>

        <p className="spot-mistake-progress">
          Quest 1 of 3
        </p>

        <div
          className="spot-mistake-icon"
          aria-hidden="true"
        >
          🔎
        </div>

        <h2 id="spot-mistake-title">
          Spot the Mistake
        </h2>

        <p className="spot-mistake-instructions">
          One part of this sentence is incorrect. Click
          the word or phrase that contains the mistake.
        </p>

        <div
          className="spot-mistake-sentence"
          aria-label={quest.sentence}
        >
          {sentenceParts.map((part) => {
            let className = "spot-mistake-part";

            if (
              selectedPart === part.id &&
              !part.isIncorrect &&
              !solved
            ) {
              className += " incorrect-choice";
            }

            if (solved && part.isIncorrect) {
              className += " correct-choice";
            }

            return (
              <button
                key={part.id}
                type="button"
                className={className}
                onClick={() => handlePartClick(part)}
                disabled={solved}
              >
                {part.text}
              </button>
            );
          })}
        </div>

        <p className="spot-mistake-hint">
          Hint: {quest.hint}
        </p>

        {feedback && (
          <div
            className={
              solved
                ? "spot-mistake-feedback correct"
                : "spot-mistake-feedback incorrect"
            }
          >
            <strong>
              {solved ? "✓ Correct!" : "Not quite!"}
            </strong>

            <p>{feedback}</p>
          </div>
        )}

        {solved && (
          <div className="spot-mistake-solution">
            <p className="spot-mistake-correction-label">
              Correction
            </p>

            <div className="spot-mistake-correction">
              <span className="spot-mistake-wrong">
                {quest.incorrect}
              </span>

              <span
                className="spot-mistake-arrow"
                aria-hidden="true"
              >
                →
              </span>

              <span className="spot-mistake-right">
                {quest.corrected}
              </span>
            </div>

            {quest.corrected_sentence && (
              <p className="spot-mistake-corrected-sentence">
                {quest.corrected_sentence}
              </p>
            )}

            <p className="spot-mistake-explanation">
              {quest.explanation}
            </p>

            <button
              type="button"
              className="spot-mistake-next"
              onClick={onComplete}
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotMistakeQuest;
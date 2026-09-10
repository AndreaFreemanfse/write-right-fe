import { useState } from "react";
import QuestHUD from "./QuestHUD";
import "./SpellingQuest.css";

function SpellingQuest({ quest, onClose, onComplete, onAttempt, lives, streak, timer, xp }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const items = quest?.items || [];
  const currentItem = items[currentIndex];

  if (!currentItem) {
    return null;
  }

  const isCorrect =
    answer.trim().toLowerCase() ===
    currentItem.word.trim().toLowerCase();

  const isLastItem = currentIndex === items.length - 1;

  function handleSubmit(event) {
    event.preventDefault();

    if (!answer.trim()) {
      return;
    }

    const correct =
      answer.trim().toLowerCase() ===
      currentItem.word.trim().toLowerCase();

    onAttempt(correct);
    setSubmitted(true);
  }

  function handleNext() {
    if (isLastItem) {
      onComplete();
      return;
    }

    setCurrentIndex((index) => index + 1);
    setAnswer("");
    setSubmitted(false);
  }

  return (
    <div
      className="spelling-quest-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spelling-quest-title"
    >
      <QuestHUD lives={lives} streak={streak} timer={timer} xp={xp} />

      <div className="spelling-quest-card">
        <button
          type="button"
          className="spelling-quest-close"
          onClick={onClose}
          aria-label="Close Quest Mode"
        >
          ×
        </button>

        <p className="spelling-quest-progress">
          Quest 2 of 3
        </p>

        <div
          className="spelling-quest-icon"
          aria-hidden="true"
        >
          ✨
        </div>

        <h2 id="spelling-quest-title">
          Spelling Challenge
        </h2>

        <p className="spelling-quest-counter">
          Word {currentIndex + 1} of {items.length}
        </p>

        <p className="spelling-quest-instructions">
          Use the clue to spell the corrected word.
        </p>

        <div className="spelling-quest-clue">
          <span>Clue</span>
          <p>{currentItem.clue}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="spelling-quest-input"
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              setSubmitted(false);
            }}
            placeholder="Type the word..."
            autoFocus
          />

          {!submitted && (
            <button
              type="submit"
              className="spelling-quest-submit"
            >
              Check Spelling
            </button>
          )}
        </form>

        {submitted && (
          <div
            className={
              isCorrect
                ? "spelling-quest-feedback correct"
                : "spelling-quest-feedback incorrect"
            }
          >
            <strong>
              {isCorrect
                ? "✓ Correct!"
                : "Not quite!"}
            </strong>

            <p>
              {isCorrect
                ? `You spelled "${currentItem.word}" correctly.`
                : "Check the clue and try again."}
            </p>

            {isCorrect && (
              <button
                type="button"
                className="spelling-quest-next"
                onClick={handleNext}
              >
                {isLastItem
                  ? "Continue →"
                  : "Next Word →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SpellingQuest;

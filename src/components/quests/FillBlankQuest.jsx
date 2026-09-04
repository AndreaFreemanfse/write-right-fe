import { useState } from "react";
import QuestHUD from "./QuestHUD";
import "./FillBlankQuest.css";

function FillBlankQuest({ quest, onClose, onComplete, onAttempt, lives, streak, timer, xp }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isCorrect =
    answer.trim().toLowerCase() ===
    quest.answer.trim().toLowerCase();

  function handleSubmit(event) {
    event.preventDefault();

    if (!answer.trim()) {
      return;
    }

    const correct =
      answer.trim().toLowerCase() ===
      quest.answer.trim().toLowerCase();

    onAttempt(correct);
    setSubmitted(true);
  }

  return (
    <div
      className="fill-blank-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fill-blank-title"
    >
      <QuestHUD lives={lives} streak={streak} timer={timer} xp={xp} />

      <div className="fill-blank-card">
        <button
          type="button"
          className="fill-blank-close"
          onClick={onClose}
          aria-label="Close Quest Mode"
        >
          ×
        </button>

        <p className="fill-blank-progress">
          Quest 1 of 3
        </p>

        <div
          className="fill-blank-icon"
          aria-hidden="true"
        >
          ✍️
        </div>

        <h2 id="fill-blank-title">
          Fill in the Blank
        </h2>

        <p className="fill-blank-instructions">
          Complete the sentence using the correct word
          or phrase.
        </p>

        <div className="fill-blank-sentence">
          {quest.sentence}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="fill-blank-input"
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              setSubmitted(false);
            }}
            placeholder="Type your answer..."
            autoFocus
          />

          <p className="fill-blank-hint">
            Hint: {quest.hint}
          </p>

          {!submitted && (
            <button
              type="submit"
              className="fill-blank-submit"
            >
              Check Answer
            </button>
          )}
        </form>

        {submitted && (
        <div
          className={
            isCorrect
              ? "fill-blank-feedback correct"
              : "fill-blank-feedback incorrect"
          }
        >
          <strong>
            {isCorrect ? "✓ Correct!" : "Not quite!"}
          </strong>

          <p>
            {isCorrect
              ? quest.explanation
              : "Try again using the hint above."}
          </p>

          {isCorrect && (
            <button
              type="button"
              className="fill-blank-next"
              onClick={onComplete}
            >
              Continue →
            </button>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

export default FillBlankQuest;

import { useMemo, useState } from "react";
import QuestHUD from "./QuestHUD";
import "./MatchingQuest.css";

function MatchingQuest({ quest, onClose, onComplete, onAttempt, lives, streak, timer, xp }) {
  const pairs = quest?.pairs || [];

  const matches = useMemo(
    () =>
        pairs
        .map((pair, index) => ({
            ...pair,
            id: index,
        }))
        .sort(() => Math.random() - 0.5),
    [pairs],
    );

  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [completedPrompts, setCompletedPrompts] = useState([]);
  const [completedMatchIds, setCompletedMatchIds] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [questComplete, setQuestComplete] = useState(false);

  function checkPair(prompt, matchItem) {
    const correctPair = pairs.find(
      (pair) =>
        pair.prompt === prompt &&
        pair.match === matchItem.match,
    );

    const isCorrect = Boolean(correctPair);

    onAttempt(isCorrect);

    if (isCorrect) {
      const newCompletedPrompts = [
        ...completedPrompts,
        prompt,
      ];

      setCompletedPrompts(newCompletedPrompts);

      setCompletedMatchIds((current) => [
        ...current,
        matchItem.id,
      ]);

      setFeedback("correct");

      if (newCompletedPrompts.length === pairs.length) {
        setQuestComplete(true);
      }
    } else {
      setFeedback("incorrect");
    }

    setSelectedPrompt(null);
    setSelectedMatch(null);
  }

  function handlePromptClick(prompt) {
    if (completedPrompts.includes(prompt)) {
      return;
    }

    setSelectedPrompt(prompt);
    setFeedback("");

    if (selectedMatch) {
      checkPair(prompt, selectedMatch);
    }
  }

  function handleMatchClick(matchItem) {
    if (completedMatchIds.includes(matchItem.id)) {
      return;
    }

    setSelectedMatch(matchItem);
    setFeedback("");

    if (selectedPrompt) {
      checkPair(selectedPrompt, matchItem);
    }
  }

  return (
    <div
      className="matching-quest-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="matching-quest-title"
    >
      <QuestHUD lives={lives} streak={streak} timer={timer} xp={xp} />

      <div className="matching-quest-card">
        <button
          type="button"
          className="matching-quest-close"
          onClick={onClose}
          aria-label="Close Quest Mode"
        >
          ×
        </button>

        <p className="matching-quest-progress">
          Quest 3 of 3
        </p>

        <div
          className="matching-quest-icon"
          aria-hidden="true"
        >
          🧩
        </div>

        <h2 id="matching-quest-title">
          Matching Game
        </h2>

        <p className="matching-quest-instructions">
          Match each journal mistake with its correction.
        </p>

        <div className="matching-quest-board">
          <div className="matching-quest-column">
            <h3>Your Writing</h3>

            {pairs.map((pair, index) => {
              const completed =
                completedPrompts.includes(pair.prompt);

              return (
                <button
                  type="button"
                  key={`${pair.prompt}-${index}`}
                  className={[
                    "matching-option",
                    selectedPrompt === pair.prompt
                      ? "selected"
                      : "",
                    completed ? "completed" : "",
                  ].join(" ")}
                  disabled={completed}
                  onClick={() =>
                    handlePromptClick(pair.prompt)
                  }
                >
                  {pair.prompt}
                </button>
              );
            })}
          </div>

          <div className="matching-quest-divider">
            ↔
          </div>

          <div className="matching-quest-column">
            <h3>Correction</h3>

            {matches.map((matchItem) => {
                const completed =
                    completedMatchIds.includes(matchItem.id);

                return (
                    <button
                    type="button"
                    key={matchItem.id}
                    className={[
                        "matching-option",
                        selectedMatch?.id === matchItem.id
                        ? "selected"
                        : "",
                        completed ? "completed" : "",
                    ].join(" ")}
                    disabled={completed}
                    onClick={() =>
                        handleMatchClick(matchItem)
                    }
                    >
                    {matchItem.match}
                    </button>
                );
                })}
          </div>
        </div>

        {feedback === "correct" && !questComplete && (
          <p className="matching-feedback correct">
            ✓ Match!
          </p>
        )}

        {feedback === "incorrect" && (
          <p className="matching-feedback incorrect">
            Not quite — try another combination.
          </p>
        )}

        {questComplete && (
          <div className="matching-complete">
            <strong>✓ Quest Complete!</strong>

            <p>
              You matched all of your journal corrections.
            </p>

            <button
              type="button"
              className="matching-finish"
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

export default MatchingQuest;

import { useEffect, useState } from "react";
import "./FlashcardStudy.css";

function FlashcardStudy({
  mistakes,
  corrections,
  onCreateStudySet,
  onSaveSet,
  savingSet,
  saveMessage,
  targetLanguage,
  nativeLanguage,
}) {
  const [queue, setQueue] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [masteredCount, setMasteredCount] = useState(0);
  const [attempt, setAttempt] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [studyStarted, setStudyStarted] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [exp_loading, setExpLoading] = useState(false);

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    setQueue(mistakes ?? []);
    setShowAnswer(false);
    setStreak(0);
    setMasteredCount(0);
    setAttempt("");
    setFeedback(null);
    setMistakeCount(0);
  }, [mistakes]);

  if (!mistakes?.length && !corrections?.length) {
    return null;
  }

  if (!studyStarted) {
    return (
      <section className="flashcard-study">
        <div className="study-start-actions">
          {mistakes?.length > 0 && (
            <button
              type="button"
              className="flashcard-button"
              onClick={() => setStudyStarted(true)}
            >
              ⚔️ Conquer {mistakes.length}{" "}
              {mistakes.length === 1 ? "Card" : "Cards"}
            </button>
          )}

          {corrections?.length > 0 && (
            <button
              type="button"
              className="flashcard-button"
              onClick={handleConquerAll}
            >
              ⚔️ Conquer All {corrections.length} Corrections
            </button>
          )}
        </div>
      </section>
    );
  }

if (queue.length === 0) {
  const perfectSession = mistakeCount === 0;

  return (
    <section className="flashcard-study">
      <article className="completion-card">
        <div
          className={`completion-card-inner ${
            perfectSession
              ? "completion-card-perfect"
              : "completion-card-standard"
          }`}
        >
          <div className="completion-card-front">
            <h2>Final card conquered!</h2>
          </div>

          <div className="completion-card-back">
            <h2>
              {perfectSession
                ? "You Crushed It!"
                : "All cards mastered!"}
            </h2>

            <p>Cards mastered: {masteredCount}</p>
            <p>Mistakes made: {mistakeCount}</p>
            <p>Final streak: {streak}</p>

            <button
              type="button"
              className="flashcard-button"
              onClick={onSaveSet}
              disabled={savingSet}
            >
              {savingSet
                ? "Saving..."
                : "Add Set to Flashcard Vault"}
            </button>

            {saveMessage && (
              <p className="flashcard-save-message">
                {saveMessage}
              </p>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}

async function explain(original, corrected, nativeLanguage, targetLanguage) {
    const response = await fetch(`${API_BASE_URL}/explanation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original: original,
        corrected: corrected,
        native_language: nativeLanguage,
        target_language: targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error("The explanation could not be generated.");
    }

    const data = await response.json();

    if (!data.explanation) {
      throw new Error("No explanation was returned.");
    }

    return {
      explanation: data.explanation,
      category: data.category
    };
  }

  const currentCard = queue[0];
  const remaining = queue.length;

  const currentNativeLanguage = nativeLanguage || "English";
  const currentTargetLanguage = targetLanguage || "English";

  function handleKnewIt() {
    setQueue((currentQueue) => currentQueue.slice(1));
    setMasteredCount((count) => count + 1);
    setStreak((currentStreak) => currentStreak + 1);
    setShowAnswer(false);
    setAttempt("");
    setFeedback(null);
  }

  function handlePracticeAgain() {
    setQueue((currentQueue) => [...currentQueue.slice(1), currentQueue[0]]);
    setStreak(0);
    setShowAnswer(false);
    setAttempt("");
    setFeedback(null);
  }

  function normalizeText(value = "") {
    return value
      .trim()
      .toLocaleLowerCase()
      .replace(/[.,!?;:]/g, "");
  }

  function handleSubmitAttempt(event) {
    event.preventDefault();

    const userAnswer = normalizeText(attempt);
    const correctedText =
      currentCard.corrected_text ?? currentCard.corrected ?? "";

    const correctAnswer = normalizeText(correctedText);

    if (userAnswer === correctAnswer) {
      setFeedback("correct");
      return;
    }
    setMistakeCount((count) => count + 1);
    setStreak(0);
    setFeedback("incorrect");
  }

  function handleConquerAll() {
    onCreateStudySet();
    setStudyStarted(true);
  }

  function renderUnderline(text) {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <u key={index}>{part.slice(2, -2)}</u>;
      }
      return part;
    });
  }

  async function generateExplanation() {
    setExpLoading(true);

    try {
      const response = await explain(
        currentCard.original_full,
        currentCard.corrected_full,
        currentNativeLanguage,
        currentTargetLanguage,
      );

      const updatedCard = {
        ...currentCard,
        explanation: response.explanation,
        category: response.category,
      };

      setQueue(prev =>
        prev.map(card =>
          card.original_full === updatedCard.original_full ? updatedCard : card
        )
      );

    } finally {
      setExpLoading(false);
    }
}

  return (
    <section className="flashcard-study">
      <div className="study-stats">
        <span>Streak: {streak}</span>
        <span>Remaining: {remaining}</span>
        <span>Mastered: {masteredCount}</span>
      </div>

      <article className="flashcard">
        {feedback === "correct" ? (
          <div className="answer-feedback correct-feedback">
            <h1>
              <strong>Correct!</strong>
            </h1>
          </div>
        ) : (
          <>
            <p className="flashcard-label">Correct this:</p>
            <h3>{renderUnderline(currentCard.original_full)}</h3>
          </>
        )}

        {!showAnswer ? (
          <form className="flashcard-attempt" onSubmit={handleSubmitAttempt}>
            {/* <label htmlFor="correction-attempt" className="flashcard-label">
              Type the corrected sentence
            </label> */}

            <input
              id="correction-attempt"
              value={attempt}
              onChange={(event) => {
                setAttempt(event.target.value);
                setFeedback(null);
              }}
              placeholder="Enter Correction..."
              autoComplete="off"
            />
            {feedback === "correct" ? (
              <button type="button" onClick={handleKnewIt}>
                Next card
              </button>
            ) : (
              <button type="submit" disabled={!attempt.trim()}>
                Check answer
              </button>
            )}

            {feedback === "incorrect" && (
              <div className="answer-feedback-incorrect-feedback">
                <div className="reveal-button">
                  <strong>Not quite—try again.</strong>
                  <button type="button" onClick={() => setShowAnswer(true)}>
                    Reveal answer
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          <div className="flashcard-answer">
            <p className="flashcard-label">Correct version:</p>
            <h3>{currentCard.corrected_full}</h3>
            {currentCard.explanation ? (
              <p>{currentCard.explanation}</p>
            ) : (
              <button
              className="generate-explanation-button"
              onClick={generateExplanation}
              disabled={exp_loading}
              >
                {exp_loading ? "Generating..." : "Generate Explanation"}
              </button>
            )}

            <div className="flashcard-actions">
              <button onClick={handleKnewIt}>Mark mastered</button>

              <button onClick={handlePracticeAgain}>Practice again</button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}

export default FlashcardStudy;

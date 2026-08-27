import { useMemo } from "react";
import { vocabulary } from "../data/vocabulary.js";
import "./AnalysisLoading.css";

function AnalysisLoading({ targetLanguage, loadingMessage, isEditing }) {
  const selectedWord = useMemo(() => {
    const normalizedLanguage = targetLanguage?.toLowerCase() || "english";

    const availableWords = vocabulary[normalizedLanguage] || vocabulary.english;

    const randomIndex = Math.floor(Math.random() * availableWords.length);

    return availableWords[randomIndex];
  }, [targetLanguage]);

  const displayLanguage = targetLanguage
    ? targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1)
    : "English";

  return (
    <main className="analysis-loading">
      <section className="analysis-loading__panel">
        <div className="analysis-loading__icon">{isEditing ? "✍️" : "✨"}</div>

        <h1>
          {isEditing ? "Updating your journal" : "Analyzing your journal"}
        </h1>

        <p className="analysis-loading__message">{loadingMessage}</p>

        <div className="analysis-loading__dots" aria-hidden="true">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>

        <div className="vocabulary-card">
          <p className="vocabulary-card__label">Word of the Day</p>

          <p className="vocabulary-card__language">{displayLanguage}</p>

          <h2>{selectedWord.word}</h2>

          {selectedWord.pronunciation && (
            <p className="vocabulary-card__pronunciation">
              {selectedWord.pronunciation}
            </p>
          )}

          <p className="vocabulary-card__meaning">{selectedWord.meaning}</p>
        </div>

        <div
          className={
            isEditing
              ? "Journal update in progress"
              : "Journal analysis in progress"
          }
          aria-label="Journal analysis in progress"
        >
          <div className="analysis-loading__progress-bar" />
        </div>
      </section>
    </main>
  );
}

export default AnalysisLoading;

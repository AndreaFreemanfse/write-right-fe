import { useState } from "react";

import Correction from "./Correction";

import "./JournalText.css";

import { useJournal } from "../context/JournalContext";

function JournalText({ onCreateFlashcard }) {
const {
  journalText,
  corrections,
  returnToEditor,
} = useJournal();

  // State to track the currently selected correction for tooltip display
  const [selectedCorrection, setSelectedCorrection] = useState(null);

  // Alias journalText so the rest of this component can keep using "text"
  const text = journalText;

  function renderTextWithCorrections() {
    // If there are no mistakes, just display the text
    if (!corrections || corrections.length === 0) {
      return text;
    }

    const parts = [];

    // Keeps track of where we are in the original text
    let currentIndex = 0;

    corrections.forEach((mistake, index) => {
      /**
       * Add the text BEFORE the mistake
       *
       * Example:
       *
       * "How are you"
       *
       * mistake:
       * Hww
       *
       * This adds everything before Hww
       */
      if (mistake.start > currentIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.slice(currentIndex, mistake.start)}
          </span>,
        );
      }

      /**
       * Add the correction component
       *
       * Example:
       *
       * Hww → How
       */
      parts.push(
        <Correction
          key={`mistake-${index}`}
          mistake={mistake}
          onCreateFlashcard={onCreateFlashcard}
          isOpen={selectedCorrection === index}
          onClose={() => setSelectedCorrection(null)}
          onClick={() =>
          setSelectedCorrection(selectedCorrection === index ? null : index)}
          onUpdateMistake={updateMistake}
        />,
      );

      /**
       * Move our pointer forward
       *
       * so we don't duplicate text
       */
      currentIndex = mistake.end;
    });

    /**
     * Add whatever text remains after the last mistake
     *
     * Example:
     *
     * " are you??"
     */
    if (currentIndex < text.length) {
      parts.push(
        <span key="remaining-text">
          {text.slice(currentIndex)}
        </span>,
      );
    }

    return parts;
  }

  return (
    <div className="journal-review">
      <div className="review-header">
        <h2>Your Journal Review</h2>

        <button onClick={returnToEditor} className="back-button">
          ← Back to Edit
        </button>
      </div>

      <div className="journal-content">
        {renderTextWithCorrections()}
      </div>
    </div>
  );
}

export default JournalText;
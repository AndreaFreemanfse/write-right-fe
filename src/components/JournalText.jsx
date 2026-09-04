import { useState } from "react";

import Correction from "./Correction";
import "./JournalText.css";

import { useJournal } from "../context/JournalContext";

function JournalText({ onCreateFlashcard }) {
  const {
    journalText,
    corrections,
    returnToEditor,
    handleNewEntry,
    editingEntry,
  } = useJournal();

  const [selectedCorrection, setSelectedCorrection] =
    useState(null);

  const text = journalText;

  function renderTextWithCorrections() {
    if (!corrections || corrections.length === 0) {
      return text;
    }

    const parts = [];
    let currentIndex = 0;

    corrections.forEach((mistake, index) => {
      if (mistake.start > currentIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.slice(currentIndex, mistake.start)}
          </span>,
        );
      }

      parts.push(
        <Correction
          key={`mistake-${index}`}
          mistake={mistake}
          onCreateFlashcard={onCreateFlashcard}
          isOpen={selectedCorrection === index}
          onClose={() => setSelectedCorrection(null)}
          onClick={() =>
            setSelectedCorrection(
              selectedCorrection === index
                ? null
                : index,
            )
          }
        />,
      );

      currentIndex = mistake.end;
    });

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

        <div className="review-actions">
          <button
            onClick={() =>
              returnToEditor(editingEntry)
            }
            className="review-button review-button--edit"
          >
            ← Edit Entry
          </button>

          <button
            onClick={handleNewEntry}
            className="review-button review-button--new"
          >
            + New Entry
          </button>
        </div>
      </div>

      <div className="journal-content">
        {renderTextWithCorrections()}
      </div>
    </div>
  );
}

export default JournalText;
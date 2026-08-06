import { useState, useRef, useEffect } from "react";
import "./CorrectionTooltip.css";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { API_BASE_URL } from "../config/api.js";


function CorrectionTooltip({ mistake, onCreateFlashcard, nativeLanguage, targetLanguage, onUpdateMistake }) {
  // Let's move this logic to BE so FE only gets clean data -------


  const currentNativeLanguage = nativeLanguage || "English";
  const currentTargetLanguage = targetLanguage || "English";
  
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

  useEffect(() => {
    async function generateExplanation() {

      if (mistake.loading) return;

      if (mistake.explanation != null) return;
      
      try {

        onUpdateMistake({
          ...mistake,
          loading: true,
        });

        const response = await explain(mistake.original_full, mistake.corrected_full, currentNativeLanguage, currentTargetLanguage)

        console.log("AI response:", response);

        onUpdateMistake({
              ...mistake,
              category: response.category,
              explanation: response.explanation,
              loading: false,
        });
      } catch (error) {
        console.error("Explanation generation failed:", error);
      }
      

    }
    
    generateExplanation();

  }, [mistake]);


  // Replaces all underscores with spaces
  function refineCategory(word = "") {
    if (!word) return "Loading...";
    const cleanWord = word.replace(/_/g, " ");

    return cleanWord;
  }

  // Helps set the badge color. If the response is one of the below options in the array, it assigns it a specific color, else it assigns it a general grey badge color
  function getBadgeCategory(word = "") {
    if (!word) return "other";
    const relevantCategories = [
      "spelling",
      "grammar",
      "vocabulary",
      "punctuation",
      "word choice",
    ];

    let cleanWord = refineCategory(word);
    return relevantCategories.includes(cleanWord) ? cleanWord : "other";
  }
  // ---------------------------------------------------------------------

  return (
    <div className="tooltip-container">
      <div className="tooltip-header">
        <span
          className={`category-badge ${getBadgeCategory(mistake.category)}`}
        >
          {refineCategory(mistake.category)}
        </span>
      </div>

      <div className="tooltip-body">
        <div className="tooltip-preview">
          <div className="tooltip-incorrect-container">
            <CloseOutlinedIcon className="close-icon" />
            <span className="tooltip-original">{mistake.original}</span>
          </div>
          <div className="tooltip-corrected-container">
            <CheckOutlinedIcon className="check-icon" />
            <span className="tooltip-corrected">{mistake.corrected}</span>
          </div>
        </div>

        <p className="tooltip-explanation">{mistake.explanation}</p>
      </div>

      <div className="tooltip-footer">
        <button
          type="button"
          className="flashcard-button"
          onClick={() => onCreateFlashcard(mistake)}
        >
          Create Flashcard
        </button>
      </div>
    </div>
  );
}

export default CorrectionTooltip;

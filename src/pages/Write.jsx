import { useState } from "react";
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../config/api";
import { useJournal } from "../context/JournalContext";

import JournalEditor from "../components/JournalEditor.jsx";
import JournalText from "../components/JournalText.jsx";
import FlashcardStudy from "../components/FlashcardStudy.jsx";
import AnalysisLoading from "../components/AnalysisLoading.jsx";
import AccuracySummary from "../components/accuracy/AccuracySummary";
import AccuracyModal from "../components/accuracy/AccuracyModal";

function Write() {
  const {
    corrections,
    reviewMode,
    loading,
    journalTitle,
    journalEntryId,
    accuracy,
  } = useJournal();

  const [flashcards, setFlashcards] = useState([]);
  const [savingSet, setSavingSet] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [accuracyModalOpen, setAccuracyModalOpen] =
    useState(false);

  function handleCreateFlashcard(mistake) {
    setFlashcards((currentCards) => {
      const alreadyExists = currentCards.some(
        (card) =>
          card.original === mistake.original &&
          card.corrected_text ===
            mistake.corrected_text,
      );

      if (alreadyExists) {
        return currentCards;
      }

      return [...currentCards, mistake];
    });
  }

  async function handleSaveFlashcardSet(
    cardsToSave = flashcards,
  ) {
    if (!cardsToSave.length) {
      return;
    }

    const trimmedTitle = journalTitle.trim();

    setSavingSet(true);
    setSaveMessage("");

    const flashcardSet = {
      name: trimmedTitle,
      language:
        cardsToSave[0]?.language ?? "Unknown",
      source_type: "journal",
      journal_entry_id: journalEntryId,
      flashcards: cardsToSave.map((card) => ({
        front:
          card.original_full ?? card.original,
        back: `${
          card.corrected_full ??
          card.corrected ??
          ""
        }||${card.explanation ?? ""}`,
        language:
          card.language ?? "Unknown",
      })),
    };

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "User is not authenticated.",
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/flashcard-sets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(flashcardSet),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Unable to save flashcard set.",
        );
      }

      setSaveMessage(
        result.message ||
          "Flashcards saved successfully.",
      );

      return true;
    } catch (saveError) {
      console.error(saveError);

      setSaveMessage(
        saveError.message ||
          "The flashcard set could not be saved.",
      );

      return false;
    } finally {
      setSavingSet(false);
    }
  }

  return (
    <>
      {!reviewMode ? (
        <JournalEditor />
      ) : loading ? (
        <AnalysisLoading />
      ) : (
        <>
          {corrections.length > 0 &&
            accuracy && (
              <AccuracySummary
                onOpenDetails={() =>
                  setAccuracyModalOpen(true)
                }
                score={accuracy.score}
              />
            )}

          <JournalText
            onCreateFlashcard={
              handleCreateFlashcard
            }
          />

          <FlashcardStudy
            mistakes={flashcards}
            onSaveSet={handleSaveFlashcardSet}
            savingSet={savingSet}
            saveMessage={saveMessage}
          />

          <AccuracyModal
            isOpen={accuracyModalOpen}
            onClose={() =>
              setAccuracyModalOpen(false)
            }
            accuracy={accuracy}
          />
        </>
      )}
    </>
  );
}

export default Write;
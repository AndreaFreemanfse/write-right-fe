import { useState } from "react";
import JournalEditor from "../components/JournalEditor.jsx";
import JournalText from "../components/JournalText.jsx";
import FlashcardStudy from "../components/FlashcardStudy.jsx";

function Write({
  text,
  setText,
  onAnalyze,
  loading,
  corrections,
  journalTitle,
  setJournalTitle,
  onBack,
  error,
  reviewMode,
  setTargetLanguage
}) {
  const [flashcards, setFlashcards] = useState([]);
  const [savingSet, setSavingSet] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  function handleCreateFlashcard(mistake) {
    setFlashcards((currentCards) => {
      const alreadyExists = currentCards.some(
        (card) =>
          card.original === mistake.original &&
          card.corrected_text === mistake.corrected_text,
      );

      if (alreadyExists) {
        return currentCards;
      }

      return [...currentCards, mistake];
    });
  }

  function handleCreateStudySet() {
  if (!corrections?.length) {
    return;
  }

  setFlashcards(corrections);
  setSaveMessage("");
}

  async function handleSaveFlashcardSet() {
  if (!flashcards.length) {
    return;
  }

  const trimmedTitle = journalTitle.trim();

  setSavingSet(true);
  setSaveMessage("");

  const flashcardSet = {
    name: trimmedTitle,
    language: flashcards[0]?.language ?? "Unknown",
    source_type: "journal",
    journal_entry_id: null,
    flashcards: flashcards.map((card) => ({
      front: card.original,
      back: card.corrected_text ?? card.corrected,
      language: card.language ?? null,
    })),
  };

  try {
    const response = await fetch(
      "http://localhost:8000/flashcard-sets",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flashcardSet),
      }
    );

    if (!response.ok) {
      throw new Error("Unable to save flashcard set.");
    }

    setSaveMessage("Flashcard set added to your vault.");
  } catch (saveError) {
    console.error(saveError);
    setSaveMessage("The flashcard set could not be saved.");
  } finally {
    setSavingSet(false);
  }
}


  return (
    <>
      {!reviewMode ? (
        <JournalEditor
          text={text}
          setText={setText}
          journalTitle={journalTitle}
          setJournalTitle={setJournalTitle}
          onAnalyze={onAnalyze}
          loading={loading}
          error={error}
          setTargetLanguage={setTargetLanguage}
        />
      ) : (
        <>
          <JournalText
            text={text}
            corrections={corrections}
            onBack={onBack}
            onCreateFlashcard={handleCreateFlashcard}
          />

          <FlashcardStudy
             mistakes={flashcards}
             corrections={corrections}
             onCreateStudySet={handleCreateStudySet}
             onSaveSet={handleSaveFlashcardSet}
             savingSet={savingSet}
             saveMessage={saveMessage}
          />
        </>
      )}
    </>
  );
}

export default Write;
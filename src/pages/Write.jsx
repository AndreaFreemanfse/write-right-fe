import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveFlashcardSet } from "../services/api";
import JournalEditor from "../components/JournalEditor.jsx";
import JournalText from "../components/JournalText.jsx";
import FlashcardStudy from "../components/FlashcardStudy.jsx";
import AnalysisLoading from "../components/AnalysisLoading.jsx";
import AccuracySummary from "../components/accuracy/AccuracySummary";
import AccuracyModal from "../components/accuracy/AccuracyModal";

function Write({
  dictionaryOpen,
  text,
  setText,
  onAnalyze,
  loading,
  loadingMessage,
  corrections,
  accuracy,
  journalEntryId,
  journalTitle,
  setJournalTitle,
  onBack,
  error,
  reviewMode,
  targetLanguage,
  nativeLanguage,
  setTargetLanguage,
  onUpdateMistake,
}) {
  const [flashcards, setFlashcards] = useState([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [accuracyModalOpen, setAccuracyModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Reset flashcards whenever a new journal analysis runs (corrections change)
  const correctionsRef = useRef(corrections);
  useEffect(() => {
    if (corrections !== correctionsRef.current) {
      correctionsRef.current = corrections;
      setFlashcards([]);
      setSaveMessage("");
    }
  }, [corrections]);

  const saveMutation = useMutation({
    mutationFn: saveFlashcardSet,
    onMutate: async (flashcardSet) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic insert
      await queryClient.cancelQueries({ queryKey: ["flashcard-sets"] });
      // Snapshot the previous state
      const previousSets = queryClient.getQueryData(["flashcard-sets"]);
      // Build a placeholder entry to show immediately
      const optimisticSet = {
        id: -Date.now(), // temporary negative ID
        name: flashcardSet.name,
        language: flashcardSet.language,
        source_type: flashcardSet.source_type,
        journal_entry_id: flashcardSet.journal_entry_id,
        flashcards: flashcardSet.flashcards.map((card, i) => ({
          ...card,
          id: -Date.now() - i,
        })),
      };
      // Insert optimistically into the cache
      queryClient.setQueryData(["flashcard-sets"], (old) => [
        ...(previousSets ?? []),
        optimisticSet,
      ]);
      return { previousSets };
    },
    onError: (_err, _vars, context) => {
      // Roll back on error
      if (context?.previousSets !== undefined) {
        queryClient.setQueryData(["flashcard-sets"], context.previousSets);
      }
    },
    onSuccess: (flashcardSet) => {
      setSaveMessage("Flashcards saved successfully.");
      // Replace the optimistic entry with the real server data
      queryClient.setQueryData(["flashcard-sets"], (old) =>
        old.map((s) =>
          s.id < 0 && s.name === flashcardSet.name ? flashcardSet : s
        )
      );
    },
  });

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

  function handleSaveFlashcardSet(cardsToSave = flashcards) {
    if (!cardsToSave.length) {
      return;
    }

    const trimmedTitle = journalTitle.trim();

    const flashcardSet = {
      name: trimmedTitle,
      language: cardsToSave[0]?.language ?? "Unknown",
      source_type: "journal",
      journal_entry_id: journalEntryId,
      flashcards: cardsToSave.map((card) => ({
        front: card.original_full ?? card.original,
        back: `${card.corrected_full ?? card.corrected ?? ""}||${card.explanation ?? ""}`,
        language: card.language ?? "Unknown",
      })),
    };

    saveMutation.mutate(flashcardSet);
  }

  return (
    <>
      {!reviewMode ? (
        <JournalEditor
          dictionaryOpen={dictionaryOpen}
          text={text}
          setText={setText}
          journalTitle={journalTitle}
          setJournalTitle={setJournalTitle}
          onAnalyze={onAnalyze}
          loading={loading}
          loadingMessage={loadingMessage}
          error={error}
          targetLanguage={targetLanguage}
          setTargetLanguage={setTargetLanguage}
        />
      ) : loading ? (
        <AnalysisLoading
          targetLanguage={targetLanguage}
          loadingMessage={loadingMessage}
        />
      ) : (
        <>
          {corrections.length > 0 && accuracy && (
            <AccuracySummary
              onOpenDetails={() => setAccuracyModalOpen(true)}
              score={accuracy.score}
            />
          )}
          <JournalText
            text={text}
            corrections={corrections}
            onBack={onBack}
            onCreateFlashcard={handleCreateFlashcard}
            targetLanguage={targetLanguage}
            nativeLanguage={nativeLanguage}
            onUpdateMistake={onUpdateMistake}
          />

          <FlashcardStudy
            mistakes={flashcards}
            corrections={corrections}
            onCreateStudySet={handleCreateStudySet}
            onSaveSet={handleSaveFlashcardSet}
            savingSet={saveMutation.isPending}
            saveMessage={saveMessage}
            targetLanguage={targetLanguage}
            nativeLanguage={nativeLanguage}
          />
          <AccuracyModal
            isOpen={accuracyModalOpen}
            onClose={() => setAccuracyModalOpen(false)}
            accuracy={accuracy}
          />
        </>
      )}
    </>
  );
}

export default Write;
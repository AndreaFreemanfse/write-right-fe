import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  handleCorrectJournal,
  updateJournalEntry,
} from "../services/api";

import { celebrate } from "../utils/celebrate";

const JournalContext = createContext();

const loadingMessages = [
  "Checking for mistakes...",
  "Preparing corrected journal...",
  "Calculating accuracy score...",
  "Generating suggestions...",
];

export function JournalProvider({ children }) {
  const navigate = useNavigate();

  const [journalText, setJournalText] = useState("");
  const [corrections, setCorrections] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState(
    loadingMessages[0],
  );

  const [apiError, setApiError] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [journalEntryData, setJournalEntryData] = useState({});

  const [nativeLanguage, setNativeLanguage] =
    useState("English");

  const [targetLanguage, setTargetLanguage] = useState("");

  const [journalTitle, setJournalTitle] = useState(
    "Untitled Journal",
  );

  const [journalEntryId, setJournalEntryId] =
    useState(null);

  const [accuracy, setAccuracy] = useState(null);

  const [editingEntry, setEditingEntry] =
    useState(null);


  useEffect(() => {
    if (!loading) return;

    let i = 0;

    const interval = setInterval(() => {
      if (i < loadingMessages.length - 1) {
        i += 1;
        setLoadingMessage(loadingMessages[i]);
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [loading]);

  async function analyzeJournal() {
  if (!journalText.trim()) {
    setApiError("Please enter some text first.");
    return;
  }

  const trimmedTitle = journalTitle.trim();

  if (!trimmedTitle || trimmedTitle === "Untitled Journal") {
    setApiError(
      "Please rename your journal before analyzing your writing.",
    );
    return;
  }

  if (!targetLanguage) {
    setApiError(
      "Please select a target language before analyzing your writing.",
    );
    return;
  }

  setCorrections([]);
  setAccuracy(null);
  setApiError("");

  setLoadingMessage("Checking for mistakes...");
  setLoading(true);
  setReviewMode(true);

  try {
    const response = await handleCorrectJournal(
      trimmedTitle,
      journalText,
      nativeLanguage,
      targetLanguage,
    );

    const mistakes = response.mistakes ?? [];
    const accuracyResult = response.accuracy ?? null;
    const savedJournalEntryId =
      response.journal_entry_id ?? null;

    setCorrections(mistakes);
    setAccuracy(accuracyResult);
    setJournalEntryId(savedJournalEntryId);

    setEditingEntry({
      id: savedJournalEntryId,
      title: trimmedTitle,
      original_text: journalText,
      native_language: nativeLanguage,
      target_language: targetLanguage,
    });

    if (mistakes.length === 0) {
      celebrate();

      setAchievement({
        title: "🏆 JOURNAL MASTER",
        subtitle: "Perfect Journal",
        description: "No corrections were needed!",
      });

      setTimeout(() => {
        setAchievement(null);
      }, 3500);
    }
  } catch (err) {
    console.error(err);

    setApiError(
      err.message ||
        "Something went wrong while analyzing your journal.",
    );

    setReviewMode(false);
  } finally {
    setLoading(false);
  }
}

  function updateMistake(updatedMistake) {
    setCorrections((previousCorrections) =>
      previousCorrections.map((mistake) =>
        mistake.original_full === updatedMistake.original_full
          ? updatedMistake
          : mistake,
      ),
    );
  }

  function returnToEditor(entry) {
  setReviewMode(false);
  setApiError(null);
  setCorrections([]);
  setAccuracy(null);

  if (entry) {
    setEditingEntry(entry);
    setJournalText(entry.original_text);
    setJournalTitle(entry.title);
    setTargetLanguage(entry.target_language || "");
    setNativeLanguage(
      entry.native_language || "English",
    );
  }

  navigate("/write");
}

function handleEditJournal(entry) {
  const confirmed = window.confirm(
    "Editing this journal will remove its current corrections. Your flashcards will be kept. Do you want to continue?",
  );

  if (!confirmed) {
    return;
  }

  setApiError(null);
  setReviewMode(false);
  setCorrections([]);
  setAccuracy(null);

  setEditingEntry(entry);
  setActiveModal(null);

  setJournalText(entry.original_text);
  setJournalTitle(entry.title);
  setTargetLanguage(entry.target_language || "");
  setNativeLanguage(
    entry.native_language || "English",
  );

  navigate("/write");
}

async function handleSaveEdit() {
  const trimmedTitle = journalTitle.trim();

  if (!journalText.trim()) {
    setApiError("Please enter some text first.");
    return;
  }

  if (
    !trimmedTitle ||
    trimmedTitle === "Untitled Journal"
  ) {
    setApiError(
      "Please rename your journal before saving your changes.",
    );
    return;
  }

  if (!targetLanguage) {
    setApiError(
      "Please select a target language before saving.",
    );
    return;
  }

  if (!editingEntry?.id) {
    setApiError(
      "Unable to determine which journal entry to update.",
    );
    return;
  }

  try {
    setLoading(true);
    setReviewMode(true);
    setApiError(null);
    setLoadingMessage("Saving your journal...");

    const response = await updateJournalEntry(
      editingEntry.id,
      {
        title: trimmedTitle,
        original_text: journalText,
        native_language: nativeLanguage,
        target_language: targetLanguage,
      },
    );

    const mistakes = response.mistakes ?? [];
    const accuracyResult = response.accuracy ?? null;

    setCorrections(mistakes);
    setAccuracy(accuracyResult);
    setJournalEntryId(response.id);

    setEditingEntry((currentEntry) => ({
      ...currentEntry,
      id: response.id,
      title: trimmedTitle,
      original_text: journalText,
      native_language: nativeLanguage,
      target_language: targetLanguage,
    }));

    setReviewMode(true);

    if (mistakes.length === 0) {
      celebrate();

      setAchievement({
        title: "🏆 JOURNAL MASTER",
        subtitle: "Perfect Journal",
        description: "No corrections were needed!",
      });

      setTimeout(() => {
        setAchievement(null);
      }, 3500);
    }
  } catch (error) {
    console.error(
      "Failed to update journal entry:",
      error,
    );

    setApiError(
      "Something went wrong while saving your changes.",
    );

    setReviewMode(false);
  } finally {
    setLoading(false);
  }
}

function handleNewEntry() {
  resetJournal();
  navigate("/write");
}

 const resetJournal = useCallback(() => {
  setJournalText("");
  setJournalTitle("Untitled Journal");
  setTargetLanguage("");
  setCorrections([]);
  setReviewMode(false);
  setJournalEntryId(null);
  setAccuracy(null);
  setApiError(null);
  setEditingEntry(null);
}, []);

  const value = {
  journalText,
  setJournalText,

  corrections,
  setCorrections,

  reviewMode,
  setReviewMode,

  loading,
  setLoading,

  loadingMessage,
  setLoadingMessage,

  apiError,
  setApiError,

  achievement,
  setAchievement,

  activeModal,
  setActiveModal,

  journalEntryData,
  setJournalEntryData,

  nativeLanguage,
  setNativeLanguage,

  targetLanguage,
  setTargetLanguage,

  journalTitle,
  setJournalTitle,

  journalEntryId,
  setJournalEntryId,

  accuracy,
  setAccuracy,

  editingEntry,
  setEditingEntry,

  analyzeJournal,
  updateMistake,
  returnToEditor,
  resetJournal,
  handleEditJournal,
  handleSaveEdit,
  handleNewEntry,
};

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);

  if (!context) {
    throw new Error(
      "useJournal must be used within a JournalProvider",
    );
  }

  return context;
}
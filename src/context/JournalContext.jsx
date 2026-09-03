import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { handleCorrectJournal } from "../services/api";
import { celebrate } from "../utils/celebrate";

const JournalContext = createContext();

const loadingMessages = [
  "Checking for mistakes...",
  "Preparing corrected journal...",
  "Calculating accuracy score...",
  "Generating suggestions...",
];

export function JournalProvider({ children }) {
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

  const [nativeLanguage, setNativeLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("");

  const [journalTitle, setJournalTitle] = useState(
    "Untitled Journal",
  );

  const [journalEntryId, setJournalEntryId] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

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

  function returnToEditor() {
    setReviewMode(false);
    setApiError(null);
  }

  function resetJournal() {
    setJournalText("");
    setJournalTitle("Untitled Journal");
    setTargetLanguage("");
    setCorrections([]);
    setReviewMode(false);
    setJournalEntryId(null);
    setAccuracy(null);
    setApiError(null);
  }

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

    analyzeJournal,
    updateMistake,
    returnToEditor,
    resetJournal,
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
import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import AchievementOverlay from "./components/achievements/AchievementOverlay";
import AmbientBackground from "./components/background/AmbientBackground";
import DictionaryModal from "./components/DictionaryModal.jsx";
import TopNav from "./components/NavBar.jsx";
import HelpModal from "./components/HelpModal";
import JournalReview from "./components/JournalReview.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

import FlashcardReviewPage from "./pages/FlashcardReviewPage.jsx";
import CheckEmailPage from "./pages/CheckEmailPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import Write from "./pages/Write.jsx";
import JournalEntriesPage from "./pages/JournalEntriesPage.jsx";

import { handleCorrectJournal } from "./services/api.js";
import { updateJournalEntry } from "./services/api.js";
import { celebrate } from "./utils/celebrate";
import "./App.css";

function App() {
  // --------------------------------------------------------------
  // Journal State
  // --------------------------------------------------------------

  const navigate = useNavigate();

  // The user's journal text
  const [journalText, setJournalText] = useState("");

  // The analysis of the user's journal text
  const [corrections, setCorrections] = useState([]);

  // The user's current review mode
  const [reviewMode, setReviewMode] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // API error state to handle errors from the backend
  const [apiError, setApiError] = useState(null);

  // Win condition celebration
  const [achievement, setAchievement] = useState(null);

  // Dictionary modal state
  const [dictionaryOpen, setDictionaryOpen] = useState(false);

  // Help modal state
  const [helpOpen, setHelpOpen] = useState(false);

  // Sets the journal review in journal entries
  const [journalEntryOpen, setJournalEntryOpen] = useState(false);
  
  const [journalEntryData, setJournalEntryData] = useState({});

  // Set the content to be edited if a user selects edit journal
  const [editingEntry, setEditingEntry] = useState(null);

  // Sets the users native language
  const [nativeLanguage, setNativeLanguage] = useState("English");

  // Sets the user's target language
  const [targetLanguage, setTargetLanguage] = useState("");

  // Journal title
  const [journalTitle, setJournalTitle] = useState("Untitled Journal");

  // Journal ID state
  const [journalEntryId, setJournalEntryId] = useState(null);

  // Accuracy state
  const [accuracy, setAccuracy] = useState(null);

  // Loading messages
  const loadingMessages = [
    "Checking for mistakes...",
    "Preparing corrected journal...",
    "Calculating accuracy score...",
    "Generating suggestions...",
  ];

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  const location = useLocation();

  const publicPaths = ["/", "/signup", "/signin", "/check-email"];

  const isPublicPage = publicPaths.includes(location.pathname);

  useEffect(() => {
    if (!loading) return;

    let i = 0;

    const interval = setInterval(() => {
      if (i < loadingMessages.length - 1) {
        i++;
        setLoadingMessage(loadingMessages[i]);
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [loading]);

  // reset journal to a clear state if user navigates away
  useEffect(() => {
    if (location.pathname === "/write") {
      return;
    }

    setJournalEntryId(null);
    setTargetLanguage("");
    setReviewMode(false);
    setApiError(null);
    setCorrections([]);
    setAccuracy(null);
    setEditingEntry(null);
    setJournalText("");
    setJournalTitle("Untitled Journal");
  }, [location.pathname]);

  // --------------------------------------------------------------
  // Helper functions
  // --------------------------------------------------------------

  // Function to handle the journal analysis.
  // Calls the backend and updates the correction state.
  async function analyzeJournal() {
    // Prevent empty submissions
    if (!journalText.trim()) {
      setApiError("Please enter some text first.");
      return;
    }

    const trimmedTitle = journalTitle.trim();

    if (!trimmedTitle || trimmedTitle === "Untitled Journal") {
      setApiError("Please rename your journal before analyzing your writing.");
      return;
    }

    if (!targetLanguage) {
      setApiError(
        "Please select a target language before analyzing your writing.",
      );
      return;
    }

    // Clear previous results before starting a new analysis
    setCorrections([]);
    setAccuracy(null);
    setApiError("");

    // Immediately show the loading screen
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
      const savedJournalEntryId = response.journal_entry_id ?? null;

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
        err.message || "Something went wrong while analyzing your journal.",
      );

      // Return to the editor so the user can see the error
      setReviewMode(false);
    } finally {
      setLoading(false);
    }
  }

  const handleEditJournal = (entry) => {
    const confirmed = window.confirm(
      "Editing this journal will remove its current corrections. Your flashcards will be kept. Do you want to continue?",
    );

    if (!confirmed) {
      return;
    }

    // Clear previous state
    setApiError(null);
    setReviewMode(false);
    setCorrections([]);
    setAccuracy(null);

    setEditingEntry(entry);
    setJournalEntryOpen(false);

    setJournalText(entry.original_text);
    setJournalTitle(entry.title);

    setTargetLanguage(entry.target_language || "");

    setNativeLanguage(entry.native_language || "English");

    navigate("/write");
  };

  const handleSaveEdit = async () => {
    const trimmedTitle = journalTitle.trim();

    // Validate before making any API calls
    if (!journalText.trim()) {
      setApiError("Please enter some text first.");
      return;
    }

    if (!trimmedTitle || trimmedTitle === "Untitled Journal") {
      setApiError("Please rename your journal before saving your changes.");
      return;
    }

    if (!targetLanguage) {
      setApiError("Please select a target language before saving.");
      return;
    }

    try {
      setLoading(true);
      setReviewMode(true);
      setApiError(null);
      setLoadingMessage("Saving your journal...");

      // Update and re-analyze the existing journal entry
      const response = await updateJournalEntry(editingEntry.id, {
        title: trimmedTitle,
        original_text: journalText,
        native_language: nativeLanguage,
        target_language: targetLanguage,
      });

      const mistakes = response.mistakes ?? [];
      const accuracyResult = response.accuracy ?? null;

      setCorrections(mistakes);
      setAccuracy(accuracyResult);
      setJournalEntryId(response.id);

      setEditingEntry({
        ...editingEntry,
        id: response.id,
        title: trimmedTitle,
        original_text: journalText,
        native_language: nativeLanguage,
        target_language: targetLanguage,
      });

      setReviewMode(true);

      // Celebrate if there are no mistakes
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
      console.error("Failed to update journal entry:", error);

      setApiError("Something went wrong while saving your changes.");
      setReviewMode(false);
    } finally {
      setLoading(false);
    }
  };

  function updateMistake(updatedMistake) {
    setCorrections((prev) =>
      prev.map((m) =>
        m.original_full === updatedMistake.original_full ? updatedMistake : m,
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
      setNativeLanguage(entry.native_language || "English");
    }
    navigate("/write");
  }

  function handleNewEntry() {
    setJournalEntryId(null);
    setTargetLanguage("");
    setReviewMode(false);
    setApiError(null);
    setCorrections([]);
    setAccuracy(null);
    setEditingEntry(null);
    setJournalText("");
    setJournalTitle("Untitled Journal");
    navigate("/write");
  }

  // --------------------------------------------------------------
  // Render
  // --------------------------------------------------------------

  return (
    <div className="App">
      <AmbientBackground />
      {!isPublicPage && (
        <>
          <TopNav
            nativeLanguage={nativeLanguage}
            setNativeLanguage={setNativeLanguage}
            onOpenDictionary={() => setDictionaryOpen(true)}
            onOpenHelp={() => setHelpOpen(true)}
            setJournalText={setJournalText}
            setJournalTitle={setJournalTitle}
            setTargetLanguage={setTargetLanguage}
            setCorrections={setCorrections}
            setReviewMode={setReviewMode}
          />
          <AchievementOverlay achievement={achievement} />
          <DictionaryModal
            isOpen={dictionaryOpen}
            onClose={() => setDictionaryOpen(false)}
            nativeLanguage={nativeLanguage}
            targetLanguage={targetLanguage}
          />
          <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
          <JournalReview
            handleEditJournal={handleEditJournal}
            isOpen={journalEntryOpen}
            journalEntryData={journalEntryData}
            onClose={() => setJournalEntryOpen(false)}
          />
        </>
      )}
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/check-email" element={<CheckEmailPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/write"
            element={
              <Write
                dictionaryOpen={dictionaryOpen}
                text={journalText}
                setText={setJournalText}
                onAnalyze={analyzeJournal}
                journalTitle={journalTitle}
                setJournalTitle={setJournalTitle}
                loading={loading}
                loadingMessage={loadingMessage}
                corrections={corrections}
                accuracy={accuracy}
                journalEntryId={journalEntryId}
                returnToEditor={returnToEditor}
                onNewEntry={handleNewEntry}
                error={apiError}
                reviewMode={reviewMode}
                targetLanguage={targetLanguage}
                nativeLanguage={nativeLanguage}
                setTargetLanguage={setTargetLanguage}
                onUpdateMistake={updateMistake}
                handleSaveEdit={handleSaveEdit}
                editingEntry={editingEntry}
              />
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/flashcards"
            element={<FlashcardReviewPage nativeLanguage={nativeLanguage} />}
          />
          <Route
            path="/journal-entries"
            element={
              <JournalEntriesPage
                setJournalEntryOpen={setJournalEntryOpen}
                setJournalEntryData={setJournalEntryData}
              />
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

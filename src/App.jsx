import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import AchievementOverlay from "./components/achievements/AchievementOverlay";
import AmbientBackground from "./components/background/AmbientBackground";
import DictionaryModal from "./components/DictionaryModal.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import HelpModal from "./components/HelpModal";
import TopNav from "./components/NavBar.jsx";
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
import { celebrate } from "./utils/celebrate";
import "./App.css";

function App() {
  // --------------------------------------------------------------
  // Journal State
  // --------------------------------------------------------------

  // The user's journal text
  const [journalText, setJournalText] = useState("");

  // The analysis of the user's journal text
  const [corrections, setCorrections] = useState([]);

  // The user's current review mode
  const [reviewMode, setReviewMode] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

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

  // Close modals on page change
  useEffect(() => {
    setActiveModal(null);
  }, [location.pathname]);

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
  }, [loading, loadingMessages, loadingMessages.length]);

  // API error state to handle errors from the backend
  const [apiError, setApiError] = useState(null);

  // Win condition celebration
  const [achievement, setAchievement] = useState(null);

  // Global modal state
  const [activeModal, setActiveModal] = useState(null);

  const [journalEntryData, setJournalEntryData] = useState({});

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

      console.log("Backend response:", response);
      console.log("Mistakes:", response.mistakes);
      console.log("First mistake:", response.mistakes?.[0]);
      console.log("Accuracy:", response.accuracy);
      console.log("Response keys:", Object.keys(response));

      const mistakes = response.mistakes ?? [];
      const accuracyResult = response.accuracy ?? null;
      const savedJournalEntryId = response.journal_entry_id ?? null;

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
        err.message || "Something went wrong while analyzing your journal.",
      );

      // Return to the editor so the user can see the error
      setReviewMode(false);
    } finally {
      setLoading(false);
    }
  }

  function updateMistake(updatedMistake) {
    setCorrections((prev) =>
      prev.map((m) =>
        m.original_full === updatedMistake.original_full ? updatedMistake : m,
      ),
    );
  }

  function returnToEditor() {
    setReviewMode(false);
    setApiError(null);
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
            onOpenDictionary={() => setActiveModal("dictionary")}
            onOpenSettings={() => setActiveModal("settings")}
            onOpenHelp={() => setActiveModal("help")}
            setJournalText={setJournalText}
            setJournalTitle={setJournalTitle}
            setTargetLanguage={setTargetLanguage}
            setCorrections={setCorrections}
            setReviewMode={setReviewMode}
            setActiveModal={setActiveModal}
          />
          <AchievementOverlay achievement={achievement} />
          <DictionaryModal
            isOpen={activeModal === "dictionary"}
            onClose={() => setActiveModal(null)}
            nativeLanguage={nativeLanguage}
            targetLanguage={targetLanguage}
          />
          <HelpModal
            isOpen={activeModal === "help"}
            onClose={() => setActiveModal(null)}
          />
          <SettingsModal
            isOpen={activeModal === "settings"}
            onClose={() => setActiveModal(null)}
            nativeLanguage={nativeLanguage}
            setNativeLanguage={setNativeLanguage}
          />
          <JournalReview
            isOpen={activeModal === "journalEntries"}
            journalEntryData={journalEntryData}
            onClose={() => setActiveModal(null)}
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
                dictionaryOpen={activeModal === "dictionary"}
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
                onBack={returnToEditor}
                error={apiError}
                reviewMode={reviewMode}
                targetLanguage={targetLanguage}
                nativeLanguage={nativeLanguage}
                setTargetLanguage={setTargetLanguage}
                onUpdateMistake={updateMistake}
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
                setActiveModal={setActiveModal}
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

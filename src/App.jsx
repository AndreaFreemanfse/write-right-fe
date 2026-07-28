import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import TopNav from "./components/NavBar.jsx";
import Write from "./pages/Write.jsx";
import FlashcardReviewPage from "./pages/FlashcardReviewPage.jsx";
import AchievementOverlay from "./components/achievements/AchievementOverlay";
import DictionaryModal from "./components/DictionaryModal.jsx";
import HelpModal from "./components/HelpModal";

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

  // API error state to handle errors from the backend
  const [apiError, setApiError] = useState(null);

  // Win condition celebration
  const [achievement, setAchievement] = useState(null);

  // Dictionary modal state
  const [dictionaryOpen, setDictionaryOpen] = useState(false);

  // Sets the user's native language
  // Help modal state
  const [helpOpen, setHelpOpen] = useState(false);

  // Sets the users native language
  const [nativeLanguage, setNativeLanguage] = useState("english");

  // Sets the user's target language
  const [targetLanguage, setTargetLanguage] = useState("english");

  // Journal title
  const [journalTitle, setJournalTitle] = useState("Untitled Journal");

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
      window.alert("Please rename your journal before analyzing your writing.");
      return;
    }

    // Clear previous results before starting a new analysis
    setCorrections([]);
    setAccuracy(null);
    setApiError("");

    // Immediately show the loading screen
    setLoading(true);
    setReviewMode(true);

    try {
      const response = await handleCorrectJournal(
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

      setCorrections(mistakes);
      setAccuracy(accuracyResult);

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
        "Something went wrong while analyzing your journal.",
      );

      // Return to the editor so the user can see the error
      setReviewMode(false);
    } finally {
      setLoading(false);
    }
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
      <TopNav setNativeLanguage={setNativeLanguage}  onOpenDictionary={() => setDictionaryOpen(true)} onOpenHelp={() => setHelpOpen(true)}/>
      <AchievementOverlay achievement={achievement} />
      <DictionaryModal isOpen={dictionaryOpen} onClose={() => setDictionaryOpen(false)} nativeLanguage={nativeLanguage} targetLanguage={targetLanguage}/>
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)}/>
      <Routes>
        <Route
          path="/"
          element={
            <Write
              text={journalText}
              setText={setJournalText}
              onAnalyze={analyzeJournal}
              journalTitle={journalTitle}
              setJournalTitle={setJournalTitle}
              loading={loading}
              corrections={corrections}
              accuracy={accuracy}
              onBack={returnToEditor}
              error={apiError}
              reviewMode={reviewMode}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
            />
          }
        />

        <Route
          path="/flashcards"
          element={<FlashcardReviewPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
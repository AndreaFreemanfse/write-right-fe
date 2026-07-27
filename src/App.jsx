import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import AchievementOverlay from "./components/achievements/AchievementOverlay";
import DictionaryModal from "./components/DictionaryModal.jsx";
import TopNav from "./components/NavBar.jsx";
import HelpModal from "./components/HelpModal";

import FlashcardReviewPage from "./pages/FlashcardReviewPage.jsx";
import CheckEmailPage from "./pages/CheckEmailPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import Write from "./pages/Write.jsx";

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

  // Loading spinner
  const [loading, setLoading] = useState(false);

  // API error state to handle errors from the backend
  const [apiError, setApiError] = useState(null);

  // Win condition celebration
  const [achievement, setAchievement] = useState(null);

  // Dictionary modal state
  const [dictionaryOpen, setDictionaryOpen] = useState(false);

  // Help modal state
  const [helpOpen, setHelpOpen] = useState(false);

  // Sets the users native language
  const [nativeLanguage, setNativeLanguage] = useState("english");

  // Sets the users target language
  const [targetLanguage, setTargetLanguage] = useState("english");

  const [journalTitle, setJournalTitle] = useState("Untitled Journal");

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

    setLoading(true);
    setApiError("");

    try {
      const response = await handleCorrectJournal(
        journalText,
        nativeLanguage,
        targetLanguage,
      );

      console.log("Backend response:", response);

      setCorrections(response.mistakes);
      setReviewMode(true);

      if (response.mistakes.length === 0) {
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
      setApiError("Something went wrong while analyzing your journal.");
    } finally {
      setLoading(false);
    }
  }

  function returnToEditor() {
    setReviewMode(false);
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
              onBack={returnToEditor}
              error={apiError}
              reviewMode={reviewMode}
              setTargetLanguage={setTargetLanguage}
            />
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/flashcards" element={<FlashcardReviewPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
      </Routes>
    </div>
  );
}

export default App;

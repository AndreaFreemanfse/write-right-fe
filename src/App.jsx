import { useState, useEffect } from "react";
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

  // Loading spinner
  const [loading, setLoading] = useState(false);

  // Loading messages
  const loadingMessages = [
    "Checking for mistakes...",
    "Generating explanations...",
    "Preparing corrected journal...",
    "Almost finished...",
    "Almost finished...",
    "Taking longer than expected, please be patient..."
  ];

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

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

    setLoadingMessage("Checking for mistakes...");
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
              loadingMessage={loadingMessage}
              corrections={corrections}
              onBack={returnToEditor}
              error={apiError}
              reviewMode={reviewMode}
              setTargetLanguage={setTargetLanguage}
            />
          }
        />
        <Route path="/flashcards" element={<FlashcardReviewPage />} />
      </Routes>
    </div>
  );
}

export default App;

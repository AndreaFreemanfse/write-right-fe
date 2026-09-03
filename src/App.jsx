import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useJournal } from "./context/JournalContext";
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
import SelectUserPresets from "./pages/SelectUserPresets.jsx";
import "./App.css";

function App() {
  // --------------------------------------------------------------
  // Journal State
  // --------------------------------------------------------------

  // Shared journal state is now provided by JournalContext.
  // App only pulls the values it still needs directly.

  const { setActiveModal } = useJournal();
  const location = useLocation();
  const publicPaths = ["/", "/signup", "/signin", "/check-email"];
  const isPublicPage = publicPaths.includes(location.pathname);

  // Close modals on page change
  useEffect(() => {
    setActiveModal(null);
  }, [location.pathname, setActiveModal]);

  // --------------------------------------------------------------
  // Helper functions
  // --------------------------------------------------------------

  // Journal helper functions such as analyzeJournal,
  // updateMistake, and returnToEditor now live in JournalContext.
  // Components that need them can access them directly with useJournal().

  // --------------------------------------------------------------
  // Render
  // --------------------------------------------------------------

  return (
    <div className="App">
      <AmbientBackground />

      {!isPublicPage && (
        <>
          <TopNav />
          <AchievementOverlay />
          <DictionaryModal />
          <HelpModal />
          <SettingsModal />
          <JournalReview />
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
            path="/select-presets"
            element={<SelectUserPresets />}
          />

          <Route path="/write" element={<Write />} />

          <Route path="/profile" element={<ProfilePage />} />

         <Route
            path="/flashcards"
            element={<FlashcardReviewPage />}
          />

          <Route
            path="/journal-entries"
            element={<JournalEntriesPage />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
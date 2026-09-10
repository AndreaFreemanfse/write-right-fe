import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../config/api";
import { useJournal } from "../context/JournalContext";

import JournalEditor from "../components/JournalEditor.jsx";
import JournalText from "../components/JournalText.jsx";
import FlashcardStudy from "../components/FlashcardStudy.jsx";
import AnalysisLoading from "../components/AnalysisLoading.jsx";
import AccuracySummary from "../components/accuracy/AccuracySummary";
import AccuracyModal from "../components/accuracy/AccuracyModal";
import QuestTrigger from "../components/quests/QuestTrigger.jsx";
import QuestModal from "../components/quests/QuestModal";
import QuestMap from "../components/quests/QuestMap";
import QuestTransition from "../components/quests/QuestTransition";
import SpotMistakeQuest from "../components/quests/SpotMistakeQuest";
import SpellingQuest from "../components/quests/SpellingQuest";
import MatchingQuest from "../components/quests/MatchingQuest";
import QuestResults from "../components/quests/QuestResults";
import QuestParticles from "../components/quests/QuestParticles";
import "../components/quests/QuestFail.css";
import {
  celebrateQuestComplete,
  celebrateAdventureComplete,
  celebrateStreak,
} from "../utils/celebrate";

const INITIAL_LIVES = 3;
const QUEST_TIME = 60;
const BASE_XP = 50;

function getStreakMultiplier(streak) {
  if (streak >= 10) return 5;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

function getStreakBonusTime(streak) {
  if (streak === 10) return 15;
  if (streak === 5) return 10;
  if (streak === 3) return 5;
  return 0;
}

function Write() {
  const {
    corrections,
    reviewMode,
    loading,
    journalTitle,
    journalEntryId,
    accuracy,
    targetLanguage
  } = useJournal();

  const [flashcards, setFlashcards] = useState([]);
  const [savingSet, setSavingSet] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [accuracyModalOpen, setAccuracyModalOpen] =
    useState(false);

  const [questLoading, setQuestLoading] = useState(false);
  const [_questError, setQuestError] = useState("");
  const [quests, setQuests] = useState(null);

  const [stage, setStage] = useState("idle");
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [timer, setTimer] = useState(QUEST_TIME);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [transitioning, setTransitioning] = useState(null);
  const [questFailed, setQuestFailed] = useState(false);

  const timerRef = useRef(null);
  const timerPaused = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (
      stage === "fill-blank" ||
      stage === "spelling" ||
      stage === "matching"
    ) {
      timerPaused.current = false;
      clearTimer();

      timerRef.current = setInterval(() => {
        if (timerPaused.current) return;

        setTimer((prev) => {
          if (prev <= 1) {
            clearTimer();
            timerPaused.current = true;
            setStage("map");
            setQuestFailed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [stage, clearTimer]);

  function handleCreateFlashcard(mistake) {
    setFlashcards((currentCards) => {
      const alreadyExists = currentCards.some(
        (card) =>
          card.original === mistake.original &&
          card.corrected_text ===
            mistake.corrected_text,
      );

      if (alreadyExists) {
        return currentCards;
      }

      return [...currentCards, mistake];
    });
  }

  async function handleOpenQuests() {

    if (!targetLanguage) {
      alert("Please select a target language before starting Quest Mode.");
      return;
    }

    setQuestLoading(true);
    setQuestError("");
    setQuestLoading(true);
    setQuestError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(
      `${API_BASE_URL}/quests/generate?target_language=${encodeURIComponent(
        targetLanguage,
      )}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );

      const result = await response.json();

      if (!response.ok) {
      if (response.status === 400) {
        alert(
        `You don't have any corrections to practice in ${targetLanguage} yet. Please select a language you've practiced to generate a quest.`,
      );
        return;
      }

  throw new Error(
    result.detail || "Unable to generate personalized quests.",
  );
}

      resetGameState();
      setQuests(result);
    } catch (questError) {
      console.error("Quest generation failed:", questError);
      setQuestError(
        questError.message || "Unable to generate personalized quests.",
      );
    } finally {
      setQuestLoading(false);
    }
  }

  function resetGameState() {
    setStage("intro");
    setLives(INITIAL_LIVES);
    setStreak(0);
    setBestStreak(0);
    setXp(0);
    setTimer(QUEST_TIME);
    setCompletedQuests([]);
    setTransitioning(null);
    setQuestFailed(false);
    clearTimer();
  }

  function handleCloseQuests() {
    resetGameState();
    setQuests(null);
    setQuestError("");
  }

  function handleBeginQuests() {
    setStage("map");
  }

  function handleSelectQuest(questId) {
    setLives(INITIAL_LIVES);
    setStreak(0);
    setTimer(QUEST_TIME);
    setQuestFailed(false);
    setStage(questId);
  }

  function handleQuestComplete() {
    clearTimer();
    timerPaused.current = true;

    const newCompleted = [...completedQuests, stage];
    setCompletedQuests(newCompleted);

    celebrateQuestComplete();

    if (newCompleted.length === 3) {
      setTimeout(() => {
        celebrateAdventureComplete();
        setStage("complete");
      }, 1500);
    } else {
      setTransitioning(stage);
      setTimeout(() => {
        setTransitioning(null);
        setStage("map");
      }, 1200);
    }
  }

  function handleQuestFail() {
    clearTimer();
    timerPaused.current = true;
    setStage("map");
  }

  function recordQuestAttempt(type, isCorrect) {
    if (isCorrect) {
      setStreak((prev) => {
        const next = prev + 1;
        const newBest = Math.max(bestStreak, next);
        setBestStreak(newBest);

        const bonusTime = getStreakBonusTime(next);
        if (bonusTime > 0) {
          setTimer((t) => t + bonusTime);
        }

        const multiplier = getStreakMultiplier(next);
        setXp((prevXp) => prevXp + BASE_XP * multiplier);

        if (next === 3 || next === 5 || next === 10) {
          celebrateStreak(next);
        }

        return next;
      });
    } else {
      setStreak(0);
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setTimeout(() => handleQuestFail(), 800);
        }
        return Math.max(0, next);
      });
      setXp((prevXp) => Math.max(0, prevXp + BASE_XP * 0.2));
    }

    setQuestStats((current) => ({
      ...current,
      correct: current.correct + (isCorrect ? 1 : 0),
      incorrect: current.incorrect + (isCorrect ? 0 : 1),
      [`${type}Attempts`]: current[`${type}Attempts`] + 1,
    }));
  }

  const [questStats, setQuestStats] = useState({
    correct: 0,
    incorrect: 0,
    fillBlankAttempts: 0,
    spellingAttempts: 0,
    matchingAttempts: 0,
  });

  function handleCreateStudySet() {
    if (!corrections?.length) {
      return;
    }

    setFlashcards(corrections);
    setSaveMessage("");
  }

  async function handleSaveFlashcardSet(
    cardsToSave = flashcards,
  ) {
    if (!cardsToSave.length) {
      return;
    }

    const trimmedTitle = journalTitle.trim();

    setSavingSet(true);
    setSaveMessage("");

    const flashcardSet = {
      name: trimmedTitle,
      language:
        cardsToSave[0]?.language ?? "Unknown",
      source_type: "journal",
      journal_entry_id: journalEntryId,
      flashcards: cardsToSave.map((card) => ({
        front:
          card.original_full ?? card.original,
        back: `${
          card.corrected_full ??
          card.corrected ??
          ""
        }||${card.explanation ?? ""}`,
        language:
          card.language ?? "Unknown",
      })),
    };

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "User is not authenticated.",
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/flashcard-sets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(flashcardSet),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Unable to save flashcard set.",
        );
      }

      setSaveMessage(
        result.message ||
          "Flashcards saved successfully.",
      );

      return true;
    } catch (saveError) {
      console.error(saveError);

      setSaveMessage(
        saveError.message ||
          "The flashcard set could not be saved.",
      );

      return false;
    } finally {
      setSavingSet(false);
    }
  }

  const isQuesting =
    stage !== "idle" && stage !== "intro" && quests !== null;

  return (
    <>
      <QuestTrigger
        onClick={handleOpenQuests}
        loading={questLoading}
      />
      {!reviewMode ? (
        <JournalEditor />
      ) : loading ? (
        <AnalysisLoading />
  
      ) : (
        <>
          {corrections.length > 0 &&
            accuracy && (
              <AccuracySummary
                onOpenDetails={() =>
                  setAccuracyModalOpen(true)
                }
                score={accuracy.score}
              />
            )}

          <JournalText
            onCreateFlashcard={
              handleCreateFlashcard
            }
          />

          <FlashcardStudy
            mistakes={flashcards}
            onSaveSet={handleSaveFlashcardSet}
            savingSet={savingSet}
            saveMessage={saveMessage}
          />

          <AccuracyModal
            isOpen={accuracyModalOpen}
            onClose={() =>
              setAccuracyModalOpen(false)
            }
            accuracy={accuracy}
          />
        </>
      )}

      {isQuesting && <QuestParticles />}

      {quests && stage === "intro" && (
        <QuestModal
          quests={quests}
          onClose={handleCloseQuests}
          onBegin={handleBeginQuests}
        />
      )}

      {quests && stage === "map" && (
        <QuestMap
          quests={quests}
          completedQuests={completedQuests}
          onClose={handleCloseQuests}
          onSelectQuest={handleSelectQuest}
        />
      )}

      {transitioning && (
        <QuestTransition questId={transitioning} />
      )}

      {quests && stage === "fill-blank" && !transitioning && (
        <SpotMistakeQuest
          quest={quests.spot_mistake}
          onClose={handleCloseQuests}
          onComplete={handleQuestComplete}
          onAttempt={(isCorrect) => recordQuestAttempt("spotMistake", isCorrect)}
          lives={lives}
          streak={streak}
          timer={timer}
          xp={xp}
        />
      )}

      {quests && stage === "spelling" && !transitioning && (
        <SpellingQuest
          quest={quests.spelling}
          onClose={handleCloseQuests}
          onComplete={handleQuestComplete}
          onAttempt={(isCorrect) => recordQuestAttempt("spelling", isCorrect)}
          lives={lives}
          streak={streak}
          timer={timer}
          xp={xp}
        />
      )}

      {quests && stage === "matching" && !transitioning && (
        <MatchingQuest
          quest={quests.matching}
          onClose={handleCloseQuests}
          onComplete={handleQuestComplete}
          onAttempt={(isCorrect) => recordQuestAttempt("matching", isCorrect)}
          lives={lives}
          streak={streak}
          timer={timer}
          xp={xp}
        />
      )}

      {quests && stage === "complete" && (
        <QuestResults
          stats={questStats}
          targetLanguage={quests.target_language}
          lives={lives}
          bestStreak={bestStreak}
          xp={xp}
          onClose={handleCloseQuests}
          onPlayAgain={() => {
            resetGameState();
            setQuestStats({
              correct: 0,
              incorrect: 0,
              fillBlankAttempts: 0,
              spellingAttempts: 0,
              matchingAttempts: 0,
            });
          }}
        />
      )}

      {quests && stage === "map" && questFailed && (
        <div
          className="quest-fail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quest-fail-title"
        >
          <div className="quest-fail-card">
            <div className="quest-fail-icon" aria-hidden="true">
              💔
            </div>
            <p className="quest-fail-eyebrow">OUT OF HEARTS</p>
            <h2 id="quest-fail-title">Quest Failed</h2>
            <p className="quest-fail-text">
              You ran out of hearts or time. Return to the map and try another quest!
            </p>
            <button
              type="button"
              className="quest-fail-btn"
              onClick={() => setQuestFailed(false)}
            >
              Back to Map
            </button>
          </div>
        </div>
      )}
    </>
  
  );
}

export default Write;
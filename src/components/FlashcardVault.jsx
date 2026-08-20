import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../config/api";
import "./FlashcardVault.css";

function FlashcardVault({nativeLanguage}) {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSet, setSelectedSet] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [changingCard, setChangingCard] = useState(false);
  const [exp_loading, setExpLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";


  async function loadFlashcardSets() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("User is not authenticated.");
      }
      const response = await fetch(`${API_BASE_URL}/flashcard-sets`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load flashcard sets.");
      }

      const data = await response.json();
      setFlashcardSets(data);
    } catch (loadError) {
      console.error(loadError);
      setError("Your flashcard sets could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFlashcardSets();
  }, []);

  if (loading) {
    return (
      <section className="flashcard-vault">
        <div className="vault-message">
          <p>Loading your flashcard vault...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flashcard-vault">
        <div className="vault-message vault-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  function handleFlipCard(cardId) {
    setFlippedCards((currentCards) => ({
      ...currentCards,
      [cardId]: !currentCards[cardId],
    }));
  }

  async function handleDeleteSet(flashcardSetId) {
    const shouldDelete = window.confirm(
      "Delete this flashcard set and all of its cards?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(
        `${API_BASE_URL}/flashcard-sets/${flashcardSetId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to delete flashcard set.");
      }

      setFlashcardSets((currentSets) =>
        currentSets.filter(
          (flashcardSet) => flashcardSet.id !== flashcardSetId,
        ),
      );
    } catch (deleteError) {
      console.error(deleteError);
      setError("The flashcard set could not be deleted.");
    }
  }

  function renderUnderline(text) {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <u key={index}>{part.slice(2, -2)}</u>;
      }
      return part;
    });
  }

  const currentNativeLanguage = nativeLanguage || "English";

  function openSet(flashcardSet) {
    setSelectedSet(flashcardSet);
    setSelectedCards(shuffleCards(flashcardSet.flashcards || []));
    setCurrentCardIndex(0);
    setFlippedCards({});
  }

  function studyAllCards() {
    const allCards = flashcardSets.flatMap(
      (flashcardSet) => flashcardSet.flashcards || []
    );

    setSelectedSet({ name: "All Cards" });
    setSelectedCards(shuffleCards(allCards));
    setCurrentCardIndex(0);
    setFlippedCards({});
  }

  function nextCard() {
    setChangingCard(true);
    setCurrentCardIndex((currentIndex) =>
      Math.min(currentIndex + 1, selectedCards.length - 1)
    );

    setFlippedCards({});
    requestAnimationFrame(() => {
      setChangingCard(false);
    });
  }

  function previousCard() {
    setChangingCard(true);
    setCurrentCardIndex((currentIndex) =>
      Math.max(currentIndex - 1, 0)
    );

    setFlippedCards({});
    requestAnimationFrame(() => {
      setChangingCard(false);
    });
  }

  function shuffleCards(cards) {
    const shuffled = [...cards];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  async function explain(original, corrected, nativeLanguage, targetLanguage) {
    if (targetLanguage == "Unknown") {
      targetLanguage = "English"
    }
    const response = await fetch(`${API_BASE_URL}/explanation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original: original,
        corrected: corrected,
        native_language: nativeLanguage,
        target_language: targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error("The explanation could not be generated.");
    }

    const data = await response.json();

    if (!data.explanation) {
      throw new Error("No explanation was returned.");
    }

    return {
      explanation: data.explanation,
      category: data.category
    };
  }

  async function generateExplanation(currentCard) {

    const [cor, exp] = currentCard.back.split("||");
    if (exp) {
      console.log("Explanation already exists: ", currentCard.back);
      return;
    }
    setExpLoading(true);

    try {
      const response = await explain(
        currentCard.front,
        cor,
        currentNativeLanguage,
        currentCard.language,
      );

      const updatedCard = {
        ...currentCard,
        back: currentCard.back.split("||")[0] + "||" + response.explanation
      };

      setSelectedCards(prev =>
        prev.map(card =>
          card.front === updatedCard.front ? updatedCard : card
        )
      );

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("User is not authenticated.");
        }
        const response = await fetch(`${API_BASE_URL}/flashcards/${currentCard.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            front: updatedCard.front,
            back: updatedCard.back,
            language: updatedCard.language,
            mastered: updatedCard.mastered,
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to update flashcard.");
        }

        const data = await response.json();

      } catch (loadError) {
        console.error(loadError);
        setError("Unable to update flashcard.");
      } finally {
        setLoading(false);
      }

      setSelectedCards(prev =>
        prev.map(card =>
          card.front === updatedCard.front ? updatedCard : card
        )
      );

    } finally {
      setExpLoading(false);
    }
  }

  async function handleBackToVault() {
    setSelectedSet(null);
    setSelectedCards([]);
    setCurrentCardIndex(0);
    await loadFlashcardSets();
  }

  if (selectedSet) {
    console.log("Selected flashcard set:", selectedSet);
    const currentCard = selectedCards[currentCardIndex];
    const [correctedText, explanation] = currentCard.back.split("||");

    if (!currentCard) {
      return null;
    }
    const cardKey = currentCard.id ?? `${selectedSet.id}-${currentCardIndex}`;
    const isFlipped = Boolean(flippedCards[cardKey]);

    return (
      <section className="flashcard-vault">
        <button
          type="button"
          className="edit-card-button"
          onClick={() => {handleBackToVault();}
          }
        >
          ← Back to Vault
        </button>

        <h2>{selectedSet.name}</h2>

        <p>
          Card {currentCardIndex + 1} of {selectedCards.length}
        </p>


        <div className="vault-study-area">
          <div
            type="button"
            className="study-card-container"
            onClick={() => handleFlipCard(cardKey)}
            aria-label={
              isFlipped ? "Show front of flashcard" : "Show answer"
            }
          >
            <div
              className={`study-card-inner
                ${isFlipped ? "is-flipped" : ""}
                ${changingCard ? "no-animation" : ""}`}
            >
              <div className="study-card-face study-card-front">
                <h3>{renderUnderline(currentCard.front)}</h3>
                <p className="study-card-hint">
                  Click to reveal answer
                </p>
              </div>

              <div className="study-card-face study-card-back">
                <h3>{renderUnderline(correctedText)}</h3>
                {explanation ? (
                  <p className='back-explanation'>
                    {explanation}
                  </p>
                ) : (
                  <button
                  className="generate-explanation-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    generateExplanation(currentCard);
                  }}
                  disabled={exp_loading}
                  >
                    {exp_loading ? "Please wait..." : "Generate Explanation"}
                  </button>
                )}
                <p className="study-card-hint">Click to see prompt</p>
              </div>
            </div>
          </div>

          <div className="study-navigation">
            <button
              type="button"
              onClick={previousCard}
              disabled={currentCardIndex === 0}
            >
              ← Previous
            </button>

            <span>
              {currentCardIndex + 1} / {selectedCards.length}
            </span>

            <button
              type="button"
              onClick={nextCard}
              disabled={currentCardIndex === selectedCards.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flashcard-vault">
      <header className="vault-header">
        <div>
          <p className="vault-eyebrow">Your collection</p>
          <h2>Flashcard Vault</h2>

          <p className="vault-count">
            {flashcardSets.length} {flashcardSets.length === 1 ? "set" : "sets"}
          </p>
        </div>
        <button
          type="button"
          className="app-button app-button--special study-all-button"
          onClick={studyAllCards}
        >
          Study All Cards
        </button>
      </header>

      {flashcardSets.length === 0 ? (
        <div className="vault-empty-state">
          <div className="vault-empty-icon">📚</div>

          <h3>Your vault is empty</h3>

          <p>
            Complete a journal correction or Conquer Cards session to save your
            first flashcard set.
          </p>
        </div>
      ) : (
        <div className="vault-grid">
          {flashcardSets.map((flashcardSet) => (
            <article className="vault-card" key={flashcardSet.id}>
              <div className="vault-card-top">
                <span className="vault-language">{flashcardSet.language}</span>

                <span className="vault-status learning">
                  {flashcardSet.source_type || "manual"}
                </span>
              </div>

              <div className="vault-card-content">
                <p className="vault-card-label">Flashcard Set</p>

                <h3>{flashcardSet.name}</h3>

                <p className="vault-card-back">
                  {flashcardSet.flashcards?.length ?? 0}{" "}
                  {flashcardSet.flashcards?.length === 1 ? "card" : "cards"}
                </p>
              </div>

              <div className="vault-card-actions">
                <button
                  type="button"
                  className="edit-card-button"
                  onClick={() => openSet(flashcardSet)}
                >
                  Open Set
                </button>

                <button
                  type="button"
                  className="delete-card-button"
                  onClick={() => handleDeleteSet(flashcardSet.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default FlashcardVault;

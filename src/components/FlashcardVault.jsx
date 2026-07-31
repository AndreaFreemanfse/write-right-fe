import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./FlashcardVault.css";

function FlashcardVault() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSet, setSelectedSet] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    async function loadFlashcardSets() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("User is not authenticated.");
        }
        const response = await fetch("http://localhost:8000/flashcard-sets", {
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
        `http://localhost:8000/flashcard-sets/${flashcardSetId}`,
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

  if (selectedSet) {
    console.log("Selected flashcard set:", selectedSet);
    return (
      <section className="flashcard-vault">
        <button
          type="button"
          className="edit-card-button"
          onClick={() => setSelectedSet(null)}
        >
          ← Back to Vault
        </button>

        <h2>{selectedSet.name}</h2>

        <p>
          {selectedSet.flashcards.length}{" "}
          {selectedSet.flashcards.length === 1 ? "card" : "cards"}
        </p>

        <div className="vault-grid">
          {selectedSet.flashcards.map((card, index) => {
            const cardKey = card.id ?? `${selectedSet.id}-${index}`;
            const isFlipped = Boolean(flippedCards[cardKey]);

            return (
              <button
                key={cardKey}
                type="button"
                className="study-card-container"
                onClick={() => handleFlipCard(cardKey)}
                aria-label={
                  isFlipped ? "Show front of flashcard" : "Show answer"
                }
              >
                <div
                  className={`study-card-inner ${
                    isFlipped ? "is-flipped" : ""
                  }`}
                >
                  <div className="study-card-face study-card-front">
                    <h3>{card.front}</h3>
                    <p className="study-card-hint">Click to reveal answer</p>
                  </div>

                  <div className="study-card-face study-card-back">
                    <h3>{card.back}</h3>
                    <p className="study-card-hint">Click to see prompt</p>
                  </div>
                </div>
              </button>
            );
          })}
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
                  onClick={() => setSelectedSet(flashcardSet)}
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

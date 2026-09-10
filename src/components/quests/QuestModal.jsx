import "./QuestModal.css";

function QuestModal({ quests, onClose, onBegin }) {
  if (!quests) {
    return null;
  }

  return (
    <div
      className="quest-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-modal-title"
    >
      <div className="quest-modal">
        <button
          type="button"
          className="quest-modal-close"
          onClick={onClose}
          aria-label="Close Quest Mode"
        >
          ×
        </button>

        <div className="quest-modal-journal" aria-hidden="true">
          📖
        </div>

        <p className="quest-modal-eyebrow">
          PERSONALIZED PRACTICE
        </p>

        <h2 id="quest-modal-title">
          Quest Mode
        </h2>

        <p className="quest-modal-language">
          {quests.target_language} Adventure
        </p>

        <p className="quest-modal-description">
          Your journal corrections have become today's
          personalized quests.
        </p>

        <div className="quest-modal-count">
          <span aria-hidden="true">✦</span>
          <strong>3 Quests</strong>
          <span aria-hidden="true">✦</span>
        </div>

        <div className="quest-modal-quest-list">
          <span>1. Spot the Mistake</span>
          <span>2. Spelling Challenge</span>
          <span>3. Matching Game</span>
        </div>

        <button
          type="button"
          className="quest-modal-begin"
          onClick={onBegin}
        >
          Begin Adventure
          <span aria-hidden="true"> →</span>
        </button>
      </div>
    </div>
  );
}

export default QuestModal;
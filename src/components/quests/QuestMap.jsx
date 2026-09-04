import "./QuestMap.css";

const QUESTS = [
  { id: "fill-blank", icon: "✍️", label: "Fill in the Blank" },
  { id: "spelling", icon: "✨", label: "Spelling Challenge" },
  { id: "matching", icon: "🧩", label: "Matching Game" },
];

function QuestMap({ quests, completedQuests, onClose, onSelectQuest }) {
  const completedCount = completedQuests.length;
  const allComplete = completedCount === 3;

  function getQuestStatus(id) {
    if (completedQuests.includes(id)) return "complete";

    const idx = QUESTS.findIndex((q) => q.id === id);
    if (idx === 0) return "available";
    const prevId = QUESTS[idx - 1].id;
    if (completedQuests.includes(prevId)) return "available";

    return "locked";
  }

  return (
    <div
      className="quest-map-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-map-title"
    >
      <div className="quest-map-card">
        <button
          type="button"
          className="quest-map-close"
          onClick={onClose}
          aria-label="Close Quest Mode"
        >
          ×
        </button>

        <p className="quest-map-eyebrow">PERSONALIZED PRACTICE</p>
        <h2 id="quest-map-title">Quest Map</h2>
        <p className="quest-map-language">{quests.target_language} Adventure</p>

        <div className="quest-map-progress-bar">
          <div
            className="quest-map-progress-fill"
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
          <span className="quest-map-progress-label">
            {completedCount}/3 Quests
          </span>
        </div>

        <div className="quest-map-path">
          <svg
            className="quest-map-lines"
            viewBox="0 0 600 120"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <line
              x1="100" y1="60" x2="300" y2="60"
              className={`quest-map-line ${completedQuests.includes("fill-blank") ? "filled" : ""}`}
            />
            <line
              x1="300" y1="60" x2="500" y2="60"
              className={`quest-map-line ${completedQuests.includes("spelling") ? "filled" : ""}`}
            />
          </svg>

          {QUESTS.map((quest) => {
            const status = getQuestStatus(quest.id);
            const isClickable = status === "available";

            return (
              <button
                type="button"
                key={quest.id}
                className={`quest-map-node ${status} ${isClickable ? "clickable" : ""}`}
                onClick={() => isClickable && onSelectQuest(quest.id)}
                disabled={!isClickable}
                aria-label={`${quest.label} - ${status}`}
              >
                <div className="quest-node-ring">
                  <span className="quest-node-icon" aria-hidden="true">
                    {status === "complete" ? "✓" : quest.icon}
                  </span>
                </div>
                <span className="quest-node-label">{quest.label}</span>
                {status === "locked" && (
                  <span className="quest-node-lock" aria-hidden="true">🔒</span>
                )}
              </button>
            );
          })}
        </div>

        {allComplete && (
          <div className="quest-map-all-complete">
            <span aria-hidden="true">🎉</span>
            All quests complete!
          </div>
        )}

        <p className="quest-map-hint">
          {allComplete
            ? "Check out your results!"
            : "Tap an available quest to begin"}
        </p>
      </div>
    </div>
  );
}

export default QuestMap;

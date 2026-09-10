import "./QuestTrigger.css";

function QuestTrigger({ onClick, loading = false }) {
  return (
    <button
      type="button"
      className="quest-trigger"
      onClick={onClick}
      disabled={loading}
      aria-label={
        loading
          ? "Generating personalized quests"
          : "Open personalized quests"
      }
      title="Quest Mode"
    >
      <span className="quest-trigger-glow" aria-hidden="true" />

      <span className="quest-trigger-icon" aria-hidden="true">
        {loading ? "✨" : "📖"}
      </span>

      <span className="quest-trigger-label">
        {loading ? "Creating Quests..." : "Quest Mode"}
      </span>
    </button>
  );
}

export default QuestTrigger;
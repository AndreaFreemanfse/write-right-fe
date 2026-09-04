import "./QuestTransition.css";

const QUEST_META = {
  "fill-blank": { icon: "✍️", label: "Fill in the Blank" },
  spelling: { icon: "✨", label: "Spelling Challenge" },
  matching: { icon: "🧩", label: "Matching Game" },
};

function QuestTransition({ questId }) {
  const meta = QUEST_META[questId];

  if (!meta) return null;

  return (
    <div className="quest-transition-backdrop">
      <div className="quest-transition-card">
        <div className="quest-transition-next-label">
          NEXT QUEST
        </div>
        <div className="quest-transition-icon" aria-hidden="true">
          {meta.icon}
        </div>
        <h2 className="quest-transition-title">{meta.label}</h2>
      </div>
    </div>
  );
}

export default QuestTransition;

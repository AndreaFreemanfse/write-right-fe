import { useJournal } from "../../context/JournalContext";
import "./AchievementOverlay.css";

function AchievementOverlay() {
  const { achievement } = useJournal();

  if (!achievement) {
    return null;
  }

  return (
    <div className="achievement-overlay">
      <div className="achievement-card">

        <div className="achievement-icon">
          🏆
        </div>

        <p className="achievement-label">
          Achievement Unlocked
        </p>

        <h2>{achievement.title}</h2>

        <h3>{achievement.subtitle}</h3>

        <p>{achievement.description}</p>

        <div className="achievement-reward">
          +1 Journal Master Badge
        </div>

      </div>
    </div>
  );
}

export default AchievementOverlay;
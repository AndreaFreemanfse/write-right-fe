import "./JournalStats.css";
import Stack from "@mui/material/Stack";

export default function JournalStats({ entries }) {
  const totalEntries = entries.length;

  const totalCorrections = entries.reduce(
    (total, entry) => total + entry.mistakes.length,
    0,
  );

  return (
    <div className="journal-stats">
      <div className="stat-card">
        <span className="stat-icon entries-icon">📖</span>
        <div className="stat-content">
          <p>Total Entries</p>
          <h3>{totalEntries}</h3>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-icon corrections-icon">✨</span>

        <div className="stat-content">
          <p>Total Corrections</p>
          <h3>{totalCorrections}</h3>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-icon streak-icon">🔥</span>

        <div className="stat-content">
          <p>Day Streak</p>
          <h3>7</h3>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-icon improvement-icon">📈</span>

        <div className="stat-content">
          <p>Improvement</p>
          <h3>+12%</h3>
        </div>
      </div>
    </div>
  );
}

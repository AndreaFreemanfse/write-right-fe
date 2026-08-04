import "./JournalStats.css"

export default function JournalStats({entries}) {

  const totalEntries = entries.length;


  const totalCorrections = entries.reduce(
    (total, entry) =>
      total + entry.mistakes.length,
    0
  );


  return (
    <div className="journal-stats">

      <div className="stat-card">
        📖
        <h3>{totalEntries}</h3>
        <p>Total Entries</p>
      </div>


      <div className="stat-card">
        ✨
        <h3>{totalCorrections}</h3>
        <p>Total Corrections</p>
      </div>


      <div className="stat-card">
        🔥
        <h3>7</h3>
        <p>Day Streak</p>
      </div>


      <div className="stat-card">
        📈
        <h3>+12%</h3>
        <p>Improvement</p>
      </div>


    </div>
  );
}
export default function JournalCard({ entry }) {
  return (
    <div className="journal-card">
      <p className="date">{new Date(entry.created_at).toLocaleDateString()}</p>

      <p>{entry.original_text}</p>

      <span>✨ {entry.mistakes.length} corrections</span>
    </div>
  );
}

import "./JournalReview.css";

function JournalReview({ isOpen, onClose, journalEntryData }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h2 id="modal-title">{journalEntryData?.title}</h2>
          </div>
        </header>
        <section className="section-1">
          <div className="section-icon">✍️</div>
          <div>
            <p className="journal-meta">
              <span>
                {new Date(journalEntryData?.created_at).toLocaleDateString()}
              </span>
              <span aria-hidden="true"> | </span>
              <span className="vault-language">{journalEntryData?.target_language}</span>
            </p>

            <p>{journalEntryData?.original_text}</p>
          </div>
        </section>

        <footer className="modal-footer">
          <button type="button" className="modal-done" onClick={onClose}>
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}

export default JournalReview;

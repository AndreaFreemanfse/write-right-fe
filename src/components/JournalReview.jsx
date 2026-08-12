import "./JournalReview.css";

function JournalReview({ isOpen, onClose, journalEntryData }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="journal-review-modal-overlay" onClick={onClose}>
      <section
        className="journal-review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="journal-review-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="journal-review-modal-header">
          <div>
            <h2 id="journal-review-modal-title">{journalEntryData?.title}</h2>
          </div>
        </header>
        <section className="journal-review-section">
          <div className="journal-review-section-icon">✍️</div>
          <div>
            <p className="journal-review-journal-meta">
              <span>
                {new Date(journalEntryData?.created_at).toLocaleDateString()}
              </span>
              <span aria-hidden="true"> | </span>
              <span className="vault-language">
                {journalEntryData?.target_language}
              </span>
            </p>

            <p>{journalEntryData?.original_text}</p>
          </div>
        </section>

        <footer className="journal-review-modal-footer">
          <button
            type="button"
            className="journal-review-modal-done"
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}

export default JournalReview;

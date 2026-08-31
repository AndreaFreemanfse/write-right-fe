import "./JournalReview.css";

function JournalReview({
  isOpen,
  onClose,
  journalEntryData,
  handleEditJournal,
}) {
  if (!isOpen) {
    return null;
  }

  const formattedDate = journalEntryData?.created_at
    ? new Date(journalEntryData.created_at).toLocaleDateString()
    : "";

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
          <h2 id="journal-review-modal-title">{journalEntryData?.title}</h2>
        </header>

        <section className="journal-review-section">
          <div className="journal-review-section-icon" aria-hidden="true">
            ✍️
          </div>

          <div>
            <p className="journal-review-journal-meta">
              <span>{formattedDate}</span>

              {journalEntryData?.target_language ? (
                <>
                  <span aria-hidden="true">|</span>

                  <span className="vault-language">
                    {journalEntryData.target_language}
                  </span>
                </>
              ) : null}
            </p>

            <p className="journal-review-text">
              {journalEntryData?.original_text}
            </p>
          </div>
        </section>

        <footer className="journal-review-modal-footer">
          <button
            type="button"
            className="journal-review-modal-button"
            onClick={() => handleEditJournal(journalEntryData)}
          >
            Edit
          </button>
          <button
            type="button"
            className="journal-review-modal-button"
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

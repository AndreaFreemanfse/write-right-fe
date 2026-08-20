import "./HelpModal.css";

function HelpModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="help-modal-overlay"
      onClick={onClose}
    >
      <section
        className="help-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="help-modal-header">
          <div>
            <p className="help-modal-eyebrow">
              WriteRight Guide
            </p>

            <h2 id="help-modal-title">
              Help
            </h2>

            <p className="help-modal-introduction">
              Learn how to use WriteRight to improve your
              writing, understand corrections, build
              vocabulary, and practice what you learn.
            </p>
          </div>

          <button
            type="button"
            className="help-modal-close"
            onClick={onClose}
            aria-label="Close help"
          >
            ×
          </button>
        </header>

        <div className="help-modal-content">
          <section className="help-section">
            <div className="help-section-icon">
              ✍️
            </div>

            <div>
              <h3>Getting Started</h3>

              <p>
                WriteRight is a language-learning journal
                designed to help you practice writing and
                learn from clear, personalized feedback.
              </p>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section-icon">
              📓
            </div>

            <div>
              <h3>Writing Journal Entries</h3>

              <ul>
                <li>
                  Create a journal entry in the language
                  you are learning.
                </li>

                <li>
                  Write naturally and focus on expressing
                  your ideas.
                </li>

                <li>
                  Submit your entry when you are ready for
                  feedback.
                </li>
              </ul>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section-icon">
              ✅
            </div>

            <div>
              <h3>Reviewing Corrections</h3>

              <ul>
                <li>
                  Review the corrected version of your
                  journal entry.
                </li>

                <li>
                  Read each explanation to understand why
                  the original wording was incorrect.
                </li>

                <li>
                  Compare the correction with your original
                  sentence before continuing.
                </li>
              </ul>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section-icon">
              📖
            </div>

            <div>
              <h3>Using the Dictionary</h3>

              <ul>
                <li>
                  Open the Dictionary from the user menu.
                </li>

                <li>
                  Enter a word in your native language to
                  translate it into your target language.
                </li>

                <li>
                  Review definitions, pronunciation, and
                  examples when available.
                </li>

                <li>
                  Keep the Dictionary open while continuing
                  to write in your journal.
                </li>
              </ul>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section-icon">
              🗂️
            </div>

            <div>
              <h3>Using Flashcards</h3>

              <ul>
                <li>
                  Create flashcards from useful words,
                  phrases, and corrections.
                </li>

                <li>
                  Organize related flashcards into sets.
                </li>

                <li>
                  Review your saved flashcards regularly to
                  reinforce what you learned.
                </li>
              </ul>
            </div>
          </section>

          <section className="help-workflow">
            <p className="help-workflow-label">
              Recommended Workflow
            </p>

            <div className="help-workflow-steps">
              <span>Write</span>
              <strong>→</strong>
              <span>Review</span>
              <strong>→</strong>
              <span>Look Up</span>
              <strong>→</strong>
              <span>Create</span>
              <strong>→</strong>
              <span>Practice</span>
            </div>

            <p>
              Write regularly, review your corrections,
              investigate unfamiliar words, save useful
              material, and return later to practice.
            </p>
          </section>
        </div>

        <footer className="help-modal-footer">
          <button
            type="button"
            className="app-button app-button--special help-modal-done"
            onClick={onClose}
          >
            Got it
          </button>
        </footer>
      </section>
    </div>
  );
}

export default HelpModal;
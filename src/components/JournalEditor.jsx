import "./JournalEditor.css";
import LanguageSelectionDropdown from "./LanguageSelectionDropdown";
import { Stack } from "@mui/material";

function JournalEditor({
  text,
  setText,
  journalTitle,
  setJournalTitle,
  onAnalyze,
  loading,
  loadingMessage,
  error,
  setTargetLanguage,
}) {
  return (
    <div className="journal-editor">
      <Stack spacing={2}>
        <label className="journal-title-group">
          <input
            type="text"
            className="journal-title-input"
            value={journalTitle}
            onChange={(event) => setJournalTitle(event.target.value)}
            size={Math.max(journalTitle.length, 1)}
            placeholder="Name your journal"
            maxLength={80}
          />
        </label>

        <Stack direction="row" spacing={2}>
          <p className="editor-subtitle">
            Practice writing in your target language:
          </p>

          <LanguageSelectionDropdown
            onChange={setTargetLanguage}
            displayText="Target Language"
          />
        </Stack>

        <div className="journal-container">
          <textarea
            className="journal-textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write about your day..."
            disabled={loading}
            style={{
              opacity: loading ? 0.35 : 1,
              transition: "opacity 0.3s ease"
            }}
          />

          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>{loadingMessage}</p>
            </div>
          )}
        </div>

        <div className="editor-footer">
          <span className="character-count">{text.length} characters</span>

          <button
            type="button"
            className="analyze-button"
            onClick={onAnalyze}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Writing"}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </Stack>
    </div>
  );
}

export default JournalEditor;

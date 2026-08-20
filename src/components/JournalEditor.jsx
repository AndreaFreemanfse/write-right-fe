import { useState, useRef } from "react";
import "./JournalEditor.css";
import LanguageSelectionDropdown from "./LanguageSelectionDropdown";
import { Stack } from "@mui/material";
import { specialCharacters } from "../utils/constants/specialCharacters";

function JournalEditor({
  dictionaryOpen,
  text,
  setText,
  journalTitle,
  setJournalTitle,
  onAnalyze,
  loading,
  loadingMessage,
  error,
  targetLanguage,
  setTargetLanguage,
}) {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const [showSpecialCharacters, setShowSpecialCharacters] = useState(false);

  const textAreaRef = useRef(null);


  const handleLanguageChange = (language) => {
    setTargetLanguage(language);
    setLanguageDropdownOpen(false);
  };

  function insertSpecialCharacter(character) {
    const textarea = textAreaRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText =
      text.slice(0, start) +
      character +
      text.slice(end);

    setText(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + character.length,
        start + character.length
      );
    });
  }

  const characters = specialCharacters[targetLanguage] ?? [];

  return (
    <div
      className={`journal-editor app-page app-page--editor
      ${dictionaryOpen ? "journal-editor--dictionary-open" : ""}`}>
        
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
        <div className="language-selector-wrapper">
          {targetLanguage && !languageDropdownOpen ? (
            <button
              type="button"
              className="selected-language-button"
              onClick={() => setLanguageDropdownOpen(true)}
              aria-label={`Change target language from ${targetLanguage}`}
            >
              {targetLanguage.toUpperCase()}
            </button>
          ) : (
            <Stack
              direction="row"
              spacing={2}
             className="fade-in"
              sx={{ alignItems: "center" ,width: "100%"}}
            >
              <p className="editor-subtitle">
                Practice writing in your target language:
              </p>

              <LanguageSelectionDropdown
                value={targetLanguage}
                onChange={handleLanguageChange}
                displayText="Target Language"
              />
            </Stack>
          )}
        </div>

        <div className="journal-container">
          <textarea
            className="journal-textarea"
            value={text}
            ref={textAreaRef}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write about your day..."
            disabled={loading}
            style={{
              opacity: loading ? 0.35 : 1,
              transition: "opacity 0.3s ease",
            }}
          />

          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>{loadingMessage}</p>
            </div>
          )}
        </div>
        {characters.length > 0 && (
          <button
            type="button"
            className="special-character-toggle"
            onClick={() => setShowSpecialCharacters((current) => !current)}
          >
            {showSpecialCharacters
              ? "Hide Special Characters"
              : "View Special Characters"}
          </button>          
          )}
          {showSpecialCharacters && characters.length > 0 && (
              <div className="special-character-bar">
                {characters.map((character) => (
                  <button
                    key={character}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      insertSpecialCharacter(character);
                      console.log(character);
                    }}
                  >
                    {character}
                  </button>
                ))}
              </div>
            )}

        <div className="editor-footer">
          <span className="character-count">{text.length} characters</span>

          <button
            type="button"
            className="app-button app-button--special analyze-button"
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

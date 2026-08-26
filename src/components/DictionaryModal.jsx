import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../config/api";

import "./DictionaryModal.css";

const LANGUAGE_CODES = {
  english: "en",
  spanish: "es",
  french: "fr",
  german: "de",
  italian: "it",
  portuguese: "pt",

  japanese: "ja",
  korean: "ko",
  chinese: "zh",
  mandarin: "zh",
  cantonese: "yue",

  russian: "ru",
  ukrainian: "uk",
  polish: "pl",
  czech: "cs",
  slovak: "sk",
  hungarian: "hu",
  romanian: "ro",

  dutch: "nl",
  swedish: "sv",
  norwegian: "no",
  danish: "da",
  finnish: "fi",

  greek: "el",
  turkish: "tr",

  arabic: "ar",
  hebrew: "he",

  hindi: "hi",
  bengali: "bn",
  urdu: "ur",
  tamil: "ta",

  thai: "th",
  vietnamese: "vi",
  indonesian: "id",
  malay: "ms",

  swahili: "sw",
};


function formatLanguageName(language = "") {
  return language.charAt(0).toUpperCase() + language.slice(1);
}

function normalizeWord(word = "") {
  return word.trim().toLocaleLowerCase();
}

function DictionaryModal({ isOpen, onClose, nativeLanguage, targetLanguage }) {
  const [searchTerm, setSearchTerm] = useState("");
  const currentNativeLanguage = nativeLanguage || "english";
  const currentTargetLanguage = targetLanguage || "english";

  const [translationResult, setTranslationResult] = useState(null);
  const [dictionaryResult, setDictionaryResult] = useState(null);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const previousTargetLanguage = useRef(currentTargetLanguage);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setTranslationResult(null);
      setDictionaryResult(null);
      setSearchError("");
      setSearchLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const targetLanguageChanged =
      previousTargetLanguage.current !== currentTargetLanguage;

    previousTargetLanguage.current = currentTargetLanguage;

    if (
      !targetLanguageChanged ||
      !isOpen ||
      !searchTerm.trim() ||
      !translationResult
    ) {
      return;
    }

    async function refreshDictionary() {
      setSearchLoading(true);
      setSearchError("");
      setTranslationResult(null);
      setDictionaryResult(null);

      try {
        const translatedWord = await translateWord(searchTerm.trim());

        setTranslationResult(translatedWord);

        const definitionResult = await lookUpDefinition(
          translatedWord.translation,
        );

        setDictionaryResult(definitionResult);
      } catch (error) {
        console.error("Dictionary refresh failed:", error);

        setSearchError(
          error.message ||
            "Something went wrong while updating the dictionary.",
        );
      } finally {
        setSearchLoading(false);
      }
    }

    refreshDictionary();
  }, [currentTargetLanguage]);

  if (!isOpen) {
    return null;
  }

  async function translateWord(word) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        text: word,
        source_language: currentNativeLanguage,
        target_language: currentTargetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error("The word could not be translated.");
    }

    const data = await response.json();

    if (!data.translation) {
      throw new Error("No translation was returned.");
    }

    return {
      translation: data.translation,
      partOfSpeech: data.part_of_speech || "",
      originalText: data.original_text || word,
      interpretedText: data.interpreted_text || word,
    };
  }

  async function lookUpDefinition(word) {
    const languageCode = LANGUAGE_CODES[currentTargetLanguage.toLowerCase()];

    if (!languageCode) {
      return null;
    }

    const response = await fetch(
      `https://freedictionaryapi.com/api/v1/entries/${languageCode}/${encodeURIComponent(
        word,
      )}`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.entries?.length) {
      return null;
    }

    return data;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      setSearchError("Please enter a word.");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setTranslationResult(null);
    setDictionaryResult(null);

    try {
      const translatedWord = await translateWord(trimmedSearchTerm);

      setTranslationResult(translatedWord);

      const definitionResult = await lookUpDefinition(
        translatedWord.translation,
      );

      setDictionaryResult(definitionResult);
    } catch (error) {
      console.error("Dictionary search failed:", error);

      setSearchError(
        error.message || "Something went wrong while translating the word.",
      );
    } finally {
      setSearchLoading(false);
    }
  }

  const nativeLanguageTitle = formatLanguageName(currentNativeLanguage);

  const targetLanguageTitle = formatLanguageName(currentTargetLanguage);

  const spellingWasCorrected =
    translationResult &&
    normalizeWord(translationResult.originalText) !==
      normalizeWord(translationResult.interpretedText);

  return (
    <div className="dictionary-modal-overlay">
      <section
        className="dictionary-modal"
        role="dialog"
        aria-modal="false"
        aria-labelledby="dictionary-title"
      >
        <div className="dictionary-modal-header">
          <div>
            <h2 id="dictionary-title">
              {nativeLanguageTitle} to {targetLanguageTitle} Dictionary
            </h2>
          </div>

          <button
            type="button"
            className="dictionary-modal-close"
            onClick={onClose}
            aria-label="Close dictionary"
          >
            ×
          </button>
        </div>

        <form className="dictionary-search-form" onSubmit={handleSubmit}>
          <label htmlFor="dictionary-search">
            What would you like to translate?
          </label>

          <div className="dictionary-search-row">
            <input
              id="dictionary-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={`Enter a word in ${currentNativeLanguage}`}
              autoComplete="off"
            />

            <button 
              type="submit"
              className="app-button app-button--special"
              disabled={searchLoading}>

              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {searchError && (
          <p className="dictionary-search-error" role="alert">
            {searchError}
          </p>
        )}

        {!translationResult && !searchError && !searchLoading && (
          <div className="dictionary-empty-state">
            <span className="dictionary-empty-icon">📖</span>

            <p>Enter a word to see its {targetLanguageTitle} translation.</p>
          </div>
        )}

        {translationResult && (
          <div className="dictionary-results">
            {spellingWasCorrected && (
              <div className="dictionary-suggestion" role="status">
                Did you mean{" "}
                <button
                  type="button"
                  className="dictionary-suggestion-word"
                  onClick={() =>
                    setSearchTerm(translationResult.interpretedText)
                  }
                >
                  {translationResult.interpretedText}
                </button>
                ?
              </div>
            )}
            <div className="dictionary-translation-result">
              <h3>{translationResult.translation}</h3>

              <p className="dictionary-translation-summary">
                {targetLanguageTitle}
                {translationResult.partOfSpeech
                  ? ` ${translationResult.partOfSpeech}`
                  : " word"}{" "}
                for “{translationResult.interpretedText}”
              </p>
            </div>

            {dictionaryResult ? (
              <div className="dictionary-definitions">
                {dictionaryResult.entries
                  .slice(0, 3)
                  .map((entry, entryIndex) => (
                    <div
                      className="dictionary-entry"
                      key={`${entry.partOfSpeech || "entry"}-${entryIndex}`}
                    >
                      {entry.partOfSpeech && (
                        <p className="dictionary-part-of-speech">
                          {entry.partOfSpeech}
                        </p>
                      )}

                      {entry.pronunciations?.[0]?.text && (
                        <p className="dictionary-pronunciation">
                          {entry.pronunciations[0].text}
                        </p>
                      )}

                      {entry.senses?.slice(0, 3).map((sense, senseIndex) => (
                        <div
                          className="dictionary-sense"
                          key={`${entryIndex}-${senseIndex}`}
                        >
                          <p>
                            <strong>{senseIndex + 1}.</strong>{" "}
                            {sense.definition}
                          </p>

                          {sense.examples?.[0] && (
                            <p className="dictionary-example">
                              “{sense.examples[0]}”
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                <p className="dictionary-attribution">
                  Definitions provided by FreeDictionaryAPI.com and Wiktionary.
                </p>
              </div>
            ) : (
              <p className="dictionary-no-definition">
                Translation found, but no additional dictionary definition was
                available.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default DictionaryModal;

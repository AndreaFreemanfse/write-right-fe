// an inital page to set user presets

function SelectUserPresets() {
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  const handleContinue = async () => {
    // save both to Supabase
  };

  return (
    <div className="preset-page">
      <h1>Let's personalize WriteRight</h1>

      <p>
        Tell us about your language preferences so we can personalize your
        learning experience.
      </p>

      <label>Native language</label>
      <LanguageSelectionDropdown
        value={nativeLanguage}
        onChange={setNativeLanguage}
        displayText="Select your native language"
      />

      <label>Language you're learning</label>
      <LanguageSelectionDropdown
        value={targetLanguage}
        onChange={setTargetLanguage}
        displayText="Select a language"
      />

      <button
        onClick={handleContinue}
        disabled={!nativeLanguage || !targetLanguage}
      >
        Continue
      </button>
    </div>
  );
}

export default SelectUserPresets;

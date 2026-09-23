import { useNavigate } from "react-router-dom";
import LanguageSelectionDropdown from "../components/LanguageSelectionDropdown";
import { useJournal } from "../context/JournalContext";
import "./SelectUserPresets.css";

function SelectUserPresets() {
  const navigate = useNavigate();

  const {
    nativeLanguage,
    setNativeLanguage,
  } = useJournal();

  const handleContinue = async () => {
    if (!nativeLanguage) return;

    try {
      navigate("/write", { replace: true });
    } catch (error) {
      console.error(
        "Failed to save native language:",
        error,
      );
    }
  };

  return (
    <div className="select-presets-page">
      <div className="select-presets-card">
        <div className="select-presets-header">
          <h1>Choose Your Native Language</h1>

          <p>
            Select the language you are most comfortable
            speaking.
          </p>
        </div>

        <div className="select-presets-form">
          <div className="language-field">
            <label htmlFor="language-selection">
              Native Language
            </label>

            <LanguageSelectionDropdown
              value={nativeLanguage}
              onChange={setNativeLanguage}
              displayText="Select your native language"
              languageType="native"
            />
          </div>

          <button
            type="button"
            className="select-presets-button"
            onClick={handleContinue}
            disabled={!nativeLanguage}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectUserPresets;
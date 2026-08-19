import { useState } from "react";
import { useNavigate} from "react-router-dom";

import { updateNativeLanguage } from "../services/auth";

import LanguageSelectionDropdown from "../components/LanguageSelectionDropdown";
import "./SelectUserPresets.css";

function SelectUserPresets() {
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!nativeLanguage) {
      return;
    }

    try {
      await updateNativeLanguage(nativeLanguage);

      navigate("/write", { replace: true });
    } catch (error) {
      console.error("Failed to save native language:", error);
    }
  };

  return (
    <div className="select-presets-page">
      <div className="select-presets-card">
        <div className="select-presets-header">
          <h1>Let's personalize your language journey</h1>

          <p>
            Tell us a little about your language preferences so we can
            personalize your learning experience.
          </p>
        </div>

        <div className="select-presets-form">
          <div className="language-field">
            <label htmlFor="native-language">Native language</label>

            <LanguageSelectionDropdown
              value={nativeLanguage}
              onChange={setNativeLanguage}
              displayText="Select your native language"
            />
          </div>

          {/* <div className="language-field">
            <label htmlFor="target-language">
              Language you're learning
            </label>

            <LanguageSelectionDropdown
              value={targetLanguage}
              onChange={setTargetLanguage}
              displayText="Select a language"
            />
          </div> */}

          <button
            className="select-presets-button"
            type="button"
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

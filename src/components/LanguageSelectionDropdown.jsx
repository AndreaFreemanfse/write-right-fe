import { languages } from "../utils/constants/languages";
import "./LanguageSelectionDropdown.css";
import { updateNativeLanguage } from "../services/auth";

function LanguageSelectionDropdown({ value = "", onChange, displayText }) {
  const handleChange = async (event) => {
    const nativeLanguage = event.target.value;
    onChange(nativeLanguage);
    try {
      await updateNativeLanguage(nativeLanguage);
    } catch (error) {
      console.error("Failed to save native language:", error);
    }
  };

  const sortedLanguages = Object.entries(languages).sort(
    ([, nameA], [, nameB]) => nameA.localeCompare(nameB),
  );

  return (
    <select
      className="language-select"
      id="language-selection"
      name="languages"
      value={value}
      onChange={handleChange}
    >
      <option value="" disabled hidden>
        {displayText}
      </option>

      {(sortedLanguages).map(([code, name]) => (
        <option key={code} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelectionDropdown;

import { languages } from "../utils/constants/languages";
import "./LanguageSelectionDropdown.css";
import { updateNativeLanguage } from "../services/auth";

function LanguageSelectionDropdown({
  value = "",
  onChange,
  displayText,
  languageType,
}) {
  const handleChange = async (event) => {
    const language = event.target.value;

    onChange(language);

    if (languageType !== "native") {
      return;
    }

    try {
      await updateNativeLanguage(language);
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

      {sortedLanguages.map(([code, name]) => (
        <option key={code} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelectionDropdown;
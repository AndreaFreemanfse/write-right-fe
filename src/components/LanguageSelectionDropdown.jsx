import { languages } from "../utils/constants/languages";
import "./LanguageSelectionDropdown.css";

function LanguageSelectionDropdown({ value = "", onChange, displayText }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <select
      className="app-dropdown language-select"
      id="language-selection"
      name="languages"
      value={value}
      onChange={handleChange}
    >
      <option value="" disabled hidden>
        {displayText}
      </option>

      {Object.entries(languages).map(([code, name]) => (
        <option key={code} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelectionDropdown;
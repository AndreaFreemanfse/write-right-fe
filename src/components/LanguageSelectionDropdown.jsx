import { languages } from "../utils/constants/languages";

function LanguageSelectionDropdown({ value = "", onChange, displayText }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <select
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
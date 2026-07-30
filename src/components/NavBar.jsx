import { Stack } from "@mui/material";
import { NavLink } from "react-router-dom";

// import LanguageSelectionDropdown from "./LanguageSelectionDropdown";
import DropDownMenu from "./DropDownMenu";

import "./NavBar.css";

function Navbar({ setNativeLanguage, onOpenDictionary, onOpenHelp }) {
  return (
    <div className="navbar">
      <Stack direction="row" spacing={2}>
        <span className="logo-icon">✍️</span>
        <span className="logo-text">WriteRight</span>
      </Stack>

      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        Write
      </NavLink>

      <NavLink
        to="/flashcards"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        Flashcards
      </NavLink>
      <DropDownMenu setNativeLanguage={setNativeLanguage} onOpenDictionary={onOpenDictionary} onOpenHelp={onOpenHelp} />
    </div>
  );
}

export default Navbar;

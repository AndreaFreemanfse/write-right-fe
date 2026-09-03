import { Stack } from "@mui/material";
import { NavLink } from "react-router-dom";

import DropDownMenu from "./DropDownMenu";

import "./NavBar.css";

function Navbar() {
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

      <NavLink
        to="/journal-entries"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        Journal Entries
      </NavLink>

      <DropDownMenu />
    </div>
  );
}

export default Navbar;
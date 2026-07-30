import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../services/auth";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./DropDownMenu.css";
import {
  Popover,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LanguageSelectionDropdown from "./LanguageSelectionDropdown";

// This component accepts an icon and menuOptions. MenuOptions can be a list of
function DropDownMenu({ nativeLanguage, setNativeLanguage, onOpenDictionary, onOpenHelp }) {
  const id = React.useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // sign out user
  async function handleSignOut(event) {
    try {
      setAnchorEl(null);
      await signOut();

      navigate("/signin");
    } catch (error) {
      setMessage(error.message);
    }
  }

  // manage opening and closing menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // closes the dropdown menu when the screen is resized
  React.useEffect(() => {
    const handleResize = () => {
      setAnchorEl(null);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // manage the settings dialog
  function openSettings() {
    setSettingsOpen(true);
    handleClose();
  }

  function closeSettings() {
    setSettingsOpen(false);
  }

  function openDictionary() {
    onOpenDictionary();
    handleClose();
  }

  return (
    <div>
      <Button
        id={buttonId}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleClick}
      >
        <AccountCircleOutlinedIcon
          className="navbar-user"
          fontSize="large"
          sx={{
            color: "#555555",
          }}
        />
      </Button>
      <Menu
        className="drop-down-menu"
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transitionDuration={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        slotProps={{
          list: {
            "aria-labelledby": buttonId,
          },
        }}
      >
        <MenuItem
          className="drop-down-menu-item"
          key="dictionary"
          onClick={openDictionary}
          sx={{
            color: "#555555",
            "&:hover": {
              backgroundColor: "#6d28d9",
              color: "white",
            },
          }}
        >
          Dictionary
        </MenuItem>
        <MenuItem
          className="drop-down-menu-item"
          key="settings"
          onClick={(event) => openSettings(event)}
          sx={{
            color: "#555555",
            "&:hover": {
              color: "#5555",
              backgroundColor: "#6d28d9",
              color: "white",
            },
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          className="drop-down-menu-item"
          key="help"
          onClick={() => {
            onOpenHelp();
            handleClose();
          }}
          sx={{
            color: "#555555",
            "&:hover": {
              backgroundColor: "#6d28d9",
              color: "white",
            },
          }}
        >
          Help
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSignOut();
          }}
          className="drop-down-menu-item"
          key="sign-out"
          sx={{
            color: "#555555",
            "&:hover": {
              backgroundColor: "#6d28d9",
              color: "white",
            },
          }}
        >
          Sign Out
        </MenuItem>
      </Menu>

      {/* Settings dialog */}
      <Dialog
        open={settingsOpen}
        onClose={closeSettings}
        slotProps={{
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.25)",
          },
        }}
      >
        <DialogTitle>Settings</DialogTitle>

        <DialogContent>
          <LanguageSelectionDropdown
            value={nativeLanguage}
            onChange={setNativeLanguage}
            displayText={"Native Language"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DropDownMenu;

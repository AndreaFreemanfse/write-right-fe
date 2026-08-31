import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../services/auth";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./DropDownMenu.css";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

// This component accepts an icon and menuOptions. MenuOptions can be a list of
function DropDownMenu({
  setNativeLanguage,
  setTargetLanguage,
  setJournalText,
  setJournalTitle,
  setActiveModal,
  onOpenDictionary,
  onOpenHelp,
  onOpenSettings,
  setCorrections,
  setReviewMode,
  nativeLanguage,
}) {
  const id = React.useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const isWritePage = location.pathname === "/write";

  // sign out user
  async function handleSignOut() {
    try {
      setAnchorEl(null);

      await signOut();

      // Reset user-specific app state
      setJournalText("");
      setJournalTitle("Untitled Journal");
      setCorrections([]);
      setReviewMode(false);
      setNativeLanguage("english");
      setTargetLanguage("");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  // manage opening and closing menu
  const handleClick = (event) => {
    setActiveModal(null);
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

  function openDictionary() {
    handleClose();
    onOpenDictionary();
  }

  function openProfile() {
    handleClose();
    navigate("/profile");
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
          key="profile"
          onClick={openProfile}
          sx={{
            color: "#555555",
            "&:hover": {
              backgroundColor: "#6d28d9",
              color: "white",
            },
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          className="drop-down-menu-item"
          key="dictionary"
          disabled={!isWritePage}
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
          onClick={() => {
            handleClose();
            onOpenSettings();
          }}
          sx={{
            color: "#555555",
            "&:hover": {
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
            handleClose();
            onOpenHelp();
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
    </div>
  );
}

export default DropDownMenu;

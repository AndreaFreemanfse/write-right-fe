import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import LanguageSelectionDropdown from "./LanguageSelectionDropdown";
import { useJournal } from "../context/JournalContext";
import { useState } from "react";
import "./SettingsModal.css";

function SettingsModal() {
  const {
    activeModal,
    setActiveModal,
    nativeLanguage,
    setNativeLanguage,
    darkMode,
    setDarkMode,
  } = useJournal();

  const isOpen = activeModal === "settings";

  const onClose = () => {
    setActiveModal(null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
          displayText="Native Language"
        />
        <div className="dark-mode-toggle">
          <span>Dark Mode</span>

          <button
            className={`toggle ${darkMode ? "active" : ""}`}
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            <span className="toggle-circle"></span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsModal;
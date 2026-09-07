import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import LanguageSelectionDropdown from "./LanguageSelectionDropdown";
import { useJournal } from "../context/JournalContext";

function SettingsModal() {
  const {
    activeModal,
    setActiveModal,
    nativeLanguage,
    setNativeLanguage,
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
      </DialogContent>
    </Dialog>
  );
}

export default SettingsModal;
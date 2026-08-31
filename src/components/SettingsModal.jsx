import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import LanguageSelectionDropdown from "./LanguageSelectionDropdown";

function SettingsModal({
  isOpen,
  onClose,
  nativeLanguage,
  setNativeLanguage,
}) {
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
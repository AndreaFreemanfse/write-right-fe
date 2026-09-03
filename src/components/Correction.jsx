import { useRef, useEffect } from "react";
import "./Correction.css";
import CorrectionTooltip from "./CorrectionTooltip";




function Correction({ mistake, onCreateFlashcard, isOpen, onClick, onClose,}) {

  // Ref for the wrapper element to detect outside clicks
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Only listen for outside clicks when this tooltip is open
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <span
      ref={wrapperRef}
      className={`correction-wrapper ${isOpen ? "active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Original incorrect text */}
      <span className="incorrect-text">{mistake.original}</span>

      {/* Corrected text */}
      <span className="corrected-text">{mistake.corrected}</span>

      {/* Tooltip */}
      {isOpen && (
        <CorrectionTooltip
          mistake={mistake}
          onCreateFlashcard={onCreateFlashcard}
        />
      )}
    </span>
  );
}

export default Correction;

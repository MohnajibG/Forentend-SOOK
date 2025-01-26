import React from "react";
import "../assets/styles/modal.css";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  variant?: "details" | "images";
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  children,
  variant = "details",
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${
          variant === "details" ? "modal-details" : "modal-images"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button className="close-btn" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
};

export default Modal;

import React, { useEffect, useRef } from "react";

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
  const dialogRef = useRef<HTMLDivElement>(null);

  // Fermer avec ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus initial sur le contenu
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Tailles selon variante
  const sizeClasses =
    variant === "images"
      ? "w-[90vw] max-w-5xl max-h-[80vh] overflow-auto"
      : "w-[90vw] max-w-xl"; // details ~600px

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-center justify-center px-4 py-6 animate-[fadeIn_.15s_ease-out]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative bg-white rounded-2xl shadow-xl p-5 md:p-6 ${sizeClasses} outline-none animate-[zoomIn_.15s_ease-out]`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        <button
          onClick={onClose}
          className="
            mt-5 inline-flex items-center justify-center
            px-4 py-2 rounded-md font-semibold text-white
            bg-[#ff4d4d] hover:bg-[#e60000] transition-colors
            focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]/50
          "
        >
          Fermer
        </button>

        {/* bouton X (optionnel) */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="
            absolute top-3 right-3 w-9 h-9 grid place-items-center
            rounded-full bg-black/5 hover:bg-black/10
            text-black/70 text-lg
          "
        >
          ×
        </button>
      </div>

      {/* animations keyframes */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes zoomIn { from { transform: scale(.98); opacity:.8 } to { transform: scale(1); opacity:1 } }
      `}</style>
    </div>
  );
};

export default Modal;

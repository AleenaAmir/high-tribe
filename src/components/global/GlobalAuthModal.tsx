import React, { useEffect, useRef } from "react";

interface GlobalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

const GlobalAuthModal: React.FC<GlobalAuthModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 transition-opacity"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      // onClick={onClose}
    >
      <div
        className={`rounded-[20px] bg-gradient-to-r from-[rgba(255,23,23,0.51)] via-[rgba(9,0,255,0.51)] to-[rgba(228,31,100,0.51)] p-3 max-w-[434px] w-full`}
      >
        <div
          className={`bg-white rounded-[20px] shadow-lg  w-full p-6 relative ${
            className || ""
          } `}
          ref={modalRef}
          tabIndex={0}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default GlobalAuthModal;

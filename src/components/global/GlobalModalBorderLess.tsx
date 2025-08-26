import React, { useEffect, useRef } from "react";

interface GlobalModalBorderLessProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  customPadding?: string;
  customHeight?: string;
}

const GlobalModalBorderLess: React.FC<GlobalModalBorderLessProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = "max-w-[434px]",
  customHeight = "h-[80vh]",
  customPadding = "p-6",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;

      // Add styles to prevent scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Cleanup function to restore scrolling
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    // onClick={onClose}
    >
      <div className={`rounded-[20px] p-2 ${maxWidth} w-full ${customHeight}`}>
        <div
          className={`bg-white rounded-[20px] shadow-lg  w-full ${customPadding} relative ${className || ""
            } `}
          ref={modalRef}
          tabIndex={0}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-4 z-10 text-gray-400 hover:text-gray-600 focus:outline-none bg-white rounded-full p-1 hover:bg-gray-100 cursor-pointer"
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

export default GlobalModalBorderLess;

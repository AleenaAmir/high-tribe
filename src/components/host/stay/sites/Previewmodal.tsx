import React, { useEffect, useRef } from "react";

interface GlobalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  customPadding?: string;
 
}

const Previewmodal: React.FC<GlobalModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = "max-w-[434px]",
  customPadding = "p-6",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity overflow-y-auto"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className={`rounded-[20px] bg-white shadow-2xl w-full ${maxWidth} relative ${customPadding} ${className || ""} overflow-hidden`}
        ref={modalRef}
        tabIndex={0}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none bg-white rounded-full p-1 hover:bg-gray-100 cursor-pointer z-10"
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

        {/* Title */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {/* Content */}
        <div  className="[&_hr]:hidden [&_.border-b]:border-b-0 [&_.border-t]:border-t-0 [&_.border]:border-0">{children}</div>
      </div>
    </div>
  );
};

export default Previewmodal;




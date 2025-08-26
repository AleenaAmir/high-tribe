"use client";
import React, { useEffect } from "react";

type ConfirmDeleteModalProps = {
    open: boolean;
    title?: string;            // optional: top heading
    message?: string;          // optional: supporting text
    onConfirm: () => void;     // Delete
    onCancel: () => void;      // Cancel / close
};

const gradient = "bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)]";

const DeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    open,
    title = "Do you want to Delete this",
    message = "Stop?",
    onConfirm,
    onCancel,
}) => {
    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
            onClick={onCancel} // backdrop click closes
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            {/* Modal */}
            <div
                className="relative mx-4 w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside
            >
                {/* Close (X) */}
                <button
                    aria-label="Close"
                    className="absolute right-3 top-3 rounded-full p-1 hover:bg-gray-100"
                    onClick={onCancel}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-500">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Content */}
                <div className="mt-3 text-center">
                    <div className="text-[18px] font-semibold text-gray-900">{title}</div>
                    <div className="mt-1 text-[18px] font-semibold text-gray-900">{message}</div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-center gap-3">
                        {/* Cancel with gradient border */}
                        <button
                            onClick={onCancel}
                            className={`relative inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium`}
                        >
                            <span className={`absolute inset-0 rounded-full `} />
                            <span className="relative rounded-full border border-[#9743AA] px-5 py-2 text-[#9743AA]">Cancel</span>
                        </button>

                        {/* Delete with gradient fill */}
                        <button
                            onClick={onConfirm}
                            className={`inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold text-white ${gradient} hover:opacity-95`}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;

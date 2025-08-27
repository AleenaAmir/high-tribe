import React, { useEffect, useRef, useState } from "react";

type DayStopCardProps = {
    dayNumber?: string;
    title: string;
    subtitle?: string;        // e.g., "19 Jun → 20 Jun"
    onEdit?: () => void;
    onDelete?: () => void;
    pad2?: (n: number) => string;
};

const defaultPad2 = (n: number) => String(n).padStart(2, "0");

const DayStopCard = ({
    dayNumber = "01",
    title,
    subtitle,
    onEdit,
    onDelete,
    pad2 = defaultPad2,
}: DayStopCardProps) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const onDocClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    return (
        <div className="group relative flex items-center justify-between rounded-2xl bg-[#F1F1F1]  px-4 py-6 hover:shadow-md transition">
            {/* Left: day badge + text */}
            <div className="flex items-center gap-4 min-w-0">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-[14px] font-medium
                        bg-[linear-gradient(90.76deg,#9243AC_0.54%,#B6459F_50.62%,#E74294_99.26%)]">
                    {dayNumber}
                </div>

                <div className="min-w-0">
                    <div className="text-[14px] font-medium font-gilroy text-[#1E1D1D] truncate max-w-[18rem]">
                        {title}
                    </div>
                    {subtitle ? (
                        <div className="text-[12px]   font-gilroy text-gray-400">{subtitle}</div>
                    ) : null}
                </div>
            </div>

            {/* Right: 3-dots */}
            <div className="relative" ref={menuRef}>
                <button
                    type="button"
                    className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    title="More"
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen((v) => !v);
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                        <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                        <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                    </svg>
                </button>

                {/* Menu */}
                {open && (
                    <div
                        role="menu"
                        className="absolute right-0 mt-2 w-32 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-20"
                    >
                        <button
                            role="menuitem"
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                                onEdit?.();
                            }}
                        >
                            Edit
                        </button>
                        <button
                            role="menuitem"
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                                onDelete?.();
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DayStopCard;

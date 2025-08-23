"use client";
import React from "react";

type Option = { label: string; value: string };
type Props = {
    options: Option[];
    value: string;
    onChange: (v: string) => void;
    className?: string;
};

export default function ToggleButton({
    options,
    value,
    onChange,
    className = "",
}: Props) {
    const activeIndex = Math.max(0, options.findIndex(o => o.value === value));
    const widthPct = 100 / options.length;

    return (
        <div
            role="tablist"
            aria-label="Segmented toggle"
            className={`relative inline-flex items-center rounded-full border  border-gray-200 bg-white p-1 pl-4 shadow-sm ${className}`}
            style={{ width: "fit-content" }}
        >
            {/* Sliding thumb */}
            <div
                className="pointer-events-none absolute inset-y-1 left-1 rounded-full
             transition-transform duration-200 ease-out
             bg-[linear-gradient(90.76deg,_#9243AC_0.54%,_#B6459F_50.62%,_#E74294_99.26%)]"
                style={{
                    width: `${widthPct}%`,
                    transform: `translateX(${activeIndex * widthPct}%)`,
                }}
            />

            {options.map((opt, i) => {
                const isActive = opt.value === value;
                return (
                    <button
                        key={opt.value}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(opt.value)}
                        className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors
              ${isActive ? "text-white" : "text-gray-800"}`}
                        style={{ width: `${widthPct}%` }}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}

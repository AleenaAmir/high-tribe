import React from "react";

type SvgProps = {
  className?: string;
};

const StatsCalanderIcon = ({ className }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 32 32"
      className={className}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M29.6 8v18.9c0 2.3-1.8 4.1-4.1 4.1h-19c-2.3 0-4.1-1.8-4.1-4.1V8c0-2.3 1.8-4.1 4.1-4.1h2.8v1.8c0 .6.5 1.1 1.1 1.1h1.3c.6 0 1-.5 1-1.1V3.8h6.4v1.8c0 .6.5 1.1 1.1 1.1h1.3c.6 0 1.1-.5 1.1-1.1V3.8h2.8c2.3 0 4.2 1.9 4.2 4.2"
      ></path>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M12.8 2.1v3.6c0 .6-.5 1.1-1 1.1h-1.3c-.6 0-1.1-.5-1.1-1.1V2.1c-.1-.6.4-1.1 1-1.1h1.3c.6 0 1.1.5 1.1 1.1M22.7 2.1v3.6c0 .6-.5 1.1-1.1 1.1h-1.3c-.6 0-1.1-.5-1.1-1.1V2.1c0-.6.5-1.1 1.1-1.1h1.3c.6 0 1.1.5 1.1 1.1M6.4 12.1h3.8M14.1 12.1h3.8M21.8 12.1h3.8M6.4 16.6h3.8M14.1 16.6h3.8M21.8 16.6h3.8M6.4 21.1h3.8M14.1 21.1h3.8M21.8 21.1h3.8M6.4 25.6h3.8M14.1 25.6h3.8"
      ></path>
    </svg>
  );
};

export default StatsCalanderIcon;

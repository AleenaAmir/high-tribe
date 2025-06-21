import React from "react";

type SvgProps = {
  className?: string;
};

const Location = ({ className }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      className={className}
    >
      <g
        stroke="#F6691D"
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#clip0_477_16569)"
      >
        <path d="M7 8.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5"></path>
        <path d="M7 11.667a4.667 4.667 0 1 0 0-9.334 4.667 4.667 0 0 0 0 9.334M7 1.167v1.166M7 11.667v1.166M11.667 7h1.166M1.167 7h1.166"></path>
      </g>
      <defs>
        <clipPath id="clip0_477_16569">
          <path fill="#fff" d="M0 0h14v14H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default Location;

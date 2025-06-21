import React from "react";

type SvgProps = {
  className?: string;
  fill?: string;
};

const Clock = ({ className, fill }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
      className={className}
    >
      <g
        stroke={fill ?? "#fff"}
        strokeLinecap="round"
        strokeMiterlimit="10"
        clipPath="url(#clip0_477_16488)"
      >
        <path d="M9 17.308A8.308 8.308 0 1 0 9 .692a8.308 8.308 0 0 0 0 16.616ZM11.492 9.97H8.446M8.308 5.538v4.154"></path>
      </g>
      <defs>
        <clipPath id="clip0_477_16488">
          <path fill={fill ?? "#fff"} d="M0 0h18v18H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default Clock;

import React from "react";

type SvgProps = {
  className?: string;
};

const FaqInfoIcon = ({ className }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="12"
      fill="none"
      viewBox="0 0 11 12"
      className={className}
    >
      <g clipPath="url(#clip0_552_58558)">
        <path
          fill="currentColor"
          d="M5.562 1.067a4.775 4.775 0 1 0 0 9.55 4.775 4.775 0 0 0 0-9.55m0 8.682a3.907 3.907 0 1 1 0-7.814 3.907 3.907 0 0 1 0 7.814m.434-1.953v.868h-.868v-.868zm1.302-3.04a1.73 1.73 0 0 1-.65 1.356 1.68 1.68 0 0 0-.625 1.032h-.882a2.52 2.52 0 0 1 .963-1.708.868.868 0 0 0-.49-1.547.9.9 0 0 0-.443.083.84.84 0 0 0-.477.785.434.434 0 1 1-.869 0 1.7 1.7 0 0 1 1.007-1.583 1.76 1.76 0 0 1 1.688.136 1.74 1.74 0 0 1 .778 1.447"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_552_58558">
          <path fill="#fff" d="M.353.633h10.419v10.419H.352z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default FaqInfoIcon;

import React from "react";

type SvgProps = {
  className?: string;
};

const Filters = ({ className }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      fill="none"
      viewBox="0 0 13 13"
      className={className}
    >
      <g fill="currentColor" clipPath="url(#clip0_477_16555)">
        <path d="M11.375 3.656H4.469a.406.406 0 1 1 0-.812h6.906a.406.406 0 0 1 0 .812M2.844 3.656H1.625a.406.406 0 1 1 0-.812h1.219a.406.406 0 1 1 0 .812M8.531 6.906H1.625a.406.406 0 1 1 0-.812h6.906a.406.406 0 1 1 0 .812M4.469 10.156H1.625a.407.407 0 0 1 0-.812h2.844a.406.406 0 1 1 0 .812"></path>
        <path d="M3.656 4.469a1.219 1.219 0 1 1 0-2.438 1.219 1.219 0 0 1 0 2.438m0-1.625a.406.406 0 1 0 0 .812.406.406 0 0 0 0-.812M9.344 7.719a1.219 1.219 0 1 1 0-2.438 1.219 1.219 0 0 1 0 2.438m0-1.625a.406.406 0 1 0 0 .812.406.406 0 0 0 0-.812M5.281 10.969a1.219 1.219 0 1 1 0-2.438 1.219 1.219 0 0 1 0 2.438m0-1.625a.406.406 0 1 0 0 .812.406.406 0 0 0 0-.812"></path>
        <path d="M11.375 6.906h-1.219a.406.406 0 0 1 0-.812h1.219a.406.406 0 0 1 0 .812M11.375 10.156H6.094a.407.407 0 0 1 0-.812h5.281a.406.406 0 0 1 0 .812"></path>
      </g>
      <defs>
        <clipPath id="clip0_477_16555">
          <path fill="currentColor" d="M0 0h13v13H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default Filters;

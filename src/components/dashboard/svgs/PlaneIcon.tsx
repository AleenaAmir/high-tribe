import React from "react";

type SvgProps = {
  className?: string;
};

const PlaneIcon = ({ className }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      fill="none"
      viewBox="0 0 11 11"
      className={className}
    >
      <path
        fill="currentColor"
        d="M3.827 10.29V9.59l.936-.702V6.315L.787 7.485v-.936l3.976-2.34V1.638q0-.292.204-.497a.68.68 0 0 1 .497-.204q.292 0 .497.204a.68.68 0 0 1 .205.497V4.21l3.976 2.339v.935l-3.976-1.17v2.573l.935.702v.702l-1.637-.468z"
      ></path>
    </svg>
  );
};

export default PlaneIcon;

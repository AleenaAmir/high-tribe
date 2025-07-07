import React from "react";

type SvgProps = {
  className?: string;
};

const CarIcon = ({ className }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="8"
      fill="none"
      viewBox="0 0 10 8"
      className={className}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1.62 3.613v2.339H8.17V3.613zM3.286 5.28a.68.68 0 0 1-.497.204.68.68 0 0 1-.497-.204.68.68 0 0 1-.204-.497q0-.293.204-.497a.68.68 0 0 1 .497-.205q.293 0 .497.205a.68.68 0 0 1 .205.497q0 .291-.205.497m4.21 0A.68.68 0 0 1 7 5.484a.68.68 0 0 1-.497-.204.68.68 0 0 1-.204-.497q0-.293.204-.497A.68.68 0 0 1 7 4.08q.292 0 .497.205a.68.68 0 0 1 .205.497q0 .291-.205.497"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.088 6.887v.468a.45.45 0 0 1-.135.333q-.134.135-.333.135h-.468a.45.45 0 0 1-.333-.135.45.45 0 0 1-.134-.333V3.613L1.667.807a.66.66 0 0 1 .251-.34.7.7 0 0 1 .404-.128h5.145q.223 0 .403.129.182.127.252.339l.982 2.806v3.742a.45.45 0 0 1-.134.333q-.135.135-.334.135H8.17a.45.45 0 0 1-.334-.135.45.45 0 0 1-.134-.333v-.468zm-.094-4.21h5.8l-.49-1.403H2.484zM1.62 5.953H8.17V3.613H1.62z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default CarIcon;

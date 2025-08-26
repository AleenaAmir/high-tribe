import React from "react";

interface LocationIconProps {
  className?: string;
}

const LocationIcon: React.FC<LocationIconProps> = ({
  className = "w-4 h-4",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="16"
      fill="none"
      viewBox="0 0 8 13"
      className={className}
    >
      <g fill="#FF0202" clipPath="url(#clip0_1032_52210)">
        <path d="M6.215.71a3.81 3.81 0 0 0-4.43 0C.05 1.927-.504 4.299.495 6.226L4 13l3.506-6.774c.998-1.927.443-4.3-1.291-5.516m.598 5.119-2.812 5.435-2.814-5.435c-.8-1.548-.356-3.45 1.036-4.427.54-.38 1.158-.57 1.777-.57s1.237.19 1.777.569c1.392.978 1.837 2.88 1.036 4.428"></path>
        <path d="M4 1.733c-1.088 0-1.974.933-1.974 2.08 0 1.146.886 2.08 1.974 2.08s1.973-.934 1.973-2.08c0-1.147-.884-2.08-1.973-2.08M4 5.06c-.653 0-1.184-.56-1.184-1.248S3.347 2.565 4 2.565s1.184.56 1.184 1.248S4.653 5.06 4 5.06"></path>
      </g>
      <defs>
        <clipPath id="clip0_1032_52210">
          <path fill="#fff" d="M0 0h8v13H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default LocationIcon;

import React from "react";

type SvgProps = {
  className?: string;
};

const HostSideBarIcon1 = ({ className }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="17"
      fill="none"
      viewBox="0 0 18 17"
      className={className}
    >
      <path
        fill="currentColor"
        d="M9.751.655a1.037 1.037 0 0 0-1.466 0L1.026 7.913A1.037 1.037 0 0 0 2.493 9.38l.303-.304v6.829c0 .572.465 1.037 1.037 1.037h2.074c.573 0 1.037-.465 1.037-1.037V13.83c0-.573.464-1.037 1.037-1.037h2.074c.572 0 1.037.464 1.037 1.037v2.074c0 .572.464 1.037 1.037 1.037h2.074c.572 0 1.036-.465 1.036-1.037v-6.83l.304.305a1.037 1.037 0 0 0 1.467-1.467z"
      ></path>
    </svg>
  );
};

export default HostSideBarIcon1;

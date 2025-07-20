import React from "react";

type SvgProps = {
  className?: string;
};

const HostSideBarIcon2 = ({ className }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="15"
      fill="none"
      viewBox="0 0 20 15"
      className={className}
    >
      <path
        fill="currentColor"
        d="M16.66 6.287c1.554 0 2.826 1.043 2.925 2.36l.006.166v5.052c0 .28-.262.506-.586.506-.288 0-.527-.18-.577-.415l-.01-.09v-2.527H2.002v2.526c0 .28-.263.506-.587.506-.287 0-.527-.18-.576-.415l-.01-.09V8.812c0-1.339 1.21-2.435 2.74-2.52l.192-.006zM6.105.225h8.21c1.554 0 2.826 1.042 2.925 2.36l.006.166v2.526h-2.345v-.505c0-.248-.208-.455-.481-.497l-.106-.009h-2.931c-.288 0-.528.18-.577.415l-.01.09v.506H9.623v-.505c0-.248-.207-.455-.48-.497l-.106-.009H6.105c-.288 0-.527.18-.577.415l-.009.09v.506H3.174V2.75c0-1.34 1.21-2.435 2.739-2.52z"
      ></path>
    </svg>
  );
};

export default HostSideBarIcon2;

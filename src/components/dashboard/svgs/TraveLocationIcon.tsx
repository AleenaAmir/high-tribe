import React from "react";

type SvgProps = {
  className?: string;
};

const TraveLocationIcon = ({ className }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      fill="none"
      viewBox="0 0 14 15"
      className={className}
    >
      <g fill="currentColor" clipPath="url(#clip0_552_58323)">
        <path d="M6.969 13.685a.43.43 0 0 1-.31-.127L3.58 10.49a4.78 4.78 0 0 1-1.403-3.393A4.8 4.8 0 0 1 3.58 3.705a4.8 4.8 0 0 1 3.389-1.4c1.268 0 2.486.503 3.388 1.4a4.78 4.78 0 0 1 1.403 3.392 4.8 4.8 0 0 1-1.403 3.393l-3.08 3.068a.44.44 0 0 1-.308.127m0-10.52a3.91 3.91 0 0 0-3.622 2.42 3.93 3.93 0 0 0 .847 4.27l2.775 2.774 2.774-2.775a3.9 3.9 0 0 0 1.145-2.77 3.93 3.93 0 0 0-1.145-2.77 3.9 3.9 0 0 0-2.774-1.148"></path>
        <path d="M6.969 9.302c-.431 0-.852-.129-1.21-.37a2.204 2.204 0 0 1-.33-3.372 2.17 2.17 0 0 1 2.373-.474c.398.166.738.447.977.807a2.2 2.2 0 0 1-.27 2.767 2.17 2.17 0 0 1-1.54.642m0-3.506a1.3 1.3 0 0 0-1.207.811 1.32 1.32 0 0 0 .283 1.433 1.304 1.304 0 0 0 2.23-.93 1.32 1.32 0 0 0-.382-.93 1.3 1.3 0 0 0-.924-.384"></path>
      </g>
      <defs>
        <clipPath id="clip0_552_58323">
          <path fill="#fff" d="M0 .975h13.937V15H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default TraveLocationIcon;

import React, { useRef } from "react";

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="13"
    fill="none"
    viewBox="0 0 16 13"
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M4.72 0c.162 0 .294.138.294.307v.461H7.57v-.46c0-.17.132-.308.295-.308s.295.138.295.307v.461h2.556v-.46c0-.17.132-.308.295-.308s.295.138.295.307v.461h1.672c1.52 0 2.752 1.284 2.752 2.868V8.25c0 .706-.25 1.387-.702 1.913l-1.623 1.888a2.7 2.7 0 0 1-2.05.954H2.752C1.233 13.006 0 11.723 0 10.14V3.636C0 2.052 1.232.768 2.753.768h1.671v-.46c0-.17.132-.308.295-.308m-.296 1.946v-.563H2.753C1.558 1.383.59 2.39.59 3.636v6.503c0 1.244.968 2.253 2.163 2.253h8.601q.075 0 .149-.006V9.32c0-.395.308-.716.688-.716h2.923q.026-.174.026-.352V3.636c0-1.245-.968-2.253-2.163-2.253h-1.67v.563c0 .17-.133.307-.296.307a.3.3 0 0 1-.295-.307v-.563H8.16v.563c0 .17-.132.307-.295.307a.3.3 0 0 1-.295-.307v-.563H5.014v.563c0 .17-.132.307-.295.307a.3.3 0 0 1-.295-.307m7.669 10.31c.331-.125.632-.335.873-.614l1.623-1.888q.21-.245.343-.537H12.19a.1.1 0 0 0-.098.102zm-8.16-7.801h.786v.82h-.786zm2.36 0h.786v.82h-.787zm3.145 0h-.786v.82h.786zm1.573 0h.787v.82h-.787zM4.72 6.913h-.786v.819h.786zm1.573 0h.787v.819h-.787zm3.146 0h-.786v.819h.786zM3.933 9.37h.786v.819h-.786zm3.146 0h-.787v.819h.787zm1.573 0h.786v.819h-.786z"
      clipRule="evenodd"
    ></path>
  </svg>
);

interface GlobalDateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const GlobalDateInput: React.FC<GlobalDateInputProps> = ({
  label,
  error,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // CSS to hide native date icon
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      input[type="date"]::-webkit-calendar-picker-indicator {
        opacity: 0;
        display: none;
      }
      input[type="date"]::-webkit-input-placeholder { color: #AFACAC; }
      input[type="date"]::-moz-placeholder { color: #AFACAC; }
      input[type="date"]:-ms-input-placeholder { color: #AFACAC; }
      input[type="date"]::placeholder { color: #AFACAC; }
      input[type="date"]::-ms-clear { display: none; }
      input[type="date"]::-ms-reveal { display: none; }
      input[type="date"]::-o-clear { display: none; }
      input[type="date"]::-o-reveal { display: none; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleIconClick = () => {
    if (inputRef.current) {
      // Try to use showPicker if available
      // @ts-ignore
      if (typeof inputRef.current.showPicker === "function") {
        // @ts-ignore
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-[12px] font-medium text-black z-10 translate-y-3 translate-x-4 bg-white w-fit px-1">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="date"
          className="w-full border rounded-lg pl-4 pr-10 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-200 border-[#848484] placeholder:italic"
          // placeholder="mm/dd/yyyy"
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0 m-0 bg-transparent border-none cursor-pointer"
          onClick={handleIconClick}
          aria-label="Open calendar"
        >
          <CalendarIcon />
        </button>
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default GlobalDateInput;

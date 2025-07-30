"use client";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

interface DropdownProps {
  disabled?: boolean;
  btnClassName?: string;
  button: React.ReactNode;
  children: React.ReactNode;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end";
  offset?: number;
}

const Dropdown = forwardRef<{ close: () => void }, DropdownProps>(
  (props, forwardedRef) => {
    const {
      disabled = false,
      btnClassName,
      button,
      children,
      placement = "bottom-end",
      offset: offsetValue = 0,
    } = props;
    const [visibility, setVisibility] = useState<boolean>(false);

    const referenceRef = useRef<HTMLButtonElement>(null);
    const popperRef = useRef<HTMLDivElement>(null);

    const { refs, floatingStyles } = useFloating({
      placement: placement as any,
      middleware: [offset(offsetValue), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        referenceRef.current?.contains(event.target as Node) ||
        popperRef.current?.contains(event.target as Node)
      ) {
        return;
      }

      setVisibility(false);
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleDocumentClick);
      return () => {
        document.removeEventListener("mousedown", handleDocumentClick);
      };
    }, []);

    useImperativeHandle(forwardedRef, () => ({
      close() {
        setVisibility(false);
      },
    }));

    // Disable button functionality if `disabled` is true
    const handleClick = () => {
      if (!disabled) {
        setVisibility(!visibility);
      }
    };

    return (
      <>
        <button
          ref={(node) => {
            referenceRef.current = node;
            refs.setReference(node);
          }}
          type="button"
          className={`${btnClassName} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleClick}
          disabled={disabled}
        >
          {button}
        </button>

        <div
          ref={(node) => {
            popperRef.current = node;
            refs.setFloating(node);
          }}
          style={floatingStyles}
          className="z-50"
          onClick={() => setVisibility(!visibility)}
        >
          {visibility && children}
        </div>
      </>
    );
  }
);

Dropdown.displayName = "Dropdown";

export default Dropdown;

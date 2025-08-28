import React, { forwardRef, HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  x?: boolean;   
  y?: boolean;
  thin?: boolean; 
};

const ScrollArea = forwardRef<HTMLDivElement, Props>(
  ({ x = false, y = true, thin = true, className = "", children, ...rest }, ref) => {
    const axis =
      (y ? "overflow-y-auto " : "overflow-y-hidden ") +
      (x ? "overflow-x-auto " : "overflow-x-hidden ");

    const thickness = thin ? "scrollbar scrollbar-thin " : "scrollbar ";
    const gradient = "scrollbar-gradient ";

    return (
      <div
        ref={ref}
        className={`${axis}${thickness}${gradient}${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";
export default ScrollArea;

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {}

export const VisuallyHidden = ({ className, ...props }: VisuallyHiddenProps) => {
  return (
    <span
      className={cn(
        "absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0",
        className
      )}
      style={{ clip: "rect(0, 0, 0, 0)" }}
      {...props}
    />
  );
}; 
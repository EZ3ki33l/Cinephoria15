"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./_layout/button";

interface HoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  isActive?: boolean;
}

const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, variant = "primary", isActive = false, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative px-6 py-2 rounded-full font-medium",
          "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "bg-transparent hover:bg-transparent",
          !isActive && "text-neutral-900",
          // Animation au hover
          "before:absolute before:inset-0 before:rounded-full",
          "before:border before:border-transparent",
          "before:scale-[1.05] before:opacity-0",
          "before:transition-all before:duration-500",
          "before:ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hover:before:scale-100 hover:before:opacity-100",
          variant === "primary" && [
            "hover:shadow-[0_0_2px_hsl(var(--primary))]",
            "before:shadow-[0_0_2px_hsl(var(--primary))]",
            "hover:before:border-primary/20",
            isActive && [
              "text-primary",
              "after:absolute after:inset-0 after:rounded-full",
              "after:bg-primary/10",
              "after:-z-10",
              "font-semibold"
            ]
          ],
          variant === "secondary" && [
            "hover:shadow-[0_0_2px_hsl(var(--secondary))]",
            "before:shadow-[0_0_2px_hsl(var(--secondary))]",
            "hover:before:border-secondary/20",
            isActive && [
              "text-secondary",
              "after:absolute after:inset-0 after:rounded-full",
              "after:bg-secondary/10",
              "after:-z-10",
              "font-semibold"
            ]
          ],
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

HoverButton.displayName = "HoverButton";

export { HoverButton };

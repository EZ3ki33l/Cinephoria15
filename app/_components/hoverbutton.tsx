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
        variant="ghost"
        className={cn(
          "relative px-6 py-2 rounded-full font-medium",
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "bg-transparent",
          "border border-foreground/[0.02] dark:border-foreground/[0.04]",
          "shadow-[inset_0_0.5px_0.5px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_0.5px_0.5px_rgba(255,255,255,0.02)]",
          !isActive && [
            "text-foreground/90 dark:text-foreground/90",
            "hover:text-foreground dark:hover:text-foreground",
            "hover:border-primary/40 dark:hover:border-primary-light/40",
            "hover:shadow-[0_0_0_1px_rgba(var(--primary),0.2)] dark:hover:shadow-[0_0_0_1px_rgba(var(--primary-light),0.2)]"
          ],
          // Animation au hover
          "before:absolute before:inset-0 before:rounded-full",
          "before:border before:border-transparent",
          "before:scale-[1.05] before:opacity-0",
          "before:transition-all before:duration-300",
          "before:ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hover:before:scale-100 hover:before:opacity-100",
          variant === "primary" && [
            isActive && [
              "text-primary dark:text-primary-light",
              "border-primary/40 dark:border-primary-light/40",
              "shadow-[0_0_0_1px_rgba(var(--primary),0.2)] dark:shadow-[0_0_0_1px_rgba(var(--primary-light),0.2)]"
            ]
          ],
          variant === "secondary" && [
            isActive && [
              "text-secondary dark:text-secondary-light",
              "border-secondary/40 dark:border-secondary-light/40",
              "shadow-[0_0_0_1px_rgba(var(--secondary),0.2)] dark:shadow-[0_0_0_1px_rgba(var(--secondary-light),0.2)]"
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

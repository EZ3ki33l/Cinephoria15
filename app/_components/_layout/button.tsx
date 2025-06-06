"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import React, { ReactElement } from "react";
import { Spinner } from "./spinner"; // Assurez-vous que Spinner est défini.

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow hover:bg-primary/60 dark:bg-primary dark:text-white dark:hover:bg-primary/60",
        secondary: "bg-secondary text-white hover:bg-secondary/60 dark:bg-secondary dark:text-white dark:hover:bg-secondary/60",
        danger: "bg-danger text-white hover:bg-danger/60 dark:bg-danger dark:text-white dark:hover:bg-danger/60",
        success: "bg-success text-white hover:bg-success/60 dark:bg-success dark:text-white dark:hover:bg-success/60",
        outline: "border border-gray text-gray hover:bg-gray-light dark:border-gray-light dark:text-gray-light dark:hover:bg-gray-dark/10",
        disabled: "bg-gray-light text-gray-dark border border-gray cursor-not-allowed dark:bg-gray-dark dark:text-gray-light dark:border-gray",
        icon: "bg-primary text-white rounded-full dark:bg-primary dark:text-white",
        ghost: "hover:bg-gray-light/50 text-foreground dark:text-foreground dark:hover:bg-gray-dark/50",
      },
      size: {
        small: "h-8 px-3 text-xs",
        medium: "h-10 px-4",
        large: "h-12 px-6 text-lg",
        icon: "h-9 w-9 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  icon?: ReactElement;
  iconPosition?: "left" | "right";
  baseUrl?: string;
  linkType?: "internal" | "external";
  action?: () => void;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      icon,
      iconPosition = "left",
      baseUrl,
      linkType = "internal",
      action,
      fullWidth,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const buttonContent = (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size="small" />
          </div>
        )}
        <span className={cn(isLoading && "invisible", "flex items-center gap-2")}>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </span>
      </>
    );

    const buttonElement = (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && "w-full"
        )}
        ref={ref}
        onClick={action}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {buttonContent}
      </Comp>
    );

    if (baseUrl) {
      if (linkType === "external") {
        return (
          <a href={baseUrl} target="_blank" rel="noopener noreferrer">
            {buttonElement}
          </a>
        );
      }
      return <Link href={baseUrl}>{buttonElement}</Link>;
    }

    return buttonElement;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };


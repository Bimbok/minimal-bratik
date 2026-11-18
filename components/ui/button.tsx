"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { audioEngine } from "../../lib/audio";

export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "outline"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  playSound?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-neutral-900 border border-neutral-800 text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800",
  primary:
    "bg-white text-black font-extrabold hover:bg-neutral-100 shadow-md",
  secondary:
    "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 font-mono",
  accent:
    "bg-neutral-800/90 border border-neutral-700 text-white hover:bg-neutral-700 hover:border-neutral-500 shadow-sm font-mono font-semibold",
  outline:
    "bg-transparent border border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white",
  ghost:
    "bg-transparent text-neutral-400 hover:bg-neutral-800/60 hover:text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-2.5 py-1 text-[11px] gap-1.5 rounded-lg",
  md: "px-3 py-1.5 text-xs gap-2 rounded-lg",
  lg: "px-3.5 py-2 text-xs sm:text-sm gap-2 rounded-lg",
  icon: "p-2 rounded-lg justify-center",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseButtonProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      playSound = true,
      className,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (playSound) {
        audioEngine.playKeyClick("down");
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center transition-all cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    BaseButtonProps {}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      playSound = true,
      className,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (playSound) {
        audioEngine.playKeyClick("down");
      }
      onClick?.(e);
    };

    return (
      <a
        ref={ref}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center transition-all select-none active:scale-[0.98]",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);
LinkButton.displayName = "LinkButton";

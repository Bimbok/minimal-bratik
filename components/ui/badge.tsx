import React from "react";
import { cn } from "../../lib/utils";

export type BadgeVariant =
  | "default"
  | "tech"
  | "subtle"
  | "outline"
  | "status"
  | "accent";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: React.ReactNode;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default:
    "bg-neutral-800 text-neutral-300 border border-neutral-700 font-medium",
  tech:
    "bg-neutral-800/80 border border-neutral-700/60 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors",
  subtle:
    "bg-neutral-900 border border-neutral-800 text-neutral-400 font-normal",
  outline:
    "bg-transparent border border-neutral-700 text-neutral-300",
  status:
    "bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-1",
  accent:
    "bg-white/10 text-white border border-white/20 font-semibold",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 select-none",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

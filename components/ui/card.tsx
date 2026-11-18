import React from "react";
import { cn } from "../../lib/utils";

export type CardVariant = "default" | "subtle" | "glass" | "interactive";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children?: React.ReactNode;
}

const cardVariants: Record<CardVariant, string> = {
  default:
    "bg-neutral-900/60 border border-neutral-800/80 rounded-2xl shadow-md",
  subtle:
    "bg-neutral-950/80 border border-neutral-800/80 rounded-xl",
  glass:
    "bg-[#0b0c0f]/95 border border-neutral-800/90 rounded-2xl backdrop-blur-xl shadow-2xl",
  interactive:
    "bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/50 rounded-2xl transition-all duration-300 group",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants[variant], "overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-5", className)}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-bold text-sm sm:text-base text-neutral-100 font-sans tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-neutral-400 font-mono", className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-5 pt-0", className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-4 sm:p-5 pt-0 border-t border-neutral-800/60 mt-auto",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";

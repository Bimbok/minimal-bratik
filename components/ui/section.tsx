import React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ id, className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn("space-y-4 pt-6 border-t border-neutral-800/80", className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);
Section.displayName = "Section";

export interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  badge,
  subtitle,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 font-sans",
        className
      )}
    >
      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
        {icon && <span className="text-neutral-300 shrink-0">{icon}</span>}
        <span>{title}</span>
        {badge && (
          typeof badge === "string" ? (
            <Badge variant="subtle" className="text-[11px] px-2 py-0.5 rounded-full">
              {badge}
            </Badge>
          ) : (
            badge
          )
        )}
      </h2>

      {subtitle && (
        <span className="text-[11px] font-mono text-neutral-500">
          {subtitle}
        </span>
      )}
    </div>
  );
};

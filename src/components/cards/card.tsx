import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Card({ children, className = '', gradient = false }: CardProps) {
  return (
    <div className={`
      bg-card border border-border rounded-2xl shadow-lg overflow-hidden
      ${gradient ? 'bg-gradient-to-br from-card via-card/95 to-card' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

// Section Header Component
interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  subtitle?: string;
}

export function SectionHeader({ title, icon, subtitle }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>
      {subtitle && (
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      )}
    </div>
  );
}
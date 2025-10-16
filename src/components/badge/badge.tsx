import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'gradient' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const variantClasses = {
    default: 'bg-secondary text-secondary-foreground',
    gradient: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white',
    outline: 'border border-border bg-background text-foreground'
  };

  return (
    <span className={`
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      rounded-full font-medium
    `}>
      {children}
    </span>
  );
}
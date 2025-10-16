import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GradientButton({ 
  children, 
  onClick, 
  disabled, 
  loading, 
  variant = 'primary',
  size = 'md',
  className = ''
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-pink-500/25',
    secondary: 'bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 hover:from-pink-200 hover:to-orange-200 dark:from-pink-900/30 dark:to-orange-900/30 dark:text-pink-300'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        rounded-xl font-semibold transition-all duration-200 
        transform hover:scale-[1.02] 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
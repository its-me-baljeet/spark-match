import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  type: 'success' | 'error' | 'warning' | 'info';
}

export function Alert({ children, type }: AlertProps) {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
  };

  return (
    <div className={`
      p-4 rounded-xl border text-sm font-medium
      ${typeClasses[type]}
    `}>
      {children}
    </div>
  );
}
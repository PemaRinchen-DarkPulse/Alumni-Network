import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Primary button component with consistent styling
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Button content
 * @param {string} type - Button type (submit, button, etc.)
 * @param {boolean} disabled - Whether the button is disabled
 * @param {Function} onClick - Click handler
 * @param {object} props - Other button props
 */
export const PrimaryButton = ({ 
  className, 
  children, 
  type = "button",
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;

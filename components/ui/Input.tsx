import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ariaLabel?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ariaLabel, placeholder, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-label={ariaLabel || placeholder || 'Input'}
        className={cn('focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none', className)}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
export { Input }; 
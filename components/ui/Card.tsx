import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: "bg-gray-800 border border-gray-700",
      elevated: "bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200",
      outlined: "bg-transparent border border-gray-600"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg overflow-hidden",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6 py-4 border-b border-gray-700", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6 py-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6 py-4 border-t border-gray-700 bg-gray-750", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter }; 
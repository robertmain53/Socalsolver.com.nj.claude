import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-900 text-white',
    secondary: 'bg-gray-100 text-gray-900',
    outline: 'border border-gray-300 text-gray-700 bg-white',
  };

  const classes = `inline-flex items-center px-2 py-1 rounded text-xs font-medium ${variants[variant]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

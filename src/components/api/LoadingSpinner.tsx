import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function LoadingSpinner({ size = 'md', color = 'primary' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
    black: 'border-black'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-t-transparent ${colorClasses[color as keyof typeof colorClasses]}`} />
  );
}
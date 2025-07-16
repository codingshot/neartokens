
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  centered?: boolean;
}

export const LoadingSpinner = ({ size = 'md', className = '', centered = false }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const spinnerContent = (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* NEAR logo in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/lovable-uploads/2f7587c3-547e-4d5b-b88d-d510b8d304a6.png" 
          alt="NEAR" 
          className="w-3/5 h-3/5 object-cover rounded-full"
        />
      </div>
      {/* Rotating circle around it */}
      <div className="absolute inset-0 border-2 border-transparent border-t-[#00ec97] rounded-full animate-spin"></div>
    </div>
  );

  if (centered) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

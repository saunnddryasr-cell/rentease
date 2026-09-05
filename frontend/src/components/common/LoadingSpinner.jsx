// src/components/common/LoadingSpinner.jsx
import React, { useState, useEffect } from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  fullScreen = false,
  minDisplayTime = 2000, // 2 seconds minimum
  onLoadingComplete 
}) => {
  const [showSpinner, setShowSpinner] = useState(true);
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  useEffect(() => {
    // Show spinner for minimum 2 seconds
    const timer = setTimeout(() => {
      setShowSpinner(false);
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, onLoadingComplete]);

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-primary-600`} />
      <p className="text-gray-500 text-sm animate-pulse">Loading amazing deals...</p>
    </div>
  );

  if (!showSpinner) {
    return null;
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-[200px]">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
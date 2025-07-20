import React from 'react';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  shape?: 'rect' | 'circle';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ width = '100%', height = 20, shape = 'rect', count = 1, className = '' }) => {
  const style = {
    width,
    height,
    borderRadius: shape === 'circle' ? '50%' : '0.5rem',
  } as React.CSSProperties;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`}
          style={style}
        />
      ))}
    </>
  );
};

export default SkeletonLoader; 
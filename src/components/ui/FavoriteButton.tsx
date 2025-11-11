"use client";

import { useState } from 'react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  isLoading: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FavoriteButton({ 
  isFavorite, 
  isLoading, 
  onToggle, 
  size = 'md',
  className = '' 
}: FavoriteButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'h-6 w-6 p-1',
    md: 'h-8 w-8 p-1.5',
    lg: 'h-10 w-10 p-2'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        ${className}
        ${className.includes('absolute') ? '' : 'relative'}
        rounded-full shadow-md dark:shadow-gray-900/50 transition-all duration-200
        ${isFavorite 
          ? 'bg-red-500 dark:bg-red-600 text-white' 
          : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isHovered && !isFavorite ? 'scale-110' : ''}
        ${isFavorite ? 'scale-100' : ''}
        active:scale-95
      `}
      title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <div className={`${iconSizes[size]} animate-spin rounded-full border-2 border-current border-t-transparent`} />
      ) : (
        <svg
          className={`${iconSizes[size]} transition-all duration-200 ${
            isFavorite ? 'fill-current' : 'fill-none'
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={isFavorite ? 0 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}

// src/components/Investor/Notification.tsx
"use client";

import React from 'react';

interface NotificationProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
  language: string;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  isVisible,
  onClose,
  language,
}) => {
  if (!isVisible) return null;
  
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-opacity-50 dark:bg-opacity-70 absolute inset-0 bg-black" onClick={onClose}></div>
      <div
        className={`relative mx-4 w-full max-w-sm rounded-lg p-4 shadow-lg dark:shadow-gray-900/50 transition-all duration-300 ${
          type === "success" ? "bg-green-500 dark:bg-green-600 text-white" : "bg-red-500 dark:bg-red-600 text-white"
        }`}
        dir={direction}
      >
        <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-center ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
            {type === "success" ? (
              <svg className={`h-5 w-5 flex-shrink-0 ${isArabic ? 'ml-2' : 'mr-2'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className={`h-5 w-5 flex-shrink-0 ${isArabic ? 'ml-2' : 'mr-2'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className={`text-sm font-medium sm:text-base ${isArabic ? 'text-right' : 'text-left'}`}>{message}</span>
          </div>
          <button onClick={onClose} className={`flex-shrink-0 text-white hover:text-gray-200 ${isArabic ? 'mr-4' : 'ml-4'}`}>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

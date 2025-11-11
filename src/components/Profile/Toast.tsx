
"use client";

import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface ToastProps {
  message: string;
  type: 'success' | 'failure';
}

export default function Toast({ message, type }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide the toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
    
  }, []);

  if (!isVisible) {
    return null;
  }

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const icon = isSuccess ? <FaCheck className="text-white text-3xl" /> : <FaTimes className="text-white text-3xl" />;

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg flex items-center space-x-4 rtl:space-x-reverse text-white ${bgColor}`}>
      {icon}
      <p className="text-lg font-bold">{message}</p>
    </div>
  );
}
'use client';

import React from 'react';

// تحديد نوع البيانات التي سيتم تمريرها للمكون
interface BreadcrumbProps {
  path: string[];
  // أضف هذه الخاصية الجديدة
  onBreadcrumbClick: (index: number) => void;
}

export default function Breadcrumb({ path, onBreadcrumbClick }: BreadcrumbProps) {
  return (
    <div className="flex items-center text-sm font-semibold text-gray-600">
      {path.map((item, index) => (
        <React.Fragment key={index}>
          <button
            className={`cursor-pointer ${index === path.length - 1 ? 'text-green-600 font-bold' : 'hover:underline'}`}
            onClick={() => onBreadcrumbClick(index)}
          >
            {item}
          </button>
          {index < path.length - 1 && (
            <span className="mx-1 text-gray-400">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
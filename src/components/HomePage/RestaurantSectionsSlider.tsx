// RestaurantSectionsSlider.tsx

'use client';

import React from 'react';

interface RestaurantSectionsSliderProps {
  sections: string[];
  onSectionClick: (sectionName: string) => void;
}

export default function RestaurantSectionsSlider({ sections, onSectionClick }: RestaurantSectionsSliderProps) {
  return (
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {sections.map((section: string, index: number) => (
          <div
            key={section}
            onClick={() => onSectionClick(section)}
            className="flex-shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:bg-gray-100"
          >
            <p className="whitespace-nowrap text-sm font-semibold text-gray-800">
              {section}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
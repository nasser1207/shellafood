"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { memo } from "react";

interface StickyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; labelAr: string }[];
}

function StickyTabs({ activeTab, onTabChange, tabs }: StickyTabsProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  return (
    <div
      dir={direction}
      className="sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-4 font-semibold text-sm transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "border-green-600 dark:border-green-400 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {isArabic ? tab.labelAr : tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(StickyTabs);


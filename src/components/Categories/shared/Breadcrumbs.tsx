"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  return (
    <nav
      aria-label="Breadcrumb"
      dir={direction}
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">{isArabic ? "الرئيسية" : "Home"}</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight
              className={`w-4 h-4 text-gray-400 ${isArabic ? 'rotate-180' : ''}`}
            />
            {isLast ? (
              <span className="font-semibold text-gray-900 dark:text-white">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href || '#'}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default memo(Breadcrumbs);


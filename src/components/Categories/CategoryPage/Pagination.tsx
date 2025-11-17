"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  maxVisiblePages?: number;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  maxVisiblePages = 7,
  className = "",
}: PaginationProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Translations
  const t = {
    previous: isRTL ? "السابق" : "Previous",
    prev: isRTL ? "السابق" : "Prev",
    next: isRTL ? "التالي" : "Next",
    page: isRTL ? "صفحة" : "Page",
    pageOf: (current: number, total: number) =>
      isRTL ? `صفحة ${current} من ${total}` : `Page ${current} of ${total}`,
    showing: (start: number, end: number, total: number) =>
      isRTL
        ? `عرض ${start}-${end} من ${total} نتيجة`
        : `Showing ${start}-${end} of ${total} results`,
  };

  // Generate page numbers with ellipsis logic
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
        startPage = 2;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("ellipsis");
      }

      // Add pages around current
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Don't show pagination if only one page or no items
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  const ButtonBase = ({
    children,
    onClick,
    disabled,
    ariaLabel,
    className: btnClassName = "",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    ariaLabel: string;
    className?: string;
  }) => (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg
        transition-all duration-200 font-medium
        ${disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
          : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 active:scale-95"
        }
        border border-gray-200 dark:border-gray-700
        ${btnClassName}
      `}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </motion.button>
  );

  return (
    <div
      className={`flex flex-col items-center gap-4 py-6 sm:py-8 ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Desktop Pagination */}
      <div className="hidden md:flex items-center gap-2">
        {/* Previous Button */}
        <ButtonBase
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          ariaLabel={t.previous}
        >
          {isRTL ? (
            <ChevronRight size={18} className="shrink-0" />
          ) : (
            <ChevronLeft size={18} className="shrink-0" />
          )}
          <span className="hidden lg:inline">{t.previous}</span>
        </ButtonBase>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-400 dark:text-gray-500 text-sm sm:text-base"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <motion.button
                key={pageNum}
                whileHover={!isActive ? { scale: 1.1, y: -1 } : {}}
                whileTap={!isActive ? { scale: 0.9 } : {}}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isActive) {
                    handlePageChange(pageNum);
                  }
                }}
                className={`
                  min-w-[40px] h-[40px] rounded-lg
                  transition-all duration-200 font-medium cursor-pointer
                  ${isActive
                    ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }
                  border border-gray-200 dark:border-gray-700
                `}
                aria-label={`${t.page} ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </motion.button>
            );
          })}
        </div>

        {/* Next Button */}
        <ButtonBase
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          ariaLabel={t.next}
        >
          <span className="hidden lg:inline">{t.next}</span>
          {isRTL ? (
            <ChevronLeft size={18} className="shrink-0" />
          ) : (
            <ChevronRight size={18} className="shrink-0" />
          )}
        </ButtonBase>
      </div>

      {/* Mobile Pagination */}
      <div className="flex md:hidden items-center justify-between w-full px-2">
        <ButtonBase
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          ariaLabel={t.previous}
          className="flex-1 max-w-[120px] justify-center"
        >
          {isRTL ? (
            <ChevronRight size={18} className="shrink-0" />
          ) : (
            <ChevronLeft size={18} className="shrink-0" />
          )}
          <span>{t.prev}</span>
        </ButtonBase>

        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4">
          {t.pageOf(currentPage, totalPages)}
        </div>

        <ButtonBase
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          ariaLabel={t.next}
          className="flex-1 max-w-[120px] justify-center"
        >
          <span>{t.next}</span>
          {isRTL ? (
            <ChevronLeft size={18} className="shrink-0" />
          ) : (
            <ChevronRight size={18} className="shrink-0" />
          )}
        </ButtonBase>
      </div>

      {/* Results Info */}
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
        {t.showing(startItem, endItem, totalItems)}
      </p>
    </div>
  );
}

export default memo(Pagination);


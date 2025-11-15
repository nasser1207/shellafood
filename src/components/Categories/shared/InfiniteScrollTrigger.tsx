"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { memo } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface InfiniteScrollTriggerProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

function InfiniteScrollTrigger({
  hasMore,
  isLoading,
  onLoadMore,
}: InfiniteScrollTriggerProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const observerRef = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
  });

  return (
    <div ref={observerRef} className="py-8 flex justify-center">
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{isArabic ? "جاري التحميل..." : "Loading more..."}</span>
        </div>
      )}
    </div>
  );
}

export default memo(InfiniteScrollTrigger);


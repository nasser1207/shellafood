"use client";

import { memo } from "react";

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
}

export default memo(ProductCardSkeleton);


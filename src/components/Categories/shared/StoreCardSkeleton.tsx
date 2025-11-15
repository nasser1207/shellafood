"use client";

import { memo } from "react";

function StoreCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
          </div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default memo(StoreCardSkeleton);


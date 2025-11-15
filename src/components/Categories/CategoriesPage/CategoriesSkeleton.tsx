"use client";

import { memo } from "react";

function CategoriesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 mb-4" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
        </div>
      ))}
    </div>
  );
}

export default memo(CategoriesGridSkeleton);


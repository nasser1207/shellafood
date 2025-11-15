"use client";

import { MobileProductCardSkeleton } from "./MobileStorePageSkeleton";

export default function MobileDepartmentPageSkeleton() {
	return (
		<div className="animate-pulse">
			{/* Mobile Header Skeleton */}
			<div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
				<div className="px-4 py-4 flex items-center gap-3">
					<div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
					<div className="flex-1">
						<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
					</div>
					<div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
				</div>
				{/* Filters bar skeleton */}
				<div className="px-4 pb-3 flex gap-2">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
					))}
				</div>
			</div>

			{/* Products Grid Skeleton - Mobile */}
			<div className="px-4 py-4">
				<div className="grid grid-cols-2 gap-3">
					{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
						<MobileProductCardSkeleton key={i} />
					))}
				</div>
			</div>
		</div>
	);
}


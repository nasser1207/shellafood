"use client";

export default function MobileStorePageSkeleton() {
	return (
		<div className="animate-pulse">
			{/* Hero skeleton */}
			<div className="h-48 bg-gray-200 dark:bg-gray-700" />

			{/* Info bar */}
			<div className="px-4 py-3 flex justify-between">
				<div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
				<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
				<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
			</div>

			{/* Search bar */}
			<div className="px-4 py-3">
				<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
			</div>

			{/* Department tabs */}
			<div className="flex gap-2 px-4 pb-3">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
				))}
			</div>

			{/* Products grid */}
			<div className="px-4 py-4">
				<div className="grid grid-cols-2 gap-3">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<MobileProductCardSkeleton key={i} />
					))}
				</div>
			</div>
		</div>
	);
}

export function MobileProductCardSkeleton() {
	return (
		<div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
			<div className="aspect-square bg-gray-200 dark:bg-gray-700" />
			<div className="p-3 space-y-2">
				<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
				<div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
				<div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
				<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
			</div>
		</div>
	);
}


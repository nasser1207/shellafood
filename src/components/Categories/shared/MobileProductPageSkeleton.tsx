"use client";

export default function MobileProductPageSkeleton() {
	return (
		<div className="animate-pulse">
			{/* Image skeleton */}
			<div className="w-full aspect-square bg-gray-200 dark:bg-gray-700" />

			{/* Info skeleton */}
			<div className="bg-white dark:bg-gray-900 rounded-t-3xl -mt-6 relative z-10">
				<div className="px-4 py-6 space-y-6">
					<div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
					<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
					<div className="space-y-2">
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
					</div>
				</div>
			</div>

			{/* Bottom bar skeleton */}
			<div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-200 dark:bg-gray-700" />
		</div>
	);
}


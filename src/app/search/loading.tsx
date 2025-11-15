/**
 * Search Loading Component
 * Responsive skeleton loading for search page
 */
export default function SearchLoading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 font-sans md:p-8" dir="rtl">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				{/* Header Skeleton */}
				<div className="mb-8 text-center animate-pulse">
					<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
					<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
				</div>

				{/* Search Bar Skeleton */}
				<div className="mb-8 animate-pulse">
					<div className="max-w-3xl mx-auto">
						<div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
					</div>
				</div>

				{/* Tabs Skeleton */}
				<div className="mb-6 flex justify-center gap-4 animate-pulse">
					<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-28"></div>
					<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-28"></div>
					<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-28"></div>
				</div>

				{/* Results Skeleton - Grid Layout */}
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[...Array(8)].map((_, i) => (
							<div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 overflow-hidden animate-pulse">
								{/* Image Skeleton */}
								<div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
								{/* Content Skeleton */}
								<div className="p-5 space-y-3">
									<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
									<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}


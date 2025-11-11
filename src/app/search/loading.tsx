/**
 * Search Loading Component
 * Responsive skeleton loading for search page
 */
export default function SearchLoading() {
	return (
		<div className="min-h-screen bg-gray-50 p-4 font-sans md:p-8" dir="rtl">
			{/* Header Skeleton */}
			<div className="mb-8 text-center animate-pulse">
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
				<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
			</div>

			{/* Search Bar Skeleton */}
			<div className="mb-8 animate-pulse">
				<div className="max-w-2xl mx-auto">
					<div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
				</div>
			</div>

			{/* Tabs Skeleton */}
			<div className="mb-6 flex justify-center gap-4 animate-pulse">
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
			</div>

			{/* Results Skeleton */}
			<div className="max-w-6xl mx-auto">
				<div className="space-y-6">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
							<div className="flex items-center gap-4">
								<div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
								<div className="flex-1 space-y-3">
									<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}


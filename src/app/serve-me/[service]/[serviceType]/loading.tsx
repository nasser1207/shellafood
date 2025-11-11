/**
 * Loading State for Individual Service Page
 * Shows skeleton UI while the page is being generated
 */
export default function Loading() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Hero Section Skeleton */}
			<div className="w-full bg-gray-300 dark:bg-gray-800 animate-pulse h-[300px] sm:h-[400px]"></div>

			{/* Content Section Skeleton */}
			<div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Price and Rating */}
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
							<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
						</div>

						{/* Service Features */}
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
							<div className="space-y-3">
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
							</div>
						</div>

						{/* Service Details */}
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
							<div className="space-y-3">
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow sticky top-4">
							<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4 animate-pulse"></div>
							<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


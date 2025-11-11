/**
 * My Orders Loading Component
 * Responsive skeleton loading for my orders page
 */
export default function LoadingMyOrders() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				{/* Header Skeleton */}
				<div className="mb-6 sm:mb-8">
					<div className="h-8 w-48 md:h-10 md:w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
					<div className="h-4 w-72 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
				</div>

				{/* Tabs Skeleton */}
				<div className="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
					<div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-t animate-pulse"></div>
					<div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-t animate-pulse"></div>
				</div>

				{/* Search and Filter Skeleton */}
				<div className="mb-6 flex flex-col sm:flex-row gap-4">
					<div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
					<div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
				</div>

				{/* Stats Cards Skeleton */}
				<div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
					{Array.from({ length: 3 }, (_, i) => (
						<div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
							<div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
							<div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
						</div>
					))}
				</div>

				{/* Orders List Skeleton */}
				<div className="space-y-4">
					{Array.from({ length: 4 }, (_, i) => (
						<div key={i} className="rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
							{/* Order Header */}
							<div className="flex justify-between items-start mb-4">
								<div className="space-y-2">
									<div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
								</div>
								<div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
							</div>

							{/* Order Items */}
							<div className="space-y-3 mb-4">
								{Array.from({ length: 2 }, (_, j) => (
									<div key={j} className="flex gap-4">
										<div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
										<div className="flex-1 space-y-2">
											<div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
											<div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
										</div>
									</div>
								))}
							</div>

							{/* Order Footer */}
							<div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
								<div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
								<div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}



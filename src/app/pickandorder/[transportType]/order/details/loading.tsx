import { Loader2, Truck, Bike } from "lucide-react";

/**
 * Loading Component for Order Details Page
 * Professional loading state matching the order details page structure
 */
export default function Loading() {
	return (
		<div className="min-h-screen py-4 sm:py-6 lg:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800">
			<div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
				{/* Header Skeleton */}
				<div className="mb-4 sm:mb-6 animate-pulse">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200/80 dark:border-gray-700">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
							<div className="flex-1 w-full sm:w-auto">
								<div className="flex items-center gap-2 sm:gap-3 mb-2">
									<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 dark:bg-gray-700 rounded-lg sm:rounded-xl"></div>
									<div className="min-w-0 flex-1">
										<div className="h-6 sm:h-7 md:h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 sm:w-64 mb-2"></div>
										<div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 sm:w-40"></div>
									</div>
								</div>
							</div>
							<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
						</div>
					</div>
				</div>

				{/* Content Skeleton */}
				<div className="space-y-4 sm:space-y-6 animate-pulse">
					{/* Segments Grid Skeleton */}
					<div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
							<div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
							<div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-full sm:w-40"></div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
							{/* Segment Card Skeletons */}
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border-2 border-gray-200 dark:border-gray-700"
								>
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
										<div className="flex-1">
											<div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
											<div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
										</div>
									</div>
									<div className="space-y-3">
										<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
										<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
										<div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Button Skeleton */}
					<div className="h-12 sm:h-14 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
				</div>
			</div>
		</div>
	);
}


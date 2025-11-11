/**
 * Categories Loading Component
 * Responsive skeleton loading for categories page with green theme
 */
export default function CategoriesLoading() {
	return (
		<div className="min-h-screen bg-gray-50" dir="rtl">
			<div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				{/* Header Skeleton */}
				<div className="mb-6 sm:mb-8">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 bg-green-100 rounded-xl animate-pulse"></div>
							<div className="flex-1">
								<div className="h-6 w-32 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
								<div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Description Skeleton */}
				<div className="mb-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
						<div className="space-y-2">
							<div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse"></div>
							<div className="h-4 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
							<div className="h-4 w-1/2 bg-gray-200 rounded-lg animate-pulse"></div>
						</div>
					</div>
				</div>

				{/* Search and Filter Bar Skeleton */}
				<div className="mb-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Search Input Skeleton */}
							<div className="flex-1">
								<div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
							</div>
							{/* Filter Button Skeleton */}
							<div className="h-10 w-32 bg-green-500 rounded-lg animate-pulse"></div>
						</div>
					</div>
				</div>

				{/* Categories Content Skeleton */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
					{/* Breadcrumb Skeleton */}
					<div className="mb-6">
						<div className="flex items-center gap-2">
							<div className="h-4 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
							<div className="h-4 w-2 bg-gray-200 rounded-lg animate-pulse"></div>
							<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
						</div>
					</div>

					{/* Title and Description Skeleton */}
					<div className="mb-8 text-center">
						<div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
						<div className="space-y-2 max-w-2xl mx-auto">
							<div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse"></div>
							<div className="h-4 w-3/4 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
						</div>
					</div>

					{/* Search Bar Skeleton */}
					<div className="mb-8">
						<div className="max-w-md mx-auto">
							<div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
						</div>
					</div>

					{/* Categories Grid Skeleton */}
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{/* Category Card 1 */}
						<div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 animate-pulse">
							<div className="text-center">
								<div className="mb-4 flex justify-center">
									<div className="h-24 w-24 bg-gray-300 rounded-full animate-pulse"></div>
								</div>
								<div className="h-6 w-24 bg-gray-300 rounded-lg mx-auto mb-2 animate-pulse"></div>
								<div className="h-4 w-full bg-gray-300 rounded-lg animate-pulse"></div>
							</div>
						</div>

						{/* Category Card 2 */}
						<div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 animate-pulse">
							<div className="text-center">
								<div className="mb-4 flex justify-center">
									<div className="h-24 w-24 bg-gray-300 rounded-full animate-pulse"></div>
								</div>
								<div className="h-6 w-28 bg-gray-300 rounded-lg mx-auto mb-2 animate-pulse"></div>
								<div className="h-4 w-full bg-gray-300 rounded-lg animate-pulse"></div>
							</div>
						</div>

						{/* Category Card 3 */}
						<div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 animate-pulse">
							<div className="text-center">
								<div className="mb-4 flex justify-center">
									<div className="h-24 w-24 bg-gray-300 rounded-full animate-pulse"></div>
								</div>
								<div className="h-6 w-20 bg-gray-300 rounded-lg mx-auto mb-2 animate-pulse"></div>
								<div className="h-4 w-full bg-gray-300 rounded-lg animate-pulse"></div>
							</div>
						</div>

						{/* Category Card 4 */}
						<div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 animate-pulse">
							<div className="text-center">
								<div className="mb-4 flex justify-center">
									<div className="h-24 w-24 bg-gray-300 rounded-full animate-pulse"></div>
								</div>
								<div className="h-6 w-26 bg-gray-300 rounded-lg mx-auto mb-2 animate-pulse"></div>
								<div className="h-4 w-full bg-gray-300 rounded-lg animate-pulse"></div>
							</div>
						</div>

						{/* Category Card 5 */}
						<div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 animate-pulse">
							<div className="text-center">
								<div className="mb-4 flex justify-center">
									<div className="h-24 w-24 bg-gray-300 rounded-full animate-pulse"></div>
								</div>
								<div className="h-6 w-22 bg-gray-300 rounded-lg mx-auto mb-2 animate-pulse"></div>
								<div className="h-4 w-full bg-gray-300 rounded-lg animate-pulse"></div>
							</div>
						</div>

						{/* Category Card 6 */}
						<div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 animate-pulse">
							<div className="text-center">
								<div className="mb-4 flex justify-center">
									<div className="h-24 w-24 bg-gray-300 rounded-full animate-pulse"></div>
								</div>
								<div className="h-6 w-24 bg-gray-300 rounded-lg mx-auto mb-2 animate-pulse"></div>
								<div className="h-4 w-full bg-gray-300 rounded-lg animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Loading Indicator */}
				<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
					<div className="flex items-center gap-3">
						<div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
						<span className="text-sm text-gray-600 font-medium">جاري تحميل الأقسام...</span>
					</div>
				</div>
			</div>
		</div>
	);
}

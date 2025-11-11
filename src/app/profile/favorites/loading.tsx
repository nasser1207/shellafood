/**
 * Favorites Loading Component
 * Responsive skeleton loading for favorites page
 */
export default function FavoritesLoading() {
	return (
		<div className="min-h-screen bg-gray-50" dir="rtl">
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				{/* Header Skeleton */}
				<div className="mb-6 sm:mb-8">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse"></div>
								<div>
									<div className="h-6 w-32 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
									<div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="h-10 w-full sm:w-48 bg-gray-200 rounded-lg animate-pulse"></div>
								<div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs Skeleton */}
				<div className="mb-6 sm:mb-8">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
						<div className="flex gap-2">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
							))}
						</div>
					</div>
				</div>

				{/* Content Grid Skeleton */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{[...Array(8)].map((_, i) => (
						<div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
							{/* Image Skeleton */}
							<div className="relative mb-4">
								<div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
								<div className="absolute top-2 right-2 h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
							</div>

							{/* Content Skeleton */}
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
								<div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
								<div className="flex items-center gap-1 mb-2">
									<div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
									<div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
								</div>
								<div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
							</div>
						</div>
					))}
				</div>

				{/* Loading Indicator */}
				<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
					<div className="flex items-center gap-3">
						<div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
						<span className="text-sm text-gray-600 font-medium">جاري تحميل المفضلة...</span>
					</div>
				</div>
			</div>
		</div>
	);
}

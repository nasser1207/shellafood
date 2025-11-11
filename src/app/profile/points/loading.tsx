/**
 * Points Loading Component
 * Responsive skeleton loading for points page with green theme
 */
export default function PointsLoading() {
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

				{/* Points and Coupons Summary Skeleton */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
					{/* Points Card Skeleton */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<div className="h-6 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
								<div className="h-4 w-20 bg-green-200 rounded-lg animate-pulse"></div>
							</div>
							<div className="h-12 w-12 bg-green-100 rounded-full animate-pulse"></div>
						</div>
					</div>

					{/* Coupons Card Skeleton */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<div className="h-6 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
								<div className="h-4 w-20 bg-green-200 rounded-lg animate-pulse"></div>
							</div>
							<div className="h-12 w-12 bg-green-100 rounded-full animate-pulse"></div>
						</div>
					</div>
				</div>

				{/* Expiration Alert Skeleton */}
				<div className="mb-6 flex items-center gap-3 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
					<div className="h-8 w-8 bg-yellow-100 rounded-full animate-pulse"></div>
					<div className="h-4 w-64 bg-yellow-200 rounded-lg animate-pulse"></div>
				</div>

				{/* Tabs Skeleton */}
				<div className="mb-6">
					<div className="flex justify-center gap-8 items-center bg-white rounded-xl shadow-sm border border-gray-200 p-1">
						<div className="py-3 px-4 bg-green-500 rounded-lg animate-pulse w-20"></div>
						<div className="py-3 px-4 bg-gray-200 rounded-lg animate-pulse w-20"></div>
					</div>
				</div>

				{/* Offers Grid Skeleton */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
					{/* Offer Card 1 */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						{/* Badge Skeleton */}
						<div className="absolute top-3 right-3 z-10 rounded-lg bg-orange-500 px-3 py-1 w-16 h-6 animate-pulse"></div>
						
						{/* Image Skeleton */}
						<div className="h-48 w-full bg-gray-200 animate-pulse"></div>
						
						{/* Content Skeleton */}
						<div className="p-4">
							<div className="h-5 w-full bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-yellow-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-green-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
							</div>
							<div className="h-8 w-full bg-green-500 rounded-lg animate-pulse"></div>
						</div>
					</div>

					{/* Offer Card 2 */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						{/* Badge Skeleton */}
						<div className="absolute top-3 right-3 z-10 rounded-lg bg-orange-500 px-3 py-1 w-16 h-6 animate-pulse"></div>
						
						{/* Image Skeleton */}
						<div className="h-48 w-full bg-gray-200 animate-pulse"></div>
						
						{/* Content Skeleton */}
						<div className="p-4">
							<div className="h-5 w-full bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-yellow-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-green-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
							</div>
							<div className="h-8 w-full bg-green-500 rounded-lg animate-pulse"></div>
						</div>
					</div>

					{/* Offer Card 3 */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						{/* Badge Skeleton */}
						<div className="absolute top-3 right-3 z-10 rounded-lg bg-orange-500 px-3 py-1 w-16 h-6 animate-pulse"></div>
						
						{/* Image Skeleton */}
						<div className="h-48 w-full bg-gray-200 animate-pulse"></div>
						
						{/* Content Skeleton */}
						<div className="p-4">
							<div className="h-5 w-full bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-yellow-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-green-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
							</div>
							<div className="h-8 w-full bg-green-500 rounded-lg animate-pulse"></div>
						</div>
					</div>

					{/* Offer Card 4 */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						{/* Badge Skeleton */}
						<div className="absolute top-3 right-3 z-10 rounded-lg bg-orange-500 px-3 py-1 w-16 h-6 animate-pulse"></div>
						
						{/* Image Skeleton */}
						<div className="h-48 w-full bg-gray-200 animate-pulse"></div>
						
						{/* Content Skeleton */}
						<div className="p-4">
							<div className="h-5 w-full bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-yellow-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-green-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
							</div>
							<div className="h-8 w-full bg-green-500 rounded-lg animate-pulse"></div>
						</div>
					</div>

					{/* Offer Card 5 */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						{/* Badge Skeleton */}
						<div className="absolute top-3 right-3 z-10 rounded-lg bg-orange-500 px-3 py-1 w-16 h-6 animate-pulse"></div>
						
						{/* Image Skeleton */}
						<div className="h-48 w-full bg-gray-200 animate-pulse"></div>
						
						{/* Content Skeleton */}
						<div className="p-4">
							<div className="h-5 w-full bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-yellow-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-green-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
							</div>
							<div className="h-8 w-full bg-green-500 rounded-lg animate-pulse"></div>
						</div>
					</div>

					{/* Offer Card 6 */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						{/* Badge Skeleton */}
						<div className="absolute top-3 right-3 z-10 rounded-lg bg-orange-500 px-3 py-1 w-16 h-6 animate-pulse"></div>
						
						{/* Image Skeleton */}
						<div className="h-48 w-full bg-gray-200 animate-pulse"></div>
						
						{/* Content Skeleton */}
						<div className="p-4">
							<div className="h-5 w-full bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-yellow-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 bg-green-100 rounded-full animate-pulse"></div>
									<div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
							</div>
							<div className="h-8 w-full bg-green-500 rounded-lg animate-pulse"></div>
						</div>
					</div>
				</div>

				{/* Loading Indicator */}
				<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
					<div className="flex items-center gap-3">
						<div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
						<span className="text-sm text-gray-600 font-medium">جاري تحميل النقاط...</span>
					</div>
				</div>
			</div>
		</div>
	);
}
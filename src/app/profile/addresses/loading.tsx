/**
 * Addresses Loading Component
 * Responsive skeleton loading for addresses page
 */
export default function AddressesLoading() {
	return (
		<div className="min-h-screen bg-gray-50" dir="rtl">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
				{/* Header Skeleton */}
				<div className="mb-8">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div className="flex items-center gap-4">
								<div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
								<div>
									<div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
									<div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
								</div>
							</div>
							<div className="flex gap-3">
								<div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
								<div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Addresses List Skeleton */}
				<div className="space-y-6">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							{/* Address Header Skeleton */}
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
									<div>
										<div className="h-6 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
										<div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
									</div>
								</div>
								<div className="flex gap-2">
									<div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
									<div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
							</div>

							{/* Address Details Skeleton */}
							<div className="space-y-3 mb-4">
								<div className="flex items-start gap-3">
									<div className="h-4 w-4 bg-gray-200 rounded animate-pulse mt-1"></div>
									<div className="flex-1">
										<div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
										<div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
									<div className="flex-1">
										<div className="h-4 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
										<div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
									</div>
								</div>
							</div>

							{/* Action Buttons Skeleton */}
							<div className="flex gap-3">
								<div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
								<div className="h-10 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
							</div>
						</div>
					))}
				</div>

				{/* Quick Actions Skeleton */}
				<div className="mt-8">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
							<div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
						</div>
						
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
									<div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
									<div className="flex-1">
										<div className="h-4 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
										<div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Loading Indicator */}
				<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
					<div className="flex items-center gap-3">
						<div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
						<span className="text-sm text-gray-600 font-medium">جاري تحميل العناوين...</span>
					</div>
				</div>
			</div>
		</div>
	);
}
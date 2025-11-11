/**
 * Account Info Loading Component
 * Responsive skeleton loading for account information page
 */
export default function AccountInfoLoading() {
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
								<div className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
								<div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Personal Information Skeleton */}
				<div className="mb-8">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
							<div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
						</div>
						
						<div className="space-y-4">
							{[...Array(6)].map((_, i) => (
								<div key={i} className="space-y-2">
									<div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
									<div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Security Actions Skeleton */}
				<div className="mt-8">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
							<div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
						</div>
						
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
						<span className="text-sm text-gray-600 font-medium">جاري تحميل معلومات الحساب...</span>
					</div>
				</div>
			</div>
		</div>
	);
}
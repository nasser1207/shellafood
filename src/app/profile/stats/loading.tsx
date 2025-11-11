/**
 * Stats Loading Component
 * Responsive skeleton loading for stats page
 */
export default function StatsLoading() {
	return (
		<div className="min-h-screen bg-gray-100" dir="rtl">
			<div className="flex min-h-screen items-center justify-center p-4">
				<div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-lg md:flex-row">
					{/* Sidebar Skeleton */}
					<div className="hidden w-[420px] border-r border-gray-200 bg-gray-50 px-6 py-8 md:block">
						<div className="space-y-6">
							{/* Profile Header Skeleton */}
							<div className="flex items-center space-x-4 space-x-reverse">
								<div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
								<div className="flex-1">
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
									<div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
								</div>
							</div>

							{/* Menu Items Skeleton */}
							<div className="space-y-3">
								{[...Array(8)].map((_, i) => (
									<div key={i} className="flex items-center space-x-3 space-x-reverse">
										<div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
										<div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Content Area Skeleton */}
					<div className="flex-1 p-4 md:p-8">
						{/* Page Title */}
						<div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-8 animate-pulse"></div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
							{[...Array(2)].map((_, i) => (
								<div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
									<div className="flex items-center justify-between">
										<div className="flex flex-col items-end">
											<div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
											<div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
										</div>
										<div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
									</div>
								</div>
							))}
						</div>

						{/* Most Purchased Products */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
							<div className="h-6 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
							
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{[...Array(6)].map((_, i) => (
									<div key={i} className="flex items-center space-x-3 space-x-reverse p-3 border border-gray-200 rounded-lg">
										<div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
										<div className="flex-1">
											<div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
											<div className="h-3 bg-gray-200 rounded w-1/2 mb-1 animate-pulse"></div>
											<div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Additional Stats */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
									<div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2 animate-pulse"></div>
									<div className="h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Loading Indicator */}
			<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
				<div className="flex items-center space-x-3 space-x-reverse">
					<div className="w-5 h-5 border-2 border-[#31A342] border-t-transparent rounded-full animate-spin"></div>
					<span className="text-sm text-gray-600 font-medium">جاري تحميل الإحصائيات...</span>
				</div>
			</div>
		</div>
	);
}

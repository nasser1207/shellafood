/**
 * Wallet Loading Component
 * Responsive skeleton loading for wallet page
 */
export default function WalletLoading() {
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

						{/* Balance Section */}
						<div className="flex items-center justify-between rounded-lg border border-green-300 bg-white p-6 shadow-sm mb-8">
							<div className="flex flex-row-reverse items-center gap-1 space-x-4">
								<div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
								<div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
							</div>
							<div className="flex flex-col items-end">
								<div className="flex items-center space-x-1 mb-2">
									<div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
									<div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
								</div>
								<div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
							</div>
						</div>

						{/* Transactions Section */}
						<div className="flex flex-col space-y-4">
							<div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
							
							{/* Filter Buttons */}
							<div className="flex flex-row-reverse items-center space-x-2">
								{[...Array(4)].map((_, i) => (
									<div key={i} className="h-8 bg-gray-200 rounded-full w-16 animate-pulse"></div>
								))}
							</div>

							{/* Empty State */}
							<div className="mt-12 flex flex-col items-center justify-center text-center">
								<div className="h-16 w-16 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
								<div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Loading Indicator */}
			<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
				<div className="flex items-center space-x-3 space-x-reverse">
					<div className="w-5 h-5 border-2 border-[#31A342] border-t-transparent rounded-full animate-spin"></div>
					<span className="text-sm text-gray-600 font-medium">جاري تحميل المحفظة...</span>
				</div>
			</div>
		</div>
	);
}

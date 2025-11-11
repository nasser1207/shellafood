/**
 * Kaidha Wallet Loading Component
 * Responsive skeleton loading for kaidha wallet page
 */
export default function KaidhaWalletLoading() {
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
						<div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-8 animate-pulse"></div>

						{/* Kaidha Wallet Card */}
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
							{/* Header Section */}
							<div className="flex flex-col-reverse md:flex-row-reverse justify-between items-start mb-4 space-y-4 md:space-y-0">
								<div className="flex flex-col items-end">
									<div className="h-6 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
									<div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
								</div>
								<div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
							</div>

							{/* Progress Section */}
							<div className="flex flex-col space-y-2 text-right mb-4">
								<div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
								<div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
									<div className="absolute top-0 right-0 h-full bg-gray-300 rounded-full w-1/2 animate-pulse"></div>
								</div>
							</div>

							{/* Balance and Limit */}
							<div className="flex flex-col md:flex-row justify-between text-gray-500 text-sm font-medium mt-4">
								<div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
								<div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
							</div>
							<div className="flex flex-col md:flex-row justify-between text-gray-500 text-sm font-medium">
								<div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
								<div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Loading Indicator */}
			<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
				<div className="flex items-center space-x-3 space-x-reverse">
					<div className="w-5 h-5 border-2 border-[#31A342] border-t-transparent rounded-full animate-spin"></div>
					<span className="text-sm text-gray-600 font-medium">جاري تحميل محفظة قيدها...</span>
				</div>
			</div>
		</div>
	);
}

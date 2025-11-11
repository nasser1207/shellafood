/**
 * Vouchers Loading Component
 * Responsive skeleton loading for vouchers page with green theme
 */
export default function VouchersLoading() {
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

				{/* Tabs Skeleton */}
				<div className="mb-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
						<div className="flex">
							<div className="flex-1 py-3 px-4 bg-green-500 rounded-lg animate-pulse"></div>
							<div className="flex-1 py-3 px-4 bg-gray-200 rounded-lg animate-pulse"></div>
						</div>
					</div>
				</div>

				{/* Vouchers List Skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
					{/* Voucher Card 1 */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
						<div className="flex items-center justify-between">
							{/* Discount Section Skeleton */}
							<div className="w-1/3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-l-xl">
								<div className="flex flex-col items-center gap-2">
									<div className="w-12 h-12 bg-green-200 rounded-full animate-pulse"></div>
									<div className="h-6 w-16 bg-green-300 rounded-lg animate-pulse"></div>
									<div className="h-4 w-20 bg-green-200 rounded-lg animate-pulse"></div>
								</div>
							</div>

							{/* Details Section Skeleton */}
							<div className="w-2/3 p-4">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-4 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-4 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
								</div>
								<div className="mt-3 pt-3 border-t border-gray-100">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-3 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
								</div>
								<div className="mt-3">
									<div className="h-8 w-full bg-green-500 rounded-lg animate-pulse"></div>
								</div>
							</div>
						</div>
					</div>

					{/* Voucher Card 2 */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
						<div className="flex items-center justify-between">
							{/* Discount Section Skeleton */}
							<div className="w-1/3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-l-xl">
								<div className="flex flex-col items-center gap-2">
									<div className="w-12 h-12 bg-green-200 rounded-full animate-pulse"></div>
									<div className="h-6 w-20 bg-green-300 rounded-lg animate-pulse"></div>
									<div className="h-4 w-24 bg-green-200 rounded-lg animate-pulse"></div>
								</div>
							</div>

							{/* Details Section Skeleton */}
							<div className="w-2/3 p-4">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-4 w-36 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-4 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
								</div>
								<div className="mt-3 pt-3 border-t border-gray-100">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-3 w-44 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
								</div>
								<div className="mt-3">
									<div className="h-8 w-full bg-green-500 rounded-lg animate-pulse"></div>
								</div>
							</div>
						</div>
					</div>

					{/* Voucher Card 3 */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
						<div className="flex items-center justify-between">
							{/* Discount Section Skeleton */}
							<div className="w-1/3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-l-xl">
								<div className="flex flex-col items-center gap-2">
									<div className="w-12 h-12 bg-green-200 rounded-full animate-pulse"></div>
									<div className="h-6 w-18 bg-green-300 rounded-lg animate-pulse"></div>
									<div className="h-4 w-28 bg-green-200 rounded-lg animate-pulse"></div>
								</div>
							</div>

							{/* Details Section Skeleton */}
							<div className="w-2/3 p-4">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-4 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-4 w-36 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
								</div>
								<div className="mt-3 pt-3 border-t border-gray-100">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
										<div className="h-3 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
								</div>
								<div className="mt-3">
									<div className="h-8 w-full bg-green-500 rounded-lg animate-pulse"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Loading Indicator */}
				<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
					<div className="flex items-center gap-3">
						<div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
						<span className="text-sm text-gray-600 font-medium">جاري تحميل القسائم...</span>
					</div>
				</div>
			</div>
		</div>
	);
}
/**
 * Kaidha Loading Component
 * Responsive skeleton loading for kaidha registration page
 */
export default function KaidhaLoading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
				{/* Description Section Skeleton */}
				<section className="relative mb-6 sm:mb-8 rounded-xl bg-[#F6F5F0] dark:bg-gray-800 p-4 sm:p-6 md:p-8 lg:p-12 shadow-sm">
					<div className="flex h-auto w-full items-end justify-end">
						<div className="w-full space-y-3">
							<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							<div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							<div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
						</div>
					</div>
				</section>

				{/* Form Section Skeleton */}
				<section className="mb-6 sm:mb-8 rounded-xl bg-[#FFFFFF] dark:bg-gray-800 p-0 sm:p-2 md:p-4 shadow-md">
					<div className="w-full">
						{/* Form Header Skeleton */}
						<div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 px-4 py-6 sm:px-6 sm:py-8 md:px-8 rounded-t-xl">
							<div className="h-8 w-48 md:h-10 md:w-64 bg-green-400 dark:bg-green-500 rounded animate-pulse mb-2"></div>
							<div className="h-4 w-32 bg-green-400 dark:bg-green-500 rounded animate-pulse"></div>
						</div>

						{/* Form Content Skeleton */}
						<div className="p-4 sm:p-6 md:p-8">
							{/* Section Header Skeleton */}
							<div className="mb-6">
								<div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							</div>

							{/* Form Fields Grid Skeleton */}
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
								{Array.from({ length: 8 }, (_, i) => (
									<div key={i} className="space-y-2">
										<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
										<div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									</div>
								))}
							</div>

							{/* Full Width Fields Skeleton */}
							<div className="space-y-4 mb-6">
								{Array.from({ length: 3 }, (_, i) => (
									<div key={i} className="space-y-2">
										<div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
										<div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									</div>
								))}
							</div>

							{/* Map Section Skeleton */}
							<div className="mb-6">
								<div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
								<div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
							</div>

							{/* Dynamic Lists Skeleton */}
							<div className="space-y-6 mb-6">
								{Array.from({ length: 2 }, (_, i) => (
									<div key={i} className="space-y-3">
										<div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
										<div className="space-y-2">
											{Array.from({ length: 2 }, (_, j) => (
												<div key={j} className="flex gap-2">
													<div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
													<div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
													<div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>

							{/* Checkbox Skeleton */}
							<div className="flex items-start gap-3 mb-6">
								<div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-0.5"></div>
								<div className="flex-1 space-y-2">
									<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									<div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
								</div>
							</div>

							{/* Submit Button Skeleton */}
							<div className="flex justify-center pt-4">
								<div className="h-12 w-full sm:w-48 bg-green-500 dark:bg-green-600 rounded-lg animate-pulse"></div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}



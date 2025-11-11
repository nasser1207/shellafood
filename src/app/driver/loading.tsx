// app/driver/loading.tsx
export default function DriverLoading() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
			<div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
				{/* Hero Section Skeleton */}
				<div className="relative mb-8 overflow-hidden rounded-xl animate-pulse">
					<div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
				</div>

				{/* Benefits Section Skeleton */}
				<section className="w-full bg-white dark:bg-gray-800 py-8 sm:py-12 md:py-16 mb-8">
					<div className="mx-auto flex flex-col items-center justify-center max-w-7xl px-4 sm:px-6 lg:px-8">
						{/* Section Header Skeleton */}
						<div className="mb-8 sm:mb-12 text-center">
							<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
						</div>

						{/* Benefits Cards Grid Skeleton */}
						<div className="flex flex-col items-center justify-center gap-8 lg:flex-row w-full">
							{/* Benefit Card 1 */}
							<div className="w-full max-w-[550px] lg:w-1/2 overflow-hidden rounded-lg sm:rounded-xl bg-gray-200 dark:bg-gray-700 shadow-lg animate-pulse">
								<div className="aspect-[550/300] w-full bg-gray-300 dark:bg-gray-600"></div>
								<div className="p-6 space-y-3">
									<div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
									<div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
									<div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
								</div>
							</div>

							{/* Benefit Card 2 */}
							<div className="w-full max-w-[550px] lg:w-1/2 overflow-hidden rounded-lg sm:rounded-xl bg-gray-200 dark:bg-gray-700 shadow-lg animate-pulse">
								<div className="aspect-[550/300] w-full bg-gray-300 dark:bg-gray-600"></div>
								<div className="p-6 space-y-3">
									<div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
									<div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
									<div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Form Section Skeleton */}
				<section className="mb-8 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md md:p-12 animate-pulse">
					{/* Form Title Skeleton */}
					<div className="text-center mb-8">
						<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto mb-4"></div>
						<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-80 mx-auto"></div>
					</div>

					{/* Form Fields Skeleton */}
					<div className="space-y-6 max-w-3xl mx-auto">
						{/* Field Row 1 */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
						</div>

						{/* Field Row 2 */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
						</div>

						{/* Field Row 3 */}
						<div className="space-y-2">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
							<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
						</div>

						{/* Field Row 4 */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
						</div>

						{/* Submit Button Skeleton */}
						<div className="pt-4">
							<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

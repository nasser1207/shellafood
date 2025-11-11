/**
 * Worker Loading Component
 * Responsive skeleton loading for worker registration page
 */
export default function WorkerLoading() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
			<div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
				{/* Hero Section Skeleton */}
				<section className="relative mb-8 overflow-hidden animate-pulse">
					<div className="h-64 sm:h-80 lg:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
				</section>

				{/* Benefits Section Skeleton */}
				<section className="mb-8 w-full bg-white dark:bg-gray-800 py-8 sm:py-12 md:py-16">
					<div className="mx-auto flex flex-col items-center justify-center max-w-7xl px-4 sm:px-6 lg:px-8">
						{/* Section Title */}
						<div className="mb-8 sm:mb-12 text-center">
							<div className="h-10 w-80 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
						</div>

						{/* Benefits Cards Grid */}
						<div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
							{Array.from({ length: 2 }, (_, i) => (
								<div key={i} className="w-full lg:w-auto space-y-4">
									<div className="h-64 w-full sm:w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
									<div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									<div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Form Section Skeleton */}
				<section className="mb-8 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md md:p-12">
					{/* Form Title */}
					<div className="mb-8 text-center">
						<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
						<div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
					</div>

					{/* Form Fields Skeleton */}
					<div className="space-y-6 max-w-4xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{Array.from({ length: 6 }, (_, i) => (
								<div key={i} className="space-y-2">
									<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									<div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
								</div>
							))}
						</div>

						{/* Map Section Skeleton */}
						<div className="space-y-2">
							<div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							<div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
						</div>

						{/* File Upload Sections */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{Array.from({ length: 3 }, (_, i) => (
								<div key={i} className="space-y-2">
									<div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									<div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
								</div>
							))}
						</div>

						{/* Checkbox Skeleton */}
						<div className="flex items-start gap-3">
							<div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-0.5"></div>
							<div className="flex-1 space-y-2">
								<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
								<div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							</div>
						</div>

						{/* Submit Button Skeleton */}
						<div className="flex justify-center pt-4">
							<div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}


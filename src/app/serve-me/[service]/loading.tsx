/**
 * Loading state for Service Detail Page
 * Shows skeleton loading for hero, cards, and sections
 */
export default function ServiceLoading() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			{/* Hero Skeleton */}
			<div className="relative h-[400px] sm:h-[450px] lg:h-[500px] w-full bg-gray-200 dark:bg-gray-800 animate-pulse">
				<div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800"></div>
				<div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
					<div className="h-12 w-3/4 max-w-2xl bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
					<div className="h-6 w-1/2 max-w-xl bg-gray-300 dark:bg-gray-700 rounded-lg mb-8"></div>
					<div className="h-14 w-full max-w-2xl bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
				</div>
			</div>

			{/* Main Services Section Skeleton */}
			<div className="bg-white dark:bg-gray-900 py-12 lg:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-10 mx-auto animate-pulse"></div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md">
								<div className="h-48 sm:h-56 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
								<div className="p-5">
									<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
									<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Key Services Section Skeleton */}
			<div className="bg-gray-100 dark:bg-gray-800 py-12 lg:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-10 mx-auto animate-pulse"></div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md">
								<div className="h-48 sm:h-56 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
								<div className="p-5">
									<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
									<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Why Choose Us Skeleton */}
			<div className="bg-white dark:bg-gray-900 py-12 lg:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-10 mx-auto animate-pulse"></div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="flex flex-col items-center text-center">
								<div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 animate-pulse"></div>
								<div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
								<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Video Section Skeleton */}
			<div className="bg-gray-100 dark:bg-gray-800 py-12 lg:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-10 mx-auto animate-pulse"></div>
					<div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden">
						<div className="h-[300px] sm:h-[400px] lg:h-[550px] bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

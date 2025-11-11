/**
 * Serve Me Loading Component
 * Responsive skeleton loading for serve-me main page
 */
export default function ServeMeLoading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
			{/* Hero Section Skeleton */}
			<section className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse">
				<div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
					<div className="h-12 w-3/4 max-w-2xl bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
					<div className="h-6 w-1/2 max-w-xl bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
					<div className="h-14 w-full max-w-2xl bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
				</div>
			</section>

			{/* Main Content Skeleton */}
			<main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
				{/* Services Grid Skeleton */}
				<div className="mb-12 animate-pulse">
					<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-8"></div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
								<div className="h-48 w-full bg-gray-200 dark:bg-gray-700"></div>
								<div className="p-4 space-y-3">
									<div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
									<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
									<div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Features Section Skeleton */}
				<div className="bg-white dark:bg-gray-800 py-12 rounded-lg shadow-md animate-pulse">
					<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-8"></div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="flex flex-col items-center text-center">
								<div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
								<div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
								<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}


// app/previously-ordered-stores/loading.tsx
export default function PreviouslyOrderedStoresLoading() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
			<div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Breadcrumbs Skeleton */}
				<div className="mb-6 flex items-center gap-2 animate-pulse">
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3"></div>
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
				</div>

				{/* Page Header Skeleton */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
							<div className="space-y-2">
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
							</div>
						</div>
						<div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
					</div>

					{/* Sort & Filter Bar Skeleton */}
					<div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse"></div>
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-40 animate-pulse"></div>
							</div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
						</div>
					</div>
				</div>

				<div className="grid lg:grid-cols-[280px_1fr] gap-8">
					{/* Filters Sidebar Skeleton */}
					<div className="hidden lg:block">
						<div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 space-y-6">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="space-y-3 animate-pulse">
									<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
									<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
								</div>
							))}
						</div>
					</div>

					{/* Stores Grid Skeleton */}
					<div>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(9)].map((_, i) => (
								<div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
									{/* Store Image */}
									<div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
									
									{/* Store Info */}
									<div className="p-4 space-y-3">
										<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
										<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
										<div className="flex items-center justify-between">
											<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
											<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


// app/categories/[category]/loading.tsx
export default function CategoryLoading() {
	return (
		<div className="min-h-screen bg-gray-50" dir="rtl">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Header Card Skeleton */}
				<div className="mb-6 sm:mb-8">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
						<div className="flex items-center gap-3 flex-row-reverse">
							<div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-xl flex-shrink-0"></div>
							<div className="flex-1 text-right">
								<div className="h-6 sm:h-8 bg-gray-200 rounded mb-2 w-3/4 mr-auto"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2 mr-auto"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Stores Grid Skeleton */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
							<div className="h-48 bg-gray-200"></div>
							<div className="p-4 space-y-2">
								<div className="h-4 bg-gray-200 rounded"></div>
								<div className="h-3 bg-gray-200 rounded w-2/3 mr-auto"></div>
								<div className="h-3 bg-gray-200 rounded w-1/2 mr-auto"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

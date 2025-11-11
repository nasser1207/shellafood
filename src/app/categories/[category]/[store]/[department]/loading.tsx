// app/categories/[category]/[store]/[department]/loading.tsx
export default function DepartmentLoading() {
	return (
		<div className="min-h-screen bg-gray-50" dir="rtl">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Header Card Skeleton */}
				<div className="mb-6 sm:mb-8">
					<div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm animate-pulse">
						<div className="flex items-center gap-3 flex-row-reverse">
							<div className="h-10 w-10 bg-gray-200 rounded-xl flex-shrink-0"></div>
							<div className="flex-1 text-right">
								<div className="h-6 bg-gray-200 rounded mb-2 w-2/3 mr-auto"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2 mr-auto"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Filters Skeleton */}
				<div className="mb-6 flex flex-wrap gap-2 justify-end">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
					))}
				</div>

				{/* Products Grid Skeleton */}
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
					{Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm animate-pulse">
							<div className="aspect-square rounded-lg bg-gray-200 mb-3"></div>
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-3 bg-gray-200 rounded w-2/3 mr-auto"></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

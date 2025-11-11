// app/categories/[category]/[store]/loading.tsx
export default function StoreLoading() {
	return (
		<div className="min-h-screen bg-white" dir="rtl">
			{/* Store Header Image Skeleton */}
			<div className="relative h-48 sm:h-64 md:h-80 bg-gray-200 animate-pulse"></div>
			
			{/* Store Content Skeleton */}
			<div className="relative z-10 -mt-8 rounded-t-2xl bg-white p-4 md:p-8">
				<div className="animate-pulse space-y-4">
					{/* Store Title Skeleton */}
					<div className="h-8 bg-gray-200 rounded w-1/3 mr-auto"></div>
					<div className="h-4 bg-gray-200 rounded w-1/4 mr-auto"></div>
					
					{/* Departments Grid Skeleton */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="bg-gray-200 rounded-lg h-24 flex items-center justify-center">
								<div className="h-4 w-3/4 bg-gray-300 rounded"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

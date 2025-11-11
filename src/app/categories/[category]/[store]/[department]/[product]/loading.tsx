// app/categories/[category]/[store]/[department]/[product]/loading.tsx
export default function ProductLoading() {
	return (
		<div className="min-h-screen bg-gray-50" dir="rtl">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Main Product Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
					{/* Product Image Skeleton */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
						<div className="aspect-square bg-gray-200 rounded-lg"></div>
					</div>
					
					{/* Product Details Skeleton */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse space-y-4">
						{/* Product Title */}
						<div className="h-8 bg-gray-200 rounded w-3/4 mr-auto"></div>
						
						{/* Product Price */}
						<div className="h-6 bg-gray-200 rounded w-1/2 mr-auto"></div>
						
						{/* Product Description */}
						<div className="space-y-2">
							<div className="h-4 bg-gray-200 rounded"></div>
							<div className="h-4 bg-gray-200 rounded w-5/6 mr-auto"></div>
							<div className="h-4 bg-gray-200 rounded w-4/6 mr-auto"></div>
						</div>
						
						{/* Quantity Selector */}
						<div className="h-10 bg-gray-200 rounded w-1/2 mr-auto"></div>
						
						{/* Add to Cart Button */}
						<div className="h-12 bg-gray-200 rounded w-full"></div>
					</div>
				</div>
				
				{/* Related Products Skeleton */}
				<div className="mt-12">
					<div className="h-6 bg-gray-200 rounded w-48 mr-auto mb-6 animate-pulse"></div>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 animate-pulse">
								<div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
								<div className="h-4 bg-gray-200 rounded mb-2"></div>
								<div className="h-3 bg-gray-200 rounded w-2/3 mr-auto"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

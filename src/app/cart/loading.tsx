// app/cart/loading.tsx
export default function CartLoading() {
	return (
	  <div className="min-h-screen bg-gray-50">
		{/* Navigation Skeleton */}
		<div className="h-16 bg-white border-b animate-pulse" />
		
		{/* Cart Content Skeleton */}
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			
			{/* Cart Items Skeleton */}
			<div className="lg:col-span-2 space-y-4">
			  <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-6" />
			  
			  {/* Item Cards */}
			  {[1, 2, 3].map((i) => (
				<div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
				  <div className="flex gap-4">
					<div className="w-24 h-24 bg-gray-200 rounded" />
					<div className="flex-1 space-y-3">
					  <div className="h-4 bg-gray-200 rounded w-3/4" />
					  <div className="h-3 bg-gray-200 rounded w-1/2" />
					  <div className="h-4 bg-gray-200 rounded w-1/4" />
					</div>
				  </div>
				</div>
			  ))}
			</div>
			
			{/* Order Summary Skeleton */}
			<div className="lg:col-span-1">
			  <div className="bg-white rounded-lg shadow p-6 sticky top-4">
				<div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4" />
				<div className="space-y-3">
				  <div className="h-4 bg-gray-200 rounded animate-pulse" />
				  <div className="h-4 bg-gray-200 rounded animate-pulse" />
				  <div className="h-4 bg-gray-200 rounded animate-pulse" />
				  <div className="border-t pt-3 mt-3">
					<div className="h-6 bg-gray-200 rounded animate-pulse" />
				  </div>
				  <div className="h-12 bg-gray-200 rounded animate-pulse mt-4" />
				</div>
			  </div>
			</div>
		  </div>
		</div>
		
		{/* Footer Skeleton */}
		<div className="h-64 bg-gray-200 animate-pulse mt-8" />
	  </div>
	);
  }
// app/home/loading.tsx
export default function HomeLoading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50" dir="rtl">
			{/* Hero Section Skeleton */}
			<section className="bg-gray-100 py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center space-y-6 animate-pulse">
						{/* Address Selector Skeleton */}
						<div className="max-w-2xl mx-auto space-y-4">
							<div className="h-12 bg-gray-200 rounded-xl w-full"></div>
							<div className="h-10 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content Container */}
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Categories Section Skeleton */}
				<section className="py-12 md:py-16">
					{/* Section Title */}
					<div className="h-8 md:h-10 bg-gray-200 rounded-lg w-1/3 max-w-xs mb-8 md:mb-12 animate-pulse"></div>
					
					{/* Categories Grid */}
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
						{[...Array(16)].map((_, i) => (
							<div key={i} className="text-center space-y-3">
								<div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
								<div className="h-3 md:h-4 bg-gray-200 rounded w-4/5 mx-auto animate-pulse"></div>
							</div>
						))}
					</div>
				</section>

				{/* Promotional Banner Skeleton */}
				<section className="py-8 mb-12">
					<div className="h-32 md:h-48 bg-gray-200 rounded-xl animate-pulse"></div>
				</section>

				{/* Nearby Stores Section Skeleton */}
				<section className="py-12 md:py-16 bg-white rounded-xl mb-8">
					{/* Section Title */}
					<div className="h-8 md:h-10 bg-gray-200 rounded-lg w-1/4 max-w-xs mb-8 md:mb-12 animate-pulse"></div>
					
					{/* Stores Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[...Array(8)].map((_, i) => (
							<div key={i} className="bg-gray-50 rounded-xl p-4 md:p-6 space-y-4 animate-pulse">
								{/* Store Image */}
								<div className="h-40 md:h-48 bg-gray-200 rounded-lg"></div>
								
								{/* Store Info */}
								<div className="space-y-2">
									<div className="h-5 md:h-6 bg-gray-200 rounded w-3/4"></div>
									<div className="h-4 bg-gray-200 rounded w-1/2"></div>
									<div className="h-4 bg-gray-200 rounded w-2/3"></div>
								</div>
								
								{/* Rating & Delivery */}
								<div className="flex items-center justify-between">
									<div className="h-4 bg-gray-200 rounded w-16"></div>
									<div className="h-4 bg-gray-200 rounded w-20"></div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Discounts Section Skeleton */}
				<section className="py-12 md:py-16">
					{/* Section Title */}
					<div className="h-8 md:h-10 bg-gray-200 rounded-lg w-1/4 max-w-xs mb-8 md:mb-12 animate-pulse"></div>
					
					{/* Discounts Slider Skeleton */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[...Array(8)].map((_, i) => (
							<div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3 animate-pulse">
								{/* Discount Image */}
								<div className="h-32 md:h-40 bg-gray-200 rounded-lg"></div>
								
								{/* Discount Details */}
								<div className="space-y-2">
									<div className="h-5 bg-gray-200 rounded w-4/5"></div>
									<div className="h-4 bg-gray-200 rounded w-3/5"></div>
								</div>
								
								{/* Price & Discount */}
								<div className="flex items-center justify-between">
									<div className="h-5 bg-gray-200 rounded w-20"></div>
									<div className="h-4 bg-gray-200 rounded w-16"></div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Popular Stores Section Skeleton */}
				<section className="py-12 md:py-16 bg-white rounded-xl">
					{/* Section Title */}
					<div className="h-8 md:h-10 bg-gray-200 rounded-lg w-1/4 max-w-xs mb-8 md:mb-12 animate-pulse"></div>
					
					{/* Popular Stores Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[...Array(8)].map((_, i) => (
							<div key={i} className="bg-gray-50 rounded-xl p-4 md:p-6 space-y-4 animate-pulse">
								{/* Store Image */}
								<div className="h-40 md:h-48 bg-gray-200 rounded-lg"></div>
								
								{/* Store Info */}
								<div className="space-y-2">
									<div className="h-5 md:h-6 bg-gray-200 rounded w-3/4"></div>
									<div className="h-4 bg-gray-200 rounded w-1/2"></div>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}

// app/categories/[category]/[store]/loading.tsx
import MobileStorePageSkeleton from "@/components/Categories/shared/MobileStorePageSkeleton";

export default function StoreLoading() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Mobile skeleton for mobile devices */}
			<div className="block md:hidden">
				<MobileStorePageSkeleton />
			</div>
			
			{/* Desktop skeleton */}
			<div className="hidden md:block min-h-screen bg-white dark:bg-gray-900" dir="rtl">
				{/* Store Header Image Skeleton */}
				<div className="relative h-64 md:h-80 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
				
				{/* Store Content Skeleton */}
				<div className="relative z-10 -mt-8 rounded-t-2xl bg-white dark:bg-gray-900 p-4 md:p-8">
					<div className="animate-pulse space-y-4">
						{/* Store Title Skeleton */}
						<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mr-auto"></div>
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mr-auto"></div>
						
						{/* Departments Grid Skeleton */}
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-24 flex items-center justify-center">
									<div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

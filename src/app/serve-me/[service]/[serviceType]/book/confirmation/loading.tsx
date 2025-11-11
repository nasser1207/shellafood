export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
			{/* Stepper Skeleton */}
			<div className="bg-white border-b border-gray-200 py-4">
				<div className="max-w-2xl mx-auto px-6">
					<div className="flex items-center justify-center gap-4 animate-pulse">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="flex items-center gap-2">
								<div className="w-8 h-8 bg-gray-200 rounded-full"></div>
								<div className="hidden md:block h-4 w-20 bg-gray-200 rounded"></div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="max-w-2xl mx-auto px-6 py-12">
				{/* Success Animation Skeleton */}
				<div className="flex justify-center mb-8 animate-pulse">
					<div className="w-20 h-20 bg-gray-200 rounded-full"></div>
				</div>

				{/* Confirmation Card Skeleton */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-pulse">
					{/* Header Skeleton */}
					<div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
						<div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
						<div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
					</div>

					{/* Content Skeleton */}
					<div className="p-8 space-y-6">
						{/* Booking Details */}
						<section className="pb-6 border-b border-gray-100">
							<div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
							<div className="space-y-3">
								<div className="flex justify-between">
									<div className="h-4 bg-gray-200 rounded w-24"></div>
									<div className="h-4 bg-gray-200 rounded w-32"></div>
								</div>
								<div className="flex justify-between">
									<div className="h-4 bg-gray-200 rounded w-20"></div>
									<div className="h-4 bg-gray-200 rounded w-40"></div>
								</div>
								<div className="flex justify-between">
									<div className="h-4 bg-gray-200 rounded w-16"></div>
									<div className="h-4 bg-gray-200 rounded w-24"></div>
								</div>
							</div>
						</section>

						{/* Address */}
						<section className="pb-6 border-b border-gray-100">
							<div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
							<div className="space-y-2">
								<div className="h-5 bg-gray-200 rounded w-full"></div>
								<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							</div>
						</section>

						{/* Client Info */}
						<section className="pb-6 border-b border-gray-100">
							<div className="h-6 bg-gray-200 rounded w-36 mb-4"></div>
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 rounded w-2/3"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2"></div>
							</div>
						</section>

						{/* Worker Assignment */}
						<section>
							<div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
							<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
								<div className="w-15 h-15 bg-gray-200 rounded-full"></div>
								<div className="flex-1 space-y-2">
									<div className="h-5 bg-gray-200 rounded w-32"></div>
									<div className="h-4 bg-gray-200 rounded w-20"></div>
								</div>
							</div>
							<div className="h-12 bg-gray-200 rounded-xl"></div>
						</section>
					</div>

					{/* Footer Skeleton */}
					<div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
						<div className="h-12 bg-gray-200 rounded-xl"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

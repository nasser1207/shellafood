export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
			{/* Stepper Skeleton */}
			<div className="bg-white border-b border-gray-200 py-4">
				<div className="max-w-3xl mx-auto px-6">
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

			<div className="max-w-3xl mx-auto px-6 py-12">
				{/* Header Skeleton */}
				<div className="mb-10 pb-8 border-b border-gray-200 animate-pulse">
					<div className="h-9 bg-gray-200 rounded w-3/4 mb-3"></div>
					<div className="h-5 bg-gray-200 rounded w-full"></div>
				</div>

				{/* Summary Card Skeleton */}
				<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-6 animate-pulse">
					<div className="space-y-6">
						{/* Service Details Section */}
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

						{/* Address Section */}
						<section className="pb-6 border-b border-gray-100">
							<div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
							<div className="space-y-2">
								<div className="h-5 bg-gray-200 rounded w-full"></div>
								<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							</div>
						</section>

						{/* Attachments Section */}
						<section className="pb-6 border-b border-gray-100">
							<div className="h-6 bg-gray-200 rounded w-28 mb-4"></div>
							<div className="grid grid-cols-3 gap-3">
								{[...Array(3)].map((_, i) => (
									<div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
								))}
							</div>
						</section>

						{/* Notes Section */}
						<section>
							<div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
							<div className="h-16 bg-gray-200 rounded"></div>
						</section>
					</div>
				</div>

				{/* Buttons Skeleton */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-pulse">
					<div className="h-12 bg-gray-200 rounded-lg w-full sm:w-40"></div>
					<div className="h-12 bg-gray-200 rounded-lg w-full sm:w-40"></div>
				</div>
			</div>
		</div>
	);
}

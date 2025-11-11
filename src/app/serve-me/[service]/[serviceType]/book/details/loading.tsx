export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
			{/* Stepper Skeleton */}
			<div className="bg-white border-b border-gray-200 py-4">
				<div className="max-w-4xl mx-auto px-6">
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

			<div className="max-w-4xl mx-auto px-6 py-12">
				<div className="space-y-12 animate-pulse">
					{/* Service Type Section */}
					<section className="pb-8 border-b border-gray-200">
						<div className="h-7 bg-gray-200 rounded w-48 mb-6"></div>
						<div className="grid grid-cols-2 gap-4">
							<div className="h-16 bg-gray-200 rounded-xl"></div>
							<div className="h-16 bg-gray-200 rounded-xl"></div>
						</div>
					</section>

					{/* Date & Time Section */}
					<section className="pb-8 border-b border-gray-200">
						<div className="h-7 bg-gray-200 rounded w-40 mb-6"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="h-14 bg-gray-200 rounded-lg"></div>
							<div className="h-14 bg-gray-200 rounded-lg"></div>
						</div>
					</section>

					{/* Problem Description Section */}
					<section className="pb-8 border-b border-gray-200">
						<div className="h-7 bg-gray-200 rounded w-56 mb-6"></div>
						<div className="h-32 bg-gray-200 rounded-lg"></div>
					</section>

					{/* Media Upload Section */}
					<section className="pb-8 border-b border-gray-200">
						<div className="h-7 bg-gray-200 rounded w-40 mb-6"></div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="h-32 bg-gray-200 rounded-xl"></div>
							<div className="h-32 bg-gray-200 rounded-xl"></div>
							<div className="h-32 bg-gray-200 rounded-xl"></div>
						</div>
					</section>

					{/* Address Section */}
					<section className="pb-8 border-b border-gray-200">
						<div className="h-7 bg-gray-200 rounded w-44 mb-6"></div>
						<div className="h-24 bg-gray-200 rounded-lg"></div>
					</section>

					{/* Notes Section */}
					<section className="pb-8">
						<div className="h-7 bg-gray-200 rounded w-32 mb-6"></div>
						<div className="h-24 bg-gray-200 rounded-lg"></div>
					</section>

					{/* Button Skeleton */}
					<div className="pt-8 flex justify-center">
						<div className="h-12 bg-gray-200 rounded-lg w-48"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

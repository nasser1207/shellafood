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
				<div className="flex flex-col justify-center min-h-[80vh]">
					{/* Header Skeleton */}
					<div className="mb-10 pb-8 border-b border-gray-200 animate-pulse">
						<div className="h-9 bg-gray-200 rounded w-full mb-3"></div>
						<div className="h-5 bg-gray-200 rounded w-3/4"></div>
					</div>

					{/* Wallet Card Skeleton */}
					<div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-6 animate-pulse">
						<div className="flex items-center gap-6">
							<div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
							<div className="flex-1 space-y-3">
								<div className="h-7 bg-gray-200 rounded w-2/3"></div>
								<div className="h-4 bg-gray-200 rounded w-full"></div>
							</div>
							<div className="w-8 h-8 bg-gray-200 rounded-full"></div>
						</div>
					</div>

					{/* Info Box Skeleton */}
					<div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 animate-pulse">
						<div className="flex items-start gap-3">
							<div className="w-5 h-5 bg-gray-200 rounded mt-1"></div>
							<div className="flex-1 space-y-2">
								<div className="h-4 bg-gray-200 rounded w-full"></div>
								<div className="h-4 bg-gray-200 rounded w-5/6"></div>
							</div>
						</div>
					</div>

					{/* Button Skeleton */}
					<div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
				</div>
			</div>
		</div>
	);
}

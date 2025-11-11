export default function ChooseWorkerLoading() {
	return (
		<div className="min-h-screen bg-white">
			<div className="flex flex-col lg:flex-row h-screen">
				{/* Left Section - Workers List Skeleton */}
				<div className="flex-1 overflow-y-auto lg:max-h-full">
					<div className="p-4 lg:p-6">
						<div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
						<div className="flex flex-wrap gap-2 mb-6">
							{[...Array(4)].map((_, index) => (
								<div key={index} className="h-8 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
							))}
						</div>
						<div className="space-y-4">
							{[...Array(6)].map((_, index) => (
								<div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
									<div className="flex items-center gap-4">
										<div className="w-15 h-15 bg-gray-200 rounded-full animate-pulse"></div>
										<div className="flex-1 min-w-0">
											<div className="h-5 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
											<div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				{/* Right Section - Map Skeleton */}
				<div className="w-full hidden md:block lg:w-1/2 border-t lg:border-t-0 lg:border-l border-gray-200 h-64 lg:h-full">
					<div className="h-full bg-gray-100"></div>
				</div>
			</div>
		</div>
	);
}


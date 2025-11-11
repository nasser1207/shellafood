export default function InvestorLoading() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="mx-auto max-w-[1800px] px-2 py-4 sm:px-4 sm:py-8 lg:px-8">
				{/* Video Slider Loading */}
				<section className="mb-6 overflow-hidden sm:mb-8">
					<div className="h-64 animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700 sm:h-80 lg:h-96"></div>
				</section>

				{/* Cards Section Loading */}
				<section className="mb-6 bg-white dark:bg-gray-800 p-3 md:mb-8 md:p-12">
					<div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-8">
						{/* Card 1 */}
						<div className="w-full max-w-[550px] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 shadow-lg lg:w-1/2">
							<div className="aspect-[550/300] w-full animate-pulse bg-gray-300 dark:bg-gray-600"></div>
							<div className="p-4 sm:p-6">
								<div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
								<div className="h-4 w-full animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
								<div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
							</div>
						</div>

						{/* Card 2 */}
						<div className="w-full max-w-[550px] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 shadow-lg lg:w-1/2">
							<div className="aspect-[550/300] w-full animate-pulse bg-gray-300 dark:bg-gray-600"></div>
							<div className="p-4 sm:p-6">
								<div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
								<div className="h-4 w-full animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
								<div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
							</div>
						</div>
					</div>
				</section>

				{/* Benefits Section Loading */}
				<section className="mb-6 bg-white dark:bg-gray-800 p-3 md:mb-8 md:p-12">
					<div className="container mx-auto px-2 md:px-12">
						<div className="mb-8 h-8 w-1/2 animate-pulse rounded bg-gray-300 dark:bg-gray-700 mx-auto md:mb-12"></div>
						
						<div className="flex flex-col items-center justify-center gap-4">
							{/* Benefit Items */}
							{Array.from({ length: 5 }, (_, i) => (
								<div key={i} className="relative flex w-full flex-col items-center justify-between gap-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 sm:flex-row sm:gap-0 sm:py-4">
									<div className="w-full h-4 animate-pulse rounded bg-gray-300 dark:bg-gray-700 sm:w-5/12"></div>
									<div className="mx-4 flex flex-col items-center">
										<div className="h-14 w-14 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700 sm:h-16 sm:w-16 md:h-20 md:w-20"></div>
										<div className="h-8 w-0.5 bg-gray-300 dark:bg-gray-700 sm:h-12 lg:hidden"></div>
									</div>
									<div className="w-full h-4 animate-pulse rounded bg-gray-300 dark:bg-gray-700 sm:w-5/12"></div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Form Section Loading */}
				<section className="mb-6 rounded-xl bg-white dark:bg-gray-800 p-3 shadow-md sm:mb-8 sm:p-6 md:p-5">
					<div className="p-4 text-center sm:p-10">
						<div className="h-8 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-700 mx-auto"></div>
					</div>

					<div className="mt-6 flex justify-center p-4 sm:mt-10 sm:p-8">
						<div className="h-12 w-48 animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700"></div>
					</div>

					{/* Form Loading */}
					<div className="w-full space-y-8">
						<div className="mx-auto w-full space-y-6 text-right">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								{Array.from({ length: 14 }, (_, i) => (
									<div key={i} className="space-y-2">
										<div className="h-4 w-1/3 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
										<div className="h-10 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700"></div>
									</div>
								))}
							</div>

							{/* Agreement */}
							<div className="mt-8 flex items-center justify-start space-x-2 space-x-reverse">
								<div className="h-4 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
								<div className="h-5 w-5 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
							</div>

							{/* Submit Button */}
							<div className="mt-8 flex justify-end">
								<div className="h-12 w-48 animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700"></div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

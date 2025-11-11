/**
 * Register Loading Component
 * Responsive skeleton loading for registration page
 */
export default function RegisterLoading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12" dir="rtl">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Skeleton */}
				<div className="text-center mb-8 animate-pulse">
					<div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-3"></div>
					<div className="h-4 w-96 bg-gray-200 rounded mx-auto"></div>
				</div>

				{/* Form Skeleton */}
				<div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-8 animate-pulse">
					{/* Personal Information Section */}
					<div className="space-y-4">
						<div className="h-8 w-48 bg-gray-200 rounded"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[1, 2, 3].map((i) => (
								<div key={i} className="space-y-2">
									<div className="h-4 w-24 bg-gray-200 rounded"></div>
									<div className="h-12 w-full bg-gray-200 rounded"></div>
								</div>
							))}
						</div>
					</div>

					{/* Account Information Section */}
					<div className="space-y-4">
						<div className="h-8 w-48 bg-gray-200 rounded"></div>
						<div className="space-y-6">
							{/* Email */}
							<div className="space-y-2">
								<div className="h-4 w-24 bg-gray-200 rounded"></div>
								<div className="h-12 w-full bg-gray-200 rounded"></div>
							</div>
							{/* Password Fields */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{[1, 2].map((i) => (
									<div key={i} className="space-y-2">
										<div className="h-4 w-24 bg-gray-200 rounded"></div>
										<div className="h-12 w-full bg-gray-200 rounded"></div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Submit Button */}
					<div className="pt-6">
						<div className="h-14 w-full bg-gray-200 rounded-lg"></div>
						<div className="h-4 w-64 bg-gray-200 rounded mx-auto mt-4"></div>
					</div>
				</div>
			</div>
		</div>
	);
}


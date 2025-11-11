/**
 * Login Loading Component
 * Responsive skeleton loading for login page
 */
export default function LoginLoading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8 sm:py-12">
			<div className="w-full max-w-[90%] sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
				{/* Header Skeleton */}
				<div className="text-center mb-6 sm:mb-8 animate-pulse">
					<div className="h-8 w-48 sm:h-10 md:w-64 bg-gray-200 rounded mx-auto mb-3"></div>
					<div className="h-4 w-56 sm:w-72 bg-gray-200 rounded mx-auto"></div>
				</div>

				{/* Form Skeleton */}
				<div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6 animate-pulse">
					{/* Email Field */}
					<div className="space-y-2">
						<div className="h-4 w-24 bg-gray-200 rounded"></div>
						<div className="h-12 w-full bg-gray-200 rounded"></div>
					</div>

					{/* Password Field */}
					<div className="space-y-2">
						<div className="h-4 w-24 bg-gray-200 rounded"></div>
						<div className="h-12 w-full bg-gray-200 rounded"></div>
					</div>

					{/* Submit Button */}
					<div className="pt-2 sm:pt-4">
						<div className="h-14 w-full bg-gray-200 rounded-lg"></div>
						<div className="h-4 w-48 bg-gray-200 rounded mx-auto mt-4"></div>
					</div>
				</div>
			</div>
		</div>
	);
}


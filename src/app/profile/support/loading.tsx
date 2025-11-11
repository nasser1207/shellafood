
/**
 * Support Loading Component
 * Responsive skeleton loading for support page matching policy style
 */
export default function SupportLoading() {
return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" >
			<div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				{/* Header Skeleton */}
				<div className="mb-6 sm:mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-xl animate-pulse"></div>
							<div className="flex-1">
								<div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 animate-pulse"></div>
								<div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Content Sections Skeleton */}
				<div className="space-y-6">
					{/* Introduction Section */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className="space-y-3">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
						</div>
					</div>

					{/* Contact Methods Section */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg animate-pulse"></div>
							<div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
						</div>
						<div className="space-y-3 mb-4">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
						</div>
						<div className="space-y-3">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="flex items-start gap-3">
									<div className="h-2 w-2 bg-green-500 dark:bg-green-600 rounded-full mt-2 animate-pulse"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
								</div>
							))}
						</div>
					</div>

					{/* Response Time Section */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg animate-pulse"></div>
							<div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
						</div>
						<div className="space-y-3 mb-4">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
						</div>
						<div className="space-y-3">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="flex items-start gap-3">
									<div className="h-2 w-2 bg-green-500 dark:bg-green-600 rounded-full mt-2 animate-pulse"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
								</div>
							))}
						</div>
					</div>

					{/* Common Issues Section */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg animate-pulse"></div>
							<div className="h-6 w-56 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
						</div>
						<div className="space-y-3 mb-4">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
						</div>
						<div className="space-y-3">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="flex items-start gap-3">
									<div className="h-2 w-2 bg-green-500 dark:bg-green-600 rounded-full mt-2 animate-pulse"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
								</div>
							))}
						</div>
					</div>

					{/* Technical Support Section */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg animate-pulse"></div>
							<div className="h-6 w-52 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
						</div>
						<div className="space-y-3 mb-4">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
						</div>
						<div className="space-y-3">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="flex items-start gap-3">
									<div className="h-2 w-2 bg-green-500 dark:bg-green-600 rounded-full mt-2 animate-pulse"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
								</div>
							))}
						</div>
					</div>

					{/* Contact Information Section */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg animate-pulse"></div>
							<div className="h-6 w-52 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
						</div>
						<div className="space-y-3 mb-4">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
						</div>
						<div className="space-y-3">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg animate-pulse"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-48 animate-pulse"></div>
								</div>
							))}
						</div>
					</div>

					{/* Important Notice Section */}
					<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 sm:p-6">
						<div className="flex items-start gap-3">
							<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg animate-pulse"></div>
							<div className="flex-1 space-y-2">
								<div className="h-4 bg-green-200 dark:bg-green-800 rounded w-3/4 animate-pulse"></div>
								<div className="h-4 bg-green-200 dark:bg-green-800 rounded w-full animate-pulse"></div>
								<div className="h-4 bg-green-200 dark:bg-green-800 rounded w-5/6 animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Loading Indicator */}
				<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
					<div className="flex items-center gap-3">
						<div className="w-5 h-5 border-2 border-green-500 dark:border-green-600 border-t-transparent rounded-full animate-spin"></div>
						<span className="text-sm text-gray-600 dark:text-gray-300 font-medium">جاري تحميل المساعدة والدعم...</span>
					</div>
				</div>
			</div>
		</div>
	);
}

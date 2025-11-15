import { Loader2, CheckCircle } from "lucide-react";

/**
 * Loading Component for Order Confirmation Page
 * Professional loading state with green accent color matching the app theme
 */
export default function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-gray-800/50 to-white dark:to-gray-900">
			<div className="text-center max-w-md px-4">
				{/* Animated Check Circle Icon */}
				<div className="mb-6 flex justify-center">
					<div className="relative">
						<div className="rounded-full p-4 bg-green-100 dark:bg-green-900/20">
							<CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
						</div>
						<div className="absolute inset-0 rounded-full bg-green-200 dark:bg-green-800 animate-ping opacity-20"></div>
					</div>
				</div>

				{/* Loading Spinner */}
				<Loader2 
					className="h-8 w-8 animate-spin mx-auto mb-4 text-green-500 dark:text-green-400" 
				/>

				{/* Loading Text */}
				<p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">
					جاري معالجة الطلب...
				</p>
				<p className="text-gray-500 dark:text-gray-500 text-sm">
					Processing your order...
				</p>

				{/* Loading Skeleton Preview */}
				<div className="mt-8 space-y-4 animate-pulse">
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
					<div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
					<div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
				</div>
			</div>
		</div>
	);
}


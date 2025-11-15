import { Loader2 } from "lucide-react";

/**
 * Loading Component for PickAndOrder Page
 * Professional loading state with green accent color matching the app theme
 */
export default function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="text-center">
				<Loader2 
					className="h-12 w-12 animate-spin mx-auto mb-4 text-green-500" 
				/>
				<p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
					جاري التحميل...
				</p>
			</div>
		</div>
	);
}


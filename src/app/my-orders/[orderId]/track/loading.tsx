/**
 * Track Order Loading Component
 * Responsive skeleton loading for order tracking page
 */
export default function LoadingTrackOrder() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-neutral-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
			<div className="text-center">
				<div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-gray-300 dark:border-gray-600 mx-auto mb-4"></div>
				<p className="text-gray-700 dark:text-gray-300 text-lg">
					جاري تحميل تفاصيل الطلب...
				</p>
			</div>
		</div>
	);
}


export default function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
			<div className="text-center">
				<div className="w-16 h-16 border-4 border-[#31A342] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
					جاري تحميل...
				</p>
			</div>
		</div>
	);
}


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	useEffect(() => {
		console.error("Driver profile error:", error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
			<div className="text-center max-w-md">
				<div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg
						className="w-10 h-10 text-red-600 dark:text-red-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</div>
				<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					حدث خطأ
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-8">
					عذراً، حدث خطأ أثناء تحميل ملف السائق.
				</p>
				<div className="flex gap-4 justify-center">
					<button
						onClick={() => reset()}
						className="px-6 py-3 bg-[#31A342] hover:bg-[#2a8f38] text-white font-semibold rounded-lg transition-colors"
					>
						حاول مرة أخرى
					</button>
					<button
						onClick={() => router.back()}
						className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors"
					>
						رجوع
					</button>
				</div>
			</div>
		</div>
	);
}


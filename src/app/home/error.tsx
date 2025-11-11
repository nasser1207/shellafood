// app/home/error.tsx
"use client";

import { RefreshCw, Home } from "lucide-react";

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function HomeError({ error, reset }: ErrorProps) {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
				{/* Error Icon */}
				<div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
					<Home className="w-8 h-8 text-red-600" />
				</div>

				{/* Error Message */}
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					عذراً! حدث خطأ ما
				</h1>
				<p className="text-gray-600 mb-6">
					واجهنا مشكلة في تحميل الصفحة الرئيسية. قد يكون هذا بسبب مشكلة في الشبكة أو مشكلة مؤقتة في الخادم.
				</p>

				{/* Error Details (Development only) */}
				{process.env.NODE_ENV === "development" && (
					<div className="bg-red-50 border border-red-200 rounded p-3 mb-6 text-left">
						<p className="text-xs text-red-800 font-mono break-all">
							{error.message}
						</p>
						{error.digest && (
							<p className="text-xs text-gray-500 mt-2">Error ID: {error.digest}</p>
						)}
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3">
					<button
						onClick={reset}
						className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
					>
						<RefreshCw className="w-4 h-4" />
						حاول مرة أخرى
					</button>

					<a
						href="/"
						className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
					>
						<Home className="w-4 h-4" />
						الرئيسية
					</a>
				</div>

				{/* Support Link */}
				<p className="text-sm text-gray-500 mt-6">
					تحتاج مساعدة؟{" "}
					<a href="/profile/support" className="text-green-600 hover:underline">
						اتصل بالدعم
					</a>
				</p>
			</div>
		</div>
	);
}


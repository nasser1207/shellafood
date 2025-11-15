"use client";

import { useEffect } from "react";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Error Component for Order Payment Page
 * Professional error state with green accent color and retry functionality
 */
export default function OrderPaymentError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	useEffect(() => {
		// Log error to error reporting service
		console.error("Order Payment page error:", error);
	}, [error]);

	return (
		<div 
			dir={isArabic ? "rtl" : "ltr"}
			className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-gray-800/50 to-white dark:to-gray-900 px-4"
		>
			<div className={`text-center max-w-md ${isArabic ? "text-right" : "text-left"}`}>
				{/* Error Icon */}
				<div className="mb-6 flex justify-center">
					<div className="relative">
						<div className="rounded-full p-4 bg-red-100 dark:bg-red-900/20">
							<AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
						</div>
						<div className="absolute inset-0 rounded-full bg-red-200 dark:bg-red-800 animate-ping opacity-20"></div>
					</div>
				</div>

				{/* Error Title */}
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
					{isArabic ? "حدث خطأ ما" : "Something Went Wrong"}
				</h1>

				{/* Error Message */}
				<p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
					{isArabic
						? "عذراً، حدث خطأ أثناء تحميل صفحة الدفع. يرجى المحاولة مرة أخرى."
						: "Sorry, an error occurred while loading the payment page. Please try again."}
				</p>

				{/* Error Details (Development only) */}
				{process.env.NODE_ENV === "development" && (
					<div className={`mb-6 rounded-lg p-4 bg-red-50 dark:bg-red-900/10 ${isArabic ? "text-right" : "text-left"}`}>
						<p className="text-sm font-mono text-red-800 dark:text-red-300">
							{error.message}
						</p>
						{error.digest && (
							<p className="mt-2 text-xs text-red-600 dark:text-red-400">
								{isArabic ? "معرف الخطأ:" : "Error ID:"} {error.digest}
							</p>
						)}
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						onClick={reset}
						className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/50 ${
							isArabic ? "flex-row-reverse" : ""
						}`}
					>
						<RefreshCw className="h-5 w-5" />
						<span>{isArabic ? "حاول مرة أخرى" : "Try Again"}</span>
					</button>
					<Link
						href="/pickandorder"
						className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl border-2 border-green-500 text-green-600 dark:text-green-400 bg-transparent hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/50 ${
							isArabic ? "flex-row-reverse" : ""
						}`}
					>
						<ArrowLeft className={`h-5 w-5 ${isArabic ? "rotate-180" : ""}`} />
						<span>
							{isArabic ? "العودة إلى الطلبات" : "Back to Orders"}
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
}


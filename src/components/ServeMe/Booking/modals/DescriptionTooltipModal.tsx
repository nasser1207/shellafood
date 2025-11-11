"use client";

import React from "react";
import { X } from "lucide-react";

interface DescriptionTooltipModalProps {
	isOpen: boolean;
	onClose: () => void;
	isArabic: boolean;
}

/**
 * Description Tooltip Modal Component
 * Displays helpful tips for describing the problem
 */
export default function DescriptionTooltipModal({
	isOpen,
	onClose,
	isArabic,
}: DescriptionTooltipModalProps) {
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4 sm:p-6"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="description-tooltip-title"
		>
			<div
				className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ${
					isArabic ? "text-right" : "text-left"
				}`}
				dir={isArabic ? "rtl" : "ltr"}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-100 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 touch-manipulation"
					aria-label={isArabic ? "إغلاق" : "Close"}
				>
					<X className="w-4 h-4 sm:w-5 sm:h-5" />
				</button>

				{/* Modal Content */}
				<div className="p-5 sm:p-6 lg:p-8">
					<h3
						id="description-tooltip-title"
						className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 pr-6 sm:pr-8"
					>
						{isArabic ? "نصيحة" : "Tip"}
					</h3>

					<div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
						<p className="text-sm sm:text-base">
							{isArabic
								? "يرجى وصف المشكلة بالتفصيل. كلما كانت المعلومات أكثر تفصيلاً، كلما ساعد ذلك الفني على فهم المشكلة بشكل أفضل."
								: "Please describe the problem in detail. The more information you provide, the better our technician can understand the issue."}
						</p>
					</div>

					{/* Action Button */}
					<div className="mt-6 sm:mt-8 flex justify-end">
						<button
							type="button"
							onClick={onClose}
							className="w-full sm:w-auto px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 transition-colors text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 touch-manipulation"
						>
							{isArabic ? "فهمت" : "Got it"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}


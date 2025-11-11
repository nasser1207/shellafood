"use client";

import React from "react";
import { X } from "lucide-react";

interface AttachmentGuidelinesModalProps {
	isOpen: boolean;
	onClose: () => void;
	isArabic: boolean;
}

/**
 * Attachment Guidelines Modal Component
 * Displays guidelines for uploading attachments (images, videos)
 */
export default function AttachmentGuidelinesModal({
	isOpen,
	onClose,
	isArabic,
}: AttachmentGuidelinesModalProps) {
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4 sm:p-6"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="guidelines-modal-title"
		>
			<div
				className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ${
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
						id="guidelines-modal-title"
						className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 pr-6 sm:pr-8"
					>
						{isArabic ? "إرشادات المرفقات" : "Attachment Guidelines"}
					</h3>

					<div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
						{isArabic ? (
							<>
								<p className="text-sm sm:text-base mb-3 sm:mb-4">
									لتسريع الخدمة والتأكد من تجهيز الفني، يرجى إرفاق:
								</p>
								<ul className="space-y-2 sm:space-y-3 list-disc list-inside text-sm sm:text-base">
									<li>
										<strong>صورتان رئيسيتان:</strong> واحدة قريبة (تركز على التفاصيل الدقيقة للمشكلة) والأخرى بعيدة (لتوضيح السياق العام والموقع المحيط).
									</li>
									<li>
										<strong>مقطع فيديو قصير (30 ثانية كحد أقصى):</strong> يصف المشكلة صوتيًا وبصريًا، وهو مفيد جداً في حالة الأعطال التي تتضمن صوتاً أو حركة.
									</li>
								</ul>
							</>
						) : (
							<>
								<p className="text-sm sm:text-base mb-3 sm:mb-4">
									To speed up service and help the technician prepare, please attach:
								</p>
								<ul className="space-y-2 sm:space-y-3 list-disc list-inside text-sm sm:text-base">
									<li>
										<strong>Two main photos:</strong> one close-up (for detailed view) and one wide shot (to show the surrounding context).
									</li>
									<li>
										<strong>A short video (maximum 30 seconds):</strong> describing the issue both visually and verbally — very helpful for sound or motion issues.
									</li>
								</ul>
							</>
						)}
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


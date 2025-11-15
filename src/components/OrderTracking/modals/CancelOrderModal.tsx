"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, AlertTriangle } from "lucide-react";
import { OrderData, ORDER_TYPE } from "../types";
import { getCancelButtonLabel } from "../utils/routeHelpers";

interface CancelOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	orderData: OrderData | null;
	currentStepIndex: number;
	language: "en" | "ar";
	isLoading?: boolean;
}

export default React.memo(function CancelOrderModal({
	isOpen,
	onClose,
	onConfirm,
	orderData,
	currentStepIndex,
	language,
	isLoading = false,
}: CancelOrderModalProps) {
	const isArabic = language === "ar";

	if (!isOpen || !orderData) return null;

	const isService = orderData.type === ORDER_TYPE.SERVICE;
	const modalTitle = getCancelButtonLabel(orderData.type, language);

	const showFeeWarning =
		orderData &&
		(orderData.status === "assigned" ||
			orderData.status === "on_the_way" ||
			orderData.status === "in_progress" ||
			(orderData.driver_or_worker && currentStepIndex > 0));

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 ${isArabic ? "rtl" : "ltr"}`}
						dir={isArabic ? "rtl" : "ltr"}
					>
						{/* Header */}
						<div className={`flex items-center justify-between mb-4 ${isArabic ? "flex-row-reverse" : ""}`}>
							<div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
								<div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
									<AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
								</div>
								<h3 className={`text-xl font-bold text-gray-900 dark:text-white ${isArabic ? "text-right" : "text-left"}`}>
									{modalTitle}
								</h3>
							</div>
							<button
								onClick={onClose}
								className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
							>
								<X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</button>
						</div>

						{/* Content */}
						<p className={`text-gray-600 dark:text-gray-400 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic
								? isService
									? "هل أنت متأكد من إلغاء هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء."
									: "هل أنت متأكد من إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
								: isService
									? "Are you sure you want to cancel this booking? This action cannot be undone."
									: "Are you sure you want to cancel this order? This action cannot be undone."}
						</p>

						{/* Fee Warning Message */}
						{showFeeWarning && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6"
							>
								<div className={`flex items-start gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
									<div className="flex-shrink-0 mt-0.5">
										<Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
									</div>
									<p className={`text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed ${isArabic ? "text-right" : "text-left"}`}>
										{isArabic
											? isService
												? "سيتم خصم رسوم صغيرة لصالح الفني (رسوم المعاينة) في حالة حدوث الإلغاء بعد إرسال الفني، وذلك لحماية الفنيين من إهدار الوقت والجهد."
												: "سيتم خصم رسوم صغيرة في حالة حدوث الإلغاء بعد بدء التحضير، وذلك لحماية المتجر من إهدار الوقت والجهد."
											: isService
												? "A small fee will be deducted in favor of the technician (inspection fee) if the cancellation occurs after the technician has been dispatched, to protect technicians from wasted time and effort."
												: "A small fee may be deducted if the cancellation occurs after preparation has started, to protect the store from wasted time and effort."}
									</p>
								</div>
							</motion.div>
						)}

						{/* Actions */}
						<div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
							<button
								onClick={onClose}
								disabled={isLoading}
								className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isArabic ? "إلغاء" : "Cancel"}
							</button>
							<button
								onClick={onConfirm}
								disabled={isLoading}
								className="flex-1 px-4 py-2.5 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{isLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										<span>{isArabic ? "جاري الإلغاء..." : "Cancelling..."}</span>
									</>
								) : (
									<span>{isArabic ? "نعم، إلغاء" : "Yes, Cancel"}</span>
								)}
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});


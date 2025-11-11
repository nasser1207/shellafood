"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

interface ConfirmCheckoutModalProps {
	isOpen: boolean;
	language: "en" | "ar";
	isProcessing: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	orderSummary: {
		subtotal: number;
		deliveryFee: number;
		discount: number;
		total: number;
		itemsCount: number;
	};
}

export default function ConfirmCheckoutModal({
	isOpen,
	language,
	isProcessing,
	onConfirm,
	onCancel,
	orderSummary,
}: ConfirmCheckoutModalProps) {
	const isArabic = language === "ar";
	const [processingStep, setProcessingStep] = useState<"validating" | "processing" | "success">("validating");

	useEffect(() => {
		if (isProcessing) {
			// Simulate processing steps
			setProcessingStep("validating");
			setTimeout(() => setProcessingStep("processing"), 800);
		} else {
			setProcessingStep("validating");
		}
	}, [isProcessing]);

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
						onClick={!isProcessing ? onCancel : undefined}
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
							className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden border border-gray-200 dark:border-gray-700 ${isArabic ? "rtl" : "ltr"}`}
							dir={isArabic ? "rtl" : "ltr"}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className={`p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 ${isArabic ? "text-right" : "text-left"}`}>
								{!isProcessing && (
									<motion.button
										whileHover={{ scale: 1.1, rotate: 90 }}
										whileTap={{ scale: 0.9 }}
										onClick={onCancel}
										className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 shadow-sm`}
									>
										<X className="w-5 h-5" />
									</motion.button>
								)}
								<div className="flex items-center gap-3">
									{isProcessing ? (
										<motion.div
											animate={{ rotate: 360 }}
											transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
										>
											<Loader2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
										</motion.div>
									) : (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ type: "spring", duration: 0.5 }}
											className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
										>
											<CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
										</motion.div>
									)}
									<h2 className={`text-xl font-bold text-gray-900 dark:text-gray-100`}>
										{isProcessing
											? isArabic
												? "معالجة الطلب..."
												: "Processing Order..."
											: isArabic
												? "تأكيد الطلب"
												: "Confirm Checkout"}
									</h2>
								</div>
							</div>

							{/* Content */}
							<div className="p-6">
								{isProcessing ? (
									<div className="flex flex-col items-center justify-center py-8">
										{/* Processing Steps */}
										<div className="w-full space-y-4 mb-6">
											{/* Step 1: Validating */}
											<div className="flex items-center gap-3">
												<motion.div
													animate={processingStep === "validating" ? { scale: [1, 1.2, 1] } : {}}
													transition={{ duration: 1, repeat: processingStep === "validating" ? Infinity : 0 }}
													className={`w-8 h-8 rounded-full flex items-center justify-center ${
														processingStep === "validating"
															? "bg-emerald-100 dark:bg-emerald-900/30"
															: "bg-gray-100 dark:bg-gray-700"
													}`}
												>
													{processingStep === "validating" ? (
														<Loader2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
													) : (
														<CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
													)}
												</motion.div>
												<span className={`text-sm font-medium ${isArabic ? "text-right" : "text-left"}`}>
													{isArabic ? "التحقق من البيانات..." : "Validating information..."}
												</span>
											</div>

											{/* Step 2: Processing */}
											<div className="flex items-center gap-3">
												<motion.div
													animate={processingStep === "processing" ? { scale: [1, 1.2, 1] } : {}}
													transition={{ duration: 1, repeat: processingStep === "processing" ? Infinity : 0 }}
													className={`w-8 h-8 rounded-full flex items-center justify-center ${
														processingStep === "processing"
															? "bg-emerald-100 dark:bg-emerald-900/30"
															: processingStep === "validating"
															? "bg-gray-100 dark:bg-gray-700"
															: "bg-emerald-100 dark:bg-emerald-900/30"
													}`}
												>
													{processingStep === "processing" ? (
														<Loader2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
													) : processingStep === "validating" ? (
														<div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600" />
													) : (
														<CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
													)}
												</motion.div>
												<span className={`text-sm font-medium ${isArabic ? "text-right" : "text-left"}`}>
													{isArabic ? "معالجة الطلب..." : "Processing your order..."}
												</span>
											</div>
										</div>

										{/* Loading Animation */}
										<motion.div
											animate={{ rotate: 360 }}
											transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
											className="w-16 h-16 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full mb-4"
										/>
										<p className="text-gray-600 dark:text-gray-400 font-medium">
											{isArabic ? "جاري معالجة طلبك..." : "Processing your order..."}
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
											{isArabic ? "يرجى الانتظار" : "Please wait"}
										</p>
									</div>
								) : (
									<>
										{/* Summary */}
										<div className="space-y-3 mb-6">
											<div className={`flex items-center justify-between`}>
												<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "عدد العناصر:" : "Items:"}</span>
												<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{orderSummary.itemsCount}</span>
											</div>
											<div className={`flex items-center justify-between`}>
												<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "المجموع الفرعي:" : "Subtotal:"}</span>
												<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
													{orderSummary.subtotal.toFixed(2)} {isArabic ? "ريال" : "SAR"}
												</span>
											</div>
											{orderSummary.deliveryFee > 0 && (
												<div className={`flex items-center justify-between`}>
													<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "رسوم التوصيل:" : "Delivery:"}</span>
													<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
														{orderSummary.deliveryFee.toFixed(2)} {isArabic ? "ريال" : "SAR"}
													</span>
												</div>
											)}
											{orderSummary.discount > 0 && (
												<div className={`flex items-center justify-between text-emerald-600 dark:text-emerald-400`}>
													<span className="text-sm font-medium flex items-center gap-1.5">
														<Sparkles className="w-3 h-3" />
														{isArabic ? "الخصم:" : "Discount:"}
													</span>
													<span className="text-sm font-semibold">
														-{orderSummary.discount.toFixed(2)} {isArabic ? "ريال" : "SAR"}
													</span>
												</div>
											)}
											<div className="border-t-2 border-gray-200 dark:border-gray-700 my-3" />
											<div className={`flex items-center justify-between`}>
												<span className="text-lg font-bold text-gray-900 dark:text-gray-100">{isArabic ? "الإجمالي:" : "Total:"}</span>
												<motion.span
													key={orderSummary.total}
													initial={{ scale: 1.2 }}
													animate={{ scale: 1 }}
													className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400"
												>
													{orderSummary.total.toFixed(2)} {isArabic ? "ريال" : "SAR"}
												</motion.span>
											</div>
										</div>

										{/* Actions */}
										<div className={`flex gap-3`}>
											<motion.button
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												onClick={onCancel}
												className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
											>
												{isArabic ? "إلغاء" : "Cancel"}
											</motion.button>
											<motion.button
												whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" }}
												whileTap={{ scale: 0.98 }}
												onClick={onConfirm}
												className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
											>
												<CheckCircle className="w-5 h-5" />
												<span>{isArabic ? "تأكيد الطلب" : "Confirm Order"}</span>
											</motion.button>
										</div>
									</>
								)}
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}

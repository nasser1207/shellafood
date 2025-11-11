"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, X, Star, Download, RotateCcw, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { RatingModal } from "@/components/ServeMe/Booking/modals";

interface BottomActionsProps {
	language: "en" | "ar";
	status: string;
	type: "product" | "service";
	orderId: string;
	canCancel?: boolean;
	onCancel?: () => void;
	onSupport?: () => void;
	onChat?: () => void;
}

export default function BottomActions({
	language,
	status,
	type,
	orderId,
	canCancel = true,
	onCancel,
	onSupport,
	onChat,
}: BottomActionsProps) {
	const isArabic = language === "ar";
	const router = useRouter();
	const [showRating, setShowRating] = useState(false);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);

	const isCompleted = status === "completed" || status === "delivered";
	const isActive = !isCompleted && status !== "cancelled" && status !== "failed";

	const handleRatingSubmit = async (rating: number, feedback: string) => {
		console.log("Rating submitted:", { orderId, rating, feedback });
		// TODO: Submit rating to API
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setShowRating(false);
	};

	const handleCancel = () => {
		if (window.confirm(isArabic ? "هل أنت متأكد من إلغاء هذا الطلب؟" : "Are you sure you want to cancel this order?")) {
			onCancel?.();
			setShowCancelConfirm(false);
		}
	};

	return (
		<>
			{/* Sticky Bottom Bar (Mobile) */}
			<div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1B1D22] border-t border-gray-200 dark:border-gray-800 shadow-lg z-40 p-4">
				<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
					{isActive && (
						<>
							{onChat && (
								<button
									onClick={onChat}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									<MessageCircle className="w-4 h-4" />
									<span>{isArabic ? "محادثة" : "Chat"}</span>
								</button>
							)}
							{onSupport && (
								<button
									onClick={onSupport}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm transition-colors"
								>
									<HelpCircle className="w-4 h-4" />
									<span>{isArabic ? "الدعم" : "Support"}</span>
								</button>
							)}
							{canCancel && (
								<button
									onClick={() => setShowCancelConfirm(true)}
									className="flex items-center justify-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-semibold text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
								>
									<X className="w-4 h-4" />
									<span className="hidden sm:inline">{isArabic ? "إلغاء" : "Cancel"}</span>
								</button>
							)}
						</>
					)}
					{isCompleted && (
						<>
							<button
								onClick={() => setShowRating(true)}
								className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm transition-colors"
							>
								<Star className="w-4 h-4" />
								<span>{isArabic ? "قيم التجربة" : "Rate Experience"}</span>
							</button>
							{type === "product" && (
								<button
									onClick={() => router.push("/")}
									className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
								>
									<RotateCcw className="w-4 h-4" />
									<span>{isArabic ? "إعادة طلب" : "Reorder"}</span>
								</button>
							)}
						</>
					)}
				</div>
			</div>

			{/* Desktop Actions */}
			<div className="hidden sm:block bg-white dark:bg-[#1B1D22] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
				<h3 className={`text-lg font-bold text-gray-900 dark:text-white mb-4 ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic ? "الإجراءات" : "Actions"}
				</h3>
				<div className={`flex flex-col sm:flex-row gap-3 ${isArabic ? "sm:flex-row-reverse" : ""}`}>
					{isActive && (
						<>
							{onSupport && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={onSupport}
									className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-semibold transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
								>
									<HelpCircle className="w-5 h-5" />
									<span>{isArabic ? "اتصل بالدعم" : "Contact Support"}</span>
								</motion.button>
							)}
							{onChat && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={onChat}
									className={`flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
								>
									<MessageCircle className="w-5 h-5" />
									<span>{isArabic ? "محادثة" : "Chat"}</span>
								</motion.button>
							)}
							{canCancel && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setShowCancelConfirm(true)}
									className={`flex items-center justify-center gap-2 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
								>
									<X className="w-5 h-5" />
									<span>{isArabic ? "إلغاء الطلب" : "Cancel Order"}</span>
								</motion.button>
							)}
						</>
					)}
					{isCompleted && (
						<>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setShowRating(true)}
								className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-semibold transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
							>
								<Star className="w-5 h-5" />
								<span>{isArabic ? "قيم التجربة" : "Rate Experience"}</span>
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => {
									// TODO: Implement invoice download
									console.log("Download invoice for:", orderId);
								}}
								className={`flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
							>
								<Download className="w-5 h-5" />
								<span>{isArabic ? "تحميل الفاتورة" : "Download Invoice"}</span>
							</motion.button>
							{type === "product" && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => router.push("/")}
									className={`flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
								>
									<RotateCcw className="w-5 h-5" />
									<span>{isArabic ? "إعادة الطلب" : "Order Again"}</span>
								</motion.button>
							)}
						</>
					)}
				</div>
			</div>

			{/* Cancel Confirmation Modal */}
			{showCancelConfirm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className={`bg-white dark:bg-[#1B1D22] rounded-xl shadow-2xl max-w-md w-full p-6 ${isArabic ? "rtl" : "ltr"}`}
						dir={isArabic ? "rtl" : "ltr"}
					>
						<h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? "إلغاء الطلب" : "Cancel Order"}
						</h3>
						<p className={`text-gray-600 dark:text-gray-400 mb-6 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic
								? "هل أنت متأكد من إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
								: "Are you sure you want to cancel this order? This action cannot be undone."}
						</p>
						<div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
							<button
								onClick={handleCancel}
								className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
							>
								{isArabic ? "نعم، إلغاء" : "Yes, Cancel"}
							</button>
							<button
								onClick={() => setShowCancelConfirm(false)}
								className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
							>
								{isArabic ? "إلغاء" : "No"}
							</button>
						</div>
					</motion.div>
				</div>
			)}

			{/* Rating Modal */}
			{showRating && (
				<RatingModal
					isOpen={showRating}
					onClose={() => setShowRating(false)}
					onSubmit={handleRatingSubmit}
					language={language}
					serviceName={type === "service" ? "Service" : "Order"}
				/>
			)}
		</>
	);
}


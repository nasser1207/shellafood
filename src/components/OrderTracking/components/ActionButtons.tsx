"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	Phone,
	MessageCircle,
	X,
	Star,
	Download,
	RotateCcw,
	HelpCircle,
	Loader2,
} from "lucide-react";

interface ActionButtonsProps {
	language: "en" | "ar";
	status: string;
	type: "product" | "service";
	isActive: boolean;
	isCompleted: boolean;
	supportPhone?: string;
	onSupport?: () => void;
	onCancel?: () => void;
	onRate?: () => void;
	onDownloadInvoice?: () => void;
	onReorder?: () => void;
	onChat?: () => void;
	isDownloadingInvoice?: boolean;
	hasChatAvailable?: boolean; // Only show chat if worker info is available
}

export default React.memo(function ActionButtons({
	language,
	status,
	type,
	isActive,
	isCompleted,
	supportPhone,
	onSupport,
	onCancel,
	onRate,
	onDownloadInvoice,
	onReorder,
	onChat,
	isDownloadingInvoice = false,
	hasChatAvailable = false,
}: ActionButtonsProps) {
	const isArabic = language === "ar";
	
	// Only show chat for service orders where chat is available
	const shouldShowChat = type === "service" && hasChatAvailable && onChat;

	return (
		<>
			{/* Desktop Actions */}
			<div className="hidden sm:block bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
				<h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic ? "الإجراءات" : "Actions"}
				</h3>
				<div className={`flex flex-col gap-3 ${isArabic ? "" : ""}`}>
					{isActive && (
						<>
							{supportPhone && onSupport && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={onSupport}
									className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg font-semibold transition-colors shadow-md ${isArabic ? "flex-row-reverse" : ""}`}
								>
									<HelpCircle className="w-5 h-5" />
									<span>{isArabic ? "واتساب الدعم" : "WhatsApp Support"}</span>
								</motion.button>
							)}
							{shouldShowChat && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={onChat}
									className={`flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
								>
									<MessageCircle className="w-5 h-5" />
									<span>{isArabic ? "محادثة" : "Chat"}</span>
								</motion.button>
							)}
							{onCancel && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={onCancel}
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
							{onRate && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={onRate}
									className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg font-semibold transition-colors shadow-md ${isArabic ? "flex-row-reverse" : ""}`}
								>
									<Star className="w-5 h-5" />
									<span>{isArabic ? "قيم التجربة" : "Rate Experience"}</span>
								</motion.button>
							)}
							{onDownloadInvoice && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={onDownloadInvoice}
									disabled={isDownloadingInvoice}
									className={`flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isArabic ? "flex-row-reverse" : ""}`}
								>
									{isDownloadingInvoice ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<Download className="w-5 h-5" />
									)}
									<span>
										{isDownloadingInvoice
											? isArabic
												? "جاري التحميل..."
												: "Downloading..."
											: isArabic
												? "تحميل الفاتورة"
												: "Download Invoice"}
									</span>
								</motion.button>
							)}
							{type === "product" && onReorder && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={onReorder}
									className={`flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
								>
									<RotateCcw className="w-5 h-5" />
									<span>{isArabic ? "إعادة الطلب" : "Order Again"}</span>
								</motion.button>
							)}
						</>
					)}
				</div>
			</div>

			{/* Mobile Actions - Sticky Bottom */}
			<div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40 p-4">
				<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
					{isActive && (
						<>
							{supportPhone && onSupport && (
								<button
									onClick={onSupport}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors shadow-md"
								>
									<HelpCircle className="w-4 h-4" />
									<span>{isArabic ? "واتساب" : "WhatsApp"}</span>
								</button>
							)}
							{shouldShowChat && (
								<button
									onClick={onChat}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									<MessageCircle className="w-4 h-4" />
									<span>{isArabic ? "محادثة" : "Chat"}</span>
								</button>
							)}
							{onCancel && (
								<button
									onClick={onCancel}
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
							{onRate && (
								<button
									onClick={onRate}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors shadow-md"
								>
									<Star className="w-4 h-4" />
									<span>{isArabic ? "قيم" : "Rate"}</span>
								</button>
							)}
							{type === "product" && onReorder && (
								<button
									onClick={onReorder}
									className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
								>
									<RotateCcw className="w-4 h-4" />
									<span>{isArabic ? "إعادة طلب" : "Reorder"}</span>
								</button>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
});


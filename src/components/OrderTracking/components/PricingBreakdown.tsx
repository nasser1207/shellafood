"use client";

import React from "react";
import { motion } from "framer-motion";
import { Receipt, Info, Shield } from "lucide-react";

interface PricingBreakdownProps {
	basePrice: number; // سعر الفني/الخدمة الأساسي
	platformFee: number; // رسوم المنصة
	vat: number; // ضريبة القيمة المضافة
	totalAmount: number; // المبلغ الإجمالي
	language: "en" | "ar";
	type: "product" | "service";
}

export default React.memo(function PricingBreakdown({
	basePrice,
	platformFee,
	vat,
	totalAmount,
	language,
	type,
}: PricingBreakdownProps) {
	const isArabic = language === "ar";
	const isService = type === "service";

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
		>
			{/* Header */}
			<div className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
				<div className={`flex items-center gap-2 sm:gap-3 `}>
					<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
						<Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
					</div>
					<div className="min-w-0">
						<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
							{isArabic ? "تفاصيل التسعير" : "Pricing Breakdown"}
						</h3>
						<p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
							{isArabic
								? "شفافية كاملة في الأسعار والرسوم"
								: "Complete pricing transparency"}
						</p>
					</div>
				</div>
			</div>

			{/* Pricing Table */}
			<div className="p-4 sm:p-5">
				<div className="space-y-2 sm:space-y-3">
					{/* Base Price */}
					<div className={`flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg `}>
						<div className={`flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 ${isArabic ? "flex-row-reverse" : ""}`}>
							<span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
								{isService
									? isArabic
										? "سعر الفني الأساسي"
										: "Base Technician Price"
									: isArabic
										? "سعر المنتجات"
										: "Products Price"}
							</span>
						</div>
						<span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap ml-2">
							{(basePrice ?? 0).toFixed(2)} {isArabic ? "ريال" : "SAR"}
						</span>
					</div>

					{/* Platform Fee */}
					<div className={`flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg `}>
						<div className={`flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 ${isArabic ? "flex-row-reverse" : ""}`}>
							<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
							<span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
								{isArabic ? "رسوم المنصة" : "Platform Fee"}
							</span>
							<div className="group relative flex-shrink-0">
								<Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 dark:text-gray-500 cursor-help" />
								<div
									className={`absolute ${isArabic ? "left-0" : "right-0"} bottom-full mb-2 w-48 sm:w-56 p-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg border border-gray-700 ${isArabic ? "text-right" : "text-left"}`}
								>
									{isArabic
										? "رسوم تشغيل المنصة لتوفير الخدمة"
										: "Platform service fee for providing the service"}
								</div>
							</div>
						</div>
						<span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap ml-2">
							{(platformFee ?? 0).toFixed(2)} {isArabic ? "ريال" : "SAR"}
						</span>
					</div>

					{/* VAT */}
					<div className={`flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg `}>
						<div className={`flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 ${isArabic ? "flex-row-reverse" : ""}`}>
							<span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
								{isArabic ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"}
							</span>
							<div className="group relative flex-shrink-0">
								<Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 dark:text-gray-500 cursor-help" />
								<div
									className={`absolute ${isArabic ? "left-0" : "right-0"} bottom-full mb-2 w-56 sm:w-64 p-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg border border-gray-700 ${isArabic ? "text-right" : "text-left"}`}
								>
									{isArabic
										? "ضريبة القيمة المضافة المطبقة وفقاً للوائح المملكة العربية السعودية"
										: "Value Added Tax applied according to Saudi Arabia regulations"}
								</div>
							</div>
						</div>
						<span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap ml-2">
							{(vat ?? 0).toFixed(2)} {isArabic ? "ريال" : "SAR"}
						</span>
					</div>

					{/* Divider */}
					<div className="border-t-2 border-gray-200 dark:border-gray-700 my-2" />

					{/* Total */}
					<div className={`flex items-center justify-between py-3 sm:py-4 px-3 sm:px-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800 `}>
						<span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
							{isArabic ? "المبلغ الإجمالي" : "Total Amount"}
						</span>
						<span className="text-lg sm:text-xl font-extrabold text-green-600 dark:text-green-400 whitespace-nowrap">
							{(totalAmount ?? 0).toFixed(2)} {isArabic ? "ريال" : "SAR"}
						</span>
					</div>
				</div>

				{/* Trust Message */}
				<div className={`mt-3 sm:mt-4 p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg ${isArabic ? "text-right" : "text-left"}`}>
					<p className={`text-xs text-blue-800 dark:text-blue-300 flex items-start gap-1.5 sm:gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
						<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
						<span>
							{isArabic
								? "جميع الأسعار شفافة وواضحة. لا توجد رسوم مخفية."
								: "All prices are transparent and clear. No hidden fees."}
						</span>
					</p>
				</div>
			</div>
		</motion.div>
	);
});


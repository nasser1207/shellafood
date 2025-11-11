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
			className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
		>
			{/* Header */}
			<div className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 border-b border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
				<div className={`flex items-center gap-3 `}>
					<div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
						<Receipt className="w-5 h-5 text-green-600 dark:text-green-400" />
					</div>
					<div>
						<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
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
			<div className="p-5">
				<div className="space-y-3">
					{/* Base Price */}
					<div className={`flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg `}>
						<div className={`flex items-center gap-2 `}>
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
								{isService
									? isArabic
										? "سعر الفني الأساسي"
										: "Base Technician Price"
									: isArabic
										? "سعر المنتجات"
										: "Products Price"}
							</span>
						</div>
						<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
							{basePrice.toFixed(2)} {isArabic ? "ريال" : "SAR"}
						</span>
					</div>

					{/* Platform Fee */}
					<div className={`flex items-center justify-between py-3 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg `}>
						<div className={`flex items-center gap-2 `}>
							<Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
								{isArabic ? "رسوم المنصة" : "Platform Fee"}
							</span>
							<div className="group relative">
								<Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 cursor-help" />
								<div
									className={`absolute ${isArabic ? "left-0" : "right-0"} bottom-full mb-2 w-56 p-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg border border-gray-700 ${isArabic ? "text-right" : "text-left"}`}
								>
									{isArabic
										? "رسوم تشغيل المنصة لتوفير الخدمة"
										: "Platform service fee for providing the service"}
								</div>
							</div>
						</div>
						<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
							{platformFee.toFixed(2)} {isArabic ? "ريال" : "SAR"}
						</span>
					</div>

					{/* VAT */}
					<div className={`flex items-center justify-between py-3 px-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg `}>
						<div className={`flex items-center gap-2 `}>
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
								{isArabic ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"}
							</span>
							<div className="group relative">
								<Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 cursor-help" />
								<div
									className={`absolute ${isArabic ? "left-0" : "right-0"} bottom-full mb-2 w-64 p-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg border border-gray-700 ${isArabic ? "text-right" : "text-left"}`}
								>
									{isArabic
										? "ضريبة القيمة المضافة المطبقة وفقاً للوائح المملكة العربية السعودية"
										: "Value Added Tax applied according to Saudi Arabia regulations"}
								</div>
							</div>
						</div>
						<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
							{vat.toFixed(2)} {isArabic ? "ريال" : "SAR"}
						</span>
					</div>

					{/* Divider */}
					<div className="border-t-2 border-gray-200 dark:border-gray-700 my-2" />

					{/* Total */}
					<div className={`flex items-center justify-between py-4 px-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800 `}>
						<span className="text-base font-bold text-gray-900 dark:text-gray-100">
							{isArabic ? "المبلغ الإجمالي" : "Total Amount"}
						</span>
						<span className="text-xl font-extrabold text-green-600 dark:text-green-400">
							{totalAmount.toFixed(2)} {isArabic ? "ريال" : "SAR"}
						</span>
					</div>
				</div>

				{/* Trust Message */}
				<div className={`mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg ${isArabic ? "text-right" : "text-left"}`}>
					<p className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
						<Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
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


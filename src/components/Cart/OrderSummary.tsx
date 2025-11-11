"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Truck, Shield, Sparkles, TrendingDown } from "lucide-react";

interface OrderSummaryProps {
	language: "en" | "ar";
	subtotal: number;
	deliveryFee: number;
	discount: number;
	couponDiscount?: number;
	total: number;
	isLoading?: boolean;
	onCheckout: () => void;
	canCheckout?: boolean;
	estimatedDeliveryTime?: string;
	estimatedDeliveryTimeAr?: string;
}

export default function OrderSummary({
	language,
	subtotal,
	deliveryFee,
	discount,
	couponDiscount = 0,
	total,
	isLoading = false,
	onCheckout,
	canCheckout = true,
	estimatedDeliveryTime,
	estimatedDeliveryTimeAr,
}: OrderSummaryProps) {
	const isArabic = language === "ar";
	const totalDiscount = discount + couponDiscount;
	const [showDetails, setShowDetails] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSticky, setIsSticky] = useState(false);

	const freeDeliveryThreshold = 100;
	const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);
	const savings = totalDiscount;

	// Handle sticky positioning
	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		const handleScroll = () => {
			const shouldBeSticky = window.scrollY > 100;
			setIsSticky(shouldBeSticky);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 ${
				isSticky ? "lg:sticky lg:top-6" : ""
			}`}
		>
			<div className="flex items-center justify-between mb-6">
				<h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic ? "ملخص الطلب" : "Order Summary"}
				</h3>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsExpanded(!isExpanded)}
					className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					aria-label={isArabic ? "تفاصيل" : "Details"}
				>
					{isExpanded ? (
						<ChevronUp className="w-5 h-5" />
					) : (
						<ChevronDown className="w-5 h-5" />
					)}
				</motion.button>
			</div>

			<AnimatePresence>
				{(isExpanded || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="space-y-3 mb-6 overflow-hidden"
					>
						{/* Subtotal */}
						<div className={`flex items-center justify-between`}>
							<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "المجموع الفرعي:" : "Subtotal:"}</span>
							<motion.span
								key={subtotal}
								initial={{ scale: 1.1, color: "#10b981" }}
								animate={{ scale: 1, color: "inherit" }}
								transition={{ duration: 0.3 }}
								className="text-sm font-semibold text-gray-900 dark:text-gray-100"
							>
								{subtotal.toFixed(2)} {isArabic ? "ريال" : "SAR"}
							</motion.span>
						</div>

						{/* Delivery Fee */}
						{deliveryFee > 0 && (
							<div className={`flex items-center justify-between`}>
								<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
									<Truck className="w-4 h-4" />
									{isArabic ? "رسوم التوصيل:" : "Delivery Fee:"}
								</span>
								<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									{deliveryFee.toFixed(2)} {isArabic ? "ريال" : "SAR"}
								</span>
							</div>
						)}

						{/* Free Delivery Progress */}
						{subtotal < freeDeliveryThreshold && deliveryFee > 0 && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
							>
								<div className="flex items-center gap-2 mb-2">
									<Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
									<span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
										{isArabic
											? `أضف ${amountNeeded.toFixed(2)} ريال للحصول على توصيل مجاني`
											: `Add ${amountNeeded.toFixed(2)} SAR for free delivery`}
									</span>
								</div>
								<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${Math.min((subtotal / freeDeliveryThreshold) * 100, 100)}%` }}
										transition={{ duration: 0.5 }}
										className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
									/>
								</div>
							</motion.div>
						)}

						{/* Discount */}
						{totalDiscount > 0 && (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className={`flex items-center justify-between text-emerald-600 dark:text-emerald-400`}
							>
								<span className="text-sm font-medium flex items-center gap-1.5">
									<TrendingDown className="w-4 h-4" />
									{isArabic ? "الخصم:" : "Discount:"}
									{couponDiscount > 0 && (
										<span className="text-xs opacity-75">
											({isArabic ? "كوبون" : "coupon"})
										</span>
									)}
								</span>
								<span className="text-sm font-bold">-{totalDiscount.toFixed(2)} {isArabic ? "ريال" : "SAR"}</span>
							</motion.div>
						)}

						{/* Savings Message */}
						{savings > 0 && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
							>
								<div className="flex items-center gap-2">
									<Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
									<span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
										{isArabic
											? `أنت توفر ${savings.toFixed(2)} ريال! 🎉`
											: `You're saving ${savings.toFixed(2)} SAR! 🎉`}
									</span>
								</div>
							</motion.div>
						)}

						{/* Estimated Delivery Time */}
						{estimatedDeliveryTime && (
							<div className={`flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700`}>
								<Truck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
								<span className="text-xs text-gray-600 dark:text-gray-400">
									{isArabic ? "الوقت المتوقع للتوصيل: " : "Estimated delivery: "}
									{isArabic && estimatedDeliveryTimeAr ? estimatedDeliveryTimeAr : estimatedDeliveryTime}
								</span>
							</div>
						)}

						{/* Divider */}
						<div className="border-t-2 border-gray-200 dark:border-gray-700 my-4" />

						{/* Total */}
						<div className={`flex items-center justify-between`}>
							<span className="text-lg font-bold text-gray-900 dark:text-gray-100">{isArabic ? "الإجمالي:" : "Total:"}</span>
							<motion.span
								key={total}
								initial={{ scale: 1.2, color: "#10b981" }}
								animate={{ scale: 1, color: "#10b981" }}
								transition={{ duration: 0.3 }}
								className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400"
							>
								{total.toFixed(2)} {isArabic ? "ريال" : "SAR"}
							</motion.span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Checkout Button */}
			<motion.button
				whileHover={canCheckout && !isLoading ? { scale: 1.02, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" } : {}}
				whileTap={canCheckout && !isLoading ? { scale: 0.98 } : {}}
				onClick={onCheckout}
				disabled={!canCheckout || isLoading}
				className={`w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
					isArabic ? "flex-row-reverse" : ""
				}`}
			>
				{isLoading ? (
					<>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
							className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
						/>
						<span>{isArabic ? "جاري المعالجة..." : "Processing..."}</span>
					</>
				) : (
					<>
						<span>{isArabic ? "تأكيد الطلب" : "Confirm & Checkout"}</span>
						<motion.div
							animate={{ x: [0, isArabic ? -4 : 4, 0] }}
							transition={{ duration: 1.5, repeat: Infinity }}
						>
							→
						</motion.div>
					</>
				)}
			</motion.button>

			{/* Security Note */}
			<div className={`flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700`}>
				<Shield className="w-4 h-4 text-gray-400 dark:text-gray-500" />
				<p className={`text-xs text-gray-500 dark:text-gray-400 text-center ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic
						? "🔒 معالجة آمنة ومشفرة لبياناتك"
						: "🔒 Secure encrypted processing of your data"}
				</p>
			</div>
		</motion.div>
	);
}

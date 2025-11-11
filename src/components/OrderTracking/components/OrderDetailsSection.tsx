"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Package,
	CreditCard,
	MapPin,
	Info,
	Phone,
	ChevronDown,
	ChevronUp,
	Copy,
	Check,
	Receipt,
} from "lucide-react";
import { OrderData } from "../types";
import PricingBreakdown from "./PricingBreakdown";

interface OrderDetailsSectionProps {
	orderData: OrderData;
	language: "en" | "ar";
}

export default React.memo(function OrderDetailsSection({
	orderData,
	language,
}: OrderDetailsSectionProps) {
	const isArabic = language === "ar";
	const [openDetails, setOpenDetails] = useState({
		pricing: false,
		items: false,
		payment: false,
		address: false,
		support: false,
	});
	const [copied, setCopied] = useState(false);

	// Calculate pricing breakdown if not provided
	const calculatePricing = () => {
		if (orderData.basePrice && orderData.platformFee && orderData.vat) {
			return {
				basePrice: orderData.basePrice,
				platformFee: orderData.platformFee,
				vat: orderData.vat,
			};
		}

		// Estimate from totalAmount
		// Formula: totalAmount = (basePrice + platformFee) * 1.15
		// Assuming platformFee = 10% of basePrice
		// So: totalAmount = (basePrice + basePrice * 0.1) * 1.15 = basePrice * 1.1 * 1.15
		const estimatedBase = Math.round((orderData.totalAmount / 1.15 / 1.1) * 100) / 100;
		const estimatedFee = Math.round(estimatedBase * 0.1 * 100) / 100;
		const estimatedVAT = Math.round((estimatedBase + estimatedFee) * 0.15 * 100) / 100;

		return {
			basePrice: estimatedBase,
			platformFee: estimatedFee,
			vat: estimatedVAT,
		};
	};

	const pricing = calculatePricing();

	const toggleDetail = (key: keyof typeof openDetails) => {
		setOpenDetails((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const copyAddress = async () => {
		try {
			await navigator.clipboard.writeText(orderData.address);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy address:", error);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
			className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4"
		>
			<h2 className={`text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
				{isArabic ? "تفاصيل الطلب" : "Order Details"}
			</h2>

			{/* Pricing Breakdown Section */}
			{(orderData.basePrice !== undefined || orderData.platformFee !== undefined || orderData.vat !== undefined) && (
				<div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4">
					<button
						onClick={() => toggleDetail("pricing")}
						className={`w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors `}
					>
						<div className={`flex items-center gap-3 `}>
							<Receipt className="w-5 h-5 text-green-600 dark:text-green-400" />
							<span className="font-semibold text-gray-900 dark:text-gray-100">
								{isArabic ? "تفاصيل التسعير" : "Pricing Breakdown"}
							</span>
						</div>
						{openDetails.pricing ? (
							<ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
						) : (
							<ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
						)}
					</button>
					<AnimatePresence>
						{openDetails.pricing && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden"
							>
								<div className="p-4">
									<PricingBreakdown
										basePrice={pricing.basePrice}
										platformFee={pricing.platformFee}
										vat={pricing.vat}
										totalAmount={orderData.totalAmount}
										language={language}
										type={orderData.type}
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}

			{/* Items Section */}
			{orderData.items && orderData.items.length > 0 && (
				<div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
					<button
						onClick={() => toggleDetail("items")}
						className={`w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors `}
					>
						<div className={`flex items-center gap-3 `}>
							<Package className="w-5 h-5 text-green-600 dark:text-green-400" />
							<span className="font-semibold text-gray-900 dark:text-gray-100">
								{isArabic ? "عناصر الطلب" : "Order Items"}
							</span>
						</div>
						{openDetails.items ? (
							<ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
						) : (
							<ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
						)}
					</button>
					<AnimatePresence>
						{openDetails.items && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden"
							>
								<div className={`p-4 space-y-3 ${isArabic ? "text-right" : "text-left"}`}>
									{orderData.items.map((item, index) => (
										<div
											key={index}
											className={`flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 `}
										>
											<span className="text-sm text-gray-700 dark:text-gray-300">
												{isArabic ? item.nameAr || item.name : item.name} × {item.quantity}
											</span>
											<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
												{(item.price * item.quantity).toFixed(2)} {isArabic ? "ريال" : "SAR"}
											</span>
										</div>
									))}
									<div className={`pt-3 border-t-2 border-gray-200 dark:border-gray-700 flex items-center justify-between `}>
										<span className="font-bold text-gray-900 dark:text-gray-100">{isArabic ? "المجموع:" : "Total:"}</span>
										<span className="text-lg font-extrabold text-green-600 dark:text-green-400">
											{orderData.totalAmount.toFixed(2)} {isArabic ? "ريال" : "SAR"}
										</span>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}

			{/* Payment Section */}
			<div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
				<button
					onClick={() => toggleDetail("payment")}
					className={`w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors `}
				>
					<div className={`flex items-center gap-3 `}>
						<CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
						<span className="font-semibold text-gray-900 dark:text-gray-100">{isArabic ? "الدفع" : "Payment"}</span>
					</div>
					{openDetails.payment ? (
						<ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
					) : (
						<ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
					)}
				</button>
				<AnimatePresence>
					{openDetails.payment && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="overflow-hidden"
						>
							<div className={`p-4 space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
								<p className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "طريقة الدفع:" : "Payment Method:"}</p>
								<p className="font-semibold text-gray-900 dark:text-gray-100">{orderData.paymentMethod}</p>
								<p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{isArabic ? "المبلغ المدفوع:" : "Amount Paid:"}</p>
								<p className="text-lg font-bold text-green-600 dark:text-green-400">
									{orderData.totalAmount.toFixed(2)} {isArabic ? "ريال" : "SAR"}
								</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Address Section */}
			<div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
				<button
					onClick={() => toggleDetail("address")}
					className={`w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors `}
				>
					<div className={`flex items-center gap-3 `}>
						<MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
						<span className="font-semibold text-gray-900 dark:text-gray-100">
							{isArabic ? "عنوان التوصيل" : "Delivery Address"}
						</span>
					</div>
					{openDetails.address ? (
						<ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
					) : (
						<ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
					)}
				</button>
				<AnimatePresence>
					{openDetails.address && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="overflow-hidden"
						>
							<div className={`p-4 ${isArabic ? "text-right" : "text-left"}`}>
								<div className={`flex items-start gap-2 mb-3 `}>
									<MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
									<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{orderData.address}</p>
								</div>
								<button
									onClick={copyAddress}
									className={`flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors `}
								>
									{copied ? (
										<Check className="w-4 h-4 text-green-600 dark:text-green-400" />
									) : (
										<Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
									)}
									<span className="text-gray-700 dark:text-gray-300">
										{copied
											? isArabic
												? "تم النسخ"
												: "Copied!"
											: isArabic
												? "نسخ العنوان"
												: "Copy Address"}
									</span>
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Support Section */}
			<div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
				<button
					onClick={() => toggleDetail("support")}
					className={`w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors `}
				>
					<div className={`flex items-center gap-3 `}>
						<Info className="w-5 h-5 text-green-600 dark:text-green-400" />
						<span className="font-semibold text-gray-900 dark:text-gray-100">{isArabic ? "الدعم" : "Support"}</span>
					</div>
					{openDetails.support ? (
						<ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
					) : (
						<ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
					)}
				</button>
				<AnimatePresence>
					{openDetails.support && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="overflow-hidden"
						>
							<div className={`p-4 space-y-3 ${isArabic ? "text-right" : "text-left"}`}>
								<p className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "تحتاج مساعدة؟" : "Need help?"}</p>
								{orderData.supportPhone && (
									<button
										onClick={() => {
											const cleanPhone = orderData.supportPhone?.replace(/\D/g, "");
											if (cleanPhone) {
												const whatsappUrl = `https://wa.me/${cleanPhone}`;
												window.open(whatsappUrl, "_blank");
											}
										}}
										className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors shadow-md `}
									>
										<Phone className="w-4 h-4" />
										<span>{isArabic ? "واتساب الدعم" : "WhatsApp Support"}</span>
									</button>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
});


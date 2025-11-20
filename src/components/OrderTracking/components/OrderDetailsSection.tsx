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
	Wrench,
	Clock,
} from "lucide-react";
import { OrderData, ORDER_TYPE } from "../types";
import PricingBreakdown from "./PricingBreakdown";
import { getAddressLabel } from "../utils/orderStatus";

interface OrderDetailsSectionProps {
	orderData: OrderData;
	language: "en" | "ar";
}

export default React.memo(function OrderDetailsSection({
	orderData,
	language,
}: OrderDetailsSectionProps) {
	const isArabic = language === "ar";
	const isService = orderData.type === ORDER_TYPE.SERVICE;
	const isPickAndOrder = orderData.type === ORDER_TYPE.PRODUCT && (orderData as any).order_details?.transportType;
	const [openDetails, setOpenDetails] = useState({
		pricing: false,
		items: false,
		serviceDetails: false,
		deliveryDetails: false,
		payment: false,
		address: false,
		support: false,
	});
	const [copied, setCopied] = useState(false);
	const addressLabel = getAddressLabel(orderData.type, language);

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
		const estimatedBase = Math.round(((orderData.totalAmount ?? 0) / 1.15 / 1.1) * 100) / 100;
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
			await navigator.clipboard.writeText(orderData.address || "");
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
			className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 space-y-3 sm:space-y-4"
		>
			<h2 className={`text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 ${isArabic ? "text-right" : "text-left"}`}>
				{isArabic ? "تفاصيل الطلب" : "Order Details"}
			</h2>

			{/* Pricing Breakdown Section */}
			{(orderData.basePrice !== undefined || orderData.platformFee !== undefined || orderData.vat !== undefined) && (
				<div className="border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4">
					<button
						onClick={() => toggleDetail("pricing")}
						className={`w-full p-3 sm:p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] ${isArabic ? "flex-row-reverse" : ""}`}
					>
						<div className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
							<Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
							<span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
								{isArabic ? "تفاصيل التسعير" : "Pricing Breakdown"}
							</span>
						</div>
						{openDetails.pricing ? (
							<ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
						) : (
							<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
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
								<div className="p-3 sm:p-4">
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

			{/* Items Section - Product Orders Only */}
			{!isService && orderData.items && orderData.items.length > 0 && (
				<div className="border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl overflow-hidden">
					<button
						onClick={() => toggleDetail("items")}
						className={`w-full p-3 sm:p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] ${isArabic ? "flex-row-reverse" : ""}`}
					>
						<div className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
							<Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
							<span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
								{isArabic ? "عناصر الطلب" : "Order Items"}
							</span>
						</div>
						{openDetails.items ? (
							<ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
						) : (
							<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
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
								<div className={`p-3 sm:p-4 space-y-2 sm:space-y-3 ${isArabic ? "text-right" : "text-left"}`}>
									{orderData.items.map((item, index) => (
										<div
											key={index}
											className={`flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 gap-2 `}
										>
											<span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
												{isArabic ? item.nameAr || item.name : item.name} × {item.quantity}
											</span>
											<span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
												{((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)} {isArabic ? "ريال" : "SAR"}
											</span>
										</div>
									))}
									<div className={`pt-2 sm:pt-3 border-t-2 border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2 `}>
										<span className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100">{isArabic ? "المجموع:" : "Total:"}</span>
										<span className="text-base sm:text-lg font-extrabold text-green-600 dark:text-green-400 whitespace-nowrap">
											{(orderData.totalAmount ?? 0).toFixed(2)} {isArabic ? "ريال" : "SAR"}
										</span>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}

			{/* Payment Section */}
			<div className="border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl overflow-hidden">
				<button
					onClick={() => toggleDetail("payment")}
					className={`w-full p-3 sm:p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] ${isArabic ? "flex-row-reverse" : ""}`}
				>
					<div className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
						<CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
						<span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">{isArabic ? "الدفع" : "Payment"}</span>
					</div>
					{openDetails.payment ? (
						<ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
					) : (
						<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
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
							<div className={`p-3 sm:p-4 space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{isArabic ? "طريقة الدفع:" : "Payment Method:"}</p>
								<p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">{orderData.paymentMethod || (isArabic ? "غير محدد" : "Not specified")}</p>
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-3">{isArabic ? "المبلغ المدفوع:" : "Amount Paid:"}</p>
								<p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
									{(orderData.totalAmount ?? 0).toFixed(2)} {isArabic ? "ريال" : "SAR"}
								</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Service Details Section - Service Orders Only */}
			{isService && (
				<div className="border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl overflow-hidden">
					<button
						onClick={() => toggleDetail("serviceDetails")}
						className={`w-full p-3 sm:p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] ${isArabic ? "flex-row-reverse" : ""}`}
					>
						<div className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
							<Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
							<span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
								{isArabic ? "تفاصيل الخدمة" : "Service Details"}
							</span>
						</div>
						{openDetails.serviceDetails ? (
							<ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
						) : (
							<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
						)}
					</button>
					<AnimatePresence>
						{openDetails.serviceDetails && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden"
							>
								<div className={`p-3 sm:p-4 space-y-3 ${isArabic ? "text-right" : "text-left"}`}>
									{orderData.service && (
										<div>
											<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
												{isArabic ? "نوع الخدمة" : "Service Type"}
											</p>
											<p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
												{orderData.service}
											</p>
										</div>
									)}
									{orderData.serviceType && (
										<div>
											<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
												{isArabic ? "فئة الخدمة" : "Service Category"}
											</p>
											<p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
												{orderData.serviceType}
											</p>
										</div>
									)}
									{orderData.scheduledTime && (
										<div className="flex items-center gap-2">
											<Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
											<div>
												<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-0.5">
													{isArabic ? "الموعد المحدد" : "Scheduled Time"}
												</p>
												<p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
													{new Date(orderData.scheduledTime).toLocaleString(isArabic ? "ar-SA" : "en-US", {
														dateStyle: "long",
														timeStyle: "short",
													})}
												</p>
											</div>
										</div>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}

			{/* Pick and Order Delivery Details Section */}
			{isPickAndOrder && (orderData as any).order_details && (
				<div className="border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl overflow-hidden">
					<button
						onClick={() => toggleDetail("deliveryDetails")}
						className={`w-full p-3 sm:p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] ${isArabic ? "flex-row-reverse" : ""}`}
					>
						<div className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
							<Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
							<span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
								{isArabic ? "تفاصيل التوصيل" : "Delivery Details"}
							</span>
						</div>
						{openDetails.deliveryDetails ? (
							<ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
						) : (
							<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
						)}
					</button>
					<AnimatePresence>
						{openDetails.deliveryDetails && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden"
							>
								<div className={`p-3 sm:p-4 space-y-4 ${isArabic ? "text-right" : "text-left"}`}>
									{/* Transport and Order Type */}
									<div className="grid grid-cols-2 gap-3">
										<div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
											<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
												{isArabic ? "نوع النقل" : "Transport Type"}
											</p>
											<p className="text-sm font-bold text-green-600 dark:text-green-400">
												{(orderData as any).order_details.transportType === "motorbike" 
													? (isArabic ? "دراجة نارية" : "Motorbike")
													: (isArabic ? "شاحنة" : "Truck")}
											</p>
										</div>
										<div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
											<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
												{isArabic ? "نوع التوصيل" : "Order Type"}
											</p>
											<p className="text-sm font-bold text-orange-600 dark:text-orange-400">
												{(orderData as any).order_details.orderType === "one-way"
													? (isArabic ? "باتجاه واحد" : "One-Way")
													: (isArabic ? "متعدد الاتجاهات" : "Multi-Direction")}
											</p>
										</div>
									</div>

									{/* Pickup and Dropoff */}
									<div className="space-y-3">
										<div className="border-l-4 border-green-500 pl-3">
											<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
												{isArabic ? "موقع الاستلام" : "Pickup Location"}
											</p>
											<p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
												{(orderData as any).order_details.pickupLocation}
											</p>
											{(orderData as any).order_details.senderName && (
												<div className="mt-2 flex items-center gap-2">
													<Phone className="w-3 h-3 text-gray-400" />
													<p className="text-xs text-gray-600 dark:text-gray-400">
														{(orderData as any).order_details.senderName} - {(orderData as any).order_details.senderPhone}
													</p>
												</div>
											)}
										</div>
										<div className="border-l-4 border-orange-500 pl-3">
											<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
												{isArabic ? "موقع التسليم" : "Dropoff Location"}
											</p>
											<p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
												{(orderData as any).order_details.dropoffLocation}
											</p>
											{(orderData as any).order_details.receiverName && (
												<div className="mt-2 flex items-center gap-2">
													<Phone className="w-3 h-3 text-gray-400" />
													<p className="text-xs text-gray-600 dark:text-gray-400">
														{(orderData as any).order_details.receiverName} - {(orderData as any).order_details.receiverPhone}
													</p>
												</div>
											)}
										</div>
									</div>

									{/* Package Details */}
									{((orderData as any).order_details.packageDescription || 
									  (orderData as any).order_details.packageWeight ||
									  (orderData as any).order_details.packageDimensions) && (
										<div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
											<p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
												{isArabic ? "تفاصيل الطرد" : "Package Details"}
											</p>
											{(orderData as any).order_details.packageDescription && (
												<div>
													<p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
														{isArabic ? "الوصف:" : "Description:"}
													</p>
													<p className="text-sm text-gray-900 dark:text-gray-100">
														{(orderData as any).order_details.packageDescription}
													</p>
												</div>
											)}
											{((orderData as any).order_details.packageWeight || (orderData as any).order_details.packageDimensions) && (
												<div className="grid grid-cols-2 gap-2 mt-2">
													{(orderData as any).order_details.packageWeight && (
														<div>
															<p className="text-xs text-gray-600 dark:text-gray-400">
																{isArabic ? "الوزن:" : "Weight:"}
															</p>
															<p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
																{(orderData as any).order_details.packageWeight}
															</p>
														</div>
													)}
													{(orderData as any).order_details.packageDimensions && (
														<div>
															<p className="text-xs text-gray-600 dark:text-gray-400">
																{isArabic ? "الأبعاد:" : "Dimensions:"}
															</p>
															<p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
																{(orderData as any).order_details.packageDimensions}
															</p>
														</div>
													)}
												</div>
											)}
										</div>
									)}

									{/* Special Instructions */}
									{(orderData as any).order_details.specialInstructions && (
										<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
											<p className="text-xs font-bold text-blue-900 dark:text-blue-100 mb-1">
												{isArabic ? "تعليمات خاصة:" : "Special Instructions:"}
											</p>
											<p className="text-sm text-blue-800 dark:text-blue-200">
												{(orderData as any).order_details.specialInstructions}
											</p>
										</div>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}

			{/* Address Section */}
			<div className="border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl overflow-hidden">
				<button
					onClick={() => toggleDetail("address")}
					className={`w-full p-3 sm:p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] ${isArabic ? "flex-row-reverse" : ""}`}
				>
					<div className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
						<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
						<span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
							{addressLabel}
						</span>
					</div>
					{openDetails.address ? (
						<ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
					) : (
						<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
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
							<div className={`p-3 sm:p-4 ${isArabic ? "text-right" : "text-left"}`}>
								<div className={`flex items-start gap-2 mb-2 sm:mb-3 ${isArabic ? "flex-row-reverse" : ""}`}>
									<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
									<p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{orderData.address || (isArabic ? "لا يوجد عنوان" : "No address provided")}</p>
								</div>
								<button
									onClick={copyAddress}
									className={`flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[44px] ${isArabic ? "flex-row-reverse" : ""}`}
								>
									{copied ? (
										<Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									) : (
										<Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
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
			<div className="border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl overflow-hidden">
				<button
					onClick={() => toggleDetail("support")}
					className={`w-full p-3 sm:p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] ${isArabic ? "flex-row-reverse" : ""}`}
				>
					<div className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
						<Info className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
						<span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">{isArabic ? "الدعم" : "Support"}</span>
					</div>
					{openDetails.support ? (
						<ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
					) : (
						<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
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
							<div className={`p-3 sm:p-4 space-y-2 sm:space-y-3 ${isArabic ? "text-right" : "text-left"}`}>
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{isArabic ? "تحتاج مساعدة؟" : "Need help?"}</p>
								{orderData.supportPhone && (
									<button
										onClick={() => {
											const cleanPhone = orderData.supportPhone?.replace(/\D/g, "");
											if (cleanPhone) {
												const whatsappUrl = `https://wa.me/${cleanPhone}`;
												window.open(whatsappUrl, "_blank");
											}
										}}
										className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-md min-h-[44px] ${isArabic ? "flex-row-reverse" : ""}`}
									>
										<Phone className="w-4 h-4 flex-shrink-0" />
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


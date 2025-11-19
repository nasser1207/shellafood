"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Calendar, ArrowLeft, Receipt, MapPin, FileText, Phone, UserCircle, Package, Truck, Bike, Info } from "lucide-react";
import { calculatePricing, formatPrice } from "./utils/pricing";

interface OrderConfirmationPageProps {
	transportType: string;
	orderType?: string;
}

export default function OrderConfirmationPage({ transportType, orderType }: OrderConfirmationPageProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMotorbike = transportType === "motorbike";
	const isMultiDirection = orderType === "multi-direction";

	// Generate order ID (in real app, this would come from API)
	const orderId = useMemo(() => {
		return `ORD-${Date.now().toString().slice(-8)}`;
	}, []);

	// Base price based on transport type
	const basePrice = useMemo(() => {
		return isMotorbike ? 50 : 150;
	}, [isMotorbike]);

	// Memoized pricing breakdown
	const pricing = useMemo(() => {
		return calculatePricing(basePrice);
	}, [basePrice]);

	// Memoized formatted date
	const formattedDate = useMemo(() => {
		return new Date().toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}, [isArabic]);

	// Handlers
	const handleBackToHome = () => {
		router.push("/pickandorder");
	};

	const handleTrackOrder = () => {
		// Navigate to track order page for this specific order
		router.push(`/my-orders/${orderId}/track`);
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-gray-800/50 to-white dark:to-gray-900 py-8 md:py-12 lg:py-16">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="max-w-2xl mx-auto px-4 sm:px-6"
			>
				{/* Success Animation */}
				<motion.div variants={itemVariants} className="flex justify-center mb-8">
					<div className="relative">
						<div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shadow-lg">
							<CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" strokeWidth={2.5} />
						</div>
						<div className="absolute inset-0 bg-green-200 dark:bg-green-700 rounded-full animate-ping opacity-20"></div>
					</div>
				</motion.div>

				{/* Unified Confirmation Card */}
				<motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
					{/* Header Section */}
					<div className="bg-gradient-to-r from-green-50 dark:from-green-900/20 to-emerald-50 dark:to-emerald-900/20 px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-gray-700">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
							{isArabic ? "تم تأكيد الطلب ✅" : "Order Confirmed ✅"}
						</h1>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
							{isArabic
								? "شكراً لك! تم تأكيد طلبك بنجاح."
								: "Thank you! Your order has been confirmed successfully."}
						</p>
					</div>

					{/* Content Section */}
					<div className="p-6 sm:p-8 space-y-6">
						{/* Order Details */}
						<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
							<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
								<Receipt className="w-5 h-5 text-green-600 dark:text-green-400" />
								{isArabic ? "تفاصيل الطلب" : "Order Details"}
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "رقم الطلب:" : "Order ID:"}</span>
									<span className="font-semibold text-gray-900 dark:text-gray-100">{orderId}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "نوع النقل:" : "Transport Type:"}</span>
									<span className={`font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
										{isMotorbike ? (
											<>
												<Bike className="w-5 h-5" />
												{isArabic ? "دراجة نارية" : "Motorbike"}
											</>
										) : (
											<>
												<Truck className="w-5 h-5" />
												{isArabic ? "شاحنة" : "Truck"}
											</>
										)}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className={`text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2`}>
										<Calendar className="w-4 h-4" />
										{isArabic ? "التاريخ:" : "Date:"}
									</span>
									<span className="font-semibold text-gray-900 dark:text-gray-100">
										{formattedDate}
									</span>
								</div>
							</div>
						</section>

						{/* Pickup Address */}
						<section className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-700">
							<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
								<MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
								{isArabic ? "عنوان الالتقاط" : "Pickup Address"}
							</h2>
							<div className={`space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
								<p className="text-base text-gray-900 dark:text-gray-100 font-medium">
									{isArabic ? "الرياض، حي النرجس" : "Riyadh, Al-Narjis District"}
								</p>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{isArabic ? "شارع الملك فهد، مبنى رقم 123" : "King Fahd Street, Building #123"}
								</p>
							</div>
						</section>

						{/* Delivery Address */}
						<section className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-700">
							<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
								<MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
								{isArabic ? "عنوان التوصيل" : "Delivery Address"}
							</h2>
							<div className={`space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
								<p className="text-base text-gray-900 dark:text-gray-100 font-medium">
									{isArabic ? "الرياض، حي العليا" : "Riyadh, Al-Olaya District"}
								</p>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{isArabic ? "طريق الملك عبدالعزيز، مبنى رقم 456" : "King Abdulaziz Road, Building #456"}
								</p>
							</div>
						</section>

						{/* Sender Info */}
						<section className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-700">
							<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
								<UserCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
								{isArabic ? "معلومات المرسل" : "Sender Information"}
							</h2>
							<div className={`space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
								<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
									<Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
									<span>
										{isArabic ? "الاسم:" : "Name:"} <span className="font-semibold text-gray-900 dark:text-gray-100">{isArabic ? "أحمد محمد" : "Ahmed Mohammed"}</span>
									</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
									<Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
									<span>
										{isArabic ? "الهاتف:" : "Phone:"} <span className="font-semibold text-gray-900 dark:text-gray-100">+966 50 123 4567</span>
									</span>
								</div>
							</div>
						</section>

						{/* Pricing Breakdown Section */}
						<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
							<h2 className={`text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3`}>
								<Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
								{isArabic ? "تفاصيل التسعير" : "Pricing Breakdown"}
							</h2>
							<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
								{/* Base Delivery Price */}
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										{isArabic ? "سعر التوصيل الأساسي:" : "Base Delivery Price:"}
									</span>
									<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										{formatPrice(pricing.basePrice, isArabic)}
									</span>
								</div>

								{/* Platform Fee */}
								<div className="flex items-center justify-between">
									<div className={`flex items-center gap-2`}>
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{isArabic ? "رسوم المنصة:" : "Platform Fee:"}
										</span>
										<div className="group relative">
											<Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
											<div className={`absolute ${isArabic ? "left-0" : "right-0"} bottom-full mb-2 w-48 sm:w-64 p-2 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 ${isArabic ? "text-right" : "text-left"}`}>
												{isArabic 
													? "رسوم الخدمة لتشغيل المنصة والصيانة والتطوير"
													: "Service fee for platform operation, maintenance & development"}
											</div>
										</div>
									</div>
									<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										{formatPrice(pricing.platformFee, isArabic)}
									</span>
								</div>

								{/* Subtotal */}
								<div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
									<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
										{isArabic ? "المجموع الفرعي:" : "Subtotal:"}
									</span>
									<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										{formatPrice(pricing.subtotal, isArabic)}
									</span>
								</div>

								{/* VAT */}
								<div className="flex items-center justify-between">
									<div className={`flex items-center gap-2`}>
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{isArabic ? "ضريبة القيمة المضافة (15%):" : "VAT (15%):"}
										</span>
										<div className="group relative">
											<Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
											<div className={`absolute ${isArabic ? "left-0" : "right-0"} bottom-full mb-2 w-48 sm:w-64 p-2 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 ${isArabic ? "text-right" : "text-left"}`}>
												{isArabic 
													? "ضريبة القيمة المضافة المطبقة وفقاً للوائح المملكة العربية السعودية"
													: "Value Added Tax applied according to Saudi Arabia regulations"}
											</div>
										</div>
									</div>
									<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										{formatPrice(pricing.vat, isArabic)}
									</span>
								</div>

								{/* Total */}
								<div className="flex items-center justify-between pt-3 border-t-2 border-green-200 dark:border-green-800">
									<span className="text-lg font-bold text-gray-900 dark:text-gray-100">
										{isArabic ? "المجموع الكلي:" : "Total Amount:"}
									</span>
									<span className="text-xl font-bold text-green-600 dark:text-green-400">
										{formatPrice(pricing.total, isArabic)}
									</span>
								</div>
							</div>

							{/* Trust Message */}
							<div className={`mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 ${isArabic ? "text-right" : "text-left"}`}>
								<p className="text-xs text-green-800 dark:text-green-300 leading-relaxed">
									{isArabic
										? "نحن ملتزمون بالشفافية الكاملة في التسعير. جميع الرسوم معروضة بوضوح."
										: "We are committed to full pricing transparency. All fees are clearly displayed."}
								</p>
							</div>
						</section>

						{/* Track Order Button */}
						<section className="space-y-4">
							<button
								onClick={handleTrackOrder}
								className={`w-full bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
									isArabic ? "flex-row-reverse" : ""
								}`}
							>
								<Package className="w-5 h-5" />
								<span>{isArabic ? "تتبع الطلب" : "Track Order"}</span>
							</button>
						</section>
					</div>

					{/* Footer Action */}
					<div className="bg-gray-50 dark:bg-gray-800 px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-gray-700">
						<button
							onClick={handleBackToHome}
							className={`w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2`}
						>
							<ArrowLeft className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
							<span>{isArabic ? "العودة للرئيسية" : "Back to Home"}</span>
						</button>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}


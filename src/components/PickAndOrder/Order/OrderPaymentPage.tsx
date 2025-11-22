"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreditCard, Wallet, Wallet2, Smartphone, Lock, Check, Receipt, Info, ArrowRight, MapPin } from "lucide-react";
import { PAYMENT_METHODS, PaymentMethodId } from "./utils/paymentMethods";
import { calculateOrderPricing, formatPrice, formatDistance } from "./utils/pricing";

interface OrderPaymentPageProps {
	transportType: string;
}

interface OrderData {
	transportType: string;
	orderType: string;
	locationPoints: Array<{
		id: string;
		type: "pickup" | "dropoff";
		location: { lat: number; lng: number } | null;
	}>;
	isExpress?: boolean;
	requiresRefrigeration?: boolean;
	loadingEquipmentNeeded?: boolean;
}

export default function OrderPaymentPage({ transportType }: OrderPaymentPageProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [isProcessing, setIsProcessing] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodId | null>(null);
	const [orderData, setOrderData] = useState<OrderData | null>(null);

	const [storedPricing, setStoredPricing] = useState<any>(null);

	// Load order data from sessionStorage - supports both old and new formats
	useEffect(() => {
		if (typeof window !== "undefined") {
			// Function to load pricing
			const loadPricing = () => {
				const pricingStr = sessionStorage.getItem("orderPricing");
				if (pricingStr) {
					try {
						const parsed = JSON.parse(pricingStr);
						setStoredPricing(parsed);
						console.log("✅ Stored pricing loaded:", parsed);
						return true;
					} catch (error) {
						console.error("❌ Error parsing stored pricing:", error);
					}
				} else {
					console.log("ℹ️ No stored pricing found in sessionStorage");
				}
				return false;
			};

			// Try to load pricing immediately
			loadPricing();

			// Also check again after a short delay (in case pricing was just stored)
			const timeoutId = setTimeout(() => {
				if (!storedPricing) {
					console.log("🔄 Re-checking for stored pricing...");
					loadPricing();
				}
			}, 500);

			// Load and convert order data using data converter utility
			import("./utils/dataConverter").then(({ loadAndConvertOrderData }) => {
				const data = loadAndConvertOrderData();
				if (data) {
					setOrderData(data);
					console.log("✅ Order data loaded for payment:", data);
					console.log("📍 Location points:", data.locationPoints);
					console.log("📍 Location points count:", data.locationPoints?.length || 0);
				} else {
					console.warn("⚠️ No order data found in sessionStorage");
				}
			}).catch((error) => {
				console.error("❌ Error loading order data:", error);
			});

			return () => clearTimeout(timeoutId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run once on mount

	// Calculate pricing using centralized utility
	const pricing = useMemo(() => {
		console.log("🔍 Calculating pricing - storedPricing:", storedPricing, "orderData:", orderData);
		
		// First, use stored pricing if available (from summary page or choose-driver page)
		if (storedPricing) {
			// Check if pricing has valid values
			if (storedPricing.total !== undefined && storedPricing.total !== null) {
				console.log("✅ Using stored pricing:", storedPricing);
				return storedPricing;
			} else {
				console.warn("⚠️ Stored pricing exists but has invalid total:", storedPricing);
			}
		} else {
			console.log("ℹ️ No stored pricing found, will calculate from order data");
		}

		// Otherwise, calculate from order data
		if (!orderData) {
			console.warn("No order data available");
			return {
				basePrice: 0,
				platformFee: 0,
				subtotal: 0,
				vat: 0,
				total: 0,
				distance: 0,
			};
		}

		if (!orderData.locationPoints || orderData.locationPoints.length === 0) {
			console.warn("No location points available in order data");
			return {
				basePrice: 0,
				platformFee: 0,
				subtotal: 0,
				vat: 0,
				total: 0,
				distance: 0,
			};
		}

		// Filter out location points without valid locations
		const validLocationPoints = orderData.locationPoints.filter(
			(point: any) => point.location && point.location.lat && point.location.lng
		);

		if (validLocationPoints.length === 0) {
			console.warn("No valid location points (with lat/lng) found");
			console.warn("Available location points:", orderData.locationPoints);
			return {
				basePrice: 0,
				platformFee: 0,
				subtotal: 0,
				vat: 0,
				total: 0,
				distance: 0,
			};
		}

		try {
			const pricingInput = {
				transportType: (transportType === "motorbike" ? "motorbike" : "truck") as "motorbike" | "truck",
				locationPoints: validLocationPoints,
				isExpress: orderData.isExpress || false,
				requiresRefrigeration: orderData.requiresRefrigeration || false,
				loadingEquipmentNeeded: orderData.loadingEquipmentNeeded || false,
			};
			console.log("Pricing input:", pricingInput);
			const calculated = calculateOrderPricing(pricingInput);
			console.log("Calculated pricing:", calculated);
			return calculated;
		} catch (error) {
			console.error("Error calculating pricing:", error);
			return {
				basePrice: 0,
				platformFee: 0,
				subtotal: 0,
				vat: 0,
				total: 0,
				distance: 0,
			};
		}
	}, [orderData, transportType, storedPricing]);

	// Memoized selected method
	const selectedMethod = useMemo(() => {
		if (!selectedPaymentMethod) return null;
		return PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod) || null;
	}, [selectedPaymentMethod]);

	// Handle payment method selection
	const handlePaymentMethodSelect = (methodId: PaymentMethodId) => {
		setSelectedPaymentMethod(methodId);
	};

	// Handle confirm and pay
	const handleConfirmAndPay = async () => {
		if (!selectedPaymentMethod) return;

		setIsProcessing(true);
		
		// Store pricing data for confirmation page
		if (typeof window !== "undefined") {
			sessionStorage.setItem("orderPricing", JSON.stringify(pricing));
		}
		
		// Simulate payment processing
		await new Promise((resolve) => setTimeout(resolve, 2000));
		
		// Navigate to confirmation page
		router.push(`/pickandorder/${transportType}/order/confirm`);
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
				className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
			>
				<div className="flex flex-col justify-center min-h-[80vh]">
					{/* Header */}
					<motion.div variants={itemVariants} className="mb-6 sm:mb-8 lg:mb-10 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200 dark:border-gray-700">
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
							{isArabic ? "اختر طريقة الدفع" : "Choose Payment Method"}
						</h1>
						<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
							{isArabic
								? "اختر طريقة الدفع المناسبة لإتمام طلبك بأمان وسهولة."
								: "Select your preferred payment method to complete your order securely and easily."}
						</p>
					</motion.div>

					{/* Payment Methods Grid */}
					<motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
						{PAYMENT_METHODS.map((method) => {
							const Icon = method.icon;
							const isSelected = selectedPaymentMethod === method.id;
							
							return (
								<button
									key={method.id}
									type="button"
									onClick={() => handlePaymentMethodSelect(method.id as PaymentMethodId)}
									className={`relative bg-gradient-to-br from-green-50 dark:from-gray-800 to-white dark:to-gray-800 rounded-xl shadow-md border-2 transition-all duration-200 p-6 hover:shadow-lg text-left ${
										isArabic ? "text-right" : "text-left"
									} ${
										isSelected
											? "border-green-600 dark:border-green-500 shadow-lg scale-[1.02]"
											: "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
									}`}
								>
									<div className={`flex items-start gap-4 sm:gap-6 `}>
										{/* Icon */}
										<div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center ${
											isSelected ? "bg-green-200 dark:bg-green-800/50" : ""
										}`}>
											<Icon className={`w-7 h-7 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 ${isSelected ? "text-green-700 dark:text-green-300" : ""}`} />
										</div>
										
										{/* Content */}
										<div className="flex-1 min-w-0">
											<h3 className={`text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 ${
												isSelected ? "text-green-700 dark:text-green-400" : ""
											}`}>
												{isArabic ? method.titleAr : method.titleEn}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
												{isArabic ? method.descriptionAr : method.descriptionEn}
											</p>
										</div>
										
										{/* Checkmark */}
										<div className="flex-shrink-0">
											<div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
												isSelected
													? "bg-green-600 dark:bg-green-500 scale-100"
													: "bg-gray-200 dark:bg-gray-700 scale-0"
											}`}>
												<Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
											</div>
										</div>
									</div>
								</button>
							);
						})}
					</motion.div>

					{/* Pricing Transparency Section */}
					<motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 shadow-md">
						<div className={`flex items-center gap-3 mb-6 `}>
							<Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
							<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
								{isArabic ? "تفاصيل التسعير" : "Pricing Breakdown"}
							</h3>
						</div>
						
						<div className="space-y-3">
							{/* Distance Info */}
							{pricing.distance > 0 && (
								<div className="flex items-center justify-between py-2 bg-blue-50 dark:bg-blue-900/20 px-3 rounded-lg border border-blue-200 dark:border-blue-800">
									<div className="flex items-center gap-2">
										<MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
										<span className="text-sm font-medium text-blue-700 dark:text-blue-300">
											{isArabic ? "المسافة الإجمالية:" : "Total Distance:"}
										</span>
									</div>
									<span className="text-sm font-bold text-blue-700 dark:text-blue-300">
										{formatDistance(pricing.distance, isArabic)}
									</span>
								</div>
							)}

							{/* Base Delivery Price */}
							<div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									{isArabic ? "سعر التوصيل الأساسي:" : "Base Delivery Price:"}
								</span>
								<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									{formatPrice(pricing.basePrice, isArabic)}
								</span>
							</div>

							{/* Platform Fee */}
							<div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
								<div className={`flex items-center gap-2 `}>
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
							<div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									{isArabic ? "المجموع الفرعي:" : "Subtotal:"}
								</span>
								<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									{formatPrice(pricing.subtotal, isArabic)}
								</span>
							</div>

							{/* VAT */}
							<div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
								<div className={`flex items-center gap-2 `}>
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
							<div className="flex items-center justify-between pt-3">
								<span className="text-lg font-bold text-gray-900 dark:text-gray-100">
									{isArabic ? "المجموع الكلي:" : "Total Amount:"}
								</span>
								<span className="text-xl font-bold text-green-600 dark:text-green-400">
									{formatPrice(pricing.total, isArabic)}
								</span>
							</div>
						</div>

						{/* Trust Message */}
						<div className={`mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 ${isArabic ? "text-right" : "text-left"}`}>
							<p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
								{isArabic
									? "نحن ملتزمون بالشفافية الكاملة في التسعير. جميع الرسوم معروضة بوضوح."
									: "We are committed to full pricing transparency. All fees are clearly displayed."}
							</p>
						</div>
					</motion.div>

					{/* Security Info Box */}
					<motion.div variants={itemVariants} className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-8 flex items-start gap-3 ${
						isArabic ? "text-right flex-row-reverse" : "text-left"
					}`}>
						<Lock className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
						<p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
							{isArabic
								? "جميع طرق الدفع آمنة ومشفرة. لا نقوم بتخزين بيانات بطاقاتك الائتمانية."
								: "All payment methods are secure and encrypted. We do not store your credit card information."}
						</p>
					</motion.div>

					{/* Confirm Button */}
					<motion.button
						variants={itemVariants}
						onClick={handleConfirmAndPay}
						disabled={isProcessing || !selectedPaymentMethod}
						className={`w-full bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 text-white py-4 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
							isArabic ? "flex-row-reverse" : ""
						}`}
					>
						{isProcessing ? (
							<>
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span className="text-base">{isArabic ? "جاري المعالجة..." : "Processing..."}</span>
							</>
						) : (
							<>
								{selectedMethod ? (
									<>
										{selectedPaymentMethod === "card" && <CreditCard className="w-5 h-5" />}
										{selectedPaymentMethod === "cash" && <Wallet className="w-5 h-5" />}
										{selectedPaymentMethod === "apple-pay" && <Wallet2 className="w-5 h-5" />}
										{selectedPaymentMethod === "qaydha-wallet" && <Smartphone className="w-5 h-5" />}
										<span className="text-base">
											{isArabic ? selectedMethod.buttonTextAr : selectedMethod.buttonTextEn}
										</span>
										<ArrowRight className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
									</>
								) : (
									<>
										<Lock className="w-5 h-5" />
										<span className="text-base">
											{isArabic ? "يرجى اختيار طريقة الدفع" : "Please select a payment method"}
										</span>
									</>
								)}
							</>
						)}
					</motion.button>
				</div>
			</motion.div>
		</div>
	);
}


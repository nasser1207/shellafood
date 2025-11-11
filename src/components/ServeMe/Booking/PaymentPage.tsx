"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooking } from "@/contexts/BookingContext";
import StepperNavigation from "@/components/ServeMe/Booking/StepperNavigation";
import { Smartphone, ArrowRight, Lock, Check, CreditCard, Wallet, Wallet2, Receipt, Info } from "lucide-react";
import { PAYMENT_METHODS, PaymentMethodId } from "./utils/paymentMethods";
import { calculatePricing, formatPrice } from "./utils/pricing";

export default function PaymentPage() {
	const params = useParams();
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const { bookingData, updateBooking } = useBooking();
	const service = params.service as string;
	const serviceType = params.serviceType as string;
	
	const [isProcessing, setIsProcessing] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodId | null>(() => {
		const method = bookingData?.paymentMethod;
		if (method && PAYMENT_METHODS.some(m => m.id === method)) {
			return method as PaymentMethodId;
		}
		return null;
	});

	// Memoized paths
	const summaryPath = useMemo(() => `/serve-me/${service}/${serviceType}/book/summary`, [service, serviceType]);
	const confirmationPath = useMemo(() => `/serve-me/${service}/${serviceType}/book/confirmation`, [service, serviceType]);

	// Redirect if no booking data
	useEffect(() => {
		if (!bookingData || !bookingData.description) {
			router.push(summaryPath);
		}
	}, [bookingData, router, summaryPath]);

	// Memoized pricing breakdown
	const pricing = useMemo(() => {
		const basePrice = bookingData?.unitPrice || 0;
		return calculatePricing(basePrice);
	}, [bookingData?.unitPrice]);

	// Memoized selected method
	const selectedMethod = useMemo(() => 
		PAYMENT_METHODS.find((method) => method.id === selectedPaymentMethod),
		[selectedPaymentMethod]
	);

	// Handlers with useCallback
	const handlePaymentMethodSelect = useCallback((methodId: PaymentMethodId) => {
		setSelectedPaymentMethod(methodId);
	}, []);

	const handleConfirmAndPay = useCallback(async () => {
		if (!selectedPaymentMethod) return;

		setIsProcessing(true);
		updateBooking({ 
			paymentMethod: selectedPaymentMethod as "card" | "apple-pay" | "cash" | "qaydha-wallet"
		});

		// Generate booking ID immediately
		const bookingId = `BK-${Date.now()}`;
		updateBooking({ bookingId });

		// Prefetch confirmation page for instant navigation
		router.prefetch(confirmationPath);

		// Minimal delay for UX feedback
		await new Promise((resolve) => setTimeout(resolve, 200));

		setIsProcessing(false);
		router.push(confirmationPath);
	}, [selectedPaymentMethod, updateBooking, router, confirmationPath]);

	if (!bookingData || !bookingData.description) {
		return null;
	}

	return (
		<div className={`min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-gray-800/50 to-white dark:to-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			<StepperNavigation service={service} serviceType={serviceType} />

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				<div className="flex flex-col justify-center min-h-[80vh]">
					{/* Header */}
					<div className="mb-6 sm:mb-8 lg:mb-10 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200 dark:border-gray-700">
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
							{isArabic ? "اختر طريقة الدفع" : "Choose Payment Method"}
						</h1>
						<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
							{isArabic
								? "اختر طريقة الدفع المناسبة لإتمام طلبك بأمان وسهولة."
								: "Select your preferred payment method to complete your booking securely and easily."}
						</p>
					</div>

					{/* Payment Methods Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
						{PAYMENT_METHODS.map((method) => {
							const Icon = method.icon;
							const isSelected = selectedPaymentMethod === method.id;
							
							return (
								<button
									key={method.id}
									type="button"
									onClick={() => handlePaymentMethodSelect(method.id as PaymentMethodId)}
									tabIndex={0}
									aria-label={isArabic ? method.titleAr : method.titleEn}
									aria-pressed={isSelected}
									className={`relative bg-gradient-to-br from-green-50 dark:from-gray-800 to-white dark:to-gray-800 rounded-xl shadow-md border-2 transition-all duration-200 p-6 hover:shadow-lg touch-manipulation text-left ${
										isArabic ? "text-right" : "text-left"
									} ${
										isSelected
											? "border-green-600 dark:border-green-500 shadow-lg scale-[1.02]"
											: "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
									}`}
									dir={isArabic ? "rtl" : "ltr"}
								>
									<div className="flex items-start gap-4 sm:gap-6">
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
					</div>

					{/* Pricing Transparency Section */}
					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 shadow-md">
						<div className="flex items-center gap-3 mb-6">
							<Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
							<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
								{isArabic ? "تفاصيل التسعير" : "Pricing Breakdown"}
							</h3>
						</div>
						
						<div className="space-y-3">
							{/* Base Worker Price */}
							<div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									{isArabic ? "سعر الفني الأساسي:" : "Base Worker Price:"}
								</span>
								<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									{formatPrice(pricing.basePrice, isArabic)}
								</span>
							</div>

							{/* Platform Fee */}
							<div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
								<div className="flex items-center gap-2">
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
								<div className="flex items-center gap-2">
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
					</div>

					{/* Security Info Box */}
					<div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-8 flex items-start gap-3 ${
						isArabic ? "text-right" : "text-left"
					}`}>
						<Lock className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
						<p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
							{isArabic
								? "جميع طرق الدفع آمنة ومشفرة. لا نقوم بتخزين بيانات بطاقاتك الائتمانية."
								: "All payment methods are secure and encrypted. We do not store your credit card information."}
						</p>
					</div>

					{/* Confirm Button */}
					<button
						onClick={handleConfirmAndPay}
						disabled={isProcessing || !selectedPaymentMethod}
						className={`w-full bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 text-white py-4 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:shadow-none touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
							isArabic ? "flex-row-reverse" : ""
						}`}
						aria-label={isArabic 
							? (selectedMethod ? selectedMethod.buttonTextAr : "اختر طريقة الدفع")
							: (selectedMethod ? selectedMethod.buttonTextEn : "Select a payment method")
						}
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
					</button>
				</div>
			</div>
		</div>
	);
}

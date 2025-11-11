"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooking } from "@/contexts/BookingContext";
import StepperNavigation from "@/components/ServeMe/Booking/StepperNavigation";
import { RatingModal } from "./modals";
import { CheckCircle, Calendar, ArrowLeft, Receipt, MapPin, FileText, Phone, UserCircle, Users, Package, Star, Info } from "lucide-react";
import Image from "next/image";
import { calculatePricing, formatPrice } from "./utils/pricing";

export default function ConfirmationPage() {
	const params = useParams();
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const { bookingData, resetBooking } = useBooking();
	const service = params.service as string;
	const serviceType = params.serviceType as string;
	const [showRatingModal, setShowRatingModal] = useState(false);

	// Memoized paths
	const detailsPath = useMemo(() => `/serve-me/${service}/${serviceType}/book/details`, [service, serviceType]);
	const serveMePath = useMemo(() => "/serve-me", []);

	// Redirect if no booking data
	useEffect(() => {
		if (!bookingData || !bookingData.bookingId) {
			router.prefetch(detailsPath);
			router.push(detailsPath);
		}
	}, [bookingData, router, detailsPath]);

	// Auto-open rating modal when confirmation page loads
	useEffect(() => {
		if (bookingData?.bookingId && !showRatingModal) {
			const timer = setTimeout(() => {
				setShowRatingModal(true);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [bookingData?.bookingId]);

	// Memoized pricing breakdown
	const pricing = useMemo(() => {
		const basePrice = bookingData?.unitPrice || 0;
		return calculatePricing(basePrice);
	}, [bookingData?.unitPrice]);

	// Memoized formatted date
	const formattedDate = useMemo(() => {
		if (!bookingData?.date) return null;
		return new Date(bookingData.date).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}, [bookingData?.date, isArabic]);

	// Handlers with useCallback
	const handleBackToHome = useCallback(() => {
		resetBooking();
		router.prefetch(serveMePath);
		router.push(serveMePath);
	}, [resetBooking, router, serveMePath]);

	const handleRatingSubmit = useCallback(async (rating: number, feedback: string) => {
		// Here you would typically send the rating to your API
		console.log("Rating submitted:", { rating, feedback, bookingId: bookingData?.bookingId });
		// Simulate API call (minimal delay)
		await new Promise((resolve) => setTimeout(resolve, 300));
	}, [bookingData?.bookingId]);

	const handleCloseRatingModal = useCallback(() => {
		setShowRatingModal(false);
	}, []);

	if (!bookingData || !bookingData.bookingId) {
		return null;
	}

	return (
		<div className={`min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-gray-800/50 to-white dark:to-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			<StepperNavigation service={service} serviceType={serviceType} />

			<div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
				{/* Success Animation */}
				<div className="flex justify-center mb-8">
					<div className="relative">
						<div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shadow-lg">
							<CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" strokeWidth={2.5} />
						</div>
						<div className="absolute inset-0 bg-green-200 dark:bg-green-700 rounded-full animate-ping opacity-20"></div>
					</div>
				</div>

				{/* Unified Confirmation Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
					{/* Header Section */}
					<div className="bg-gradient-to-r from-green-50 dark:from-green-900/20 to-emerald-50 dark:to-emerald-900/20 px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-gray-700">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
							{isArabic ? "تم تأكيد الحجز ✅" : "Booking Confirmed ✅"}
						</h1>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
							{isArabic
								? "شكراً لك! تم تأكيد حجزك بنجاح."
								: "Thank you! Your booking has been confirmed successfully."}
						</p>
					</div>

					{/* Content Section */}
					<div className="p-6 sm:p-8 space-y-6">
						{/* Booking Details */}
						<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
								<Receipt className="w-5 h-5 text-green-600 dark:text-green-400" />
								{isArabic ? "تفاصيل الحجز" : "Booking Details"}
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "رقم الحجز:" : "Booking ID:"}</span>
									<span className="font-semibold text-gray-900 dark:text-gray-100">{bookingData.bookingId}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "الخدمة:" : "Service:"}</span>
									<span className="font-semibold text-gray-900 dark:text-gray-100 text-right max-w-[60%]">
										{isArabic ? bookingData.serviceNameAr : bookingData.serviceName}
									</span>
								</div>
								{bookingData.date && formattedDate && (
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
											<Calendar className="w-4 h-4" />
											{isArabic ? "التاريخ:" : "Date:"}
										</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">
											{formattedDate}
										</span>
									</div>
								)}
								{bookingData.time && (
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
											<Calendar className="w-4 h-4" />
											{isArabic ? "الوقت:" : "Time:"}
										</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">{bookingData.time}</span>
									</div>
								)}
							</div>
						</section>

						{/* Address */}
						{bookingData.address && (
							<section className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-700">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
									<MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
									{isArabic ? "عنوان الخدمة" : "Service Address"}
								</h2>
								<div className={`space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
									<p className="text-base text-gray-900 dark:text-gray-100 font-medium">{bookingData.address.title}</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">{bookingData.address.address}</p>
									{bookingData.address.details && (
										<p className="text-xs text-gray-500 dark:text-gray-500">{bookingData.address.details}</p>
									)}
									{bookingData.address.phone && (
										<div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
											<Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
											<span className="text-sm text-gray-600 dark:text-gray-400">{bookingData.address.phone}</span>
										</div>
									)}
								</div>
							</section>
						)}

						{/* Client Info */}
						<section className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-700">
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
								<UserCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
								{isArabic ? "معلومات العميل" : "Client Information"}
							</h2>
							<div className={`space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
								<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
									<Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
									<span>
										{isArabic ? "الاسم:" : "Name:"} <span className="font-semibold text-gray-900 dark:text-gray-100">{bookingData.address?.title || (isArabic ? "مستخدم" : "User")}</span>
									</span>
								</div>
								{bookingData.address?.phone && (
									<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
										<Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
										<span>
											{isArabic ? "الهاتف:" : "Phone:"} <span className="font-semibold text-gray-900 dark:text-gray-100">{bookingData.address.phone}</span>
										</span>
									</div>
								)}
							</div>
						</section>

						{/* Notes */}
						{bookingData.notes && (
							<section className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-700">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
									<FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
									{isArabic ? "ملاحظات" : "Notes"}
								</h2>
								<div className={`${isArabic ? "text-right" : "text-left"}`}>
									<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{bookingData.notes}</p>
								</div>
							</section>
						)}

						{/* Worker Assignment - Display only if worker is assigned */}
						{bookingData.worker && (
							<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
								<div className="flex items-center gap-2 mb-4">
									<Users className="w-5 h-5 text-green-600 dark:text-green-400" />
									<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{isArabic ? "العامل المكلف" : "Assigned Worker"}</h2>
								</div>
								<div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
									<Image
										src={bookingData.worker.avatar}
										alt={bookingData.worker.name}
										width={60}
										height={60}
										className="w-15 h-15 rounded-full object-cover"
										loading="lazy"
									/>
									<div className={`flex-1 ${isArabic ? "text-right" : "text-left"}`}>
										<h4 className="font-semibold text-gray-900 dark:text-gray-100">{bookingData.worker.name}</h4>
										<div className="flex items-center gap-1 mt-1">
											<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
											<span className="text-sm text-gray-600 dark:text-gray-400">{bookingData.worker.rating}</span>
										</div>
									</div>
								</div>
							</section>
						)}

						{/* Pricing Breakdown Section */}
						<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
							<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
								<Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
								{isArabic ? "تفاصيل التسعير" : "Pricing Breakdown"}
							</h2>
							<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
								{/* Base Worker Price */}
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										{isArabic ? "سعر الفني الأساسي:" : "Base Worker Price:"}
									</span>
									<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										{formatPrice(pricing.basePrice, isArabic)}
									</span>
								</div>

								{/* Platform Fee */}
								<div className="flex items-center justify-between">
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
								onClick={() => router.push("/my-orders")}
								className={`w-full bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
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
							className={`w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 ${isArabic ? "flex-row-reverse" : ""}`}
						>
							<ArrowLeft className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
							<span>{isArabic ? "العودة للرئيسية" : "Back to Home"}</span>
						</button>
					</div>
				</div>
			</div>

			{/* Rating Modal */}
			<RatingModal
				isOpen={showRatingModal}
				onClose={handleCloseRatingModal}
				onSubmit={handleRatingSubmit}
				language={language}
				serviceName={isArabic ? bookingData.serviceNameAr : bookingData.serviceName}
			/>
		</div>
	);
}

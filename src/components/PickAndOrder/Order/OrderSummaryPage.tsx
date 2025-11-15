"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Edit2, MapPin, UserCircle, Phone, Truck } from "lucide-react";
import { ANIMATION_VARIANTS } from "../constants";
import { getFlexDirection, getTextAlign } from "../utils/rtl";

interface OrderSummaryPageProps {
	transportType: string;
}

export default React.memo(function OrderSummaryPage({ transportType }: OrderSummaryPageProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMotorbike = transportType === "motorbike";

	// Mock data - in real app, this would come from context or props
	const senderData = useMemo(
		() => ({
			name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
			address: isArabic ? "شارع الملك فهد، حي النخيل، الرياض" : "King Fahd Street, Al-Nakheel District, Riyadh",
			phone: "+966 50 123 4567",
		}),
		[isArabic]
	);

	const receiverData = useMemo(
		() => ({
			name: isArabic ? "فاطمة علي" : "Fatima Ali",
			address: isArabic ? "شارع الأمير سلطان، حي الورود، الرياض" : "Prince Sultan Street, Al-Worood District, Riyadh",
			phone: "+966 50 987 6543",
		}),
		[isArabic]
	);

	// Distance and delivery fee
	const distance = useMemo(() => "10.75", []);
	const deliveryFee = useMemo(() => {
		return isMotorbike ? 9 : 25;
	}, [isMotorbike]);

	// Memoized handlers
	const handleEdit = useCallback(() => {
		router.push(`/pickandorder/${transportType}/order/details`);
	}, [router, transportType]);

	const handleProceed = useCallback(() => {
		router.push(`/pickandorder/${transportType}/order/payment`);
	}, [router, transportType]);

	// Use shared animation variants
	const containerVariants = ANIMATION_VARIANTS.container;
	const itemVariants = ANIMATION_VARIANTS.item;

	return (
		<div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-gray-800/50 to-white dark:to-gray-900 py-8 md:py-12 lg:py-16">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="space-y-6"
				>
					{/* Top Action Bar - Green rounded input-like container */}
					<motion.div variants={itemVariants}>
						<div className="bg-[#31A342] rounded-xl p-4 shadow-md" role="banner" aria-label={isArabic ? "ملخص الطلب" : "Order Summary"}>
							<div className={`flex items-center gap-3 ${getFlexDirection(isArabic)}`}>
								<div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-2">
									<ArrowRight className={`h-5 w-5 text-white ${isArabic ? "rotate-180" : ""}`} aria-hidden="true" />
									<span className="text-white text-sm font-medium">
										{isArabic ? "ملخص الطلب" : "Order Summary"}
									</span>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Sender & Receiver Cards - Side by Side */}
					<motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6" role="region" aria-label={isArabic ? "معلومات المرسل والمتلقي" : "Sender and Receiver Information"}>
						{/* Sender Card */}
						<article className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
							<div className={`flex items-center gap-3 mb-6 ${getFlexDirection(isArabic)}`}>
								<div className="w-12 h-12 rounded-xl bg-[#31A342]/10 dark:bg-[#31A342]/20 flex items-center justify-center">
									<UserCircle className="h-6 w-6 text-[#31A342]" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
									{isArabic ? "معلومات المرسل" : "Sender Information"}
								</h3>
							</div>
							<div className="space-y-4">
								{/* Name */}
								<div className={`flex items-start gap-3 ${getFlexDirection(isArabic)} ${getTextAlign(isArabic)}`}>
									<UserCircle className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
									<div className="flex-1">
										<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
											{isArabic ? "الاسم" : "Name"}
										</p>
										<p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
											{senderData.name}
										</p>
									</div>
								</div>
								{/* Address */}
								<div className={`flex items-start gap-3 ${getFlexDirection(isArabic)} ${getTextAlign(isArabic)}`}>
									<MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
									<div className="flex-1">
										<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
											{isArabic ? "العنوان" : "Address"}
										</p>
										<p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
											{senderData.address}
										</p>
									</div>
								</div>
								{/* Phone */}
								<div className={`flex items-start gap-3 ${getFlexDirection(isArabic)} ${getTextAlign(isArabic)}`}>
									<Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
									<div className="flex-1">
										<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
											{isArabic ? "الهاتف" : "Phone"}
										</p>
										<a href={`tel:${senderData.phone}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-[#31A342] transition-colors">
											{senderData.phone}
										</a>
									</div>
								</div>
							</div>
						</article>

						{/* Receiver Card */}
						<article className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
							<div className={`flex items-center gap-3 mb-6 ${getFlexDirection(isArabic)}`}>
								<div className="w-12 h-12 rounded-xl bg-[#31A342]/10 dark:bg-[#31A342]/20 flex items-center justify-center">
									<UserCircle className="h-6 w-6 text-[#31A342]" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
									{isArabic ? "معلومات المتلقي" : "Receiver Information"}
								</h3>
							</div>
							<div className="space-y-4">
								{/* Name */}
								<div className={`flex items-start gap-3 ${getFlexDirection(isArabic)} ${getTextAlign(isArabic)}`}>
									<UserCircle className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
									<div className="flex-1">
										<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
											{isArabic ? "الاسم" : "Name"}
										</p>
										<p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
											{receiverData.name}
										</p>
									</div>
								</div>
								{/* Address */}
								<div className={`flex items-start gap-3 ${getFlexDirection(isArabic)} ${getTextAlign(isArabic)}`}>
									<MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
									<div className="flex-1">
										<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
											{isArabic ? "العنوان" : "Address"}
										</p>
										<p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
											{receiverData.address}
										</p>
									</div>
								</div>
								{/* Phone */}
								<div className={`flex items-start gap-3 ${getFlexDirection(isArabic)} ${getTextAlign(isArabic)}`}>
									<Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
									<div className="flex-1">
										<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
											{isArabic ? "الهاتف" : "Phone"}
										</p>
										<a href={`tel:${receiverData.phone}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-[#31A342] transition-colors">
											{receiverData.phone}
										</a>
									</div>
								</div>
							</div>
						</article>
					</motion.div>

					{/* Distance and Delivery Fee Row */}
					<motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6" role="region" aria-label={isArabic ? "المسافة ورسوم التوصيل" : "Distance and Delivery Fee"}>
						{/* Distance Box */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
							<div className={`flex items-center gap-4 ${getFlexDirection(isArabic)} ${getTextAlign(isArabic)}`}>
								<div className="w-14 h-14 rounded-xl bg-[#31A342]/10 dark:bg-[#31A342]/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
									<MapPin className="h-7 w-7 text-[#31A342]" />
								</div>
								<div className="flex-1">
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
										{isArabic ? "المسافة" : "Distance"}
									</p>
									<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
										{distance} {isArabic ? "كم" : "KM"}
									</p>
								</div>
							</div>
						</div>

						{/* Delivery Fee Box */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
							<div className={`flex items-center gap-4 ${getFlexDirection(isArabic)} ${getTextAlign(isArabic)}`}>
								<div className="w-14 h-14 rounded-xl bg-[#31A342]/10 dark:bg-[#31A342]/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
									<Truck className="h-7 w-7 text-[#31A342]" />
								</div>
								<div className="flex-1">
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
										{isArabic ? "رسوم التوصيل" : "Delivery Fee"}
									</p>
									<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
										{deliveryFee} {isArabic ? "ريال" : "SAR"}
									</p>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Fee Info Notice */}
					<motion.div variants={itemVariants}>
						<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4" role="alert" aria-live="polite">
							<p className={`text-sm text-green-800 dark:text-green-300 ${getTextAlign(isArabic)}`}>
								{isArabic
									? "يتم دفع الرسوم في الخطوة التالية"
									: "You will complete payment in the next step."}
							</p>
						</div>
					</motion.div>

					{/* Action Buttons */}
					<motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4" role="group" aria-label={isArabic ? "أزرار الإجراءات" : "Action buttons"}>
						{/* Back/Edit Order Button */}
						<motion.button
							onClick={handleEdit}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className={`flex-1 flex items-center justify-center gap-2 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 ${getFlexDirection(isArabic)}`}
							aria-label={isArabic ? "تعديل الطلب" : "Edit Order"}
						>
							<Edit2 className="h-5 w-5" aria-hidden="true" />
							<span>{isArabic ? "تعديل الطلب" : "Edit Order"}</span>
						</motion.button>

						{/* Proceed to Payment Button */}
						<motion.button
							onClick={handleProceed}
							whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(49, 163, 66, 0.3)" }}
							whileTap={{ scale: 0.98 }}
							className={`flex-1 flex items-center justify-center gap-2 py-4 bg-[#31A342] hover:bg-[#2a8f38] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#31A342] focus:ring-offset-2 ${getFlexDirection(isArabic)}`}
							aria-label={isArabic ? "المتابعة إلى الدفع" : "Proceed to Payment"}
						>
							<span>{isArabic ? "المتابعة إلى الدفع" : "Proceed to Payment"}</span>
							<ArrowRight className={`h-5 w-5 ${isArabic ? "rotate-180" : ""}`} aria-hidden="true" />
						</motion.button>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
});

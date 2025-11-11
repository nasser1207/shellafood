"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, MapPin, Clock, Package, Store, User } from "lucide-react";
import StatusAnimation from "./StatusAnimation";

interface ConfirmationCardProps {
	language: "en" | "ar";
	orderId: string;
	type: "service" | "product";
	status: "success" | "pending" | "failed";
	paymentMethod: string;
	totalAmount: number;
	currency?: string;
	eta?: string;
	address?: string;
	storeOrProvider?: string;
	createdAt?: string;
}

export default function ConfirmationCard({
	language,
	orderId,
	type,
	status,
	paymentMethod,
	totalAmount,
	currency = "SAR",
	eta,
	address,
	storeOrProvider,
	createdAt,
}: ConfirmationCardProps) {
	const isArabic = language === "ar";

	const getStatusTitle = () => {
		if (status === "success") {
			return isArabic ? "تم تأكيد طلبك!" : "Your order has been confirmed!";
		}
		if (status === "pending") {
			return isArabic ? "جاري التحقق من الدفع..." : "We're verifying your payment...";
		}
		return isArabic ? "حدث خطأ" : "Something went wrong";
	};

	const getStatusSubtitle = () => {
		if (status === "success") {
			if (type === "service") {
				return isArabic
					? eta
						? `سيصل الفني في ${new Date(eta).toLocaleDateString(isArabic ? "ar-SA" : "en-US", { dateStyle: "long" })}`
						: "سيتم إبلاغك بموعد وصول الفني قريباً"
					: eta
						? `Your technician will arrive on ${new Date(eta).toLocaleDateString("en-US", { dateStyle: "long" })}`
						: "You'll be notified of the technician's arrival time soon";
			} else {
				return isArabic
					? "توصيلك قيد التنفيذ وسيصل خلال 25 دقيقة"
					: "Your delivery is on its way and will arrive within 25 minutes";
			}
		}
		if (status === "pending") {
			return isArabic
				? "يرجى الانتظار حتى نتحقق من عملية الدفع"
				: "Please wait while we verify your payment";
		}
		return isArabic
			? "يرجى الاتصال بالدعم للمساعدة"
			: "Please contact support for assistance";
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="bg-white dark:bg-[#1B1D22] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8"
		>
			{/* Header with Animation */}
			<div className="flex flex-col items-center text-center mb-6">
				<StatusAnimation status={status} size="lg" />
				<motion.h1
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className={`text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-6 mb-2 ${isArabic ? "text-right" : "text-left"}`}
				>
					{getStatusTitle()}
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className={`text-base sm:text-lg text-gray-600 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}
				>
					{getStatusSubtitle()}
				</motion.p>
			</div>

			{/* Order Summary */}
			<div className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-6">
				{/* Order Number */}
				<div className={`flex items-center justify-between `}>
					<div className={`flex items-center gap-3 `}>
						<div className="w-10 h-10 rounded-lg bg-[#10b981]/10 dark:bg-[#10b981]/20 flex items-center justify-center">
							<Package className="w-5 h-5 text-[#10b981]" />
						</div>
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">{isArabic ? "رقم الطلب:" : "Order Number:"}</p>
							<p className="font-bold text-gray-900 dark:text-white">{orderId}</p>
						</div>
					</div>
					<span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold">
						{isArabic ? (type === "service" ? "حجز خدمة" : "طلب منتج") : type === "service" ? "Service" : "Product"}
					</span>
				</div>

				{/* Payment Method */}
				<div className={`flex items-center gap-3 `}>
					<div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
						<CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
					</div>
					<div className="flex-1">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{isArabic ? "طريقة الدفع:" : "Payment Method:"}
						</p>
						<p className="font-semibold text-gray-900 dark:text-white">{paymentMethod}</p>
					</div>
					<p className="text-lg font-bold text-[#10b981]">
						{totalAmount.toFixed(2)} {currency}
					</p>
				</div>

				{/* ETA or Appointment Time */}
				{eta && (
					<div className={`flex items-center gap-3 `}>
						<div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
							<Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
						</div>
						<div className="flex-1">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{isArabic
									? type === "service"
										? "موعد الخدمة:"
										: "وقت التوصيل المتوقع:"
									: type === "service"
										? "Service Time:"
										: "Estimated Delivery:"}
							</p>
							<p className="font-semibold text-gray-900 dark:text-white">
								{new Date(eta).toLocaleString(isArabic ? "ar-SA" : "en-US", {
									dateStyle: "long",
									timeStyle: "short",
								})}
							</p>
						</div>
					</div>
				)}

				{/* Address */}
				{address && (
					<div className={`flex items-start gap-3 `}>
						<div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
							<MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
								{isArabic ? (type === "service" ? "عنوان الخدمة:" : "عنوان التوصيل:") : type === "service" ? "Service Address:" : "Delivery Address:"}
							</p>
							<p className="font-semibold text-gray-900 dark:text-white break-words">{address}</p>
						</div>
					</div>
				)}

				{/* Store or Provider */}
				{storeOrProvider && (
					<div className={`flex items-center gap-3 `}>
						<div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
							{type === "service" ? (
								<User className="w-5 h-5 text-green-600 dark:text-green-400" />
							) : (
								<Store className="w-5 h-5 text-green-600 dark:text-green-400" />
							)}
						</div>
						<div className="flex-1">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{isArabic ? (type === "service" ? "مقدم الخدمة:" : "المتجر:") : type === "service" ? "Service Provider:" : "Store:"}
							</p>
							<p className="font-semibold text-gray-900 dark:text-white">{storeOrProvider}</p>
						</div>
					</div>
				)}
			</div>
		</motion.div>
	);
}


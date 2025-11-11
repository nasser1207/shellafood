"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, Wrench, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface OrderHeaderProps {
	language: "en" | "ar";
	orderId: string;
	type: "product" | "service";
	status: string;
	eta?: string;
	scheduledTime?: string;
}

export default function OrderHeader({
	language,
	orderId,
	type,
	status,
	eta,
	scheduledTime,
}: OrderHeaderProps) {
	const isArabic = language === "ar";

	const getTypeLabel = () => {
		if (type === "service") {
			return isArabic ? "حجز خدمة" : "Service Request";
		}
		return isArabic ? "طلب منتج" : "Product Order";
	};

	const getTimeDisplay = () => {
		if (eta) {
			const etaDate = new Date(eta);
			const now = new Date();
			const diffMinutes = Math.ceil((etaDate.getTime() - now.getTime()) / (1000 * 60));
			
			if (diffMinutes > 0) {
				return isArabic 
					? `الوصول خلال ${diffMinutes} ${diffMinutes === 1 ? "دقيقة" : "دقائق"}`
					: `ETA: ${diffMinutes} ${diffMinutes === 1 ? "min" : "mins"}`;
			}
		}
		
		if (scheduledTime) {
			const scheduled = new Date(scheduledTime);
			return isArabic
				? `مجدول: ${scheduled.toLocaleDateString("ar-SA", { dateStyle: "long" })} | ${scheduled.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}`
				: `Scheduled: ${scheduled.toLocaleDateString("en-US", { dateStyle: "long" })} | ${scheduled.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
		}

		return null;
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-[#1B1D22] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6 mb-6"
		>
			<div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isArabic ? "sm:flex-row-reverse" : ""}`}>
				{/* Left/Right Section: Order Info */}
				<div className={`flex items-start gap-4 flex-1 ${isArabic ? "flex-row-reverse" : ""}`}>
					{/* Icon */}
					<div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
						type === "service" 
							? "bg-orange-100 dark:bg-orange-900/30" 
							: "bg-blue-100 dark:bg-blue-900/30"
					}`}>
						{type === "service" ? (
							<Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />
						) : (
							<Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						)}
					</div>

					{/* Order Details */}
					<div className="flex-1 min-w-0">
						<div className={`flex items-center gap-3 mb-2 flex-wrap ${isArabic ? "flex-row-reverse" : ""}`}>
							<h1 className={`text-xl sm:text-2xl font-bold text-gray-900 dark:text-white ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "تتبع الطلب" : "Track Order"}
							</h1>
							<StatusBadge status={status} language={language} />
						</div>
						<div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 ${isArabic ? "sm:flex-row-reverse" : ""}`}>
							<p className={`text-sm text-gray-600 dark:text-gray-400 ${isArabic ? "text-right" : "text-left"}`}>
								<span className="font-semibold">{isArabic ? "رقم الطلب:" : "Order #:"}</span> {orderId}
							</p>
							<span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
							<span className={`px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold ${isArabic ? "text-right" : "text-left"}`}>
								{getTypeLabel()}
							</span>
						</div>
					</div>
				</div>

				{/* Right/Left Section: Time Info */}
				{getTimeDisplay() && (
					<div className={`flex items-center gap-2 px-4 py-2.5 bg-[#10b981]/10 dark:bg-[#10b981]/20 border border-[#10b981]/30 rounded-lg ${isArabic ? "flex-row-reverse" : ""}`}>
						<Clock className="w-5 h-5 text-[#10b981] flex-shrink-0" />
						<p className="text-sm font-semibold text-[#10b981]">
							{getTimeDisplay()}
						</p>
					</div>
				)}
			</div>
		</motion.div>
	);
}


"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Star, MapPin, Wrench, Clock, User, MessageCircle, AlertCircle, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RatingModal } from "@/components/ServeMe/Booking/modals";
import { OrderStatusBadge } from "../../shared/OrderStatusBadge";
import { PaymentStatusBadge } from "../../shared/PaymentStatusBadge";
import { cn } from "@/lib/utils";

interface ServiceRequest {
	id: string;
	requestNumber: string;
	serviceName: string;
	serviceNameAr?: string;
	serviceImage?: string;
	status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
	workerId?: string;
	workerName?: string;
	workerPhoto?: string;
	address?: string;
	preferredDate?: string;
	preferredTime?: string;
	urgency: "normal" | "urgent" | "emergency";
	paymentMethod?: string;
	paymentStatus?: "paid" | "pending" | "failed";
	totalAmount: number;
	createdAt: string;
	hasImages?: boolean;
}

interface ServiceOrderCardProps {
	request: ServiceRequest;
	onServiceClick?: (serviceId: string) => void;
	hasExistingRating?: boolean;
}

function getStatusGradient(status: string): string {
	const gradients: Record<string, string> = {
		pending: "from-yellow-500 to-orange-500",
		assigned: "from-blue-500 to-cyan-500",
		in_progress: "from-purple-500 to-pink-500",
		completed: "from-green-500 to-emerald-500",
		cancelled: "from-red-500 to-pink-500",
	};
	return gradients[status] || gradients.pending;
}

function getUrgencyColor(urgency: string): string {
	const colors: Record<string, string> = {
		normal: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
		urgent: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
		emergency: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
	};
	return colors[urgency] || colors.normal;
}

function formatDate(dateString: string, isArabic: boolean): string {
	const date = new Date(dateString);
	return date.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function ServiceOrderCard({
	request,
	onServiceClick,
	hasExistingRating = false,
}: ServiceOrderCardProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [showRating, setShowRating] = useState(false);

	const canRate = request.status === "completed" && !hasExistingRating;
	const canChat = (request.status === "in_progress" || request.status === "completed") && request.workerId;

	const handleRatingSubmit = async (rating: number, feedback: string) => {
		console.log("Worker rating submitted:", { requestId: request.id, rating, feedback });
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setShowRating(false);
	};

	const urgencyLabels = {
		normal: { en: "Normal", ar: "عادي" },
		urgent: { en: "Urgent", ar: "عاجل" },
		emergency: { en: "Emergency", ar: "طوارئ" },
	};

	return (
		<>
			<motion.div
				layout
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				className="group"
			>
				<div className="relative bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
					{/* Status Indicator Bar - Top */}
					<div className={cn("h-2 bg-gradient-to-r", getStatusGradient(request.status))} />

					{/* Card Content */}
					<div className="p-4 sm:p-5 md:p-6">
						{/* Header - Service Info & Status */}
						<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-5 gap-3">
							<div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
								{/* Service Image */}
								<div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 border-2 border-gray-200 dark:border-gray-600 shadow-sm">
									{request.serviceImage ? (
										<Image
											src={request.serviceImage}
											alt={isArabic ? request.serviceNameAr || request.serviceName : request.serviceName}
											width={64}
											height={64}
											className="object-cover w-full h-full"
										/>
									) : (
										<Wrench className="w-full h-full p-2 sm:p-3 md:p-4 text-gray-400" />
									)}
								</div>

								{/* Service Name & Request Number */}
								<div className="flex-1 min-w-0">
									<h3
										className={cn(
											"text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate mb-1 cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors",
											isArabic ? "text-right" : "text-left"
										)}
										onClick={() => onServiceClick?.(request.id)}
									>
										{isArabic ? request.serviceNameAr || request.serviceName : request.serviceName}
									</h3>
									<div
										className={cn(
											"flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap",
											isArabic ? "text-right flex-row-reverse" : "text-left"
										)}
									>
										<span className="font-mono font-semibold">#{request.requestNumber}</span>
										<span className="text-gray-400 hidden sm:inline">•</span>
										<time className="whitespace-nowrap text-xs">{formatDate(request.createdAt, isArabic)}</time>
									</div>
								</div>
							</div>

							{/* Status Badge */}
							<div className={cn("flex flex-row sm:flex-col gap-2 flex-shrink-0 self-start sm:self-auto", isArabic ? "sm:mr-auto sm:ml-2" : "sm:ml-auto sm:mr-2")}>
								<OrderStatusBadge status={request.status} type="service" />
								{/* Urgency Badge */}
								<div
									className={cn(
										"px-2 sm:px-2.5 py-1 rounded-md sm:rounded-lg text-xs font-semibold text-center shadow-sm whitespace-nowrap",
										getUrgencyColor(request.urgency)
									)}
								>
									{isArabic ? urgencyLabels[request.urgency].ar : urgencyLabels[request.urgency].en}
								</div>
							</div>
						</div>

						{/* Worker Info */}
						{request.workerName && (
							<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/10 border-2 border-green-200/50 dark:border-green-800/30 mb-4 sm:mb-5 shadow-sm">
								{request.workerPhoto ? (
									<div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-300 dark:border-green-700 shadow-sm">
										<Image
											src={request.workerPhoto}
											alt={request.workerName}
											width={56}
											height={56}
											className="object-cover w-full h-full"
										/>
									</div>
								) : (
									<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 border-2 border-green-300 dark:border-green-700 shadow-sm">
										<User className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
									</div>
								)}
								<div className="flex-1 min-w-0">
									<p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">
										{isArabic ? "الفني المعين" : "Assigned Worker"}
									</p>
									<p
										className={cn(
											"text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate",
											isArabic ? "text-right" : "text-left"
										)}
									>
										{request.workerName}
									</p>
								</div>
							</div>
						)}

						{/* Service Details */}
						<div className="mb-4 sm:mb-5 space-y-2 sm:space-y-2.5">
							{/* Address */}
							{request.address && (
								<div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/30 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50">
									<div className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex-shrink-0">
										<MapPin className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400", isArabic ? "ml-0" : "mr-0")} />
									</div>
									<p className={cn("text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex-1 leading-relaxed", isArabic ? "text-right" : "text-left")}>
										{request.address}
									</p>
								</div>
							)}

							{/* Preferred Date/Time */}
							{request.preferredDate && (
								<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/30 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50">
									<div className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex-shrink-0">
										<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
									</div>
									<div className={cn("flex-1 min-w-0", isArabic ? "text-right" : "text-left")}>
										<p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1 font-medium">
											{isArabic ? "الموعد المفضل" : "Preferred Time"}
										</p>
										<p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white break-words">
											{new Date(request.preferredDate).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
											{request.preferredTime && ` • ${request.preferredTime}`}
										</p>
									</div>
								</div>
							)}

							{/* Images Indicator */}
							{request.hasImages && (
								<div className={cn("flex items-center gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-800/30", isArabic ? "text-right flex-row-reverse" : "text-left")}>
									<div className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex-shrink-0">
										<AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
									</div>
									<span className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-semibold">
										{isArabic ? "يحتوي على صور قبل/بعد" : "Includes before/after images"}
									</span>
								</div>
							)}
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-5" />

						{/* Payment & Total */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900/40 dark:via-gray-800/40 dark:to-gray-800/60 border-2 border-gray-200/50 dark:border-gray-700/50 mb-4 sm:mb-5 shadow-sm">
							{request.paymentMethod ? (
								<div className="flex items-center gap-2 sm:gap-2.5">
									<div className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex-shrink-0">
										<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
									</div>
									<div className="flex flex-col min-w-0">
										<span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
											{isArabic ? "طريقة الدفع" : "Payment"}
										</span>
										<div className="flex items-center gap-2 flex-wrap">
											<span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">{request.paymentMethod}</span>
											{request.paymentStatus && <PaymentStatusBadge status={request.paymentStatus} />}
										</div>
									</div>
								</div>
							) : (
								<div></div>
							)}
							<div className={cn("text-left sm:text-right", isArabic ? "sm:text-left" : "sm:text-right")}>
								<div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{isArabic ? "المجموع" : "Total"}</div>
								<div className="text-xl sm:text-2xl md:text-3xl font-black text-green-600 dark:text-green-400 tracking-tight">
									{request.totalAmount.toFixed(2)} <span className="text-base sm:text-lg">{isArabic ? "ريال" : "SAR"}</span>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
							<Link
								href={"/my-orders/" + request.requestNumber + "/track"}
								className={cn(
									"flex-1 py-3 sm:py-3.5 px-4 sm:px-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg sm:rounded-xl text-center transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 min-h-[44px]",
									isArabic ? "flex-row-reverse" : ""
								)}
							>
								<MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
								<span className="text-sm sm:text-base">{isArabic ? "تتبع الحالة" : "Track Status"}</span>
							</Link>

							{canChat && (
								<Link
									href={"/worker/" + request.workerId + "/chat"}
									className={cn(
										"px-4 sm:px-4 py-3 sm:py-3.5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 text-blue-700 dark:text-blue-400 font-bold rounded-lg sm:rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm hover:shadow-md min-h-[44px]",
										isArabic ? "flex-row-reverse" : ""
									)}
								>
									<MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
									<span className="hidden sm:inline">{isArabic ? "محادثة" : "Chat"}</span>
								</Link>
							)}

							{canRate && (
								<button
									onClick={() => setShowRating(true)}
									className="px-4 sm:px-4 py-3 sm:py-3.5 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-200 dark:border-yellow-800/50 hover:border-yellow-300 dark:hover:border-yellow-700 text-yellow-700 dark:text-yellow-400 font-bold rounded-lg sm:rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md min-h-[44px] min-w-[44px] flex items-center justify-center"
									aria-label={isArabic ? "قيم الفني" : "Rate Worker"}
								>
									<Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
								</button>
							)}
						</div>
					</div>

					{/* Mobile Swipe Actions Indicator */}
					<div className="md:hidden absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
						<ChevronRight className="w-6 h-6 text-gray-400" />
					</div>
				</div>
			</motion.div>

			{/* Rating Modal */}
			{showRating && (
				<RatingModal
					isOpen={showRating}
					onClose={() => setShowRating(false)}
					onSubmit={handleRatingSubmit}
					language={language}
					serviceName={isArabic ? request.serviceNameAr || request.serviceName : request.serviceName}
					driverName={request.workerName}
					driverPhoto={request.workerPhoto}
				/>
			)}
		</>
	);
}


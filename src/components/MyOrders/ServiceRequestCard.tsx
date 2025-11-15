"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
	Clock,
	MapPin,
	CreditCard,
	CheckCircle,
	XCircle,
	Loader2,
	User,
	Star,
	MessageCircle,
	AlertCircle,
	Wrench,
	Eye,
} from "lucide-react";
import { RatingModal } from "@/components/ServeMe/Booking/modals";

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

interface ServiceRequestCardProps {
	request: ServiceRequest;
	language: "en" | "ar";
	onServiceClick?: (serviceId: string) => void;
	hasExistingRating?: boolean;
}

const statusConfig = {
	pending: { color: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600", labelEn: "Pending", labelAr: "قيد الانتظار", icon: Clock },
	assigned: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800", labelEn: "Assigned", labelAr: "تم التعيين", icon: User },
	in_progress: { color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800", labelEn: "In Progress", labelAr: "قيد التنفيذ", icon: Loader2 },
	completed: { color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800", labelEn: "Completed", labelAr: "مكتمل", icon: CheckCircle },
	cancelled: { color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800", labelEn: "Cancelled", labelAr: "ملغى", icon: XCircle },
};

const urgencyConfig = {
	normal: { color: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300", labelEn: "Normal", labelAr: "عادي" },
	urgent: { color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400", labelEn: "Urgent", labelAr: "عاجل" },
	emergency: { color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400", labelEn: "Emergency", labelAr: "طوارئ" },
};

export default function ServiceRequestCard({
	request,
	language,
	onServiceClick,
	hasExistingRating = false,
}: ServiceRequestCardProps) {
	const isArabic = language === "ar";
	const [showRating, setShowRating] = useState(false);

	const status = statusConfig[request.status];
	const StatusIcon = status.icon;
	const urgency = urgencyConfig[request.urgency];
	const canRate = request.status === "completed" && !hasExistingRating;
	const canChat = (request.status === "in_progress" || request.status === "completed") && request.workerId;

	const handleRatingSubmit = async (rating: number, feedback: string) => {
		console.log("Worker rating submitted:", { requestId: request.id, rating, feedback });
		await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				whileHover={{ y: -2 }}
				className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
			>
				{/* Header */}
				<div className={`p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
					<div className={`flex items-start justify-between gap-3 mb-3 `}>
						{/* Service Info */}
						<div className={`flex items-center gap-3 flex-1 min-w-0 `}>
							{request.serviceImage ? (
								<div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-100 dark:border-gray-700">
									<Image
										src={request.serviceImage}
										alt={isArabic ? request.serviceNameAr || request.serviceName : request.serviceName}
										fill
										className="object-cover"
										sizes="56px"
									/>
								</div>
							) : (
								<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
									<Wrench className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
								</div>
							)}
							<div className="flex-1 min-w-0">
								<h3
									className={`font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors ${
										isArabic ? "text-right" : "text-left"
									}`}
									onClick={() => onServiceClick?.(request.id)}
								>
									{isArabic ? request.serviceNameAr || request.serviceName : request.serviceName}
								</h3>
								<p className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "رقم الطلب:" : "Request"} {request.requestNumber}
								</p>
							</div>
						</div>

						{/* Status Badge */}
						<div className={`flex flex-col gap-2 flex-shrink-0 ${isArabic ? "mr-auto ml-3" : "ml-auto mr-3"}`}>
							<div
								className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 ${status.color} shadow-sm`}
							>
								<StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
								<span className="text-xs sm:text-sm font-semibold">
									{isArabic ? status.labelAr : status.labelEn}
								</span>
							</div>
							{/* Urgency Badge */}
							<div
								className={`px-2 py-1 rounded-lg text-xs font-semibold ${urgency.color} ${
									isArabic ? "text-right" : "text-left"
								}`}
							>
								{isArabic ? urgency.labelAr : urgency.labelEn}
							</div>
						</div>
					</div>

					{/* Worker Info */}
					{request.workerName && (
						<div className={`flex items-center gap-2 sm:gap-3 mb-2 `}>
							{request.workerPhoto ? (
								<div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200 dark:border-gray-700">
									<Image
										src={request.workerPhoto}
										alt={request.workerName}
										fill
										className="object-cover"
										sizes="40px"
									/>
								</div>
							) : (
								<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
									<User className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
								</div>
							)}
							<div>
								<p className={`text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "الفني:" : "Worker:"} {request.workerName}
								</p>
							</div>
						</div>
					)}

					{/* Date/Time */}
					<div className={`flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 `}>
						{request.preferredDate && (
							<div className={`flex items-center gap-1.5 `}>
								<Clock className="w-3.5 h-3.5" />
								<span>
									{new Date(request.preferredDate).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}
									{request.preferredTime && ` • ${request.preferredTime}`}
								</span>
							</div>
						)}
						<div className={`flex items-center gap-1.5 `}>
							<Clock className="w-3.5 h-3.5" />
							<span>
								{new Date(request.createdAt).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
									month: "short",
									day: "numeric",
								})}
							</span>
						</div>
					</div>
				</div>

				{/* Body */}
				<div className="p-4 sm:p-5 space-y-3">
					{/* Address */}
					{request.address && (
						<div className={`flex items-start gap-2 `}>
							<MapPin className={`w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0 ${isArabic ? "ml-2" : "mr-2"}`} />
							<p className={`text-sm text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}>{request.address}</p>
						</div>
					)}

					{/* Images Indicator */}
					{request.hasImages && (
						<div className={`flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 `}>
							<AlertCircle className="w-4 h-4" />
							<span>{isArabic ? "يحتوي على صور قبل/بعد" : "Includes before/after images"}</span>
						</div>
					)}

					{/* Payment Info */}
					{request.paymentMethod && (
						<div className={`flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 `}>
							<div className={`flex items-center gap-2 `}>
								<CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
								<span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{request.paymentMethod}</span>
							</div>
							{request.paymentStatus && (
								<span
									className={`text-xs sm:text-sm font-semibold ${
										request.paymentStatus === "paid"
											? "text-green-600 dark:text-green-400"
											: request.paymentStatus === "pending"
												? "text-yellow-600 dark:text-yellow-400"
												: "text-red-600 dark:text-red-400"
									}`}
								>
									{isArabic
										? request.paymentStatus === "paid"
											? "مدفوع"
											: request.paymentStatus === "pending"
												? "قيد الدفع"
												: "فشل الدفع"
										: request.paymentStatus === "paid"
											? "Paid"
											: request.paymentStatus === "pending"
												? "Pending"
												: "Failed"}
								</span>
							)}
						</div>
					)}

					{/* Total */}
					<div className={`flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 `}>
						<span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">{isArabic ? "المجموع:" : "Total:"}</span>
						<span className="text-base sm:text-lg font-extrabold text-[#10b981] dark:text-green-400">
							{request.totalAmount} {isArabic ? "ريال" : "SAR"}
						</span>
					</div>
				</div>

				{/* Footer Actions */}
				<div className={`p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
					<div className={`flex items-center gap-2 sm:gap-3 `}>
						<button
							onClick={() => {
								window.location.href = `/my-orders/${request.requestNumber}/track`;
							}}
							className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 touch-manipulation ${
								isArabic ? "flex-row-reverse" : ""
							}`}
						>
							<Eye className="w-4 h-4" />
							<span>{isArabic ? "تتبع الحالة" : "Track Status"}</span>
						</button>
						{canChat && (
							<button
								onClick={() => {
									window.location.href = `/worker/${request.workerId}/chat`;
								}}
								className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all active:scale-95 ${
									isArabic ? "flex-row-reverse" : ""
								}`}
							>
								<MessageCircle className="w-4 h-4" />
								<span className="hidden sm:inline">{isArabic ? "محادثة" : "Chat"}</span>
							</button>
						)}
						{canRate && (
							<button
								onClick={() => setShowRating(true)}
								className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg font-semibold text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 touch-manipulation ${
									isArabic ? "flex-row-reverse" : ""
								}`}
							>
								<Star className="w-4 h-4" />
								<span>{isArabic ? "قيم الفني" : "Rate Worker"}</span>
							</button>
						)}
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


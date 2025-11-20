"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Star, MapPin, Truck, Bike, Package, Navigation, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RatingModal } from "@/components/ServeMe/Booking/modals";
import { OrderStatusBadge } from "../../shared/OrderStatusBadge";
import { PaymentStatusBadge } from "../../shared/PaymentStatusBadge";
import { cn } from "@/lib/utils";

interface DeliveryOrder {
	id: string;
	orderNumber: string;
	transportType: "motorbike" | "truck";
	status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "completed" | "cancelled";
	createdAt: string;
	senderName: string;
	senderPhone: string;
	senderAddress: string;
	receiverName: string;
	receiverPhone: string;
	receiverAddress: string;
	distance: number; // in km
	deliveryFee: number;
	totalAmount: number;
	paymentMethod: string;
	paymentStatus: "paid" | "pending" | "failed";
	driverName?: string;
	driverPhoto?: string;
	orderType: "one-way" | "multi-direction";
}

interface DeliveryOrderCardProps {
	order: DeliveryOrder;
	onOrderClick?: (orderId: string) => void;
	hasExistingRating?: boolean;
}

function getStatusGradient(status: string): string {
	const gradients: Record<string, string> = {
		pending: "from-yellow-500 to-orange-500",
		assigned: "from-blue-500 to-cyan-500",
		picked_up: "from-yellow-500 to-orange-500",
		in_transit: "from-indigo-500 to-blue-500",
		delivered: "from-green-500 to-emerald-500",
		completed: "from-green-500 to-emerald-500",
		cancelled: "from-red-500 to-pink-500",
	};
	return gradients[status] || gradients.pending;
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

export function DeliveryOrderCard({
	order,
	onOrderClick,
	hasExistingRating = false,
}: DeliveryOrderCardProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [showRating, setShowRating] = useState(false);

	const canRate = order.status === "completed" && !hasExistingRating;
	const TransportIcon = order.transportType === "motorbike" ? Bike : Truck;

	const handleRatingSubmit = async (rating: number, feedback: string) => {
		console.log("Delivery rating submitted:", { orderId: order.id, rating, feedback });
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setShowRating(false);
	};

	const transportLabels = {
		motorbike: { en: "Motorbike Delivery", ar: "توصيل بالدراجة النارية" },
		truck: { en: "Truck Delivery", ar: "توصيل بالشاحنة" },
	};

	const orderTypeLabels = {
		"one-way": { en: "One-Way", ar: "نقل باتجاه واحد" },
		"multi-direction": { en: "Multi-Direction", ar: "نقل باكثر من اتجاه" },
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
					<div className={cn("h-2 bg-gradient-to-r", getStatusGradient(order.status))} />

					{/* Card Content */}
					<div className="p-4 sm:p-5 md:p-6">
						{/* Header - Transport Type & Status */}
						<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-5 gap-3">
							<div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
								{/* Transport Icon */}
								<div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 flex items-center justify-center flex-shrink-0 border-2 border-green-200 dark:border-green-800 shadow-sm">
									<TransportIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
								</div>

								{/* Order Info */}
								<div className="flex-1 min-w-0">
									<h3
										className={cn(
											"text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate mb-1",
											isArabic ? "text-right" : "text-left"
										)}
									>
										{isArabic ? transportLabels[order.transportType].ar : transportLabels[order.transportType].en}
									</h3>
									<div
										className={cn(
											"flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap",
											isArabic ? "text-right flex-row-reverse" : "text-left"
										)}
									>
										<span className="font-mono font-semibold">#{order.orderNumber}</span>
										<span className="text-gray-400 hidden sm:inline">•</span>
										<time className="whitespace-nowrap text-xs">{formatDate(order.createdAt, isArabic)}</time>
									</div>
									{order.orderType && (
										<p className={cn("text-xs text-gray-500 mt-1 font-medium", isArabic ? "text-right" : "text-left")}>
											{isArabic ? orderTypeLabels[order.orderType].ar : orderTypeLabels[order.orderType].en}
										</p>
									)}
								</div>
							</div>

							{/* Status Badge */}
							<div className={cn("flex-shrink-0 self-start sm:self-auto", isArabic ? "sm:mr-auto sm:ml-2" : "sm:ml-auto sm:mr-2")}>
								<OrderStatusBadge status={order.status} type="delivery" />
							</div>
						</div>

						{/* Driver Info */}
						{order.driverName && (
							<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/10 border-2 border-green-200/50 dark:border-green-800/30 mb-4 sm:mb-5 shadow-sm">
								{order.driverPhoto ? (
									<div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-300 dark:border-green-700 shadow-sm">
										<Image
											src={order.driverPhoto}
											alt={order.driverName}
											width={56}
											height={56}
											className="object-cover w-full h-full"
										/>
									</div>
								) : (
									<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 border-2 border-green-300 dark:border-green-700 shadow-sm">
										<Truck className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
									</div>
								)}
								<div className="flex-1 min-w-0">
									<p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">
										{isArabic ? "السائق المعين" : "Assigned Driver"}
									</p>
									<p
										className={cn(
											"text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate",
											isArabic ? "text-right" : "text-left"
										)}
									>
										{order.driverName}
									</p>
								</div>
							</div>
						)}

						{/* Sender & Receiver */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
							{/* Sender */}
							<div className={cn("p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-50/50 to-amber-50/30 dark:from-orange-900/10 dark:to-amber-900/10 border-2 border-orange-200/50 dark:border-orange-800/30 shadow-sm", isArabic ? "text-right" : "text-left")}>
								<div className="flex items-center gap-2 mb-2 sm:mb-3">
									<div className="p-1 sm:p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex-shrink-0">
										<Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400" />
									</div>
									<span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wide">
										{isArabic ? "المرسل" : "Sender"}
									</span>
								</div>
								<p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2 truncate">{order.senderName}</p>
								<div className="flex items-start gap-1.5 sm:gap-2 mt-2">
									<MapPin className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0", isArabic ? "ml-0" : "mr-0")} />
									<p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{order.senderAddress}</p>
								</div>
							</div>

							{/* Receiver */}
							<div className={cn("p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/10 border-2 border-green-200/50 dark:border-green-800/30 shadow-sm", isArabic ? "text-right" : "text-left")}>
								<div className="flex items-center gap-2 mb-2 sm:mb-3">
									<div className="p-1 sm:p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 flex-shrink-0">
										<Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
									</div>
									<span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">
										{isArabic ? "المتلقي" : "Receiver"}
									</span>
								</div>
								<p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2 truncate">{order.receiverName}</p>
								<div className="flex items-start gap-1.5 sm:gap-2 mt-2">
									<MapPin className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0", isArabic ? "ml-0" : "mr-0")} />
									<p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{order.receiverAddress}</p>
								</div>
							</div>
						</div>

						{/* Distance & Fee */}
						<div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
							<div className={cn("p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10 border-2 border-blue-200/50 dark:border-blue-800/30 shadow-sm", isArabic ? "text-right" : "text-left")}>
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2 font-medium">{isArabic ? "المسافة" : "Distance"}</p>
								<p className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
									{order.distance} <span className="text-xs sm:text-sm">{isArabic ? "كم" : "KM"}</span>
								</p>
							</div>
							<div className={cn("p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/10 dark:to-pink-900/10 border-2 border-purple-200/50 dark:border-purple-800/30 shadow-sm", isArabic ? "text-right" : "text-left")}>
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2 font-medium">
									{isArabic ? "رسوم التوصيل" : "Delivery Fee"}
								</p>
								<p className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400">
									{(order.deliveryFee ?? 0).toFixed(2)} <span className="text-xs sm:text-sm">{isArabic ? "ريال" : "SAR"}</span>
								</p>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-5" />

						{/* Payment & Total */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900/40 dark:via-gray-800/40 dark:to-gray-800/60 border-2 border-gray-200/50 dark:border-gray-700/50 mb-4 sm:mb-5 shadow-sm">
							<div className="flex items-center gap-2 sm:gap-2.5">
								<div className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex-shrink-0">
									<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
								</div>
								<div className="flex flex-col min-w-0">
									<span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
										{isArabic ? "طريقة الدفع" : "Payment"}
									</span>
									<div className="flex items-center gap-2 flex-wrap">
										<span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">{order.paymentMethod}</span>
										<PaymentStatusBadge status={order.paymentStatus} />
									</div>
								</div>
							</div>
							<div className={cn("text-left sm:text-right", isArabic ? "sm:text-left" : "sm:text-right")}>
								<div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{isArabic ? "المجموع" : "Total"}</div>
								<div className="text-xl sm:text-2xl md:text-3xl font-black text-green-600 dark:text-green-400 tracking-tight">
									{(order.totalAmount ?? 0).toFixed(2)} <span className="text-base sm:text-lg">{isArabic ? "ريال" : "SAR"}</span>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
							<Link
								href={"/my-orders/" + order.orderNumber + "/track"}
								className={cn(
									"flex-1 py-3 sm:py-3.5 px-4 sm:px-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg sm:rounded-xl text-center transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 min-h-[44px]",
									isArabic ? "flex-row-reverse" : ""
								)}
							>
								<MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
								<span className="text-sm sm:text-base">{isArabic ? "تتبع الطلب" : "Track Order"}</span>
							</Link>

							{canRate && (
								<button
									onClick={() => setShowRating(true)}
									className="px-4 sm:px-4 py-3 sm:py-3.5 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-200 dark:border-yellow-800/50 hover:border-yellow-300 dark:hover:border-yellow-700 text-yellow-700 dark:text-yellow-400 font-bold rounded-lg sm:rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md min-h-[44px] min-w-[44px] flex items-center justify-center"
									aria-label={isArabic ? "قيم السائق" : "Rate Driver"}
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
					serviceName={
						isArabic
							? transportLabels[order.transportType].ar
							: transportLabels[order.transportType].en
					}
					driverName={order.driverName}
					driverPhoto={order.driverPhoto}
				/>
			)}
		</>
	);
}


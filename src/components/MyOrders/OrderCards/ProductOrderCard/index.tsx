"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Star, MapPin, Store, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RatingModal } from "@/components/ServeMe/Booking/modals";
import { OrderStatusBadge } from "../../shared/OrderStatusBadge";
import { PaymentStatusBadge } from "../../shared/PaymentStatusBadge";
import { cn } from "@/lib/utils";

interface ProductOrderItem {
	id: string;
	productName: string;
	productNameAr?: string;
	image?: string;
	quantity: number;
	price: number;
}

interface ProductOrder {
	id: string;
	orderNumber: string;
	storeName: string;
	storeNameAr?: string;
	storeLogo?: string;
	status: "pending" | "preparing" | "ready" | "delivering" | "completed" | "cancelled";
	createdAt: string;
	items: ProductOrderItem[];
	totalAmount: number;
	paymentMethod: string;
	paymentStatus: "paid" | "pending" | "failed";
	address?: string;
}

interface ProductOrderCardProps {
	order: ProductOrder;
	onProductClick?: (productId: string) => void;
	hasExistingRating?: boolean;
}

function getStatusGradient(status: string): string {
	const gradients: Record<string, string> = {
		pending: "from-yellow-500 to-orange-500",
		preparing: "from-blue-500 to-cyan-500",
		ready: "from-purple-500 to-pink-500",
		delivering: "from-indigo-500 to-blue-500",
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

export function ProductOrderCard({
	order,
	onProductClick,
	hasExistingRating = false,
}: ProductOrderCardProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [showDetails, setShowDetails] = useState(false);
	const [showRating, setShowRating] = useState(false);

	const canRate = order.status === "completed" && !hasExistingRating;

	const handleRatingSubmit = async (rating: number, feedback: string) => {
		console.log("Store rating submitted:", { orderId: order.id, rating, feedback });
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setShowRating(false);
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
						{/* Header - Store Info & Status */}
						<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-5 gap-3">
							<div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
								{/* Store Logo */}
								<div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 border-2 border-gray-200 dark:border-gray-600 shadow-sm">
									{order.storeLogo ? (
										<Image
											src={order.storeLogo}
											alt={isArabic ? order.storeNameAr || order.storeName : order.storeName}
											width={64}
											height={64}
											className="object-cover w-full h-full"
										/>
									) : (
										<Store className="w-full h-full p-2 sm:p-3 md:p-4 text-gray-400" />
									)}
								</div>

								{/* Store Name & Order Number */}
								<div className="flex-1 min-w-0">
									<h3
										className={cn(
											"text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate mb-1",
											isArabic ? "text-right" : "text-left"
										)}
									>
										{isArabic ? order.storeNameAr || order.storeName : order.storeName}
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
								</div>
							</div>

							{/* Status Badge */}
							<div className={cn("flex-shrink-0 self-start sm:self-auto", isArabic ? "sm:mr-auto sm:ml-2" : "sm:ml-auto sm:mr-2")}>
								<OrderStatusBadge status={order.status} type="product" />
							</div>
						</div>

						{/* Order Items Preview - First 2 items */}
						<div className="mb-4 sm:mb-5 space-y-2 sm:space-y-2.5">
							{order.items.slice(0, 2).map((item, i) => (
								<div
									key={i}
									className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/30 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
								>
									<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 shadow-sm">
										{item.image ? (
											<Image
												src={item.image}
												alt={isArabic ? item.productNameAr || item.productName : item.productName}
												width={56}
												height={56}
												className="object-cover w-full h-full"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
												<span className="text-xs text-gray-400 font-medium">IMG</span>
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p
											className={cn(
												"text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate mb-0.5 sm:mb-1",
												isArabic ? "text-right" : "text-left"
											)}
										>
											{isArabic ? item.productNameAr || item.productName : item.productName}
										</p>
										<p
											className={cn(
												"text-xs font-medium text-gray-600 dark:text-gray-400",
												isArabic ? "text-right" : "text-left"
											)}
										>
											{item.quantity}x • {item.price.toFixed(2)} {isArabic ? "ريال" : "SAR"}
										</p>
									</div>
								</div>
							))}

							{order.items.length > 2 && (
								<button
									onClick={() => setShowDetails(!showDetails)}
									className={cn(
										"text-sm text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 transition-colors flex items-center gap-1.5",
										isArabic ? "text-right flex-row-reverse" : "text-left"
									)}
								>
									{showDetails
										? isArabic
											? "عرض أقل"
											: "Show less"
										: isArabic
											? `+${order.items.length - 2} منتجات أخرى`
											: `+${order.items.length - 2} more items`}
								</button>
							)}
						</div>

						{/* Expandable Details */}
						<AnimatePresence>
							{showDetails && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									className="mb-4 space-y-2 overflow-hidden"
								>
									{order.items.slice(2).map((item, i) => (
										<div
											key={i}
											className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/30 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50"
										>
											<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 shadow-sm">
												{item.image ? (
													<Image
														src={item.image}
														alt={isArabic ? item.productNameAr || item.productName : item.productName}
														width={56}
														height={56}
														className="object-cover w-full h-full"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
														<span className="text-xs text-gray-400 font-medium">IMG</span>
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p
													className={cn(
														"text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate mb-0.5 sm:mb-1",
														isArabic ? "text-right" : "text-left"
													)}
												>
													{isArabic ? item.productNameAr || item.productName : item.productName}
												</p>
												<p
													className={cn(
														"text-xs font-medium text-gray-600 dark:text-gray-400",
														isArabic ? "text-right" : "text-left"
													)}
												>
													{item.quantity}x • {item.price.toFixed(2)} {isArabic ? "ريال" : "SAR"}
												</p>
											</div>
										</div>
									))}
								</motion.div>
							)}
						</AnimatePresence>

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
										<span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
											{order.paymentMethod}
										</span>
										<PaymentStatusBadge status={order.paymentStatus} />
									</div>
								</div>
							</div>
							<div className={cn("text-left sm:text-right", isArabic ? "sm:text-left" : "sm:text-right")}>
								<div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
									{isArabic ? "المجموع" : "Total"}
								</div>
								<div className="text-xl sm:text-2xl md:text-3xl font-black text-green-600 dark:text-green-400 tracking-tight">
									{order.totalAmount.toFixed(2)} <span className="text-base sm:text-lg">{isArabic ? "ريال" : "SAR"}</span>
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
									aria-label={isArabic ? "قيم المتجر" : "Rate Store"}
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
					serviceName={isArabic ? order.storeNameAr || order.storeName : order.storeName}
				/>
			)}
		</>
	);
}


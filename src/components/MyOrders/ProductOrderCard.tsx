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
	Truck,
	Star,
	Eye,
	Package,
} from "lucide-react";
import { RatingModal } from "@/components/ServeMe/Booking/modals";

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
	language: "en" | "ar";
	onProductClick?: (productId: string) => void;
	hasExistingRating?: boolean;
}

const statusConfig = {
	pending: { color: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600", labelEn: "Pending", labelAr: "قيد الانتظار", icon: Clock },
	preparing: { color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800", labelEn: "Preparing", labelAr: "قيد التحضير", icon: Loader2 },
	ready: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800", labelEn: "Ready", labelAr: "جاهز", icon: CheckCircle },
	delivering: { color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800", labelEn: "Delivering", labelAr: "قيد التوصيل", icon: Truck },
	completed: { color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800", labelEn: "Completed", labelAr: "مكتمل", icon: CheckCircle },
	cancelled: { color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800", labelEn: "Cancelled", labelAr: "ملغى", icon: XCircle },
};

const paymentStatusConfig = {
	paid: { color: "text-green-600 dark:text-green-400 font-semibold", labelEn: "Paid", labelAr: "مدفوع" },
	pending: { color: "text-yellow-600 dark:text-yellow-400", labelEn: "Pending", labelAr: "قيد الدفع" },
	failed: { color: "text-red-600 dark:text-red-400", labelEn: "Failed", labelAr: "فشل الدفع" },
};

export default function ProductOrderCard({
	order,
	language,
	onProductClick,
	hasExistingRating = false,
}: ProductOrderCardProps) {
	const isArabic = language === "ar";
	const [showRating, setShowRating] = useState(false);

	const status = statusConfig[order.status];
	const StatusIcon = status.icon;
	const canRate = order.status === "completed" && !hasExistingRating;

	const handleRatingSubmit = async (rating: number, feedback: string) => {
		console.log("Store rating submitted:", { orderId: order.id, rating, feedback });
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
					<div className={`flex items-start justify-between gap-3 `}>
						{/* Store Info */}
						<div className={`flex items-center gap-3 flex-1 min-w-0 `}>
							{order.storeLogo ? (
								<div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-100 dark:border-gray-700">
									<Image
										src={order.storeLogo}
										alt={isArabic ? order.storeNameAr || order.storeName : order.storeName}
										fill
										className="object-cover dark:opacity-80 transition-opacity duration-300"
										sizes="56px"
									/>
								</div>
							) : (
								<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
									<Package className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
								</div>
							)}
							<div className="flex-1 min-w-0">
								<h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate">
									{isArabic ? order.storeNameAr || order.storeName : order.storeName}
								</h3>
								<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
									{isArabic ? "رقم الطلب:" : "Order"} {order.orderNumber}
								</p>
							</div>
						</div>

						{/* Status Badge */}
						<div className={`flex-shrink-0 ${isArabic ? "mr-auto ml-3" : "ml-auto mr-3"}`}>
							<div
								className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 ${status.color} shadow-sm`}
							>
								<StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
								<span className="text-xs sm:text-sm font-semibold">
									{isArabic ? status.labelAr : status.labelEn}
								</span>
							</div>
						</div>
					</div>

					{/* Date */}
					<p className={`text-xs text-gray-500 dark:text-gray-400 mt-2 ${isArabic ? "text-right" : "text-left"}`}>
						{new Date(order.createdAt).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>

				{/* Items */}
				<div className="p-4 sm:p-5 space-y-3">
					{order.items.map((item) => (
						<div
							key={item.id}
							className={`flex items-center gap-3 `}
						>
							{item.image ? (
								<div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
									<Image
										src={item.image}
										alt={isArabic ? item.productNameAr || item.productName : item.productName}
										fill
										className="object-cover"
										sizes="56px"
									/>
								</div>
							) : (
								<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
									<Package className="w-5 h-5 text-gray-400 dark:text-gray-500" />
								</div>
							)}
							<div className="flex-1 min-w-0">
								<h4
									className={`font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 cursor-pointer hover:text-[#10b981] dark:hover:text-green-400 transition-colors ${
										isArabic ? "text-right" : "text-left"
									}`}
									onClick={() => onProductClick?.(item.id)}
								>
									{isArabic ? item.productNameAr || item.productName : item.productName}
								</h4>
								<p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 ${isArabic ? "text-right" : "text-left"}`}>
									{item.quantity} {isArabic ? "×" : "×"} {item.price} {isArabic ? "ريال" : "SAR"}
								</p>
							</div>
							<div className={`text-sm font-bold text-gray-900 dark:text-gray-100 ${isArabic ? "mr-auto" : "ml-auto"}`}>
								{item.quantity * item.price} {isArabic ? "ريال" : "SAR"}
							</div>
						</div>
					))}
				</div>

				{/* Footer */}
				<div className={`p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
					{/* Payment Info */}
					<div className={`flex items-center justify-between mb-3 `}>
						<div className={`flex items-center gap-2 `}>
							<CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
							<span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
								{isArabic ? "طريقة الدفع:" : "Payment:"} {order.paymentMethod}
							</span>
						</div>
						<span className={`text-xs sm:text-sm font-semibold ${paymentStatusConfig[order.paymentStatus].color}`}>
							{isArabic
								? paymentStatusConfig[order.paymentStatus].labelAr
								: paymentStatusConfig[order.paymentStatus].labelEn}
						</span>
					</div>

					{/* Total */}
					<div className={`flex items-center justify-between mb-4 `}>
						<span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
							{isArabic ? "المجموع:" : "Total:"}
						</span>
						<span className="text-base sm:text-lg font-extrabold text-[#10b981] dark:text-green-400">
							{order.totalAmount} {isArabic ? "ريال" : "SAR"}
						</span>
					</div>

					{/* Actions */}
					<div className={`flex items-center gap-2 sm:gap-3 `}>
						<button
							onClick={() => {
								window.location.href = `/my-orders/${order.orderNumber}/track`;
							}}
							className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 touch-manipulation`}
						>
							<Eye className="w-4 h-4" />
							<span>{isArabic ? "تتبع الطلب" : "Track Order"}</span>
						</button>
						{canRate && (
							<button
								onClick={() => setShowRating(true)}
								className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg font-semibold text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 touch-manipulation `}
							>
								<Star className="w-4 h-4" />
								<span>{isArabic ? "قيم المتجر" : "Rate Store"}</span>
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
					serviceName={isArabic ? order.storeNameAr || order.storeName : order.storeName}
				/>
			)}
		</>
	);
}


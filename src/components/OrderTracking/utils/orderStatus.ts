/**
 * Order status calculation utilities
 * Extracted for better code organization and testability
 */

import { OrderData, OrderType, ORDER_TYPE } from "../types";

/**
 * Calculate current step index based on order status and type
 */
export function calculateCurrentStepIndex(orderData: OrderData | null): number {
	if (!orderData) return 0;

	const isService = orderData.type === ORDER_TYPE.SERVICE;

	const statusMap: Record<string, number> = {
		pending: 0,
		confirmed: 0,
		preparing: 1,
		assigned: isService ? 1 : 0,
		on_the_way: isService ? 2 : 2,
		in_progress: isService ? 3 : 2,
		delivered: isService ? 3 : 3,
		completed: isService ? 4 : 3,
	};

	return statusMap[orderData.status] ?? 0;
}

/**
 * Get timeline steps count based on order type
 */
export function getTimelineStepsCount(type: OrderType): number {
	return type === ORDER_TYPE.SERVICE ? 5 : 4;
}

/**
 * Get worker type label based on order type
 */
export function getWorkerTypeLabel(type: OrderType, language: "en" | "ar"): string {
	if (type === ORDER_TYPE.SERVICE) {
		return language === "ar" ? "الفني" : "Technician";
	}
	return language === "ar" ? "السائق" : "Driver";
}

/**
 * Get address label based on order type
 */
export function getAddressLabel(type: OrderType, language: "en" | "ar"): string {
	if (type === ORDER_TYPE.SERVICE) {
		return language === "ar" ? "موقع الخدمة" : "Service Location";
	}
	return language === "ar" ? "عنوان التوصيل" : "Delivery Address";
}

/**
 * Get ETA label based on order type
 */
export function getETALabel(type: OrderType, language: "en" | "ar"): string {
	if (type === ORDER_TYPE.SERVICE) {
		return language === "ar" ? "الوصول المتوقع" : "Estimated Arrival";
	}
	return language === "ar" ? "وقت التوصيل المتوقع" : "Estimated Delivery";
}

/**
 * Check if order is completed
 */
export function isOrderCompleted(status: string): boolean {
	return status === "completed" || status === "delivered";
}

/**
 * Check if order is active (not completed, cancelled, or failed)
 */
export function isOrderActive(status: string): boolean {
	return !isOrderCompleted(status) && status !== "cancelled" && status !== "failed";
}

/**
 * Check if order can be cancelled (type-aware)
 */
export function canCancelOrder(status: string, type?: OrderType): boolean {
	// Service orders can be cancelled until technician is on the way
	if (type === ORDER_TYPE.SERVICE) {
		const cancellableStatuses = ["pending", "confirmed", "assigned"];
		return cancellableStatuses.includes(status);
	}
	// Product orders can be cancelled until out for delivery
	const cancellableStatuses = ["pending", "confirmed", "preparing", "ready"];
	return cancellableStatuses.includes(status);
}

/**
 * Get status label based on order type
 */
export function getStatusLabel(status: string, type: OrderType, language: "en" | "ar"): string {
	const labels: Record<string, { en: string; ar: string }> = {
		pending: { en: "Pending", ar: "قيد الانتظار" },
		confirmed: { en: "Confirmed", ar: "مؤكد" },
		preparing: { en: "Preparing", ar: "قيد التحضير" },
		assigned: { en: type === ORDER_TYPE.SERVICE ? "Technician Assigned" : "Driver Assigned", ar: type === ORDER_TYPE.SERVICE ? "تم تعيين الفني" : "تم تعيين السائق" },
		on_the_way: { en: type === ORDER_TYPE.SERVICE ? "Technician on the Way" : "Out for Delivery", ar: type === ORDER_TYPE.SERVICE ? "الفني في الطريق" : "قيد التوصيل" },
		in_progress: { en: "In Progress", ar: "قيد التنفيذ" },
		delivered: { en: "Delivered", ar: "تم التوصيل" },
		completed: { en: "Completed", ar: "مكتمل" },
		cancelled: { en: "Cancelled", ar: "ملغي" },
	};

	return labels[status]?.[language] || status;
}


/**
 * Route helper utilities for order tracking
 * Extracted for better code organization and reusability
 */

import { OrderType, ORDER_TYPE } from "../types";

/**
 * Get service information from order data
 */
export function getServiceInfo(orderData: {
	service?: string;
	serviceType?: string;
	driver_or_worker?: {
		service?: string;
		serviceType?: string;
		id?: string;
	};
}) {
	return {
		service: orderData.service || orderData.driver_or_worker?.service,
		serviceType: orderData.serviceType || orderData.driver_or_worker?.serviceType,
		workerId: orderData.driver_or_worker?.id,
	};
}

/**
 * Check if chat is available (has all required service info)
 */
export function hasChatAvailable(orderData: {
	type: OrderType;
	service?: string;
	serviceType?: string;
	driver_or_worker?: {
		id?: string;
		service?: string;
		serviceType?: string;
	};
}): boolean {
	// Chat is primarily available for service orders
	if (orderData.type === ORDER_TYPE.SERVICE) {
		const { service, serviceType, workerId } = getServiceInfo(orderData);
		return !!(service && serviceType && workerId);
	}
	// For product orders, chat might be available if driver has ID
	return !!orderData.driver_or_worker?.id;
}

/**
 * Build worker details route (type-aware)
 */
export function buildWorkerDetailsRoute(workerId: string, orderType?: OrderType): string {
	return `/worker/${workerId}`;
}

/**
 * Build chat route (type-aware)
 */
export function buildChatRoute(workerId: string, orderType?: OrderType): string {
	return `/worker/${workerId}/chat`;
}

/**
 * Get worker phone number with fallback
 */
export function getWorkerPhone(orderData: {
	driver_or_worker?: {
		phone?: string;
	};
	supportPhone?: string;
}): string | undefined {
	return orderData.driver_or_worker?.phone || orderData.supportPhone;
}

/**
 * Determine if map should be visible based on assignment status
 */
export function shouldShowMap(orderData: {
	type: OrderType;
	status: string;
	driver_or_worker?: {
		id?: string;
	};
	map?: {
		driver_lat?: number;
		driver_lng?: number;
	};
}): boolean {
	// Don't show map if no driver/worker assigned
	if (!orderData.driver_or_worker?.id) {
		return false;
	}

	// Don't show map if no location data
	if (!orderData.map?.driver_lat || !orderData.map?.driver_lng) {
		return false;
	}

	// Show map when driver/technician is on the way or in progress
	const activeStatuses = ["on_the_way", "in_progress", "delivering"];
	return activeStatuses.includes(orderData.status);
}

/**
 * Get cancellation button label based on order type
 */
export function getCancelButtonLabel(type: OrderType, language: "en" | "ar"): string {
	if (type === ORDER_TYPE.SERVICE) {
		return language === "ar" ? "إلغاء الحجز" : "Cancel Booking";
	}
	return language === "ar" ? "إلغاء الطلب" : "Cancel Order";
}

/**
 * Get reorder button label based on order type
 */
export function getReorderButtonLabel(type: OrderType, language: "en" | "ar"): string {
	if (type === ORDER_TYPE.SERVICE) {
		return language === "ar" ? "حجز مرة أخرى" : "Book Again";
	}
	return language === "ar" ? "إعادة الطلب" : "Reorder";
}

/**
 * Get rating button label based on order type
 */
export function getRatingButtonLabel(type: OrderType, language: "en" | "ar"): string {
	if (type === ORDER_TYPE.SERVICE) {
		return language === "ar" ? "قيم الخدمة" : "Rate Service";
	}
	return language === "ar" ? "قيم المتجر" : "Rate Store";
}


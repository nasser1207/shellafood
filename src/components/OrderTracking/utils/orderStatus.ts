/**
 * Order status calculation utilities
 * Extracted for better code organization and testability
 */

import { OrderData } from "../types";

/**
 * Calculate current step index based on order status and type
 */
export function calculateCurrentStepIndex(orderData: OrderData | null): number {
	if (!orderData) return 0;

	const statusMap: Record<string, number> = {
		pending: 0,
		confirmed: 0,
		preparing: 1,
		assigned: 1,
		on_the_way: 2,
		in_progress: orderData.type === "service" ? 3 : 2,
		delivered: 3,
		completed: orderData.type === "service" ? 4 : 3,
	};

	return statusMap[orderData.status] ?? 0;
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


/**
 * Route helper utilities for order tracking
 * Extracted for better code organization and reusability
 */

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
	service?: string;
	serviceType?: string;
	driver_or_worker?: {
		id?: string;
		service?: string;
		serviceType?: string;
	};
}): boolean {
	const { service, serviceType, workerId } = getServiceInfo(orderData);
	return !!(service && serviceType && workerId);
}

/**
 * Build worker details route
 */
export function buildWorkerDetailsRoute(service: string, serviceType: string, workerId: string): string {
	return `/worker/${workerId}`;
}

/**
 * Build chat route
 */
export function buildChatRoute(service: string, serviceType: string, workerId: string): string {
	return `/worker/${workerId}/chat`;
}


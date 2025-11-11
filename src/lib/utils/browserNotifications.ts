/**
 * Browser Notification Utilities
 * Handles browser notifications for order tracking
 */

export interface NotificationPermission {
	status: NotificationPermission | "default" | "granted" | "denied";
}

/**
 * Request browser notification permission
 * @returns Promise that resolves to permission status
 */
export async function requestNotificationPermission(): Promise<NotificationPermission["status"]> {
	if (typeof window === "undefined" || !("Notification" in window)) {
		return "denied";
	}

	if (Notification.permission === "granted") {
		return "granted";
	}

	if (Notification.permission === "denied") {
		return "denied";
	}

	try {
		const permission = await Notification.requestPermission();
		return permission;
	} catch (error) {
		console.error("Error requesting notification permission:", error);
		return "denied";
	}
}

/**
 * Check if notifications are supported
 */
export function isNotificationSupported(): boolean {
	if (typeof window === "undefined") return false;
	return "Notification" in window;
}

/**
 * Check if notification permission is granted
 */
export function hasNotificationPermission(): boolean {
	if (typeof window === "undefined" || !("Notification" in window)) {
		return false;
	}
	return Notification.permission === "granted";
}

/**
 * Show browser notification
 * @param title Notification title
 * @param options Notification options
 */
export function showBrowserNotification(
	title: string,
	options?: NotificationOptions
): Notification | null {
	if (!isNotificationSupported() || !hasNotificationPermission()) {
		return null;
	}

	try {
		const notification = new Notification(title, {
			icon: "/logous.svg",
			badge: "/logous.svg",
			...options,
		});

		// Auto-close after 5 seconds
		setTimeout(() => {
			notification.close();
		}, 5000);

		return notification;
	} catch (error) {
		console.error("Error showing notification:", error);
		return null;
	}
}

/**
 * Show notification for order status change
 */
export function notifyOrderStatusChange(
	status: string,
	orderId: string,
	language: "en" | "ar"
): void {
	const statusMessages: Record<string, { en: string; ar: string }> = {
		confirmed: {
			en: "Order confirmed",
			ar: "تم تأكيد الطلب",
		},
		assigned: {
			en: "Technician assigned",
			ar: "تم تعيين الفني",
		},
		preparing: {
			en: "Order is being prepared",
			ar: "جاري تحضير الطلب",
		},
		on_the_way: {
			en: "Technician is on the way",
			ar: "الفني في الطريق",
		},
		in_progress: {
			en: "Work in progress",
			ar: "قيد التنفيذ",
		},
		delivered: {
			en: "Order delivered",
			ar: "تم التوصيل",
		},
		completed: {
			en: "Service completed",
			ar: "تم إكمال الخدمة",
		},
	};

	const message = statusMessages[status] || {
		en: "Order status updated",
		ar: "تم تحديث حالة الطلب",
	};

	const title = language === "ar" ? message.ar : message.en;
	const body = language === "ar"
		? `رقم الطلب: ${orderId}`
		: `Order #: ${orderId}`;

	showBrowserNotification(title, {
		body,
		tag: `order-${orderId}-${status}`,
	});
}

/**
 * Show notification for technician approaching
 */
export function notifyTechnicianApproaching(
	etaMinutes: number,
	technicianName: string,
	language: "en" | "ar"
): void {
	const title = language === "ar"
		? `الفني قريب! الوصول خلال ${etaMinutes} ${etaMinutes === 1 ? "دقيقة" : "دقائق"}`
		: `Technician approaching! Arriving in ${etaMinutes} ${etaMinutes === 1 ? "min" : "mins"}`;

	const body = language === "ar"
		? `${technicianName} في طريقه إليك`
		: `${technicianName} is on the way to you`;

	showBrowserNotification(title, {
		body,
		tag: "technician-approaching",
		requireInteraction: true,
	});
}


"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertCircle, Bell, X } from "lucide-react";

export interface ToastNotificationData {
	id: string;
	message: string;
	messageAr?: string;
	type: "success" | "error" | "info" | "warning";
	duration?: number; // in milliseconds
	icon?: React.ComponentType<{ className?: string }>;
}

interface ToastNotificationProps {
	notification: ToastNotificationData | null;
	language: "en" | "ar";
	onClose: () => void;
}

export default function ToastNotification({
	notification,
	language,
	onClose,
}: ToastNotificationProps) {
	const isArabic = language === "ar";
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (notification) {
			setIsVisible(true);
			const duration = notification.duration || 5000;
			const timer = setTimeout(() => {
				setIsVisible(false);
				setTimeout(onClose, 300); // Wait for animation to complete
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [notification, onClose]);

	if (!notification) return null;

	const config = {
		success: {
			bgColor: "bg-green-500",
			icon: CheckCircle,
			textColor: "text-white",
		},
		error: {
			bgColor: "bg-red-500",
			icon: XCircle,
			textColor: "text-white",
		},
		info: {
			bgColor: "bg-blue-500",
			icon: Info,
			textColor: "text-white",
		},
		warning: {
			bgColor: "bg-yellow-500",
			icon: AlertCircle,
			textColor: "text-white",
		},
	};

	const typeConfig = config[notification.type] || config.info;
	const Icon = notification.icon || typeConfig.icon;

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: -50, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -20, scale: 0.95 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className={`fixed top-4 ${isArabic ? "left-4 right-auto" : "right-4 left-auto"} z-50 max-w-md w-full sm:w-auto`}
					dir={isArabic ? "rtl" : "ltr"}
				>
					<div
						className={`${typeConfig.bgColor} ${typeConfig.textColor} rounded-xl shadow-2xl p-4 flex items-start gap-3 ${isArabic ? "flex-row-reverse" : ""}`}
					>
						<Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
						<div className="flex-1 min-w-0">
							<p className={`text-sm font-semibold ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic && notification.messageAr
									? notification.messageAr
									: notification.message}
							</p>
						</div>
						<button
							onClick={() => {
								setIsVisible(false);
								setTimeout(onClose, 300);
							}}
							className="flex-shrink-0 hover:opacity-80 dark:hover:opacity-70 transition-opacity"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

/**
 * Toast Notification Manager Hook
 */
export function useToastNotifications(language: "en" | "ar") {
	const [notifications, setNotifications] = useState<ToastNotificationData[]>([]);
	const [currentNotification, setCurrentNotification] = useState<ToastNotificationData | null>(null);

	const showNotification = (notification: Omit<ToastNotificationData, "id">) => {
		const id = `toast-${Date.now()}-${Math.random()}`;
		const newNotification: ToastNotificationData = { ...notification, id };
		
		setNotifications((prev) => [...prev, newNotification]);
		setCurrentNotification(newNotification);
	};

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
		if (currentNotification?.id === id) {
			const nextNotification = notifications.find((n) => n.id !== id);
			setCurrentNotification(nextNotification || null);
		}
	};

	const handleClose = () => {
		if (currentNotification) {
			removeNotification(currentNotification.id);
			// Show next notification if available
			const remaining = notifications.filter((n) => n.id !== currentNotification.id);
			if (remaining.length > 0) {
				setTimeout(() => {
					setCurrentNotification(remaining[0]);
				}, 300);
			}
		}
	};

	return {
		showNotification,
		removeNotification,
		currentNotification,
		handleClose,
	};
}


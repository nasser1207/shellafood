"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
	id: string;
	message: string;
	messageAr?: string;
	type: ToastType;
	duration?: number;
}

interface ToastProps {
	toast: Toast;
	onClose: () => void;
	isArabic?: boolean;
}

const toastConfig = {
	success: {
		icon: CheckCircle,
		bgColor: "bg-green-50",
		borderColor: "border-green-200",
		textColor: "text-green-800",
		iconColor: "text-green-600",
	},
	error: {
		icon: XCircle,
		bgColor: "bg-red-50",
		borderColor: "border-red-200",
		textColor: "text-red-800",
		iconColor: "text-red-600",
	},
	warning: {
		icon: AlertCircle,
		bgColor: "bg-orange-50",
		borderColor: "border-orange-200",
		textColor: "text-orange-800",
		iconColor: "text-orange-600",
	},
	info: {
		icon: Info,
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		textColor: "text-blue-800",
		iconColor: "text-blue-600",
	},
};

function ToastItem({ toast, onClose, isArabic = false }: ToastProps) {
	const config = toastConfig[toast.type];
	const Icon = config.icon;
	const duration = toast.duration || 4000;

	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	return (
		<motion.div
			initial={{ opacity: 0, y: -20, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -20, scale: 0.95 }}
			className={`relative flex items-start gap-3 p-4 rounded-xl shadow-lg border-2 ${config.bgColor} ${config.borderColor} min-w-[300px] max-w-md ${isArabic ? "rtl" : "ltr"}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			<Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
			<div className="flex-1 min-w-0">
				<p className={`text-sm font-medium ${config.textColor} ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic && toast.messageAr ? toast.messageAr : toast.message}
				</p>
			</div>
			<button
				onClick={onClose}
				className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
				aria-label={isArabic ? "إغلاق" : "Close"}
			>
				<X className="w-4 h-4" />
			</button>
		</motion.div>
	);
}

interface ToastContainerProps {
	toasts: Toast[];
	onRemoveToast: (id: string) => void;
	isArabic?: boolean;
}

export function ToastContainer({ toasts, onRemoveToast, isArabic = false }: ToastContainerProps) {
	return (
		<div className={`fixed ${isArabic ? "left-4" : "right-4"} top-4 z-[100] flex flex-col gap-3 pointer-events-none`}>
			<AnimatePresence mode="popLayout">
				{toasts.map((toast) => (
					<div key={toast.id} className="pointer-events-auto">
						<ToastItem
							toast={toast}
							onClose={() => onRemoveToast(toast.id)}
							isArabic={isArabic}
						/>
					</div>
				))}
			</AnimatePresence>
		</div>
	);
}

// Hook for managing toasts
export function useToast() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback((message: string, type: ToastType = "info", messageAr?: string, duration?: number) => {
		const id = Math.random().toString(36).substring(7);
		const newToast: Toast = { id, message, messageAr, type, duration };
		setToasts((prev) => [...prev, newToast]);
		return id;
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	return { toasts, showToast, removeToast };
}


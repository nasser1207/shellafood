"use client";

import React from "react";
import { Clock, CheckCircle, CheckCircle2, XCircle, Loader2, Truck, ChefHat, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
	status: string;
	type?: "product" | "service" | "delivery";
	className?: string;
}

const statusConfig = {
	// Product order statuses
	pending: {
		label: { en: "Pending", ar: "قيد الانتظار" },
		icon: Clock,
		gradient: "from-yellow-500 to-orange-500",
		bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
		textColor: "text-yellow-700 dark:text-yellow-300",
		borderColor: "border-yellow-300 dark:border-yellow-800",
		animation: "animate-pulse",
	},
	preparing: {
		label: { en: "Preparing", ar: "قيد التحضير" },
		icon: ChefHat,
		gradient: "from-blue-500 to-cyan-500",
		bgColor: "bg-blue-50 dark:bg-blue-900/20",
		textColor: "text-blue-700 dark:text-blue-300",
		borderColor: "border-blue-300 dark:border-blue-800",
		animation: "",
	},
	ready: {
		label: { en: "Ready", ar: "جاهز" },
		icon: CheckCircle,
		gradient: "from-purple-500 to-pink-500",
		bgColor: "bg-purple-50 dark:bg-purple-900/20",
		textColor: "text-purple-700 dark:text-purple-300",
		borderColor: "border-purple-300 dark:border-purple-800",
		animation: "",
	},
	delivering: {
		label: { en: "Delivering", ar: "قيد التوصيل" },
		icon: Truck,
		gradient: "from-indigo-500 to-blue-500",
		bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
		textColor: "text-indigo-700 dark:text-indigo-300",
		borderColor: "border-indigo-300 dark:border-indigo-800",
		animation: "animate-pulse",
	},
	completed: {
		label: { en: "Completed", ar: "مكتمل" },
		icon: CheckCircle2,
		gradient: "from-green-500 to-emerald-500",
		bgColor: "bg-green-50 dark:bg-green-900/20",
		textColor: "text-green-700 dark:text-green-300",
		borderColor: "border-green-300 dark:border-green-800",
		animation: "",
	},
	delivered: {
		label: { en: "Delivered", ar: "تم التسليم" },
		icon: CheckCircle2,
		gradient: "from-green-500 to-emerald-500",
		bgColor: "bg-green-50 dark:bg-green-900/20",
		textColor: "text-green-700 dark:text-green-300",
		borderColor: "border-green-300 dark:border-green-800",
		animation: "",
	},
	cancelled: {
		label: { en: "Cancelled", ar: "ملغي" },
		icon: XCircle,
		gradient: "from-red-500 to-pink-500",
		bgColor: "bg-red-50 dark:bg-red-900/20",
		textColor: "text-red-700 dark:text-red-300",
		borderColor: "border-red-300 dark:border-red-800",
		animation: "",
	},
	// Service request statuses
	assigned: {
		label: { en: "Assigned", ar: "تم التعيين" },
		icon: CheckCircle,
		gradient: "from-blue-500 to-cyan-500",
		bgColor: "bg-blue-50 dark:bg-blue-900/20",
		textColor: "text-blue-700 dark:text-blue-300",
		borderColor: "border-blue-300 dark:border-blue-800",
		animation: "",
	},
	in_progress: {
		label: { en: "In Progress", ar: "قيد التنفيذ" },
		icon: Loader2,
		gradient: "from-purple-500 to-pink-500",
		bgColor: "bg-purple-50 dark:bg-purple-900/20",
		textColor: "text-purple-700 dark:text-purple-300",
		borderColor: "border-purple-300 dark:border-purple-800",
		animation: "animate-spin",
	},
	// Delivery order statuses
	picked_up: {
		label: { en: "Picked Up", ar: "تم الاستلام" },
		icon: Package,
		gradient: "from-yellow-500 to-orange-500",
		bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
		textColor: "text-yellow-700 dark:text-yellow-300",
		borderColor: "border-yellow-300 dark:border-yellow-800",
		animation: "",
	},
	in_transit: {
		label: { en: "In Transit", ar: "قيد النقل" },
		icon: Truck,
		gradient: "from-indigo-500 to-blue-500",
		bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
		textColor: "text-indigo-700 dark:text-indigo-300",
		borderColor: "border-indigo-300 dark:border-indigo-800",
		animation: "animate-pulse",
	},
};

export function OrderStatusBadge({ status, type, className }: OrderStatusBadgeProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
	const StatusIcon = config.icon;

	// Formal style for service type
	if (type === "service") {
		const formalStatusColors: Record<string, { bg: string; text: string; border: string }> = {
			pending: {
				bg: "bg-gray-100 dark:bg-gray-700",
				text: "text-gray-700 dark:text-gray-300",
				border: "border-gray-300 dark:border-gray-600",
			},
			assigned: {
				bg: "bg-gray-100 dark:bg-gray-700",
				text: "text-gray-700 dark:text-gray-300",
				border: "border-gray-300 dark:border-gray-600",
			},
			in_progress: {
				bg: "bg-gray-100 dark:bg-gray-700",
				text: "text-gray-700 dark:text-gray-300",
				border: "border-gray-300 dark:border-gray-600",
			},
			completed: {
				bg: "bg-gray-100 dark:bg-gray-700",
				text: "text-gray-700 dark:text-gray-300",
				border: "border-gray-300 dark:border-gray-600",
			},
			cancelled: {
				bg: "bg-gray-100 dark:bg-gray-700",
				text: "text-gray-700 dark:text-gray-300",
				border: "border-gray-300 dark:border-gray-600",
			},
		};

		const formalColor = formalStatusColors[status] || formalStatusColors.pending;

		return (
			<div
				className={cn(
					"inline-flex items-center gap-2 px-3 py-1.5 rounded-md border shadow-sm",
					formalColor.bg,
					formalColor.border,
					className
				)}
			>
				<StatusIcon className={cn("w-3.5 h-3.5", formalColor.text)} />
				<span className={cn("text-xs font-semibold", formalColor.text)}>
					{isArabic ? config.label.ar : config.label.en}
				</span>
			</div>
		);
	}

	// Default style for product and delivery
	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 shadow-sm",
				config.bgColor,
				config.borderColor,
				config.animation,
				className
			)}
		>
			<div className={cn("w-2 h-2 rounded-full bg-gradient-to-r", config.gradient)} />
			<StatusIcon className={cn("w-4 h-4", config.textColor)} />
			<span className={cn("text-xs font-bold", config.textColor)}>
				{isArabic ? config.label.ar : config.label.en}
			</span>
		</div>
	);
}


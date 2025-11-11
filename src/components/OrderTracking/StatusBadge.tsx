"use client";

import React from "react";
import { CheckCircle, Clock, Loader2, Truck, XCircle, Navigation } from "lucide-react";

interface StatusBadgeProps {
	status: string;
	language: "en" | "ar";
}

const statusConfig: Record<
	string,
	{
		color: string;
		bgColor: string;
		borderColor: string;
		labelEn: string;
		labelAr: string;
		icon: React.ComponentType<{ className?: string }>;
	}
> = {
	pending: {
		color: "text-gray-700 dark:text-gray-300",
		bgColor: "bg-gray-100 dark:bg-gray-800",
		borderColor: "border-gray-300 dark:border-gray-600",
		labelEn: "Pending",
		labelAr: "قيد الانتظار",
		icon: Clock,
	},
	confirmed: {
		color: "text-blue-700 dark:text-blue-300",
		bgColor: "bg-blue-100 dark:bg-blue-900/30",
		borderColor: "border-blue-300 dark:border-blue-700",
		labelEn: "Confirmed",
		labelAr: "مؤكد",
		icon: CheckCircle,
	},
	preparing: {
		color: "text-yellow-700 dark:text-yellow-300",
		bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
		borderColor: "border-yellow-300 dark:border-yellow-700",
		labelEn: "Preparing",
		labelAr: "قيد التحضير",
		icon: Loader2,
	},
	assigned: {
		color: "text-yellow-700 dark:text-yellow-300",
		bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
		borderColor: "border-yellow-300 dark:border-yellow-700",
		labelEn: "Assigned",
		labelAr: "تم التعيين",
		icon: CheckCircle,
	},
	on_the_way: {
		color: "text-orange-700 dark:text-orange-300",
		bgColor: "bg-orange-100 dark:bg-orange-900/30",
		borderColor: "border-orange-300 dark:border-orange-700",
		labelEn: "On the Way",
		labelAr: "في الطريق",
		icon: Truck,
	},
	in_progress: {
		color: "text-purple-700 dark:text-purple-300",
		bgColor: "bg-purple-100 dark:bg-purple-900/30",
		borderColor: "border-purple-300 dark:border-purple-700",
		labelEn: "In Progress",
		labelAr: "قيد التنفيذ",
		icon: Loader2,
	},
	delivered: {
		color: "text-green-700 dark:text-green-300",
		bgColor: "bg-green-100 dark:bg-green-900/30",
		borderColor: "border-green-300 dark:border-green-700",
		labelEn: "Delivered",
		labelAr: "تم التوصيل",
		icon: CheckCircle,
	},
	completed: {
		color: "text-green-700 dark:text-green-300",
		bgColor: "bg-green-100 dark:bg-green-900/30",
		borderColor: "border-green-300 dark:border-green-700",
		labelEn: "Completed",
		labelAr: "مكتمل",
		icon: CheckCircle,
	},
	cancelled: {
		color: "text-red-700 dark:text-red-300",
		bgColor: "bg-red-100 dark:bg-red-900/30",
		borderColor: "border-red-300 dark:border-red-700",
		labelEn: "Cancelled",
		labelAr: "ملغى",
		icon: XCircle,
	},
	failed: {
		color: "text-red-700 dark:text-red-300",
		bgColor: "bg-red-100 dark:bg-red-900/30",
		borderColor: "border-red-300 dark:border-red-700",
		labelEn: "Failed",
		labelAr: "فشل",
		icon: XCircle,
	},
};

export default function StatusBadge({ status, language }: StatusBadgeProps) {
	const isArabic = language === "ar";
	const config = statusConfig[status] || statusConfig.pending;
	const Icon = config.icon;
	const isAnimating = status === "preparing" || status === "in_progress" || status === "on_the_way";

	return (
		<div
			className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 ${config.bgColor} ${config.color} ${config.borderColor} ${
				isArabic ? "flex-row-reverse" : ""
			}`}
		>
			<Icon
				className={`w-4 h-4 flex-shrink-0 ${isAnimating ? "animate-spin" : ""}`}
			/>
			<span className="text-sm font-semibold">
				{isArabic ? config.labelAr : config.labelEn}
			</span>
		</div>
	);
}


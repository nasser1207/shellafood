"use client";

import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
	status: "paid" | "pending" | "failed";
	className?: string;
}

const paymentStatusConfig = {
	paid: {
		label: { en: "Paid", ar: "مدفوع" },
		icon: CheckCircle,
		color: "text-green-600 dark:text-green-400",
		bgColor: "bg-green-50 dark:bg-green-900/20",
		borderColor: "border-green-200 dark:border-green-800",
	},
	pending: {
		label: { en: "Pending", ar: "قيد الدفع" },
		icon: Clock,
		color: "text-yellow-600 dark:text-yellow-400",
		bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
		borderColor: "border-yellow-200 dark:border-yellow-800",
	},
	failed: {
		label: { en: "Failed", ar: "فشل الدفع" },
		icon: XCircle,
		color: "text-red-600 dark:text-red-400",
		bgColor: "bg-red-50 dark:bg-red-900/20",
		borderColor: "border-red-200 dark:border-red-800",
	},
};

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const config = paymentStatusConfig[status];
	const StatusIcon = config.icon;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border",
				config.bgColor,
				config.borderColor,
				config.color,
				className
			)}
		>
			<StatusIcon className="w-3 h-3" />
			{isArabic ? config.label.ar : config.label.en}
		</span>
	);
}


"use client";

import React from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PullToRefreshIndicatorProps {
	pullDistance: number;
	isRefreshing: boolean;
	threshold?: number;
}

export function PullToRefreshIndicator({
	pullDistance,
	isRefreshing,
	threshold = 80,
}: PullToRefreshIndicatorProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const shouldShow = pullDistance > 0 || isRefreshing;
	const progress = Math.min(pullDistance / threshold, 1);

	if (!shouldShow) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: shouldShow ? 1 : 0, y: shouldShow ? 0 : -50 }}
			className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg ${isArabic ? "rtl" : "ltr"}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			<div className="flex flex-col items-center gap-2">
				<motion.div
					animate={{ rotate: isRefreshing ? 360 : 0 }}
					transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
					className="relative"
				>
					<RefreshCw
						className={`w-6 h-6 ${isRefreshing ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}
					/>
					{!isRefreshing && (
						<motion.div
							className="absolute inset-0 rounded-full border-2 border-green-600 dark:border-green-400 border-t-transparent"
							style={{
								rotate: progress * 360,
							}}
						/>
					)}
				</motion.div>
				<p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
					{isRefreshing
						? isArabic
							? "جاري التحديث..."
							: "Refreshing..."
						: isArabic
							? "اسحب للتحديث"
							: "Pull to refresh"}
				</p>
			</div>
		</motion.div>
	);
}


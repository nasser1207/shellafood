"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Package, Users, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TrustBadges() {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const badges = [
		{
			icon: Package,
			value: "2M+",
			label: isArabic ? "طلبات تم توصيلها" : "Orders Delivered",
			color: "from-green-500 to-emerald-600",
		},
		{
			icon: Star,
			value: "4.8",
			label: isArabic ? "تقييم العملاء" : "Customer Rating",
			color: "from-yellow-500 to-orange-500",
		},
		{
			icon: Users,
			value: "50K+",
			label: isArabic ? "مطعم ومتجر" : "Restaurants & Stores",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: Clock,
			value: "20min",
			label: isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time",
			color: "from-purple-500 to-pink-500",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.4 }}
			className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
		>
			{badges.map((badge, index) => {
				const Icon = badge.icon;
				return (
					<motion.div
						key={index}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.5 + index * 0.1 }}
						whileHover={{ scale: 1.05, y: -4 }}
						className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all"
					>
						<div className={`flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 ${isArabic ? "flex-row-reverse" : ""}`}>
							<div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-md flex-shrink-0`}>
								<Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{badge.value}</p>
							</div>
						</div>
						<p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 ${isArabic ? "text-right" : "text-left"}`}>
							{badge.label}
						</p>
					</motion.div>
				);
			})}
		</motion.div>
	);
}


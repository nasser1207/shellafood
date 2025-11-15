"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface OrdersHeaderProps {
	stats: {
		totalOrders: number;
		completedOrders: number;
		totalAmount: number;
	};
	activeTab: "products" | "services" | "delivery";
}

export function OrdersHeader({ stats, activeTab }: OrdersHeaderProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
			{/* Header with Gradient Banner */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative mb-6 sm:mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-green-600 via-green-600 to-emerald-600 dark:from-green-700 dark:via-green-700 dark:to-emerald-700 p-6 sm:p-8 text-white shadow-lg"
			>
				{/* Decorative Elements */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full -mr-32 -mt-32"></div>
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 dark:bg-white/5 rounded-full -ml-24 -mb-24"></div>

				<div className="relative z-10">
					<div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isArabic ? "text-right" : "text-left"}`}>
						<div>
							<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
								{isArabic ? "طلباتي" : "My Orders"}
							</h1>
							<p className="text-sm sm:text-base opacity-90">
								{isArabic
									? "إدارة طلبات المنتجات وطلبات الخدمات الخاصة بك"
									: "Manage your product orders and service requests"}
							</p>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-3 gap-3 sm:gap-4">
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2 }}
								className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center"
							>
								<div className="text-2xl sm:text-3xl font-bold">{stats.totalOrders}</div>
								<div className="text-xs sm:text-sm opacity-90">{isArabic ? "إجمالي الطلبات" : "Total Orders"}</div>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3 }}
								className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center"
							>
								<div className="text-2xl sm:text-3xl font-bold">{stats.completedOrders}</div>
								<div className="text-xs sm:text-sm opacity-90">{isArabic ? "مكتملة" : "Completed"}</div>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4 }}
								className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center"
							>
								<div className="text-lg sm:text-xl font-bold">{stats.totalAmount.toFixed(0)}</div>
								<div className="text-xs opacity-90">{isArabic ? "ر.س" : "SAR"}</div>
							</motion.div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}


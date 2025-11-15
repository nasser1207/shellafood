"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, Wrench, Truck } from "lucide-react";

interface OrdersTabsProps {
	activeTab: "products" | "services" | "delivery";
	onTabChange: (tab: "products" | "services" | "delivery") => void;
	language: "en" | "ar";
}

export default function OrdersTabs({ activeTab, onTabChange, language }: OrdersTabsProps) {
	const isArabic = language === "ar";

	const tabs = [
		{
			id: "products" as const,
			labelEn: "Products",
			labelAr: "المنتجات",
			icon: Package,
		},
		{
			id: "services" as const,
			labelEn: "Services",
			labelAr: "الخدمات",
			icon: Wrench,
		},
		{
			id: "delivery" as const,
			labelEn: "Pick & Order",
			labelAr: "جلب وتوصيل",
			icon: Truck,
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className={`flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-2 `}
		>
			{tabs.map((tab) => {
				const Icon = tab.icon;
				const isActive = activeTab === tab.id;
				const label = isArabic ? tab.labelAr : tab.labelEn;

				return (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={`relative border-2 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 flex-1 justify-center
						${isActive ? "border-green-600 dark:border-green-500" : "border-transparent dark:border-transparent"}`}
					>
						<Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? "text-white" : "text-gray-600 dark:text-gray-400"}`} />
						{isActive ? (
							<span className="inline text-white">{label}</span>
						) : (
							<span className="hidden sm:inline text-gray-600 dark:text-gray-400">{label}</span>
						)}

						{/* Active indicator with gradient */}
						{isActive && (
							<motion.div
								layoutId="activeTab"
								className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 shadow-lg shadow-green-500/30 dark:shadow-green-500/20 -z-10"
								transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
							/>
						)}
					</button>
				);
			})}
		</motion.div>
	);
}

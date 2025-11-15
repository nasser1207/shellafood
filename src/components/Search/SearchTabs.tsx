"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchTabsProps {
	activeTab: "all" | "stores" | "products";
	onTabChange: (tab: "all" | "stores" | "products") => void;
	counts: {
		all: number;
		stores: number;
		products: number;
	};
	visible?: boolean;
}

export default function SearchTabs({ activeTab, onTabChange, counts, visible = true }: SearchTabsProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	if (!visible) return null;

	const tabs = [
		{ id: "all" as const, label: isArabic ? "الكل" : "All", count: counts.all },
		{ id: "stores" as const, label: isArabic ? "المتاجر" : "Stores", count: counts.stores },
		{ id: "products" as const, label: isArabic ? "المنتجات" : "Products", count: counts.products },
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.2 }}
			className="mb-6 flex justify-center"
		>
			<div className="inline-flex rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 shadow-md backdrop-blur-sm">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={`relative px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
							activeTab === tab.id
								? "text-white"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
						aria-label={`${tab.label} (${tab.count})`}
						aria-pressed={activeTab === tab.id}
					>
						{activeTab === tab.id && (
							<motion.div
								layoutId="activeTab"
								className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 shadow-lg shadow-green-500/30 dark:shadow-green-500/20 -z-10"
								transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
							/>
						)}
						<span className="relative z-10">
							{tab.label} ({tab.count})
						</span>
					</button>
				))}
			</div>
		</motion.div>
	);
}


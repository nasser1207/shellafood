"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";

export default function SearchHeader() {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="mb-8 text-center"
		>
			{/* Icon Badge */}
			<motion.div
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
				className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 shadow-lg mb-4"
			>
				<Search className="w-8 h-8 text-white" />
			</motion.div>

			{/* Title with Gradient */}
			<h1
				className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 ${isArabic ? "text-right" : "text-left"}`}
			>
				<span className="text-gray-900 dark:text-gray-100">
					{isArabic ? "البحث في" : "Search"}
				</span>
				{" "}
				<span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
					{isArabic ? "شلة فود" : "Shella Food"}
				</span>
			</h1>

			{/* Description */}
			<p
				className={`text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto ${isArabic ? "text-right" : "text-left"}`}
			>
				{isArabic
					? "ابحث عن المتاجر والمطاعم والمنتجات التي تريدها"
					: "Search for stores, restaurants, and products you want"}
			</p>
		</motion.div>
	);
}


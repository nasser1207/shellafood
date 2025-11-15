"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { TEST_CATEGORIES } from "@/lib/data/categories/testData";

interface SearchEmptyStateProps {
	type: "no-results" | "start-search";
	searchTerm?: string;
	onCategoryClick?: (categoryId: string) => void;
}

export default function SearchEmptyState({
	type,
	searchTerm,
	onCategoryClick,
}: SearchEmptyStateProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const popularCategories = TEST_CATEGORIES.slice(0, 6);

	if (type === "no-results") {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className="flex flex-col items-center justify-center py-20"
			>
				<div className="text-6xl mb-4">🔍</div>
				<h3 className={`text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2 ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic ? "لم نجد نتائج" : "No Results Found"}
				</h3>
				<p className={`text-gray-500 dark:text-gray-400 mb-6 ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic
						? `لم نجد نتائج لـ "${searchTerm}". جرب البحث بكلمات مختلفة أو تحقق من الإملاء`
						: `No results found for "${searchTerm}". Try searching with different words or check your spelling`}
				</p>

				{/* Suggested Categories */}
				{popularCategories.length > 0 && (
					<div className="mt-8 w-full max-w-2xl">
						<h4 className={`text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? "اقتراحات:" : "Suggestions:"}
						</h4>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
							{popularCategories.map((category, index) => (
								<motion.button
									key={category.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => onCategoryClick?.(category.id)}
									className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
								>
									{isArabic ? category.name : category.name}
								</motion.button>
							))}
						</div>
					</div>
				)}
			</motion.div>
		);
	}

	// Start search state
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			className="flex flex-col items-center justify-center py-20"
		>
			<motion.div
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
				className="relative mb-8"
			>
				<div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full blur-3xl opacity-50"></div>
				<div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center shadow-lg border-2 border-green-100 dark:border-green-800">
					<Search className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 dark:text-green-400" />
				</div>
			</motion.div>

			<h3 className={`text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2 ${isArabic ? "text-right" : "text-left"}`}>
				{isArabic ? "ابدأ البحث" : "Start Searching"}
			</h3>
			<p className={`text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center ${isArabic ? "text-right" : "text-left"}`}>
				{isArabic
					? "اكتب في مربع البحث أعلاه للعثور على المتاجر والمنتجات"
					: "Type in the search box above to find stores and products"}
			</p>

			{/* Popular Categories */}
			{popularCategories.length > 0 && (
				<div className="mt-8 w-full max-w-2xl">
					<div className={`flex items-center gap-2 mb-4 ${isArabic ? "flex-row-reverse" : ""}`}>
						<TrendingUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
						<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							{isArabic ? "الأقسام الشائعة" : "Popular Categories"}
						</h4>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
						{popularCategories.map((category, index) => (
							<motion.button
								key={category.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 + index * 0.1 }}
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => onCategoryClick?.(category.id)}
								className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all shadow-sm hover:shadow-md"
							>
								{isArabic ? category.name : category.name}
							</motion.button>
						))}
					</div>
				</div>
			)}
		</motion.div>
	);
}


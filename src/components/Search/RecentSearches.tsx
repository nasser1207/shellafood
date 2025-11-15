"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, X, Trash2 } from "lucide-react";
import {
	getSearchHistory,
	removeFromSearchHistory,
	clearSearchHistory,
	SearchHistoryItem,
} from "@/lib/utils/searchUtils";

interface RecentSearchesProps {
	onSearchClick: (term: string) => void;
	visible?: boolean;
}

export default function RecentSearches({ onSearchClick, visible = true }: RecentSearchesProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);

	// Load and sync search history
	useEffect(() => {
		const loadHistory = () => {
			setRecentSearches(getSearchHistory());
		};

		loadHistory();

		// Listen for cross-tab updates
		window.addEventListener("searchHistoryUpdated", loadHistory);
		return () => window.removeEventListener("searchHistoryUpdated", loadHistory);
	}, []);

	const handleRemove = useCallback(
		(e: React.MouseEvent, term: string) => {
			e.stopPropagation();
			removeFromSearchHistory(term);
			setRecentSearches((prev) => prev.filter((item) => item.term !== term));
		},
		[]
	);

	const handleClearAll = useCallback(() => {
		clearSearchHistory();
		setRecentSearches([]);
	}, []);

	if (!visible || recentSearches.length === 0) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, delay: 0.2 }}
			className="mb-8 max-w-3xl mx-auto"
		>
			<div className={`flex items-center justify-between mb-4 ${isArabic ? "flex-row-reverse" : ""}`}>
				<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
					<Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
					<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
						{isArabic ? "البحث الأخير" : "Recent Searches"}
					</h3>
				</div>
				<button
					onClick={handleClearAll}
					className={`flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
					aria-label={isArabic ? "مسح الكل" : "Clear all"}
				>
					<Trash2 className="w-4 h-4" />
					<span>{isArabic ? "مسح الكل" : "Clear all"}</span>
				</button>
			</div>
			<div className={`flex flex-wrap gap-2 ${isArabic ? "justify-end" : "justify-start"}`}>
				<AnimatePresence>
					{recentSearches.map((item, index) => (
						<motion.button
							key={item.term}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ delay: index * 0.05 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => onSearchClick(item.term)}
							className="group relative px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
						>
							<span>{item.term}</span>
							<button
								onClick={(e) => handleRemove(e, item.term)}
								className={`absolute ${isArabic ? "left-1" : "right-1"} top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-all`}
								aria-label={isArabic ? "حذف" : "Remove"}
							>
								<X className="w-3 h-3 text-red-600 dark:text-red-400" />
							</button>
						</motion.button>
					))}
				</AnimatePresence>
			</div>
		</motion.div>
	);
}


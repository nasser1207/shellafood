"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Filter, X, SlidersHorizontal, Star, DollarSign, MapPin } from "lucide-react";

export interface SearchFilters {
	sortBy: "relevance" | "rating" | "distance" | "price";
	minRating: number | null;
	priceRange: [number, number] | null;
	categories: string[];
}

interface SearchFiltersProps {
	filters: SearchFilters;
	onFiltersChange: (filters: SearchFilters) => void;
	onReset: () => void;
	visible?: boolean;
}

const defaultFilters: SearchFilters = {
	sortBy: "relevance",
	minRating: null,
	priceRange: null,
	categories: [],
};

export default function SearchFilters({
	filters,
	onFiltersChange,
	onReset,
	visible = true,
}: SearchFiltersProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [isOpen, setIsOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	// Check if desktop on mount
	useEffect(() => {
		const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
		checkDesktop();
		window.addEventListener("resize", checkDesktop);
		return () => window.removeEventListener("resize", checkDesktop);
	}, []);

	const hasActiveFilters =
		filters.sortBy !== "relevance" ||
		filters.minRating !== null ||
		filters.priceRange !== null ||
		filters.categories.length > 0;

	const handleFilterChange = (key: keyof SearchFilters, value: any) => {
		onFiltersChange({ ...filters, [key]: value });
	};

	const handleReset = () => {
		onReset();
		setIsOpen(false);
	};

	if (!visible) return null;

	return (
		<>
			{/* Mobile Filter Button */}
			<div className="lg:hidden mb-4">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className={`w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-900 dark:text-gray-100 hover:border-green-500 dark:hover:border-green-500 transition-all ${isArabic ? "flex-row-reverse" : ""}`}
				>
					<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
						<SlidersHorizontal className="w-5 h-5" />
						<span>{isArabic ? "تصفية" : "Filters"}</span>
						{hasActiveFilters && (
							<span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
								{Object.values(filters).filter((v) => v !== null && (Array.isArray(v) ? v.length > 0 : v !== "relevance")).length}
							</span>
						)}
					</div>
					<Filter className={`w-5 h-5 ${isOpen ? "rotate-180" : ""} transition-transform`} />
				</button>
			</div>

			{/* Filters Panel */}
			<AnimatePresence>
				{(isOpen || isDesktop) && (
					<motion.div
						initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: isArabic ? 20 : -20 }}
						className={`lg:sticky lg:top-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg dark:shadow-gray-900/50 mb-6 lg:mb-0 ${isOpen ? "block" : "hidden lg:block"}`}
					>
						{/* Header */}
						<div className={`flex items-center justify-between mb-6 ${isArabic ? "flex-row-reverse" : ""}`}>
							<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
								<SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
								<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
									{isArabic ? "تصفية النتائج" : "Filter Results"}
								</h3>
							</div>
							<button
								onClick={() => setIsOpen(false)}
								className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
								aria-label={isArabic ? "إغلاق" : "Close"}
							>
								<X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
							</button>
						</div>

						<div className="space-y-6">
							{/* Sort By */}
							<div>
								<label className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "ترتيب حسب" : "Sort By"}
								</label>
								<div className="space-y-2">
									{[
										{ value: "relevance", label: isArabic ? "الأكثر صلة" : "Most Relevant", icon: Filter },
										{ value: "rating", label: isArabic ? "الأعلى تقييماً" : "Highest Rated", icon: Star },
										{ value: "distance", label: isArabic ? "الأقرب" : "Nearest", icon: MapPin },
										{ value: "price", label: isArabic ? "السعر" : "Price", icon: DollarSign },
									].map((option) => {
										const Icon = option.icon;
										return (
											<button
												key={option.value}
												onClick={() => handleFilterChange("sortBy", option.value)}
												className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
													filters.sortBy === option.value
														? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
														: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
												} ${isArabic ? "flex-row-reverse text-right" : "text-left"}`}
											>
												<Icon className="w-5 h-5 flex-shrink-0" />
												<span className="font-medium">{option.label}</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* Minimum Rating */}
							<div>
								<label className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "الحد الأدنى للتقييم" : "Minimum Rating"}
								</label>
								<div className="flex gap-2">
									{[4, 3, 2, 1].map((rating) => (
										<button
											key={rating}
											onClick={() =>
												handleFilterChange("minRating", filters.minRating === rating ? null : rating)
											}
											className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
												filters.minRating === rating
													? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
													: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
											}`}
										>
											<div className="flex items-center justify-center gap-1">
												<Star className={`w-4 h-4 ${filters.minRating === rating ? "fill-current" : ""}`} />
												<span className="font-medium">{rating}+</span>
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Price Range */}
							<div>
								<label className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "نطاق السعر" : "Price Range"}
								</label>
								<div className="space-y-2">
									{[
										{ label: isArabic ? "أقل من 50" : "Under 50", range: [0, 50] },
										{ label: isArabic ? "50 - 100" : "50 - 100", range: [50, 100] },
										{ label: isArabic ? "100 - 200" : "100 - 200", range: [100, 200] },
										{ label: isArabic ? "أكثر من 200" : "Over 200", range: [200, 1000] },
									].map((option) => {
										const isActive =
											filters.priceRange?.[0] === option.range[0] &&
											filters.priceRange?.[1] === option.range[1];
										return (
											<button
												key={option.label}
												onClick={() =>
													handleFilterChange("priceRange", isActive ? null : option.range)
												}
												className={`w-full px-4 py-2 rounded-lg border-2 transition-all ${
													isActive
														? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
														: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
												} ${isArabic ? "text-right" : "text-left"}`}
											>
												<span className="font-medium">{option.label} {isArabic ? "ريال" : "SAR"}</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* Reset Button */}
							{hasActiveFilters && (
								<button
									onClick={handleReset}
									className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all ${isArabic ? "flex-row-reverse" : ""} flex items-center justify-center gap-2`}
								>
									<X className="w-4 h-4" />
									<span>{isArabic ? "إعادة تعيين" : "Reset Filters"}</span>
								</button>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}


"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface OrdersFiltersProps {
	searchTerm: string;
	onSearchChange: (term: string) => void;
	sortBy: "newest" | "oldest" | "status";
	onSortChange: (sort: "newest" | "oldest" | "status") => void;
	filterStatus?: string;
	onFilterStatusChange?: (status: string) => void;
}

export function OrdersFilters({
	searchTerm,
	onSearchChange,
	sortBy,
	onSortChange,
	filterStatus,
	onFilterStatusChange,
}: OrdersFiltersProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [showFilters, setShowFilters] = useState(false);

	const getStatusLabel = (status: string): string => {
		const labels: Record<string, { en: string; ar: string }> = {
			all: { en: "All", ar: "الكل" },
			pending: { en: "Pending", ar: "قيد الانتظار" },
			preparing: { en: "Preparing", ar: "قيد التحضير" },
			delivering: { en: "Delivering", ar: "قيد التوصيل" },
			completed: { en: "Completed", ar: "مكتمل" },
			cancelled: { en: "Cancelled", ar: "ملغي" },
		};
		const label = labels[status] || labels.all;
		return isArabic ? label.ar : label.en;
	};

	return (
		<div className="space-y-4">
			{/* Search Bar */}
			<div className="relative">
				<div
					className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"}`}
				>
					<Search className="w-5 h-5 text-gray-400" />
				</div>
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={
						isArabic
							? "ابحث برقم الطلب، اسم المتجر..."
							: "Search by order number, store name..."
					}
					className={cn(
						"w-full py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all",
						isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
					)}
					dir={isArabic ? "rtl" : "ltr"}
				/>
				{searchTerm && (
					<button
						onClick={() => onSearchChange("")}
						className={cn(
							"absolute top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors",
							isArabic ? "left-4" : "right-4"
						)}
					>
						<X className="w-5 h-5 text-gray-400" />
					</button>
				)}
			</div>

			{/* Sort & Filter Bar */}
			<div className="flex gap-3">
				{/* Sort Dropdown */}
				<select
					value={sortBy}
					onChange={(e) => onSortChange(e.target.value as "newest" | "oldest" | "status")}
					className={cn(
						"flex-1 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all",
						isArabic ? "text-right" : "text-left"
					)}
					dir={isArabic ? "rtl" : "ltr"}
				>
					<option value="newest">{isArabic ? "الأحدث أولاً" : "Newest First"}</option>
					<option value="oldest">{isArabic ? "الأقدم أولاً" : "Oldest First"}</option>
					<option value="status">{isArabic ? "حسب الحالة" : "By Status"}</option>
				</select>

				{/* Filter Button */}
				{onFilterStatusChange && (
					<button
						onClick={() => setShowFilters(!showFilters)}
						className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:border-green-500 transition-all flex items-center gap-2"
					>
						<SlidersHorizontal className="w-5 h-5" />
						{isArabic ? "فلترة" : "Filter"}
					</button>
				)}
			</div>

			{/* Filter Panel */}
			{onFilterStatusChange && (
				<AnimatePresence>
					{showFilters && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							className="overflow-hidden"
						>
							<div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 space-y-4">
								<h3 className="font-bold text-gray-900 dark:text-white mb-3">
									{isArabic ? "فلترة حسب الحالة" : "Filter by Status"}
								</h3>

								<div className="flex flex-wrap gap-2">
									{["all", "pending", "preparing", "delivering", "completed", "cancelled"].map(
										(status) => (
											<button
												key={status}
												onClick={() => onFilterStatusChange(status)}
												className={cn(
													"px-4 py-2 rounded-full font-semibold text-sm transition-all",
													filterStatus === status
														? "bg-green-600 text-white shadow-lg"
														: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
												)}
											>
												{getStatusLabel(status)}
											</button>
										)
									)}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			)}
		</div>
	);
}


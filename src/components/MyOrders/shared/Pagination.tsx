"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	totalItems: number;
	itemsPerPage: number;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage,
}: PaginationProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	// Calculate the range of items being displayed
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total pages is less than max visible
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage > 3) {
				pages.push("...");
			}

			// Show pages around current page
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push("...");
			}

			// Always show last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className="w-full">
			{/* Items count info */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
				<p className="text-sm text-gray-600 dark:text-gray-400">
					{isArabic ? (
						<>
							عرض <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> إلى{" "}
							<span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> من{" "}
							<span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> طلب
						</>
					) : (
						<>
							Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{" "}
							<span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{" "}
							<span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> orders
						</>
					)}
				</p>
			</div>

			{/* Pagination controls */}
			<div className="flex flex-wrap items-center justify-center gap-2">
				{/* First page button */}
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => onPageChange(1)}
					disabled={currentPage === 1}
					className={cn(
						"p-2 rounded-lg border-2 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center",
						currentPage === 1
							? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
							: "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
					)}
					aria-label={isArabic ? "الصفحة الأولى" : "First page"}
				>
					{isArabic ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
				</motion.button>

				{/* Previous page button */}
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className={cn(
						"p-2 rounded-lg border-2 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center",
						currentPage === 1
							? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
							: "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
					)}
					aria-label={isArabic ? "الصفحة السابقة" : "Previous page"}
				>
					{isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
				</motion.button>

				{/* Page numbers */}
				<div className="flex items-center gap-2 flex-wrap justify-center">
					{pageNumbers.map((page, index) => {
						if (page === "...") {
							return (
								<span
									key={`ellipsis-${index}`}
									className="px-2 text-gray-500 dark:text-gray-400 select-none"
								>
									...
								</span>
							);
						}

						const pageNumber = page as number;
						const isActive = pageNumber === currentPage;

						return (
							<motion.button
								key={pageNumber}
								whileHover={{ scale: isActive ? 1 : 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => onPageChange(pageNumber)}
								className={cn(
									"min-w-[40px] min-h-[40px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 border-2",
									isActive
										? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-600 dark:border-emerald-600 shadow-lg"
										: "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
								)}
								aria-label={isArabic ? `الصفحة ${pageNumber}` : `Page ${pageNumber}`}
								aria-current={isActive ? "page" : undefined}
							>
								{pageNumber}
							</motion.button>
						);
					})}
				</div>

				{/* Next page button */}
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={cn(
						"p-2 rounded-lg border-2 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center",
						currentPage === totalPages
							? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
							: "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
					)}
					aria-label={isArabic ? "الصفحة التالية" : "Next page"}
				>
					{isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
				</motion.button>

				{/* Last page button */}
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage === totalPages}
					className={cn(
						"p-2 rounded-lg border-2 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center",
						currentPage === totalPages
							? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
							: "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
					)}
					aria-label={isArabic ? "الصفحة الأخيرة" : "Last page"}
				>
					{isArabic ? <ChevronsLeft className="w-5 h-5" /> : <ChevronsRight className="w-5 h-5" />}
				</motion.button>
			</div>
		</div>
	);
}


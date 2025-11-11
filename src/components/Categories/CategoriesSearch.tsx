"use client";

import { memo, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

function CategoriesSearch({ searchTerm, onSearchChange }: { searchTerm: string, onSearchChange: (searchTerm: string) => void }) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const content = useMemo(() => ({
		ar: {
			placeholder: "ابحث عن قسم..."
		},
		en: {
			placeholder: "Search for a category..."
		}
	}), []);

	const currentContent = content[language];

	return (
		<div className="mb-8" dir={direction}>
			<div className="mx-auto max-w-md">
				<div className="relative">
					<input
						type="text"
						placeholder={currentContent.placeholder}
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:outline-none transition-all ${
							isArabic 
								? 'pr-12 text-right' 
								: 'pl-12 text-left'
						}`}
						dir={direction}
					/>
					<div className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'}`}>
						<svg
							className="h-5 w-5 text-gray-400 dark:text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo(CategoriesSearch);

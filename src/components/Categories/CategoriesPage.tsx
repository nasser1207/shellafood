"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useCallback, useMemo, memo } from "react";
import CategoriesHeader from "./CategoriesHeader";
import CategoriesSearch from "./CategoriesSearch";
import CategoriesGrid from "./CategoriesGrid";
import { Category } from "../Utils/CategoryCard";


function CategoriesPage({ categories }: { categories: Category[] }) {
	// Destructure props to make it clear they're available if needed
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const [searchTerm, setSearchTerm] = useState("");

	const handleBreadcrumbClick = useCallback((index: number) => {

	}, []);

	const filteredCategories = useMemo(
		() => categories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase())),
		[categories, searchTerm, isArabic]
	);

	const hasSearchResults = filteredCategories.length > 0;
	const showNoResults = !hasSearchResults && searchTerm.trim().length > 0;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				<CategoriesHeader onBreadcrumbClick={handleBreadcrumbClick} />
				<CategoriesSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
				<CategoriesGrid categories={filteredCategories} />

				{showNoResults && (
					<div className={`py-12 text-center`} dir={direction}>
						<div className="mb-4 text-6xl">🔍</div>
						<h3 className={`mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300`}>
							{isArabic ? 'لا توجد نتائج' : 'No search results'}
						</h3>
						<p className={`text-gray-500 dark:text-gray-400`}>
							{isArabic ? 'جرب البحث بكلمة مختلفة' : 'Try searching for a different term'}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default memo(CategoriesPage);

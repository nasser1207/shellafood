"use client";

import { memo } from "react";
import CategoryCard from "../Utils/CategoryCard";
import { Category } from "../Utils/CategoryCard";
import { useLanguage } from "@/contexts/LanguageContext";

function CategoriesGrid({ categories, className, id }: { categories: Category[], className?: string, id?: string }) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<div dir={direction} className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className || ''}`} id={id}>
			{categories.map((category) => (
				<CategoryCard key={category.id} category={category} />
			))} 
		</div>
	);
}

export default memo(CategoriesGrid);

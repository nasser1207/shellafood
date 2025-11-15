"use client";

import { useState, useCallback, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import CategoriesSliderGrid from "./CategoriesSliderGrid";
import CategoriesSliderControls from "./CategoriesSliderControls";
import { Category } from "@/components/Utils/CategoryCard";


function CategoriesSlider({
	categories,
}: { categories: Category[] }) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";


	const [isLoading, setIsLoading] = useState(false);

const handleRefresh = useCallback(() => {
	
}, []);

const handleCategoryClick = useCallback((categoryPath: string, categoryName: string) => {
	if (categoryPath) {
		router.push(categoryPath);
	}
}, [router]);



	// Loading state
	if (isLoading) {
		return (
			<div className="relative flex items-center">
				<div className="scrollbar-hide flex gap-8 space-x-reverse overflow-x-auto px-4 pb-2">
					{Array.from({ length: 5 }, (_, i) => (
						<div key={i} className="flex w-[85px] flex-shrink-0 flex-col items-center text-center">
							<div className="h-[85px] w-[85px] animate-pulse rounded-full bg-gray-300 dark:bg-gray-700"></div>
							<div className="mt-2 h-3 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// Empty state


	// Slider view
	return (
		<CategoriesSliderControls
			onRefresh={handleRefresh}
		>
			<CategoriesSliderGrid
				categories={categories}
				onCategoryClick={handleCategoryClick}
			/>
		</CategoriesSliderControls>
	);
}

export default memo(CategoriesSlider);

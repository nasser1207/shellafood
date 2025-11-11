"use client";

import { memo, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
	export interface Category {
		id: string;
		name: string;
		description: string;
		image: string;
		slug?: string;
	}

function CategoryCard({ category }: { category: Category }) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const router = useRouter();
	
	const handleClick = useCallback(() => {
		// Use slug if available (English), otherwise fallback to name
		const routeParam = category.slug || category.name;
		router.push(`/categories/${routeParam}`);
	}, [router, category.slug, category.name]);

	return (
		<div
			dir={direction}
			onClick={handleClick}
			className={`transform cursor-pointer rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm dark:shadow-gray-900/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600`}
		>
			<div className="text-center">
				<div className={`mb-4 flex ${isArabic ? 'justify-end' : 'justify-center'}`}>
					{category.image ? (
						<div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
							<Image
								src={category.image}
								alt={category.name}
								fill
								className="object-cover"
								loading="lazy"
								sizes="96px"
							/>
						</div>
					) : (
						<div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 shadow-md">
							<svg className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
							</svg>
						</div>
					)}
				</div>
				<h3 className={`text-xl font-bold mb-2 text-gray-900 dark:text-gray-100`}>
					{category.name}
				</h3>
				<p className={`text-sm text-gray-600 dark:text-gray-400`}>
					{category.description}
				</p>
			</div>
		</div>
	);
}

export default memo(CategoryCard);

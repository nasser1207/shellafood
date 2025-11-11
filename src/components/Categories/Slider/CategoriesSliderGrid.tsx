"use client";

import { memo, useMemo, useCallback } from "react";

interface Category {
	id: string;
	name: string;
	description?: string;
	image?: string;
	path?: string;
}

interface CategoriesSliderGridProps {
	categories: Category[];
	onCategoryClick?: (categoryPath: string, categoryName: string) => void;
	className?: string;
	id?: string;
}

function CategoriesSliderGrid({ categories, onCategoryClick, className = "", id }: CategoriesSliderGridProps) {
	// Memoized category styles
	const CATEGORY_STYLES = useMemo(() => ({
		المطاعم: {
			icon: "🍽️",
			color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30",
			textColor: "text-red-700 dark:text-red-400",
		},
		السوبرماركت: {
			icon: "🛒",
			color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30",
			textColor: "text-blue-700 dark:text-blue-400",
		},
		الصيدليات: {
			icon: "💊",
			color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30",
			textColor: "text-green-700 dark:text-green-400",
		},
		الإلكترونيات: {
			icon: "📱",
			color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30",
			textColor: "text-purple-700 dark:text-purple-400",
		},
		الملابس: {
			icon: "👕",
			color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/30",
			textColor: "text-pink-700 dark:text-pink-400",
		},
		المنزل: {
			icon: "🏠",
			color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
			textColor: "text-indigo-700 dark:text-indigo-400",
		},
		"هايبر شلة": {
			icon: "🏪",
			color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30",
			textColor: "text-purple-700 dark:text-purple-400",
		},
		"استلام وتسليم": {
			icon: "📦",
			color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
			textColor: "text-indigo-700 dark:text-indigo-400",
		},
	}), []);

	const getCategoryStyle = useCallback((categoryName: string) => {
		return (CATEGORY_STYLES as Record<string, { icon: string; color: string; textColor: string }>)[categoryName] || {
			icon: "📂",
			color: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700",
			textColor: "text-gray-700 dark:text-gray-300",
		};
	}, [CATEGORY_STYLES]);

	return (
		<div
			id={id || "categories-scroll-container"}
			className={`scrollbar-hide flex gap-6 space-x-reverse overflow-x-auto px-4 pb-2 ${className}`}
		>
			{categories.map((category) => {
				const style = getCategoryStyle(category.name);
				const categoryPath = category.path || `/categories/${category.id}`;
				
				return (
					<button
						key={category.id}
						onClick={() => onCategoryClick?.(categoryPath, category.name)}
						className="flex w-[100px] flex-shrink-0 transform cursor-pointer flex-col items-center text-center transition-all duration-300 hover:scale-105"
					>
						<div className="relative h-[90px] w-[90px] overflow-hidden rounded-full">
							{category.image ? (
								<img
									src={category.image}
									alt={category.name}
									className="absolute inset-0 h-full w-full object-cover"
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										target.style.display = "none";
										const parent = target.parentElement;
										if (parent) {
											parent.innerHTML = `<div class="w-full h-full flex items-center justify-center rounded-full ${style.color}"><span class="text-3xl">${style.icon}</span></div>`;
										}
									}}
								/>
							) : (
								<div
									className={`flex h-full w-full items-center justify-center rounded-full ${style.color}`}
								>
									<span className="text-3xl">{style.icon}</span>
								</div>
							)}
						</div>
						<p
							className={`mt-2 text-xs font-medium ${style.textColor} line-clamp-2`}
						>
							{category.name}
						</p>
					</button>
				);
			})}
		</div>
	);
}

export default memo(CategoriesSliderGrid);

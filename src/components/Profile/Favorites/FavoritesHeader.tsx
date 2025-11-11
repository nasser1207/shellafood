"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaHeart, FaFilter, FaSearch } from "react-icons/fa";

interface FavoritesHeaderProps {
	onSearch?: (query: string) => void;
	onFilter?: () => void;
	onClearAll?: () => void;
	totalCount?: number;
}

export default function FavoritesHeader({ onSearch, onFilter, onClearAll, totalCount = 0 }: FavoritesHeaderProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6" dir={direction}>
			<div className={`flex flex-col  sm:items-center sm:justify-between gap-4 ${isArabic ? 'sm:flex-row' : 'sm:flex-row'}`}>
				{/* Title Section */}
				<div className={`flex items-center gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
					<div className="h-10 w-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
						<FaHeart className="text-red-600 dark:text-red-400 text-lg" />
					</div>
					<div className={isArabic ? 'text-right' : 'text-left'}>
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
							{isArabic ? "المفضلة" : "Favorites"}
						</h1>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							{isArabic 
								? `لديك ${totalCount} عنصر في المفضلة`
								: `You have ${totalCount} items in favorites`
							}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className={`flex flex-col  gap-3 ${isArabic ? 'sm:flex-row' : 'sm:flex-row'}`}>
					{/* Search Bar */}
					{onSearch && (
						<div className="relative">
							<FaSearch className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm ${isArabic ? 'right-3' : 'left-3'}`} />
							<input
								type="text"
								placeholder={isArabic ? "البحث في المفضلة..." : "Search favorites..."}
								onChange={(e) => onSearch(e.target.value)}
								className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
								dir={direction}
							/>
						</div>
					)}

					{/* Filter Button */}
					{onFilter && (
						<button
							onClick={onFilter}
							className="flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm touch-manipulation"
						>
							<FaFilter className="text-sm" />
							<span>{isArabic ? "تصفية" : "Filter"}</span>
						</button>
					)}

					{/* Clear All Button */}
					{onClearAll && totalCount > 0 && (
						<button
							onClick={onClearAll}
							className="flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium text-sm touch-manipulation"
						>
							<FaHeart className="text-sm" />
							<span>{isArabic ? "مسح الكل" : "Clear All"}</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

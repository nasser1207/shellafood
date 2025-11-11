"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { IconType } from "react-icons";

interface Tab {
	id: string;
	label: string;
	icon: IconType;
	count: number;
	color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

interface FavoritesTabsProps {
	tabs: Tab[];
	activeTab: string;
	onTabChange: (tabId: string) => void;
}

export default function FavoritesTabs({ tabs, activeTab, onTabChange }: FavoritesTabsProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const getColorClasses = (color: string, isActive: boolean) => {
		const colors = {
			blue: isActive 
				? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" 
				: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400",
			green: isActive 
				? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800" 
				: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400",
			orange: isActive 
				? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800" 
				: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400",
			red: isActive 
				? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" 
				: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400",
			purple: isActive 
				? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800" 
				: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
		};
		return colors[color as keyof typeof colors] || colors.blue;
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2" dir={direction}>
			<div className="grid grid-cols-2 sm:flex gap-2 sm:flex-row sm:justify-center">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;
					
					return (
						<button
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-lg border-2 transition-all duration-200 touch-manipulation ${getColorClasses(tab.color, isActive)}`}
						>
							<Icon className="text-sm" />
							<span className="font-medium text-xs sm:text-sm">{tab.label}</span>
							{tab.count > 0 && (
								<span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${
									isActive 
										? 'bg-white dark:bg-gray-800 text-current' 
										: 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
								}`}>
									{tab.count}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}

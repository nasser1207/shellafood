"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { getMainCards, getQuickActions, getMoreOptions, getColorClasses, getIconBgClasses } from "./dashboardData";

interface MobileDashboardProps {
	onNavigate: (page: string) => void;
}

export default function MobileDashboard({ onNavigate }: MobileDashboardProps) {
	const { language, t } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const mainCards = getMainCards(t);
	const quickActions = getQuickActions(t);
	const moreOptions = getMoreOptions(t);

	return (
		<div className="block lg:hidden" dir={direction}>
			<div className="px-4 py-6">
				{/* Mobile Header */}
				<div className="mb-6">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
							{t("profile.dashboard.title")}
						</h1>
						<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
							{t("profile.dashboard.subtitle")}
						</p>
					</div>
				</div>

				{/* Main Cards */}
				<div className="space-y-4 mb-6">
					{mainCards.map((card) => (
						<div key={card.key} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
							<div className="flex items-center space-x-4 space-x-reverse mb-4">
								<div className={`h-12 w-12 ${getIconBgClasses(card.color)} rounded-xl flex items-center justify-center`}>
									<span className="text-2xl">{card.icon}</span>
								</div>
								<div className="flex-1">
									<h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1">
										{card.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-400 text-sm">
										{card.description}
									</p>
								</div>
							</div>
							<button 
								onClick={() => onNavigate(card.key)}
								className={`w-full ${getColorClasses(card.color)} text-white py-3 px-4 rounded-xl transition-colors font-medium text-base`}
							>
								{card.buttonText}
							</button>
						</div>
					))}
				</div>

				{/* Quick Actions */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5 text-center">
						{isArabic ? "إجراءات سريعة أخرى" : "Other Quick Actions"}
					</h3>
					<div className="grid grid-cols-2 gap-4">
						{quickActions.map((action) => (
							<button 
								key={action.key}
								onClick={() => onNavigate(action.key)}
								className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
							>
								<span className="text-3xl mb-3 group-hover:scale-110 transition-transform">
									{action.icon}
								</span>
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
									{action.label}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* More Options */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5 text-center">
						{isArabic ? "خيارات إضافية" : "More Options"}
					</h3>
					<div className="grid grid-cols-2 gap-4">
						{moreOptions.map((option) => (
							<button 
								key={option.key}
								onClick={() => onNavigate(option.key)}
								className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
							>
								<span className="text-3xl mb-3 group-hover:scale-110 transition-transform">
									{option.icon}
								</span>
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
									{option.label}
								</span>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

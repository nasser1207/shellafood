"use client";

import React, { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import Sidebar from "../Sidebar";
import { getMainCards, getQuickActions, getMoreOptions, getColorClasses, getIconBgClasses } from "./dashboardData";

interface DesktopDashboardProps {
	activePage: string;
	onNavigate: (page: string) => void;
}

// Route mapping - moved outside to avoid recreation
const routes: Record<string, string> = {
	profile: "/profile",
	accountInfo: "/profile/account-info",
	addresses: "/profile/addresses",
	favorites: "/profile/favorites",
	stats: "/profile/stats",
	wallet: "/profile/wallet",
	kaidhaWallet: "/profile/kaidha-wallet",
	points: "/profile/points",
	vouchers: "/profile/vouchers",
	privacy: "/profile/policies/privacy",
	kaidhaTerms: "/profile/policies/kaidha-terms",
	terms: "/profile/policies/terms",
	support: "/profile/support",
	refund: "/profile/policies/refund"
};

export default function DesktopDashboard({ activePage, onNavigate }: DesktopDashboardProps) {
	const { language, t } = useLanguage();
	const router = useRouter();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	// Memoize dashboard data to prevent recalculation on every render
	const mainCards = useMemo(() => getMainCards(t), [t]);
	const quickActions = useMemo(() => getQuickActions(t), [t]);
	const moreOptions = useMemo(() => getMoreOptions(t), [t]);

	// Prefetch all profile routes on mount for instant navigation
	useEffect(() => {
		Object.values(routes).forEach((route) => {
			router.prefetch(route);
		});
	}, [router]);

	// Note: onClick removed from Links - Next.js Link handles navigation automatically
	// activePage updates via pathname change in ProfileDashboard, no need for onClick

	return (
		<div className="hidden lg:block" dir={direction}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
				<div className={`flex gap-4 lg:gap-6 xl:gap-8 ${isArabic ? 'flex-row' : 'flex-row'}`}>
					{/* Sidebar */}
					<div className="w-72 lg:w-80 xl:w-96 flex-shrink-0">
						<div className="sticky top-6 lg:top-8">
							<Sidebar activePage={activePage} setActivePage={onNavigate} />
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1 min-w-0">
						{/* Header */}
						<div className="mb-6 lg:mb-8">
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
								<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 lg:mb-4">
									{t("profile.dashboard.title")}
								</h1>
								<p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg leading-relaxed">
									{t("profile.dashboard.subtitle")}
								</p>
							</div>
						</div>

						{/* Main Cards */}
						<div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
							{mainCards.map((card) => {
								const route = routes[card.key] || "/profile";
								return (
									<div key={card.key} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 lg:p-6 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow duration-200">
										<div className={`flex items-center mb-4 ${isArabic ? 'space-x-reverse space-x-3 lg:space-x-4' : 'space-x-3 lg:space-x-4'}`}>
											<div className={`h-10 w-10 lg:h-12 lg:w-12 ${getIconBgClasses(card.color)} rounded-xl flex items-center justify-center flex-shrink-0`}>
												<span className="text-lg lg:text-2xl">{card.icon}</span>
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base lg:text-lg mb-1">
													{card.title}
												</h3>
												<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
													{card.description}
												</p>
											</div>
										</div>
										<Link 
											href={route}
											prefetch={true}
											className={`block w-full ${getColorClasses(card.color)} text-white py-2.5 lg:py-3 px-4 rounded-xl transition-colors font-medium text-sm lg:text-base text-center`}
										>
											{card.buttonText}
										</Link>
									</div>
								);
							})}
						</div>

						{/* Quick Actions */}
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 lg:p-6 mb-4 lg:mb-6">
							<h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6 text-center">
								{isArabic ? "إجراءات سريعة أخرى" : "Other Quick Actions"}
							</h3>
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
								{quickActions.map((action) => {
									const route = routes[action.key] || "/profile";
									return (
										<Link 
											key={action.key}
											href={route}
											prefetch={true}
											className="flex flex-col items-center p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
										>
											<span className="text-2xl lg:text-3xl mb-2 lg:mb-3 group-hover:scale-110 transition-transform">
												{action.icon}
											</span>
											<span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
												{action.label}
											</span>
										</Link>
									);
								})}
							</div>
						</div>

						{/* More Options */}
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 lg:p-6">
							<h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6 text-center">
								{isArabic ? "خيارات إضافية" : "More Options"}
							</h3>
							<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
								{moreOptions.map((option) => {
									const route = routes[option.key] || "/profile";
									return (
										<Link 
											key={option.key}
											href={route}
											prefetch={true}
											className="flex flex-col items-center p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
										>
											<span className="text-2xl lg:text-3xl mb-2 lg:mb-3 group-hover:scale-110 transition-transform">
												{option.icon}
											</span>
											<span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
												{option.label}
											</span>
										</Link>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

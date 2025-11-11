"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaUser, FaMapMarkerAlt, FaHeart, FaChartBar, FaWallet, FaCoins, FaStar, FaTicketAlt, FaShieldAlt, FaFileContract, FaQuestionCircle, FaSignOutAlt, FaHome } from "react-icons/fa";

interface SidebarProps {
	activePage: string;
	setActivePage: (page: string) => void;
	onLogout?: () => void;
}

export default function Sidebar({ activePage, setActivePage, onLogout }: SidebarProps) {
	const { language, t } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	// Sidebar items with icons and keys
	const sidebarItems = [
		{ key: "profile", icon: FaHome, label: isArabic ? "الرئيسية" : "Dashboard" },
		{ key: "accountInfo", icon: FaUser, label: t("profile.navigation.accountInfo") },
		{ key: "addresses", icon: FaMapMarkerAlt, label: t("profile.navigation.addresses") },
		{ key: "favorites", icon: FaHeart, label: t("profile.navigation.favorites") },
		{ key: "stats", icon: FaChartBar, label: t("profile.navigation.stats") },
		{ key: "wallet", icon: FaWallet, label: t("profile.navigation.wallet") },
		{ key: "kaidhaWallet", icon: FaCoins, label: t("profile.navigation.kaidhaWallet") },
		{ key: "points", icon: FaStar, label: t("profile.navigation.points") },
		{ key: "vouchers", icon: FaTicketAlt, label: t("profile.navigation.vouchers") },
		{ key: "privacy", icon: FaShieldAlt, label: t("profile.navigation.privacy") },
		{ key: "kaidhaTerms", icon: FaFileContract, label: t("profile.navigation.kaidhaTerms") },
		{ key: "terms", icon: FaFileContract, label: t("profile.navigation.terms") },
		{ key: "support", icon: FaQuestionCircle, label: t("profile.navigation.support") },
		{ key: "refund", icon: FaShieldAlt, label: t("profile.navigation.refund") },
		{ key: "logout", icon: FaSignOutAlt, label: t("profile.navigation.logout"), isLogout: true }
	];

	const handleItemClick = (item: typeof sidebarItems[0]) => {
		if (item.isLogout) {
			if (onLogout) {
				onLogout();
			}
		} else {
			setActivePage(item.key);
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6" dir={direction}>
			{/* Profile Header */}
			<div className={`flex items-center mb-6 lg:mb-8 pb-4 lg:pb-6 border-b border-gray-200 dark:border-gray-700 ${isArabic ? 'space-x-reverse space-x-2 lg:space-x-3' : 'space-x-2 lg:space-x-3'}`}>
				<div className="h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
					<span className="text-white font-bold text-sm lg:text-lg">ش</span>
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xs lg:text-sm truncate">
						{isArabic ? "أحمد محمد" : "Ahmed Mohammed"}
					</h3>
					<p className="text-gray-500 dark:text-gray-400 text-xs truncate">
						{isArabic ? "عضو مميز" : "Premium Member"}
					</p>
				</div>
			</div>

			{/* Navigation Items */}
			<nav>
				<ul className="space-y-1 lg:space-y-2">
					{sidebarItems.map((item, index) => {
						const Icon = item.icon;
						const isActive = activePage === item.key;
						const isLogout = item.isLogout;

						return (
							<li key={index}>
								<button
									onClick={() => handleItemClick(item)}
									className={`w-full flex items-center px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-200 ${
										isActive && !isLogout
											? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 font-semibold shadow-sm"
											: isLogout
											? "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-500"
											: "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
									} ${isArabic ? 'space-x-reverse space-x-2 lg:space-x-3' : 'space-x-2 lg:space-x-3'}`}
								>
									<Icon 
										size={16} 
										className={`flex-shrink-0 ${
											isActive && !isLogout ? "text-green-600 dark:text-green-400" : 
											isLogout ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
										}`} 
									/>
									<span className="text-xs lg:text-sm font-medium flex-1 text-right lg:text-right truncate">
										{item.label}
									</span>
									{isActive && !isLogout && (
										<div className="h-1.5 w-1.5 lg:h-2 lg:w-2 bg-green-500 dark:bg-green-400 rounded-full flex-shrink-0"></div>
									)}
								</button>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Footer */}
			<div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200 dark:border-gray-700">
				<div className="text-center">
					<p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
						{isArabic ? "الإصدار 1.0.0" : "Version 1.0.0"}
					</p>
					<div className={`flex items-center justify-center ${isArabic ? 'space-x-reverse space-x-1.5 lg:space-x-2' : 'space-x-1.5 lg:space-x-2'}`}>
						<div className="h-1.5 w-1.5 lg:h-2 lg:w-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
						<span className="text-xs text-green-600 dark:text-green-400 font-medium">
							{isArabic ? "متصل" : "Online"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

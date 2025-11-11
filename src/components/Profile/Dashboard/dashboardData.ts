/**
 * Shared dashboard data and configuration
 * Used by both MobileDashboard and DesktopDashboard components
 */

export interface DashboardCard {
	key: string;
	icon: string;
	title: string;
	description: string;
	buttonText: string;
	color: 'blue' | 'red' | 'green';
}

export interface DashboardAction {
	key: string;
	icon: string;
	label: string;
}

export const getMainCards = (t: (key: string) => string): DashboardCard[] => [
	{
		key: "accountInfo",
		icon: "👤",
		title: t("profile.dashboard.accountInfo"),
		description: t("profile.dashboard.accountInfoDesc"),
		buttonText: t("profile.dashboard.viewDetails"),
		color: "blue"
	},
	{
		key: "favorites",
		icon: "❤️",
		title: t("profile.dashboard.favorites"),
		description: t("profile.dashboard.favoritesDesc"),
		buttonText: t("profile.dashboard.viewFavorites"),
		color: "red"
	},
	{
		key: "wallet",
		icon: "💰",
		title: t("profile.dashboard.wallet"),
		description: t("profile.dashboard.walletDesc"),
		buttonText: t("profile.dashboard.viewWallet"),
		color: "green"
	}
];

export const getQuickActions = (t: (key: string) => string): DashboardAction[] => [
	{ key: "addresses", icon: "🏠", label: t("profile.navigation.addresses") },
	{ key: "stats", icon: "📊", label: t("profile.navigation.stats") },
	{ key: "points", icon: "⭐", label: t("profile.navigation.points") },
	{ key: "support", icon: "🆘", label: t("profile.navigation.support") }
];

export const getMoreOptions = (t: (key: string) => string): DashboardAction[] => [
	{ key: "kaidhaWallet", icon: "🪙", label: t("profile.navigation.kaidhaWallet") },
	{ key: "vouchers", icon: "🎫", label: t("profile.navigation.vouchers") },
	{ key: "privacy", icon: "🔒", label: t("profile.navigation.privacy") },
	{ key: "terms", icon: "📋", label: t("profile.navigation.terms") },
	{ key: "kaidhaTerms", icon: "📄", label: t("profile.navigation.kaidhaTerms") },
	{ key: "refund", icon: "↩️", label: t("profile.navigation.refund") }
];

export const getColorClasses = (color: string): string => {
	const colors = {
		blue: "bg-blue-600 hover:bg-blue-700",
		red: "bg-red-600 hover:bg-red-700",
		green: "bg-green-600 hover:bg-green-700"
	};
	return colors[color as keyof typeof colors] || colors.blue;
};

export const getIconBgClasses = (color: string): string => {
	const colors = {
		blue: "bg-blue-100 dark:bg-blue-900/30",
		red: "bg-red-100 dark:bg-red-900/30",
		green: "bg-green-100 dark:bg-green-900/30"
	};
	return colors[color as keyof typeof colors] || colors.blue;
};

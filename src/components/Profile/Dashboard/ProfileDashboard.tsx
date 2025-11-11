"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";

// Lazy load dashboard components for better performance
const MobileDashboard = dynamic(() => import("./MobileDashboard"), {
	loading: () => <div className="lg:hidden h-screen bg-gray-50" />,
});

const DesktopDashboard = dynamic(() => import("./DesktopDashboard"), {
	loading: () => <div className="hidden lg:block h-screen bg-gray-50" />,
	ssr: true, // Keep SSR for desktop
});

// Route mapping outside component to avoid recreation
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

// Memoized path matcher
const getActivePageFromPath = (path: string): string => {
	const pathMap: Record<string, string> = {
		"/profile": "profile",
		"/profile/account-info": "accountInfo",
		"/profile/addresses": "addresses",
		"/profile/favorites": "favorites",
		"/profile/stats": "stats",
		"/profile/wallet": "wallet",
		"/profile/kaidha-wallet": "kaidhaWallet",
		"/profile/points": "points",
		"/profile/vouchers": "vouchers",
		"/profile/policies/privacy": "privacy",
		"/profile/policies/kaidha-terms": "kaidhaTerms",
		"/profile/policies/terms": "terms",
		"/profile/support": "support",
		"/profile/policies/refund": "refund"
	};
	
	return pathMap[path] || "profile";
};

export default function ProfileDashboard() {
	const pathname = usePathname();
	const router = useRouter();
	const { language } = useLanguage();
	const [isPending, startTransition] = useTransition();
	
	const direction = language === 'ar' ? 'rtl' : 'ltr';

	// Memoize active page calculation
	const activePage = useMemo(() => getActivePageFromPath(pathname), [pathname]);

	// Prefetch common routes on mount
	useEffect(() => {
		const commonRoutes = [
			"/profile/favorites",
			"/profile/addresses",
			"/profile/wallet"
		];
		
		commonRoutes.forEach(route => {
			router.prefetch(route);
		});
	}, [router]);

	const handleNavigation = (page: string) => {
		const route = routes[page];
		if (route && route !== pathname) {
			// Use startTransition for non-blocking navigation
			startTransition(() => {
				router.push(route, { scroll: false });
			});
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			{isPending && (
				<div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 z-50">
					<div className="h-full bg-blue-500 dark:bg-blue-400 animate-[shimmer_1s_ease-in-out_infinite]" 
						 style={{ width: '30%' }} />
				</div>
			)}
			<MobileDashboard onNavigate={handleNavigation} />
			<DesktopDashboard activePage={activePage} onNavigate={handleNavigation} />
		</div>
	);
}	
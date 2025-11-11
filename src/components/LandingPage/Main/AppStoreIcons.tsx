"use client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppStoreIcons() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<div className={`flex flex-wrap gap-3 ${isArabic ? 'items-start justify-center lg:justify-end' : 'items-end justify-center lg:justify-start'}`}>
						<a
							className="block h-12 w-36 overflow-hidden rounded-lg shadow-md dark:shadow-gray-900/50 transition-transform duration-300 hover:scale-105"
							href="https://apps.apple.com/us/app/%D8%B4%D9%84%D9%87/id6739772273?l=ar"
							target="_blank"
						>
							<img
								src="appstore.png"
								alt="App Store"
								className="h-full w-full object-cover dark:opacity-80 transition-opacity duration-300"
							/>
						</a>
						<a
							className="block h-12 w-36 overflow-hidden rounded-lg shadow-md dark:shadow-gray-900/50 transition-transform duration-300 hover:scale-105"
							href="https://play.google.com/store/apps/details?id=com.food.shala&hl=ar&pli=1"
							target="_blank"
						>
							<img
								src="googleplay.png"
								alt="Google Play"
								className="h-full w-full object-cover dark:opacity-80 transition-opacity duration-300"
							/>
						</a>
						<a
							className="block h-12 w-36 overflow-hidden rounded-lg shadow-md dark:shadow-gray-900/50 transition-transform duration-300 hover:scale-105"
							href="https://play.google.com/store/apps/details?id=com.food.shala&hl=ar&pli=1"
							target="_blank"
						>
							<img
								src="appgalary.png"
								alt="AppGallery"
								className="h-full w-full object-cover dark:opacity-80 transition-opacity duration-300"
							/>
						</a>
					</div>
	);
}
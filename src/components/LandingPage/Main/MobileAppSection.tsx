"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import AppStoreIcons from "./AppStoreIcons";

export default function MobileAppSection() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<section className="mb-8 rounded-xl bg-[#EAF6EC] dark:bg-gray-800/50 p-6 shadow-md dark:shadow-gray-900/50 md:p-12">
			<div className={`grid items-center justify-center gap-6 lg:grid-cols-2 ${isArabic ? '' : 'lg:grid-flow-col-dense'}`}>
				{/* Content and Store Icons */}
				<div className={`flex flex-col  gap-6 text-center ${isArabic ? 'items-start lg:text-right lg:col-end-2' : 'items-end lg:text-left lg:col-start-2'}`}>
					<div className="flex flex-col ">
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 md:text-4xl lg:text-5xl">
							<span className="text-[#1C4234] dark:text-green-400">
								{t("landing.mobileApp.title")}
							</span>
						</h2>
						<p className="mt-2 text-base text-gray-700 dark:text-gray-300 md:text-lg">
							{t("landing.mobileApp.subtitle")}
						</p>
					</div>

					{/* App Store Icons */}
					<AppStoreIcons />
				</div>

				{/* Mobile App Image */}
				<div className={`flex justify-center ${isArabic ? 'lg:justify-start' : 'lg:justify-end lg:col-start-1'}`}>
					<img
						src="imagemobile.png"
						alt={isArabic ? "تطبيق شلة" : "Shalla App"}
						className="h-auto max-w-full -translate-y-[-25px] md:translate-y-[-70px] lg:translate-y-[-70px] dark:opacity-80 transition-opacity duration-300"
					/>
				</div>
			</div>
		</section>
	);
}

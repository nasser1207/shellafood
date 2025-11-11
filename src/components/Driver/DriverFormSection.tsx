// src/components/Driver/DriverFormSection.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import DriverForm from "./DriverForm";

export default function DriverFormSection() {
	const { t, language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<section className="mb-8 rounded-xl bg-[#FFFFFF] dark:bg-gray-900 p-6 shadow-md md:p-12" dir={direction}>
			<div className={`text-center font-['Readex_Pro'] text-[39px] leading-none font-semibold tracking-normal text-gray-900 dark:text-gray-100 ${isArabic ? 'text-right' : 'text-left'}`}>
				<p>{t("driver.title")}</p>
				<p className="font-['Readex_Pro'] p-2.5 text-[16px] text-[#8C8C8C] dark:text-gray-400">
					{isArabic 
						? "انضم إلى فريق سائقي شلة وابدأ رحلتك في عالم التوصيل" 
						: "Join Shilla's driver team and start your delivery journey"
					}
				</p>
			</div>

			<div className="">
				<DriverForm />
			</div>
		</section>
	);
}


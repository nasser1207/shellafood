// src/components/Partner/PartnerNewsletter.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function PartnerNewsletter() {
	const { t, language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<section className={`mx-auto max-w-lg rounded-lg bg-gray-100 dark:bg-gray-800 p-10 text-center shadow-lg`} dir={direction}>
			<h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
				{t("partner.newsletter.title")}
			</h2>
			<p className="mb-6 text-gray-600 dark:text-gray-400">
				{t("partner.newsletter.description")}
				<br />
				{t("partner.newsletter.subscribe")}
			</p>
			<div className="flex gap-2">
				<input
					type="email"
					placeholder="ex@example.com"
					className={`flex-grow rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 p-3 ${isArabic ? 'text-right' : 'text-left'}`}
				/>
				<button className="rounded-md bg-green-500 dark:bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-600 dark:hover:bg-green-700">
					{t("partner.newsletter.button")}
				</button>
			</div>
		</section>
	);
}


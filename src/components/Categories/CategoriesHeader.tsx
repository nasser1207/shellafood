"use client";

import { memo, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumb from "@/components/HomePage/Breadcrumb";

function CategoriesHeader({ onBreadcrumbClick }: { onBreadcrumbClick: (index: number) => void }) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const content = useMemo(() => ({
		ar: {
			title: "أقسامنا",
			description: "اكتشف جميع أقسام شلة واختر ما يناسب احتياجاتك من مطاعم، سوبرماركت، صيدليات وأكثر",
			breadcrumb: ["الرئيسية", "أقسامنا"]
		},
		en: {
			title: "Our Categories",
			description: "Discover all Shilla categories and choose what suits your needs from restaurants, supermarkets, pharmacies and more",
			breadcrumb: ["Home", "Categories"]
		}
	}), []);

	const currentContent = content[language];

	return (
		<div dir={direction}>
			<div className="mb-6">
				<Breadcrumb
					path={currentContent.breadcrumb}
					onBreadcrumbClick={onBreadcrumbClick}
				/>
			</div>

			<div className={`mb-8 ${isArabic ? 'text-right' : 'text-center'}`}>
				<h1 className={`mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 ${isArabic ? 'text-right' : 'text-center'}`}>
					{currentContent.title}
				</h1>
				<p className={`mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400 ${isArabic ? 'text-right' : 'text-center'}`}>
					{currentContent.description}
				</p>
			</div>
		</div>
	);
}

export default memo(CategoriesHeader);

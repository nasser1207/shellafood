// src/components/Investor/InvestorCards.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function InvestorCards() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<section className="mb-6 bg-white dark:bg-gray-900 p-3 md:mb-8 md:p-12" dir={direction}>
			<div className={`flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-8 ${isArabic ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
				{/* البطاقة الأولى */}
				<div className="w-full max-w-[550px] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 lg:w-1/2">
					<div className="relative aspect-[550/300] w-full">
						<img
							src="investore1.png"
							alt={isArabic ? "عامل التوصيل على دراجة" : "Delivery Agent on a bike"}
							className="h-full w-full object-cover"
						/>
					</div>
					<div className={`p-4 sm:p-6 ${isArabic ? 'text-right' : 'text-left'}`}>
						<h3 className="mb-2 text-lg font-semibold text-green-600 dark:text-green-400 sm:text-xl">
							{isArabic ? "فرص استثمارية متميزة" : "Exceptional Investment Opportunities"}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
							{isArabic 
								? "انضم إلى شبكة المستثمرين في شلة واستفد من الفرص الاستثمارية المتميزة في قطاع التوصيل والخدمات"
								: "Join Shilla's investor network and benefit from exceptional investment opportunities in the delivery and services sector"
							}
						</p>
					</div>
				</div>

				{/* البطاقة الثانية */}
				<div className="w-full max-w-[550px] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 lg:w-1/2">
					<div className="relative aspect-[550/300] w-full">
						<img
							src="investore2.png"
							alt={isArabic ? "عامل التوصيل يسلم الطلبية" : "Delivery Agent handing over a package"}
							className="h-full w-full object-cover"
						/>
					</div>
					<div className={`p-4 sm:p-6 ${isArabic ? 'text-right' : 'text-left'}`}>
						<h3 className="mb-2 text-lg font-semibold text-green-600 dark:text-green-400 sm:text-xl">
							{isArabic ? "نمو مستمر ومضمون" : "Continuous and Guaranteed Growth"}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
							{isArabic 
								? "استثمر في مستقبل التوصيل والخدمات مع عوائد مضمونة ونمو مستمر في السوق السعودي المتنامي"
								: "Invest in the future of delivery and services with guaranteed returns and continuous growth in the growing Saudi market"
							}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

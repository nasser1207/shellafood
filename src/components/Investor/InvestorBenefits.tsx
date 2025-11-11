// src/components/Investor/InvestorBenefits.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function InvestorBenefits() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const benefits = {
		ar: [
			"يساعد الاستثمار في الأعمال على ضمان نجاح الشركة على المدى الطويل",
			"الاستثمار التجاري يساعد على خلق فرص العمل",
			"يمكن أن يساعد الاستثمار في الشركات الناشئة على تعزيز النمو الاقتصادي",
			"يمكن أن يؤدي الاستثمار في الشركات الناشئة إلى الابتكار",
			"يمكن أن يساعد الاستثمار التجاري في جذب الموظفين الموهوبين"
		],
		en: [
			"Business investment helps ensure long-term company success",
			"Commercial investment helps create job opportunities",
			"Startup investment can help boost economic growth",
			"Startup investment can lead to innovation",
			"Commercial investment can help attract talented employees"
		]
	};

	// Gradient colors for each circle
	const circleColors = [
		"from-purple-600 to-purple-400", // Purple
		"from-blue-500 to-blue-300", // Blue
		"from-green-500 to-green-300", // Green
		"from-orange-500 to-yellow-400", // Orange
		"from-pink-600 to-red-400" // Red
	];

	const currentBenefits = benefits[language];

	return (
		<section className="w-full bg-[#e6ebf9] dark:bg-gray-800 py-16 px-4" dir={direction}>
			<div className="flex flex-col items-center">
				<h2 className={`mb-12 text-center font-['Readex_Pro'] text-3xl font-semibold text-gray-800 dark:text-gray-100 md:text-4xl lg:text-[39px] ${isArabic ? 'text-right' : 'text-left'}`}>
					{isArabic ? "الفوائد الاستثمارية" : "Investment Benefits"}
				</h2>
				
				{/* Timeline Container */}
				<div className="relative w-full max-w-5xl">
					{/* Vertical Center Line */}
					<div className="absolute left-1/2 h-full w-[3px] -translate-x-1/2 transform bg-gray-300 dark:bg-gray-600"></div>
					
					{/* Timeline Steps */}
					{currentBenefits.map((benefit, index) => (
						<div key={index} className={`relative mb-10 flex w-full items-center justify-between ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
							{/* Text Box */}
							<div className={`w-1/2 bg-white dark:bg-gray-700 p-4 shadow-md dark:shadow-gray-900/50 rounded-2xl transition-transform duration-300 hover:scale-105 ${isArabic ? 'text-right' : 'text-left'}`}>
								<p className="text-gray-700 dark:text-gray-300 font-['Readex_Pro'] text-base md:text-lg">
									{benefit}
								</p>
							</div>
							
							{/* Circle Number */}
							<div className="flex items-center justify-center">
								<div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-r ${circleColors[index]} shadow-lg dark:shadow-gray-900/50 transition-transform duration-300 hover:scale-105`}>
									{index + 1}
								</div>
							</div>
							
							{/* Connector Line */}
							<div className={`w-10 h-[3px] bg-gray-300 dark:bg-gray-600 ${index % 2 === 0 ? 'mr-4' : 'ml-4'}`}></div>
							
							{/* Empty space for alternating layout */}
							<div className="w-1/2"></div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

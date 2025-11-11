// src/components/Worker/WorkerBenefits.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface BenefitCard {
	id: string;
	image: string;
	titleKey: string;
	descriptionKey: string;
}

/**
 * WorkerBenefits Component
 * Displays worker benefits in a responsive card layout
 * Supports English/Arabic with full RTL/LTR support
 */
export default function WorkerBenefits() {
	const { t, language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const benefitCards: BenefitCard[] = useMemo(() => [
		{
			id: "card-1",
			image: "/worker2.jpg",
			titleKey: "worker.card1.title",
			descriptionKey: "worker.card1.description",
		},
		{
			id: "card-2",
			image: "/worker1.jpg",
			titleKey: "worker.card2.title",
			descriptionKey: "worker.card2.description",
		},
	], []);

	return (
		<section 
			className="w-full bg-white dark:bg-gray-900 py-8 sm:py-12 md:py-16" 
			dir={direction}
		>
			<div className="mx-auto flex flex-col items-center justify-center max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<header className="mb-8 sm:mb-12 text-center">
					<h2 className={`font-['Readex_Pro'] text-2xl sm:text-3xl md:text-4xl lg:text-[39px] font-semibold text-gray-800 dark:text-gray-100 leading-tight ${isArabic ? 'text-right' : 'text-left'}`}>
						{t("worker.benefits")}{" "}
						<span className="text-[#31A342] dark:text-green-400">{t("company.name")}</span>
					</h2>
				</header>

				{/* Benefits Cards Grid */}
				<div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
					{benefitCards.map((card) => (
						<article
							key={card.id}
							className={`
								group w-full max-w-[550px] lg:w-1/2
								overflow-hidden 
								rounded-lg sm:rounded-xl 
								bg-[#EDEDED] dark:bg-gray-800
								shadow-lg dark:shadow-gray-900/50 hover:shadow-2xl dark:hover:shadow-gray-900/70
								transition-all duration-300 ease-in-out
								transform hover:-translate-y-2 hover:scale-[1.02]
							`}
						>
							{/* Image Container */}
							<div className="relative aspect-[550/300] w-full overflow-hidden">
								<img
									src={card.image}
									alt={t(card.titleKey)}
									className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
								{/* Overlay on Hover */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>

							{/* Content Section */}
							<div className={`p-6 ${isArabic ? 'text-right' : 'text-left'}`}>
								<h3 className="mb-2 text-xl font-semibold text-green-600 dark:text-green-400 transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-300">
									{t(card.titleKey)}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
									{t(card.descriptionKey)}
								</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}


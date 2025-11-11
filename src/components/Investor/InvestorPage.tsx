// src/components/Investor/InvestorPage.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import InvestorHero from "./InvestorHero";
import InvestorCards from "./InvestorCards";
import InvestorBenefits from "./InvestorBenefits";
import InvestorForm from "./InvestorForm";

export default function InvestorPage() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<main className="bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
			<div className="mx-auto max-w-[1800px] px-2 py-4 sm:px-4 sm:py-8 lg:px-8">
				{/* Hero Section with Video Slider */}
				<InvestorHero />

				{/* Investment Cards */}
				<InvestorCards />

				{/* Benefits Section */}
				<InvestorBenefits />
				{/* Form Section */}
				<InvestorForm />
			</div>
		</main>
	);
}

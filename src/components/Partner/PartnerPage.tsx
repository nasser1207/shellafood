// src/components/Partner/PartnerPage.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import PartnerHero from "./PartnerHero";
import PartnerBenefits from "./PartnerBenefits";
import PartnerFormSection from "./PartnerFormSection";
import PartnerNewsletter from "./PartnerNewsletter";

export default function PartnerPage() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<main className="bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
			<div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
				{/* Hero Section with Image Slider */}
				<PartnerHero />

				{/* Benefits Section */}
				<PartnerBenefits />

				{/* Form Section */}
				<PartnerFormSection  />

				{/* Newsletter Section */}
				<PartnerNewsletter />
			</div>
		</main>
	);
}


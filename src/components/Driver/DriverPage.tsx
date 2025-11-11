// src/components/Driver/DriverPage.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import DriverHero from "./DriverHero";
import DriverBenefits from "./DriverBenefits";
import DriverFormSection from "./DriverFormSection";

export default function DriverPage() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<main className="bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
			<div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
				{/* Hero Section with Image Slider */}
				<DriverHero />

				{/* Benefits Section */}
				<DriverBenefits />

				{/* Form Section */}
				<DriverFormSection />
			</div>
		</main>
	);
}


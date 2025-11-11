// src/components/Worker/WorkerPage.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import WorkerHero from "./WorkerHero";
import WorkerBenefits from "./WorkerBenefits";
import WorkerFormSection from "./WorkerFormSection";

export default function WorkerPage() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<main className="bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
			<div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
				{/* Hero Section with Image Slider */}
				<WorkerHero />

				{/* Benefits Section */}
				<WorkerBenefits />

				{/* Form Section */}
				<WorkerFormSection />
			</div>
		</main>
	);
}


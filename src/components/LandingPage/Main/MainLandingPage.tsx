"use client";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "../HeroSection";
import MobileAppSection from "../MobileAppSection";
import ServicesSection from "../ServicesSection";
import StatisticsSection from "../StatisticsSection";
import TilesSection from "./TilesSection";


// Lazy load below-fold sections for better performance
const LazyTestimonialsSection = dynamic(
	() => import("../TestimonialsSection"),
	{
		loading: () => (
			<div className="py-32 bg-gray-50 dark:bg-gray-800">
				<div className="container mx-auto px-4">
					<div className="h-96 flex items-center justify-center">
						<div className="animate-pulse text-gray-400">Loading...</div>
					</div>
				</div>
			</div>
		),
		ssr: false,
	}
);

const LazyCTASection = dynamic(() => import("../CTASection"), {
	loading: () => (
		<div className="py-32 bg-gradient-to-br from-green-600 to-emerald-600">
			<div className="container mx-auto px-4">
				<div className="h-64 flex items-center justify-center">
					<div className="animate-pulse text-white/50">Loading...</div>
				</div>
			</div>
		</div>
	),
	ssr: true,
});

export default function MainLandingPage() {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const direction = isArabic ? "rtl" : "ltr";

	return (
		<div
			className={`font-tajawal flex min-h-screen w-full flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200 overflow-x-hidden`}
			dir={direction}
		>
			{/* Main Content */}
			<main className="flex-grow overflow-x-hidden w-full" id="main-content">
				<SpeedInsights />
				<div className="mx-auto max-w-[1800px] w-full overflow-x-hidden">
					{/* Hero Section */}
					<HeroSection />

					{/* Mobile App Section */}
					<MobileAppSection />

					{/* Statistics Section */}
					<StatisticsSection />

					{/* Services Section (includes Qaydha and other services) */}
					<TilesSection />

					{/* How It Works Section */}
					{/* <HowItWorksSection /> */}

					{/* Testimonials Section (Lazy Loaded) */}
					<LazyTestimonialsSection />

					{/* Final CTA Section (Lazy Loaded) */}
					<LazyCTASection />
				</div>
			</main>
		</div>
	);
}

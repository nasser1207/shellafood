"use client";
import { SpeedInsights } from "@vercel/speed-insights/next"
import HeroSection from "./HeroSection";
import MobileAppSection from "./MobileAppSection";
import TilesSection from "./TilesSection";
export default function MainLandingPage() {
	return (
		<div
			// Use a consistent background color and modern font
			className={`font-tajawal flex min-h-screen w-full flex-col bg-[#FFFFFF] dark:bg-gray-900 text-gray-800 dark:text-gray-200`}
			dir="rtl"
		>
			{/* المحتوى الرئيسي */}
			<main className="flex-grow">
				 <SpeedInsights />
				<div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
					{/* ====== HERO SECTION (القسم الأول) ====== */}
					<HeroSection />

					{/* ====== Mobile App SECTION (تطبيق الجوال) ====== */}
					<MobileAppSection />

					{/* ====== ROWS (الشراكات + قيدها) ====== */}
					<TilesSection />

					<div className="h-20" />
				</div>
			</main>
		</div>
	);
}

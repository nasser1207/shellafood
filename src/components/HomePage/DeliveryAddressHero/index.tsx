"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import AddressSelector from "./AddressSelector";
import HeroBackground from "./HeroBackground";
import TrustBadges from "./TrustBadges";

interface DeliveryAddressHeroProps {
	onAddressChange?: (address: any) => void;
}

export default function DeliveryAddressHero({ onAddressChange }: DeliveryAddressHeroProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<section className="relative min-h-[50vh] sm:min-h-[60vh] overflow-hidden">
			{/* Animated gradient background */}
			<HeroBackground />

			{/* Hero content */}
			<div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
				<div className="max-w-4xl mx-auto">
					{/* Hero Title */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className={`text-center mb-6 sm:mb-8 ${isArabic ? "text-right" : "text-left"}`}
					>
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3 sm:mb-4 leading-tight">
							<span className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
								{isArabic ? "توصيل سريع" : "Fast Delivery"}
							</span>
							<br />
							<span className="text-gray-900 dark:text-gray-100">
								{isArabic ? "إلى باب منزلك" : "To Your Door"}
							</span>
						</h1>
						<p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2 sm:px-0">
							{isArabic
								? "اكتشف أفضل المطاعم والمتاجر في منطقتك واحصل على توصيل سريع وآمن"
								: "Discover the best restaurants and stores in your area and get fast, secure delivery"}
						</p>
					</motion.div>

					{/* Glassmorphic address card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 mb-6 sm:mb-8"
					>
						<AddressSelector onAddressChange={onAddressChange} />
					</motion.div>

					{/* Trust Badges */}
					{/* <TrustBadges /> */}
				</div>
			</div>
		</section>
	);
}


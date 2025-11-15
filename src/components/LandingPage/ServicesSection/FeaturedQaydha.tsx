"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FeaturedQaydha() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.8 }}
			className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 w-full overflow-x-hidden"
		>
			<div className="relative group max-w-7xl mx-auto w-full overflow-x-hidden">
				<div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl sm:rounded-3xl lg:rounded-[2rem] blur-lg opacity-25 group-hover:opacity-40 transition duration-300" />

				<div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl lg:rounded-[2rem] overflow-hidden shadow-2xl">
					<div className="grid lg:grid-cols-[1.25fr_1fr] xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[1.35fr_1fr]">
						{/* Content */}
						<div className={`p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 2xl:p-20 flex flex-col justify-center ${isArabic ? "lg:order-1" : "lg:order-2"}`}>
							<div className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 mb-5 sm:mb-6 md:mb-7 rounded-full bg-green-100 dark:bg-green-900/30 w-fit">
								<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
								<span className="text-sm sm:text-base font-bold text-green-700 dark:text-green-300">
									{isArabic ? "⭐ منتج مميز" : "⭐ Featured"}
								</span>
							</div>

							<h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-5 sm:mb-6 md:mb-7 leading-tight">
								<span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
									{t("landing.qaydha.title")}
								</span>
							</h3>

							<p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700 dark:text-gray-300 font-bold mb-4 sm:mb-5 md:mb-6 leading-snug">
								{t("landing.qaydha.subtitle")}
							</p>

							<p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-2xl">
								{t("landing.qaydha.description")}
							</p>

							{/* Buttons */}
							<div className={`flex flex-wrap gap-4 sm:gap-5 md:gap-6 ${isArabic ? "justify-start" : "justify-start"}`}>
								<Link
									href="/kaidha"
									className="px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 min-h-[52px] sm:min-h-[56px] md:min-h-[64px]"
									aria-label={t("landing.qaydha.registerButton")}
								>
									<span>{t("landing.qaydha.registerButton")}</span>
									<ArrowRight
										className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${isArabic ? "rotate-180" : ""}`}
									/>
								</Link>
								<a
									href="https://www.qaydha.com/"
									target="_blank"
									rel="noopener noreferrer"
									className="px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 transition-all duration-300 flex items-center gap-3 min-h-[52px] sm:min-h-[56px] md:min-h-[64px] border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
									aria-label={t("landing.qaydha.learnMoreButton")}
								>
									<span>{t("landing.qaydha.learnMoreButton")}</span>
									<ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
								</a>
							</div>
						</div>

						{/* Image - Optimized sizing */}
						<div
							className={`relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/5] xl:aspect-[3/4] 2xl:aspect-[2/3] ${isArabic ? "lg:order-2" : "lg:order-1"} p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12`}
						>
							<div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800">
								<Image
									src="/date.png"
									alt={isArabic ? "قيدها" : "Qaydha"}
									fill
									className="object-contain p-2 sm:p-4"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 40vw, (max-width: 1536px) 35vw, 500px"
									quality={90}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}


"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
	Sparkles,
	ArrowRight,
	Play,
	Rocket,
	Star,
	ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<section
			className="relative min-h-screen flex items-center justify-center overflow-hidden w-full"
			aria-labelledby="hero-heading"
		>
			{/* Animated Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

				{/* Animated Blobs - Responsive sizes with overflow control */}
				<div className="absolute top-20 -left-20 sm:-left-40 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] xl:w-[500px] xl:h-[500px] bg-green-400/20 rounded-full blur-3xl animate-blob" />
				<div className="absolute top-40 -right-20 sm:-right-40 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] xl:w-[500px] xl:h-[500px] bg-emerald-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
				<div className="absolute -bottom-10 sm:-bottom-20 left-1/2 -translate-x-1/2 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] xl:w-[500px] xl:h-[500px] bg-teal-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
			</div>

			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-4 xl:px-6 2xl:px-8 py-12 sm:py-16 md:py-20 lg:py-24 w-full overflow-x-hidden">
				<div className="max-w-6xl lg:max-w-[95%] xl:max-w-[98%] 2xl:max-w-[1800px] mx-auto text-center w-full">
					{/* Floating Badge with Pulse */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 mb-6 sm:mb-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200 dark:border-green-800 shadow-lg"
					>
						<div className="relative">
							<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
							<div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
						</div>
						<Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
						<span className="text-xs sm:text-sm font-bold whitespace-nowrap">
							{isArabic ? "🚀 أكثر من 2 مليون طلب" : "🚀 2M+ Orders Delivered"}
						</span>
					</motion.div>

					{/* Massive Headline - Better mobile scaling */}
					<motion.h1
						id="hero-heading"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-4 sm:mb-6 leading-[1.1] tracking-tight px-2"
					>
						<span className=" text-gray-900 dark:text-white mb-1 sm:mb-2">
							{isArabic ?  "مع " : "With "}
						</span>
						<span >
							<span className="bg-gradient-to-r mx-2 from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
								{t("company.name")}
							</span>
						</span>
						<span className="block text-gray-900 dark:text-white mt-1 sm:mt-2">
							{t("landing.hero.title")}
						</span>
					</motion.h1>

					{/* Subtitle - Better mobile scaling */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto leading-relaxed font-medium px-4"
					>
						{t("landing.hero.subtitle")}
					</motion.p>

					{/* Modern CTA Buttons - Touch-friendly sizes */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4"
					>
						{/* Primary CTA with shine effect */}
						<Link
							href="/home"
							className="group relative px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden min-h-[44px] flex items-center justify-center"
							aria-label={isArabic ? "تصفح الآن" : "Browse now"}
						>
							<div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ${
								isArabic 
									? "translate-x-[200%] group-hover:translate-x-[-200%]" 
									: "translate-x-[-200%] group-hover:translate-x-[200%]"
							}`} />
							<span className={`relative z-10 flex items-center gap-2 sm:gap-3 justify-center ${isArabic ? "flex-row-reverse" : ""}`}>
								<Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
								<span className="whitespace-nowrap">{t("landing.hero.browseButton")}</span>
								<ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
									isArabic 
										? "rotate-180 group-hover:-translate-x-2" 
										: "group-hover:translate-x-2"
								}`} />
							</span>
						</Link>

						{/* Secondary CTA */}
						<button
							className="group px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 shadow-xl transition-all min-h-[44px] flex items-center justify-center"
							aria-label={isArabic ? "شاهد كيف يعمل" : "See How It Works"}
						>
							<span className="flex items-center gap-2 sm:gap-3 justify-center">
								<Play className="w-4 h-4 sm:w-5 sm:h-5" />
								<span className="whitespace-nowrap">{isArabic ? "شاهد كيف يعمل" : "See How It Works"}</span>
							</span>
						</button>
					</motion.div>

					{/* Trust Indicators - Better mobile layout */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.8 }}
						className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 px-4"
					>
						<div className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
							<div className={`flex ${isArabic ? "-space-x-2 sm:-space-x-3" : "-space-x-2 sm:-space-x-3"}`}>
								{[1, 2, 3, 4, 5].map((i) => (
									<div
										key={i}
										className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold"
									>
										{String.fromCharCode(64 + i)}
									</div>
								))}
							</div>
							<div className={`text-xs sm:text-sm ${isArabic ? "text-right" : "text-left"}`}>
								<p className="font-bold text-gray-900 dark:text-white">
									50,000+
								</p>
								<p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
									{isArabic ? "مستخدم نشط" : "Active Users"}
								</p>
							</div>
						</div>

						<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
							<div className="flex gap-0.5 sm:gap-1">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
									/>
								))}
							</div>
							<div className={`text-xs sm:text-sm ${isArabic ? "text-right" : "text-left"}`}>
								<p className="font-bold text-gray-900 dark:text-white">4.8/5</p>
								<p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
									10K+ {isArabic ? "تقييم" : "reviews"}
								</p>
							</div>
						</div>
					</motion.div>

					{/* Hero Dashboard Mockup - Better mobile handling */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 1 }}
						className="relative mt-12 sm:mt-16 md:mt-20 px-2 sm:px-4 lg:px-4 xl:px-6 2xl:px-8 w-full overflow-x-hidden"
					>
						<div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-3xl opacity-20" />
						<div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-white/20 dark:border-gray-700/20 shadow-2xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/8] xl:aspect-[16/5] 2xl:aspect-[16/4] w-full max-w-full lg:max-w-[98%] xl:max-w-[99%] 2xl:max-w-[1800px] mx-auto">
							<Image
								src="https://cdn2.hubspot.net/hubfs/318836/online-store-small-business-blog.png"
								alt="Shella Platform"
								width={1920}
								height={600}
								priority
								quality={90}
								className="w-full h-full object-cover"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 98vw, (max-width: 1536px) 99vw, 1800px"
								placeholder="blur"
								blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
							/>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Scroll Indicator - Hide on mobile */}
			<motion.div
				animate={{ y: [0, 12, 0] }}
				transition={{ repeat: Infinity, duration: 2 }}
				className="hidden sm:block absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
			>
				<ChevronDown className="w-6 h-6 text-gray-400" />
			</motion.div>
		</section>
	);
}


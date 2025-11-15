"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
	Smartphone,
	Zap,
	MapPin,
	CreditCard,
	Bell,
	Package,
} from "lucide-react";
import Image from "next/image";
import AppStoreButton from "../shared/AppStoreButton";
import FloatingCard from "../shared/FloatingCard";

export default function MobileAppSection() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<section
			className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden w-full"
			aria-labelledby="mobile-app-heading"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
				<div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
					{/* Content */}
					<motion.div
						initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className={isArabic ? "lg:order-1" : "lg:order-2"}
					>
						<div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30">
							<Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
							<span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
								{isArabic ? "📱 التطبيق المحمول" : "📱 Mobile App"}
							</span>
						</div>

						<h2
							id="mobile-app-heading"
							className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6"
						>
							<span className="text-gray-900 dark:text-white block mb-1 sm:mb-2">
								{t("landing.mobileApp.title")}
							</span>
							<span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent block">
								{isArabic ? "في جيبك دائماً" : "Always in Your Pocket"}
							</span>
						</h2>

						<p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10">
							{t("landing.mobileApp.subtitle")}
						</p>

						{/* Feature List */}
						<div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
							{[
								{
									icon: Zap,
									title: isArabic ? "طلب في ثوانٍ" : "Order in Seconds",
									color: "from-yellow-500 to-orange-500",
								},
								{
									icon: MapPin,
									title: isArabic ? "تتبع مباشر" : "Live Tracking",
									color: "from-green-500 to-emerald-500",
								},
								{
									icon: CreditCard,
									title: isArabic ? "دفع آمن" : "Secure Payments",
									color: "from-blue-500 to-cyan-500",
								},
								{
									icon: Bell,
									title: isArabic ? "إشعارات فورية" : "Instant Notifications",
									color: "from-purple-500 to-pink-500",
								},
							].map((feature, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: i * 0.1 }}
									className="flex items-center gap-3 sm:gap-4"
								>
									<div
										className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg flex-shrink-0`}
									>
										<feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
									</div>
									<h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
										{feature.title}
									</h4>
								</motion.div>
							))}
						</div>

						{/* App Store Buttons */}
						<div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
							<AppStoreButton store="apple" />
							<AppStoreButton store="google" />
							<AppStoreButton store="huawei" />
						</div>

					</motion.div>

					{/* Phone Mockup with Floating Elements */}
					<motion.div
						initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className={`relative ${isArabic ? "lg:order-2" : "lg:order-1"} mt-8 lg:mt-0 flex items-center justify-center`}
					>
						<div className="relative w-full max-w-[400px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[480px] xl:max-w-[540px] 2xl:max-w-[600px] aspect-[5/8] mx-auto">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-20" />

							<motion.div
								animate={{ y: [0, -20, 0] }}
								transition={{ repeat: Infinity, duration: 6 }}
								className="relative w-full h-full"
							>
								<Image
									src="/imagemobile.png"
									alt={isArabic ? "تطبيق شلة" : "Shella App"}
									width={600}
									height={960}
									quality={90}
									className="w-full h-full object-contain drop-shadow-2xl"
									sizes="(max-width: 640px) 400px, (max-width: 768px) 420px, (max-width: 1024px) 460px, (max-width: 1280px) 480px, (max-width: 1536px) 540px, 600px"
									priority={false}
								/>
							</motion.div>

							{/* Floating Cards - Position based on RTL/LTR - Hidden on mobile to prevent overflow */}
							<FloatingCard 
								className={`absolute top-20 hidden xl:block ${isArabic ? "right-0 xl:-right-16" : "left-0 xl:-left-16"}`} 
								delay={0.5}
							>
								<Package className="w-6 h-6 text-green-500 mb-2" />
								<p className="text-xs font-bold text-gray-900 dark:text-white">
									{isArabic ? "تم التوصيل!" : "Delivered!"}
								</p>
							</FloatingCard>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}


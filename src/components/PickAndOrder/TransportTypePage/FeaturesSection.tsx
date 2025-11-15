"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, Shield, Headphones, Sparkles } from "lucide-react";

interface FeaturesSectionProps {
	transportType: string;
}

export default React.memo(function FeaturesSection({ transportType }: FeaturesSectionProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const title = isArabic ? "مميزات خدماتنا" : "Our Service Features";
	const subtitle = isArabic
		? "نقدم حلول توصيل مبتكرة تلبي جميع احتياجاتك"
		: "We provide innovative delivery solutions that meet all your needs";

	const features = useMemo(() => [
		{
			icon: Zap,
			title: isArabic ? "توصيل سريع" : "Fast Delivery",
			description: isArabic
				? "وصول شحنتك في الوقت المحدد مع ضمان السرعة"
				: "Your shipment arrives on time with speed guarantee",
			badge: isArabic ? "جديد" : "New",
		},
		{
			icon: Shield,
			title: isArabic ? "خدمة آمنة" : "Secure Service",
			description: isArabic
				? "شحن آمن مع تتبع مباشر للشحنة وتأمين كامل"
				: "Secure shipping with real-time tracking and full insurance",
			badge: null,
		},
		{
			icon: Headphones,
			title: isArabic ? "خدمة متميزة" : "Premium Service",
			description: isArabic
				? "فريق محترف لخدمة العملاء متاح على مدار الساعة"
				: "Professional customer service team available 24/7",
			badge: null,
		},
	], [isArabic]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
			},
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 40, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.6,
			},
		},
	};

	return (
		<section className="relative bg-gray-50 dark:bg-gray-900 py-20 md:py-32 lg:py-40 xl:py-48 overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute top-0 left-1/4 w-72 h-72 lg:w-96 lg:h-96 xl:w-[500px] xl:h-[500px] bg-[#31A342]/5 rounded-full blur-3xl"></div>
			<div className="absolute bottom-0 right-1/4 w-96 h-96 lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] bg-[#FA9D2B]/5 rounded-full blur-3xl"></div>

			<div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<motion.div
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
						className="inline-flex items-center gap-2 px-4 py-2 bg-[#31A342]/10 dark:bg-[#31A342]/20 backdrop-blur-sm rounded-full border border-[#31A342]/20 mb-6"
					>
						<Sparkles className="h-4 w-4 text-[#31A342]" />
						<span className="text-sm font-semibold text-[#31A342]">
							{isArabic ? "مميزات حصرية" : "Exclusive Features"}
						</span>
					</motion.div>
					<h2 
						className="font-extrabold text-gray-900 dark:text-gray-100 mb-4"
						style={{
							fontSize: "clamp(2rem, 4vw + 1rem, 3.5rem)",
							lineHeight: "1.1",
							letterSpacing: "-0.02em",
						}}
					>
						{title}
					</h2>
					<p 
						className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
						style={{
							fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1.25rem)",
						}}
					>
						{subtitle}
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12"
				>
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<motion.div
								key={index}
								variants={cardVariants}
								whileHover={{ y: -12, scale: 1.02 }}
								className="group relative"
							>
								{/* Glassmorphic Card */}
								<div className="relative h-full backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
									{/* Gradient overlay on hover */}
									<div className="absolute inset-0 bg-[#31A342]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
									
									{/* Badge */}
									{feature.badge && (
										<div className="absolute top-4 right-4 px-3 py-1 bg-[#FA9D2B] text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
											{feature.badge}
										</div>
									)}

									<div className={`relative flex flex-col items-center ${isArabic ? "text-center" : "text-center"}`}>
										{/* Icon with pulse animation */}
										<motion.div
											className="relative p-5 bg-[#31A342] rounded-2xl mb-6 shadow-lg"
											whileHover={{ scale: 1.1, rotate: 5 }}
											transition={{ type: "spring", stiffness: 300 }}
										>
											<Icon className="h-10 w-10 text-white relative z-10" />
											{/* Pulse effect */}
											<motion.div
												className="absolute inset-0 bg-[#31A342] rounded-2xl"
												animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
												transition={{ duration: 2, repeat: Infinity }}
											></motion.div>
										</motion.div>

										{/* Content */}
										<h3 
											className="font-bold text-gray-900 dark:text-gray-100 mb-3"
											style={{
												fontSize: "clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem)",
											}}
										>
											{feature.title}
										</h3>
										<p 
											className="text-gray-600 dark:text-gray-400 leading-relaxed"
											style={{
												fontSize: "clamp(0.875rem, 1vw + 0.25rem, 1rem)",
											}}
										>
											{feature.description}
										</p>

										{/* Hover indicator */}
										<div className="mt-6 w-12 h-1 bg-[#31A342] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									</div>

									{/* Border glow on hover */}
									<div className="absolute inset-0 rounded-3xl bg-[#31A342]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
								</div>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
});

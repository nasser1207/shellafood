"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Truck, Package, Zap, ArrowDown, TrendingUp, Users, Clock } from "lucide-react";

interface HeroSectionProps {
	transportType: string;
}

export default React.memo(function HeroSection({ transportType }: HeroSectionProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMotorbike = transportType === "motorbike";
	const [statsVisible, setStatsVisible] = useState(false);

	// Animated stats counter
	const stats = useMemo(() => [
		{ value: 10000, suffix: "+", label: isArabic ? "عميل سعيد" : "Happy Customers" },
		{ value: 98, suffix: "%", label: isArabic ? "معدل الرضا" : "Satisfaction Rate" },
		{ value: 30, suffix: isArabic ? "دقيقة" : "mins", label: isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time" },
	], [isArabic]);

	// Content based on transport type
	const title = isArabic
		? "جلب السعادة من الباب الى الباب"
		: "Bringing Happiness from Door to Door";
	const subtitle = isArabic
		? "هل انت مستعد لنقل شيئ مميز"
		: "Are you ready to transport something special?";

	// Feature boxes data
	const featureBoxes = useMemo(() => [
		{
			icon: Truck,
			title: isArabic ? "توصيل سريع, آمن وموثوق" : "Fast, Safe & Reliable Delivery",
			description: isArabic
				? "خدمة توصيل سريعة مع ضمان الأمان"
				: "Fast delivery service with safety guarantee",
		},
		{
			icon: Package,
			title: isArabic ? "خدمة توصيل سريع وموثوق" : "Fast & Reliable Delivery Service",
			description: isArabic
				? "نضمن وصول شحنتك في الوقت المحدد"
				: "We guarantee your shipment arrives on time",
		},
	], [isArabic]);

	// Dynamic images based on transport type
	const heroImage = useMemo(() => isMotorbike
		? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
		: "https://images.unsplash.com/photo-1562887189-fb38c1a1a0e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", [isMotorbike]);

	// Scroll-based parallax
	const { scrollY } = useScroll();
	const imageY = useTransform(scrollY, [0, 500], [0, 150]);

	// Trigger stats animation on mount
	useEffect(() => {
		setStatsVisible(true);
	}, []);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
			},
		},
	};

	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#2E7D3214] via-white to-[#00000000] dark:from-[#2E7D3214] dark:via-gray-900 dark:to-[#00000000] py-20 md:py-32 lg:py-40 xl:py-48">
			{/* Decorative background blobs */}
			<div className="absolute top-0 -right-20 w-96 h-96 lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] bg-[#31A342]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
			<div className="absolute bottom-0 -left-20 w-96 h-96 lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] bg-[#FA9D2B]/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
			
			{/* Subtle grid pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] lg:bg-[size:32px_32px] -z-10"></div>

			<div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 2xl:gap-24 items-center"
				>
					{/* Text Content */}
					<motion.div
						variants={itemVariants}
						className={`space-y-8 ${isArabic ? "lg:order-1 text-right" : "lg:order-2 text-left"}`}
					>
						{/* Floating Badge */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
							className={`inline-flex items-center gap-2 px-4 py-2 bg-[#31A342]/10 dark:bg-[#31A342]/20 backdrop-blur-sm rounded-full border border-[#31A342]/20 ${isArabic ? "ml-auto" : "mr-auto"}`}
						>
							<Zap className="h-4 w-4 text-[#31A342]" />
							<span className="text-sm font-semibold text-[#31A342] dark:text-[#31A342]">
								{isArabic ? "🚀 توصيل سريع في 30 دقيقة" : "🚀 Fast Delivery in 30 mins"}
							</span>
						</motion.div>

						{/* Hero Title with Gradient */}
						<h1 
							className="font-extrabold leading-[1.1] tracking-tight"
							style={{
								fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
								lineHeight: "1.1",
								letterSpacing: "-0.02em",
							}}
						>
							<span className="text-gray-900 dark:text-gray-100 drop-shadow-sm">
								{title.split(" ").slice(0, -2).join(" ")}
							</span>
							<br />
							<span className="text-[#31A342]">
								{title.split(" ").slice(-2).join(" ")}
							</span>
						</h1>

						<p 
							className="text-gray-600 dark:text-gray-300 leading-relaxed font-light"
							style={{
								fontSize: "clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem)",
							}}
						>
							{subtitle}
						</p>

						{/* Stats Counter */}
						<div className={`grid grid-cols-3 gap-4 pt-4 ${isArabic ? "text-right" : "text-left"}`}>
							{stats.map((stat, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={statsVisible ? { opacity: 1, y: 0 } : {}}
									transition={{ delay: 0.5 + index * 0.1 }}
									className="space-y-1"
								>
									<div className="flex items-baseline gap-1">
										<span className="text-2xl sm:text-3xl font-bold text-[#31A342]">
											{stat.value}
										</span>
										<span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
											{stat.suffix}
										</span>
									</div>
									<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
										{stat.label}
									</p>
								</motion.div>
							))}
						</div>

						{/* Buttons with Enhanced Effects */}
						<div className={`flex flex-col sm:flex-row gap-4 pt-4`}>
							<motion.button
								onClick={() => router.push(`/pickandorder/${transportType}/order/details?type=multi-direction`)}
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.98 }}
								className="group relative overflow-hidden px-8 py-4 bg-[#31A342] hover:bg-[#2a8f38] text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#31A342]/50 text-base sm:text-lg"
							>
								<span className="absolute inset-0 bg-[#2a8f38] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
								<span className="relative flex items-center justify-center gap-2">
									{isArabic ? "نقل باكثر من اتجاه" : "Multi-Direction Transport"}
									<TrendingUp className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
								</span>
							</motion.button>
							<motion.button
								onClick={() => router.push(`/pickandorder/${transportType}/order/details?type=one-way`)}
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.98 }}
								className="group relative overflow-hidden px-8 py-4 bg-[#FA9D2B] hover:bg-[#E88D26] text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#FA9D2B]/50 text-base sm:text-lg"
							>
								<span className="absolute inset-0 bg-[#E88D26] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
								<span className="relative">
									{isArabic ? "نقل باتجاه واحد" : "One-Way Transport"}
								</span>
							</motion.button>
						</div>

						{/* Trust Badges */}
						<div className={`flex items-center gap-6 pt-4 `}>
							<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
								<Users className="h-5 w-5 text-[#31A342]" />
								<span className="font-medium">{isArabic ? "انضم إلى" : "Join"} 10,000+ {isArabic ? "مستخدم" : "users"}</span>
							</div>
							<div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
							<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
								<Clock className="h-5 w-5 text-[#31A342]" />
								<span className="font-medium">{isArabic ? "متوسط وقت التوصيل" : "Avg delivery"}: 30 {isArabic ? "دقيقة" : "mins"}</span>
							</div>
						</div>

						{/* Feature Boxes with Glassmorphism */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
							{featureBoxes.map((feature, index) => {
								const Icon = feature.icon;
								return (
									<motion.div
										key={index}
										variants={itemVariants}
										whileHover={{ y: -6, scale: 1.02 }}
										className="group backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300"
									>
										<div className={`flex items-start gap-3 `}>
											<div className="p-3 bg-[#31A342] rounded-xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
												<Icon className="h-5 w-5 text-white" />
											</div>
											<div className={`flex-1 ${isArabic ? "text-right" : "text-left"}`}>
												<h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1">
													{feature.title}
												</h3>
												<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
													{feature.description}
												</p>
											</div>
										</div>
									</motion.div>
								);
							})}
						</div>
					</motion.div>

					{/* Image with Parallax */}
					<motion.div
						variants={itemVariants}
						style={{ y: imageY }}
						className={`${isArabic ? "lg:order-1" : "lg:order-2"} flex items-center justify-center`}
					>
						<div className="relative w-full max-w-lg xl:max-w-xl 2xl:max-w-2xl group">
							{/* Decorative glow effect */}
							<div className="absolute inset-0 bg-[#31A342]/20 rounded-3xl blur-3xl opacity-30 group-hover:opacity-40 transition-opacity duration-500 -z-10 scale-110 animate-pulse"></div>
							
							{/* Gradient overlay for better contrast */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl -z-0"></div>
							
							<div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-700 transform transition-all duration-500 hover:scale-105 will-change-transform">
								<Image
									src={heroImage}
									alt={isArabic ? "خدمة التوصيل" : "Delivery Service"}
									width={600}
									height={600}
									className="w-full h-auto object-cover"
									loading="eager"
									unoptimized
									priority
								/>
							</div>
						</div>
					</motion.div>
				</motion.div>

				{/* Scroll Indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
					className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${isArabic ? "hidden" : ""}`}
				>
					<motion.div
						animate={{ y: [0, 10, 0] }}
						transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
						className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500"
					>
						<span className="text-xs font-medium">{isArabic ? "انتقل للأسفل" : "Scroll to explore"}</span>
						<ArrowDown className="h-5 w-5" />
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
});

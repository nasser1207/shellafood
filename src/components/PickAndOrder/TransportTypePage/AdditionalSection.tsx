"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Package, CheckCircle2, Car, CreditCard, Star, Shield, ArrowRight } from "lucide-react";

interface AdditionalSectionProps {
	transportType: string;
}

export default React.memo(function AdditionalSection({ transportType }: AdditionalSectionProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	// "How It Works" Section
	const howItWorksTitle = isArabic ? "كيف تعمل خدمتنا" : "How Our Service Works";
	const howItWorksSubtitle = isArabic
		? "خطوات بسيطة لتوصيل سريع وآمن"
		: "Simple steps for fast and secure delivery";

	// "Why Choose Us" Section
	const whyChooseTitle = isArabic ? "لماذا تختارنا؟" : "Why Choose Us?";
	const whyChooseSubtitle = isArabic
		? "نقدم أفضل تجربة توصيل لتناسب احتياجاتك اليومية."
		: "We provide the best delivery experience to suit your daily needs.";

	const steps = useMemo(() => [
		{
			number: "01",
			icon: Car,
			title: isArabic ? "اختر نوع الخدمة" : "Choose Service Type",
			description: isArabic
				? "اختر النوع المناسب لاحتياجاتك"
				: "Select the type that suits your needs",
		},
		{
			number: "02",
			icon: MapPin,
			title: isArabic ? "حدد الوجهة" : "Set Destination",
			description: isArabic
				? "أدخل عنوان التوصيل والمكان المطلوب"
				: "Enter delivery address and destination",
		},
		{
			number: "03",
			icon: CreditCard,
			title: isArabic ? "ادفع بأمان" : "Pay Securely",
			description: isArabic
				? "راجع تفاصيل الطلب وأكده"
				: "Review order details and confirm",
		},
		{
			number: "04",
			icon: Package,
			title: isArabic ? "تتبع شحنتك" : "Track Your Shipment",
			description: isArabic
				? "تابع شحنتك في الوقت الفعلي"
				: "Track your shipment in real-time",
		},
	], [isArabic]);

	const whyChooseItems = useMemo(() => [
		{
			icon: Star,
			title: isArabic ? "خدمة متميزة" : "Premium Service",
			description: isArabic
				? "فريق محترف ومدرب لضمان أفضل تجربة توصيل"
				: "Professional and trained team to ensure the best delivery experience",
		},
		{
			icon: CheckCircle2,
			title: isArabic ? "ضمان الجودة" : "Quality Guarantee",
			description: isArabic
				? "نضمن وصول شحنتك بأمان وفي الوقت المحدد"
				: "We guarantee your shipment arrives safely and on time",
		},
		{
			icon: Shield,
			title: isArabic ? "أمان مضمون" : "Guaranteed Safety",
			description: isArabic
				? "شحن آمن مع تأمين كامل على جميع الشحنات"
				: "Secure shipping with full insurance on all shipments",
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

	const stepVariants = {
		hidden: { opacity: 0, y: 40, scale: 0.9 },
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
		<>
			{/* How It Works Section */}
			<section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-32 lg:py-40 xl:py-48 overflow-hidden">
				{/* Background decorative elements */}
				<div className="absolute top-0 right-0 w-96 h-96 lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] bg-[#31A342]/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 w-96 h-96 lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] bg-[#FA9D2B]/5 rounded-full blur-3xl"></div>

				<div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<h2 
							className="font-extrabold text-gray-900 dark:text-gray-100 mb-4"
							style={{
								fontSize: "clamp(2rem, 4vw + 1rem, 3.5rem)",
								lineHeight: "1.1",
								letterSpacing: "-0.02em",
							}}
						>
							{howItWorksTitle}
						</h2>
						<p 
							className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
							style={{
								fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1.25rem)",
							}}
						>
							{howItWorksSubtitle}
						</p>
					</motion.div>

					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 relative"
					>
						{steps.map((step, index) => {
							const Icon = step.icon;
							const isLast = index === steps.length - 1;

							return (
								<motion.div
									key={index}
									variants={stepVariants}
									whileHover={{ y: -12, scale: 1.03 }}
									className="relative group"
								>
									{/* Connector Line with Animation */}
									{!isLast && (
										<div className="hidden lg:block absolute top-20 left-full w-full h-0.5 -z-10">
											<div className="relative w-full h-full">
												<div className="absolute inset-0 bg-[#31A342]/30"></div>
												<motion.div
													className="absolute inset-0 bg-[#31A342]"
													initial={{ scaleX: 0 }}
													whileInView={{ scaleX: 1 }}
													viewport={{ once: true }}
													transition={{ duration: 0.8, delay: index * 0.2 }}
													style={{ transformOrigin: "left" }}
												></motion.div>
												<motion.div
													className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#31A342] rounded-full shadow-lg"
													initial={{ scale: 0 }}
													whileInView={{ scale: 1 }}
													viewport={{ once: true }}
													transition={{ duration: 0.3, delay: 0.8 + index * 0.2 }}
												></motion.div>
											</div>
										</div>
									)}

									{/* Step Card */}
									<div className="relative h-full backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
										{/* Gradient overlay on hover */}
										<div className="absolute inset-0 bg-[#31A342]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

										<div className={`relative flex flex-col items-center ${isArabic ? "text-center" : "text-center"}`}>
											{/* Step Number */}
											<div 
												className="text-[#31A342] mb-6 font-extrabold"
												style={{
													fontSize: "clamp(2.5rem, 3vw + 1rem, 3.5rem)",
												}}
											>
												{step.number}
											</div>

											{/* Icon Container */}
											<motion.div
												className="p-5 bg-[#31A342] rounded-2xl mb-6 shadow-lg"
												whileHover={{ scale: 1.1, rotate: 5 }}
												transition={{ type: "spring", stiffness: 300 }}
											>
												<Icon className="h-10 w-10 text-white" />
											</motion.div>

											{/* Content */}
											<h3 
												className="font-bold text-gray-900 dark:text-gray-100 mb-3"
												style={{
													fontSize: "clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem)",
												}}
											>
												{step.title}
											</h3>
											<p 
												className="text-gray-600 dark:text-gray-400 leading-relaxed"
												style={{
													fontSize: "clamp(0.875rem, 1vw + 0.25rem, 1rem)",
												}}
											>
												{step.description}
											</p>
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

			{/* Why Choose Us Section */}
			<section className="relative bg-white dark:bg-gray-900 py-20 md:py-32 lg:py-40 xl:py-48 overflow-hidden">
				{/* Background pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] lg:bg-[size:32px_32px]"></div>

				<div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16 lg:mb-20"
					>
						<h2 
							className="font-extrabold text-gray-900 dark:text-gray-100 mb-4"
							style={{
								fontSize: "clamp(2rem, 4vw + 1rem, 3.5rem)",
								lineHeight: "1.1",
								letterSpacing: "-0.02em",
							}}
						>
							{whyChooseTitle}
						</h2>
						<p 
							className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
							style={{
								fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1.25rem)",
							}}
						>
							{whyChooseSubtitle}
						</p>
					</motion.div>

					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12"
					>
						{whyChooseItems.map((item, index) => {
							const Icon = item.icon;
							return (
								<motion.div
									key={index}
									variants={stepVariants}
									whileHover={{ y: -12, scale: 1.02 }}
									className="group relative"
								>
									<div className="relative h-full backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
										{/* Gradient overlay */}
										<div className="absolute inset-0 bg-[#31A342]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

										<div className={`relative flex flex-col items-center ${isArabic ? "text-center" : "text-center"}`}>
											{/* Icon with pulse */}
											<motion.div
												className="relative p-5 bg-[#31A342] rounded-2xl mb-6 shadow-lg"
												whileHover={{ scale: 1.1, rotate: 5 }}
												transition={{ type: "spring", stiffness: 300 }}
											>
												<Icon className="h-10 w-10 text-white" />
												{/* Pulse effect */}
												<motion.div
													className="absolute inset-0 bg-[#31A342] rounded-2xl"
													animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
													transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
												></motion.div>
											</motion.div>

											<h3 
												className="font-bold text-gray-900 dark:text-gray-100 mb-3"
												style={{
													fontSize: "clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem)",
												}}
											>
												{item.title}
											</h3>
											<p 
												className="text-gray-600 dark:text-gray-400 leading-relaxed"
												style={{
													fontSize: "clamp(0.875rem, 1vw + 0.25rem, 1rem)",
												}}
											>
												{item.description}
											</p>

											{/* Hover indicator */}
											<div className="mt-6 w-12 h-1 bg-[#31A342] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										</div>

										{/* Border glow */}
										<div className="absolute inset-0 rounded-3xl bg-[#31A342]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
									</div>
								</motion.div>
							);
						})}
					</motion.div>
				</div>
			</section>
		</>
	);
});

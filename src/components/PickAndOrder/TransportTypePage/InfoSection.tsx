"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2, Clock, MapPin, Shield, Star, Quote } from "lucide-react";

interface InfoSectionProps {
	transportType: string;
}

export default React.memo(function InfoSection({ transportType }: InfoSectionProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMotorbike = transportType === "motorbike";

	const title = isArabic ? "خدمة توصيل موثوقة" : "Reliable Delivery Service";
	const description = isArabic
		? "نقدم خدمة توصيل سريعة وآمنة لجميع احتياجاتك مع فريق محترف ومدرب"
		: "We provide fast and secure delivery service for all your needs with a professional and trained team";

	const infoItems = useMemo(() => [
		{
			icon: Clock,
			title: isArabic ? "توصيل سريع" : "Fast Delivery",
			description: isArabic ? "في أقل من 30 دقيقة" : "In less than 30 minutes",
		},
		{
			icon: MapPin,
			title: isArabic ? "تتبع مباشر" : "Real-Time Tracking",
			description: isArabic ? "تابع شحنتك لحظة بلحظة" : "Track your shipment in real-time",
		},
		{
			icon: Shield,
			title: isArabic ? "ضمان الأمان" : "Safety Guarantee",
			description: isArabic ? "تأمين كامل على جميع الشحنات" : "Full insurance on all shipments",
		},
		{
			icon: CheckCircle2,
			title: isArabic ? "خدمة موثوقة" : "Reliable Service",
			description: isArabic ? "نسبة نجاح 98%" : "98% success rate",
		},
	], [isArabic]);

	// Testimonials
	const testimonials = useMemo(() => [
		{
			name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
			role: isArabic ? "رجل أعمال" : "Business Owner",
			rating: 5,
			comment: isArabic
				? "خدمة ممتازة وسريعة، أنصح بها بشدة"
				: "Excellent and fast service, highly recommended",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
		},
		{
			name: isArabic ? "فاطمة علي" : "Fatima Ali",
			role: isArabic ? "ربة منزل" : "Housewife",
			rating: 5,
			comment: isArabic
				? "أفضل خدمة توصيل استخدمتها، موثوقة جداً"
				: "Best delivery service I've used, very reliable",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
		},
	], [isArabic]);

	return (
		<section className="relative bg-white dark:bg-gray-900 py-20 md:py-32 lg:py-40 xl:py-48 overflow-hidden">
			{/* Background pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] lg:bg-[size:32px_32px]"></div>

			<div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
				{/* Bento Grid Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
					{/* Main Image - Large Card */}
					<motion.div
						initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.8 }}
						className={`lg:col-span-7 ${isArabic ? "lg:order-2" : "lg:order-1"}`}
					>
						<div className="relative h-full min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] rounded-3xl overflow-hidden group">
							{/* Gradient overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10"></div>
							<div className="absolute inset-0 bg-[#31A342]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
							
							<Image
								src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
								alt={isArabic ? "خدمة التوصيل" : "Delivery Service"}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-110"
								loading="lazy"
								unoptimized
							/>
							
							{/* Floating badge on image */}
							<div className="absolute top-6 left-6 z-20 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl px-4 py-3 shadow-xl border border-white/20">
								<div className="flex items-center gap-2">
									<Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
									<span className="font-bold text-gray-900 dark:text-gray-100">4.9/5</span>
									<span className="text-sm text-gray-600 dark:text-gray-400">
										{isArabic ? "تقييم العملاء" : "Rating"}
									</span>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Content Section - Medium Cards */}
					<div className={`lg:col-span-5 space-y-6 xl:space-y-8 ${isArabic ? "lg:order-1" : "lg:order-2"}`}>
						{/* Title Card */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.6 }}
							className="space-y-4"
						>
							<h2 
								className="font-extrabold text-gray-900 dark:text-gray-100"
								style={{
									fontSize: "clamp(2rem, 4vw + 1rem, 3.5rem)",
									lineHeight: "1.1",
									letterSpacing: "-0.02em",
								}}
							>
								{title}
							</h2>
							<p 
								className="text-gray-600 dark:text-gray-300 leading-relaxed"
								style={{
									fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1.25rem)",
								}}
							>
								{description}
							</p>
						</motion.div>

						{/* Info Items Grid */}
						<div className="grid grid-cols-2 gap-4">
							{infoItems.map((item, index) => {
								const Icon = item.icon;
								return (
									<motion.div
										key={index}
										initial={{ opacity: 0, scale: 0.9 }}
										whileInView={{ opacity: 1, scale: 1 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: index * 0.1 }}
										whileHover={{ scale: 1.05, y: -4 }}
										className="group backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
									>
										<div className={`flex flex-col gap-3 ${isArabic ? "text-right items-start" : "text-left items-end"}`}>
											<div className="p-3 bg-[#31A342] rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
												<Icon className="h-5 w-5 text-white" />
											</div>
											<div>
												<h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1">
													{item.title}
												</h3>
												<p className="text-xs text-gray-600 dark:text-gray-400">
													{item.description}
												</p>
											</div>
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Testimonials Section */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.6 }}
					className="mt-16 lg:mt-20 xl:mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 xl:gap-10"
				>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.2 }}
							whileHover={{ y: -4 }}
							className="group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
						>
							<div className={`flex flex-col gap-4 ${isArabic ? "text-right" : "text-left"}`}>
								{/* Quote Icon */}
								<div className={`${isArabic ? "self-start" : "self-end"}`}>
									<Quote className="h-8 w-8 text-[#31A342]/50" />
								</div>
								
								{/* Rating */}
								<div className={`flex gap-1 ${isArabic ? "justify-start" : "justify-end"}`}>
									{[...Array(testimonial.rating)].map((_, i) => (
										<Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
									))}
								</div>

								{/* Comment */}
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
									{testimonial.comment}
								</p>

								{/* Author */}
								<div className={`flex items-center gap-3 `}>
									<div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#31A342]/20">
										<Image
											src={testimonial.avatar}
											alt={testimonial.name}
											width={48}
											height={48}
											className="object-cover"
											unoptimized
										/>
									</div>
									<div>
										<div className="font-semibold text-gray-900 dark:text-gray-100">
											{testimonial.name}
										</div>
										<div className="text-sm text-gray-600 dark:text-gray-400">
											{testimonial.role}
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
});

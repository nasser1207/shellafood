"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

/**
 * Steps Section - Clean & Modern Design
 * Simple step indicators matching the app's design system
 */
export const StepsSection: React.FC = () => {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const title = isArabic ? "اسهل طريقة للحصول على الخدمات" : "The Easiest Way to Get Services";
	const subtitle = isArabic
		? "خطوات بسيطة للحصول على الخدمة في دقائق"
		: "Simple steps to get the service in minutes";

	// Food delivery logistics image - matching app theme
	const imageUrl = "/pickandorder.jpg";
	// Image loading and error states
	const [imageLoading, setImageLoading] = useState(true);
	const [imageError, setImageError] = useState(false);

	const handleImageLoad = () => {
		setImageLoading(false);
	};

	const handleImageError = () => {
		setImageLoading(false);
		setImageError(true);
	};

	const steps = isArabic
		? [
				{ number: "01", title: "اختر نوع النقل", description: "اختر ما يناسب احتياجاتك" },
				{ number: "02", title: "أدخل التفاصيل", description: "أدخل معلومات الشحنة" },
				{ number: "03", title: "تتبع الشحنة", description: "تابع شحنتك في الوقت الفعلي" },
			]
		: [
				{ number: "01", title: "Choose Transport", description: "Select what suits your needs" },
				{ number: "02", title: "Enter Details", description: "Enter shipment information" },
				{ number: "03", title: "Track Shipment", description: "Follow your shipment in real-time" },
			];

	return (
		<section className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
			<div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className="text-center mb-8 sm:mb-12"
				>
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
						{title}
					</h2>
					<p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
						{subtitle}
					</p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-row-reverse">
					{/* Steps List */}
					<motion.div
						initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
						className={`space-y-6 sm:space-y-8 ${isArabic ? "lg:order-2" : "lg:order-1"}`}
					>
						{steps.map((step, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className={`flex gap-4 sm:gap-6 items-start ${isArabic ? "flex-row-reverse text-right" : "flex-row text-left"}`}
							>
								{/* Step Number */}
								<div className={`flex-shrink-0 ${isArabic ? "order-3" : "order-1"}`}>
									<div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center font-bold text-base sm:text-lg md:text-xl shadow-lg">
										{step.number}
									</div>
								</div>

								{/* Step Content */}
								<div className={`flex-1 pt-1 ${isArabic ? "order-2 text-right" : "order-2 text-left"}`}>
									<h3 className={`text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 ${isArabic ? "text-right" : "text-left"}`}>
										{step.title}
									</h3>
									<p className={`text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 ${isArabic ? "text-right" : "text-left"}`}>
										{step.description}
									</p>
								</div>

								{/* Check Icon */}
								<div className={`flex-shrink-0 pt-1 hidden sm:block ${isArabic ? "order-1" : "order-3"}`}>
									<CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
								</div>
							</motion.div>
						))}
					</motion.div>

					{/* Image */}
					<motion.div
						initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.2 }}
						className={`relative ${isArabic ? "lg:order-1" : "lg:order-2"}`}
					>
						<div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] rounded-2xl overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
							{/* Loading State */}
							{imageLoading && !imageError && (
								<div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
									<Loader2 className="h-8 w-8 text-green-500 animate-spin" />
								</div>
							)}

							{/* Error State */}
							{imageError && (
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 p-4">
									<AlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
									<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
										{isArabic ? "فشل تحميل الصورة" : "Failed to load image"}
									</p>
								</div>
							)}

							{/* Image */}
							{!imageError && (
								<img
									src={imageUrl}
									alt={isArabic ? "خطوات الحصول على الخدمة" : "Steps to get service"}
									className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
									loading="lazy"
									onLoad={handleImageLoad}
									onError={handleImageError}
								/>
							)}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};


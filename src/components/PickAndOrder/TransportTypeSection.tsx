"use client";

import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bike, Truck, CheckCircle2 } from "lucide-react";
import { ANIMATION_VARIANTS, VIEWPORT_SETTINGS, ANIMATION_DURATION } from "./constants";
import { getTextAlign, getFloatAlign, getFlexDirection } from "./utils/rtl";

/**
 * Transport Type Selection Section - Clean & Modern Design
 * Optimized for performance with memoization and accessibility
 */
export const TransportTypeSection: React.FC = React.memo(() => {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";

	// Memoized content
	const content = useMemo(
		() => ({
			title: isArabic ? "الرجاء اختيار نوع النقل المناسب" : "Please Choose Your Transport Type",
			subtitle: isArabic
				? "اختر النوع الذي يناسب احتياجاتك"
				: "Select the type that suits your needs",
		}),
		[isArabic]
	);

	// Color theme configurations - memoized for performance
	const colorThemes = useMemo(
		() => ({
			green: {
				borderHover: "hover:border-green-500 dark:hover:border-green-500",
				bgHover: "hover:bg-green-50 dark:hover:bg-green-900/20",
				iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
				checkIcon: "text-green-500",
				button: "bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500/50",
			},
			orange: {
				borderHover: "hover:border-[#FA9D2B] dark:hover:border-[#FA9D2B]",
				bgHover: "hover:bg-orange-50 dark:hover:bg-orange-900/20",
				iconBg: "bg-[#FA9D2B]",
				checkIcon: "text-[#FA9D2B]",
				button: "bg-[#FA9D2B] hover:bg-[#E88D26] focus:ring-[#FA9D2B]/50",
			},
		}),
		[]
	);

	// Memoized transport types
	const transportTypes = useMemo(
		() => [
			{
				icon: Bike,
				title: isArabic ? "دراجة نارية" : "Motorbike",
				slug: "motorbike",
				description: isArabic ? "مناسبة للتوصيل السريع" : "Suitable for fast delivery",
				features: isArabic
					? ["توصيل سريع", "أقل تكلفة", "مناسب للمسافات القصيرة"]
					: ["Fast delivery", "Lower cost", "Suitable for short distances"],
				color: "green" as const,
			},
			{
				icon: Truck,
				title: isArabic ? "شاحنة" : "Truck",
				slug: "truck",
				description: isArabic ? "مناسبة للشحنات الكبيرة" : "Suitable for large shipments",
				features: isArabic
					? ["شحنات كبيرة", "آمنة ومضمونة", "مناسبة للمسافات الطويلة"]
					: ["Large shipments", "Safe & secure", "Suitable for long distances"],
				color: "orange" as const,
			},
		],
		[isArabic]
	);

	// Memoized handler
	const handleChoose = useCallback(
		(slug: string) => {
			router.push(`/pickandorder/${slug}`);
		},
		[router]
	);

	return (
		<section id="transport-section" className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 lg:py-20" aria-labelledby="transport-type-heading">
			<div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
				{/* Section Header */}
				<motion.div
					initial={ANIMATION_VARIANTS.slideUp.hidden}
					whileInView={ANIMATION_VARIANTS.slideUp.visible}
					viewport={VIEWPORT_SETTINGS}
					transition={{ duration: ANIMATION_DURATION.normal }}
					className="text-center mb-8 sm:mb-12"
				>
					<h2 id="transport-type-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
						{content.title}
					</h2>
					<p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
						{content.subtitle}
					</p>
				</motion.div>

				{/* Transport Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto" role="list">
					{transportTypes.map((type, index) => {
						const Icon = type.icon;
						const theme = colorThemes[type.color];
						const textAlign = getTextAlign(isArabic);
						const floatAlign = getFloatAlign(isArabic);

						return (
							<motion.div
								key={type.slug}
								initial={ANIMATION_VARIANTS.item.hidden}
								whileInView={ANIMATION_VARIANTS.item.visible}
								viewport={VIEWPORT_SETTINGS}
								transition={{ duration: ANIMATION_DURATION.normal, delay: index * 0.1 }}
								whileHover={{ y: -4 }}
								whileTap={{ scale: 0.98 }}
								className="group"
								role="listitem"
							>
								{/* Card Container */}
								<div
									className={`relative h-full bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 ${theme.borderHover} ${theme.bgHover} transition-all duration-200 shadow-sm hover:shadow-lg focus-within:ring-2 focus-within:ring-${type.color === "green" ? "green" : "orange"}-500`}
									tabIndex={0}
								>
									{/* Content */}
									<div className={`space-y-5 ${textAlign}`}>
										{/* Icon */}
										<div className={`inline-flex p-4 rounded-xl ${theme.iconBg} text-white shadow-lg ${floatAlign}`} aria-hidden="true">
											<Icon className="h-6 w-6 sm:h-8 sm:w-8" />
										</div>

										{/* Title & Description */}
										<div className="clear-both">
											<h3 className={`text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 ${textAlign}`}>
												{type.title}
											</h3>
											<p className={`text-base text-gray-600 dark:text-gray-300 ${textAlign}`}>
												{type.description}
											</p>
										</div>

										{/* Features List */}
										<ul className={`space-y-2 ${textAlign}`} role="list">
											{type.features.map((feature, idx) => (
												<li key={`${type.slug}-feature-${idx}`} className={`flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 `}>
													<CheckCircle2 className={`h-4 w-4 ${theme.checkIcon} flex-shrink-0`} aria-hidden="true" />
													<span>{feature}</span>
												</li>
											))}
										</ul>

										{/* CTA Button */}
										<button
											onClick={() => handleChoose(type.slug)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													handleChoose(type.slug);
												}
											}}
											className={`w-full mt-4 px-6 py-3 ${theme.button} text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 text-sm sm:text-base`}
											aria-label={`${isArabic ? "اختيار" : "Choose"} ${type.title}`}
										>
											{isArabic ? "اختيار" : "Choose"}
										</button>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
});

TransportTypeSection.displayName = "TransportTypeSection";


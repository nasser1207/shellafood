"use client";

import React, { memo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ServiceCardProps {
	title: string;
	icon: React.ReactNode | null;
	image: string;
	serviceSlugPath: string;
	buttonText: string;
	isArabic: boolean;
	serviceSlug: string;
	description?: string;
	onClick?: () => void;
}

/**
 * Service Card Component
 * Modern, professional service card with image, icon, title, description, and CTA button
 * Enhanced UI/UX with smooth animations and responsive design
 * Full RTL/LTR support for Arabic and English
 */
export const ServiceCard: React.FC<ServiceCardProps> = memo(({
	title,
	icon,
	image,
	buttonText,
	isArabic,
	serviceSlugPath,
	serviceSlug,
	description,
	onClick,
}) => {
	const router = useRouter();

	const handleClick = useCallback(() => {
		if (onClick) {
			onClick();
		}
	}, [onClick]);

	// Prefetch route on hover for instant navigation
	const handleMouseEnter = useCallback(() => {
		router.prefetch(serviceSlugPath);
	}, [router, serviceSlugPath]);

	return (
		<motion.div
			whileHover={{ y: -4, scale: 1.02 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-[#10b981]/30 dark:hover:border-green-500/50 ${
				isArabic ? "rtl" : "ltr"
			}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* Image Container */}
			<div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
				<Image
					src={image}
					alt={title}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="object-cover transition-transform duration-500 group-hover:scale-110"
					priority={false}
				/>
				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
				
				{/* Icon Overlay - Centered */}
				{icon && (
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						whileInView={{ scale: 1, opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3 }}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border-2 border-white/50 dark:border-gray-700/50 group-hover:scale-110 transition-transform duration-300"
					>
						<div className="text-[#10b981] dark:text-green-400 flex items-center justify-center">
							{icon}
						</div>
					</motion.div>
				)}
			</div>

			{/* Content */}
			<div className="p-5 sm:p-6">
				{/* Title */}
				<h3 className={`text-lg sm:text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100 mb-3 text-center ${
					isArabic ? "text-right" : "text-left"
				}`}>
					{title}
				</h3>

				{/* Description */}
				{description && (
					<p className={`text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed ${
						isArabic ? "text-right" : "text-left"
					}`}>
						{description}
					</p>
				)}

				{/* Button with Link - Modern Gradient Style */}
				<Link
					href={serviceSlugPath}
					onClick={handleClick}
					onMouseEnter={handleMouseEnter}
					prefetch={true}
					aria-label={isArabic ? `${buttonText} - ${title}` : `${buttonText} - ${title}`}
					className={`group/btn block w-full rounded-xl bg-gradient-to-r from-[#10b981] via-emerald-600 to-teal-600 hover:from-[#059669] hover:via-emerald-700 hover:to-teal-700 text-white py-3 sm:py-3.5 px-4 sm:px-6 font-bold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#10b981]/30 text-center focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-offset-2 active:scale-[0.98] ${
						isArabic ? "flex-row-reverse" : ""
					}`}
				>
					<span className="flex items-center justify-center gap-2">
						{buttonText}
						<motion.span
							animate={{ x: isArabic ? [0, -4, 0] : [0, 4, 0] }}
							transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
							className="inline-block"
						>
							{isArabic ? "←" : "→"}
						</motion.span>
					</span>
				</Link>
			</div>
		</motion.div>
	);
});

ServiceCard.displayName = "ServiceCard";

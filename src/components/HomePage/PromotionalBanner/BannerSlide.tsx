"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface BannerSlideProps {
	banner: {
		id: number;
		title: string;
		titleEn: string;
		description: string;
		descriptionEn: string;
		cta: string;
		ctaEn: string;
		image: string;
		link: string;
	};
	isArabic: boolean;
	onClick: () => void;
}

export default function BannerSlide({ banner, isArabic, onClick }: BannerSlideProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: isArabic ? -100 : 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: isArabic ? 100 : -100 }}
			transition={{ duration: 0.5 }}
			className="relative h-full w-full cursor-pointer"
			onClick={onClick}
		>
			{/* Background Image */}
			<div className="absolute inset-0">
				<Image
					src={banner.image}
					alt={isArabic ? banner.title : banner.titleEn}
					fill
					className="object-cover"
					priority
					unoptimized
				/>
			</div>

			{/* Gradient Overlay */}
			<div
				className={`absolute inset-0 bg-gradient-to-r ${
					isArabic ? "from-black/70 via-black/50 to-transparent" : "from-black/70 via-black/50 to-transparent"
				}`}
			/>

			{/* Content */}
			<div
				className={`relative h-full flex flex-col justify-center p-4 sm:p-8 md:p-12 lg:p-16 ${
					isArabic ? "items-end text-right" : "items-start text-left"
				}`}
			>
				<motion.h3
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 max-w-2xl leading-tight"
				>
					{isArabic ? banner.title : banner.titleEn}
				</motion.h3>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 sm:mb-6 max-w-xl line-clamp-2 sm:line-clamp-none"
				>
					{isArabic ? banner.description : banner.descriptionEn}
				</motion.p>
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={(e) => {
						e.stopPropagation();
						onClick();
					}}
					className="bg-white text-gray-900 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transition-all hover:bg-gray-50 touch-manipulation w-fit"
				>
					{isArabic ? banner.cta : banner.ctaEn}
				</motion.button>
			</div>
		</motion.div>
	);
}


"use client";

import React from "react";
import { motion } from "framer-motion";

interface BannerPaginationProps {
	banners: any[];
	currentIndex: number;
	onSlideClick: (index: number) => void;
	isArabic: boolean;
}

export default function BannerPagination({
	banners,
	currentIndex,
	onSlideClick,
	isArabic,
}: BannerPaginationProps) {
	return (
		<div
			className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
		>
			{banners.map((_, index) => (
				<button
					key={index}
					onClick={() => onSlideClick(index)}
					className="relative"
					aria-label={`${isArabic ? "انتقل إلى الشريحة" : "Go to slide"} ${index + 1}`}
				>
					{/* Progress bar */}
					{index === currentIndex && (
						<motion.div
							layoutId="activePagination"
							className="absolute inset-0 bg-white rounded-full"
							initial={false}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
						/>
					)}
					{/* Dot */}
					<div
						className={`w-2 h-2 rounded-full transition-all ${
							index === currentIndex
								? "bg-white w-8"
								: "bg-white/50 hover:bg-white/75 w-2"
						}`}
					/>
				</button>
			))}
		</div>
	);
}


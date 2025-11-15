"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BannerSlide from "./BannerSlide";
import BannerPagination from "./BannerPagination";

const banners = [
	{
		id: 1,
		title: "عروض خاصة ومميزة",
		titleEn: "Special Offers & Deals",
		description: "استمتع بأفضل العروض والخصومات الحصرية",
		descriptionEn: "Enjoy the best exclusive offers and discounts",
		cta: "عرض جميع العروض",
		ctaEn: "View All Offers",
		image: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=1200&h=600&fit=crop",
		link: "/discounts",
	},
	{
		id: 2,
		title: "مطاعم جديدة",
		titleEn: "New Restaurants",
		description: "اكتشف المطاعم الجديدة في منطقتك",
		descriptionEn: "Discover new restaurants in your area",
		cta: "استكشف الآن",
		ctaEn: "Explore Now",
		image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop",
		link: "/categories",
	},
	{
		id: 3,
		title: "توصيل مجاني",
		titleEn: "Free Delivery",
		description: "احصل على توصيل مجاني للطلبات فوق 100 ريال",
		descriptionEn: "Get free delivery on orders over 100 SAR",
		cta: "اطلب الآن",
		ctaEn: "Order Now",
		image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
		link: "/home",
	},
];

export default function PromotionalBanner() {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Auto-play carousel
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % banners.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [isAutoPlaying]);

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};

	const nextSlide = () => {
		goToSlide((currentIndex + 1) % banners.length);
	};

	const prevSlide = () => {
		goToSlide((currentIndex - 1 + banners.length) % banners.length);
	};

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.3 }}
			className="mb-8 sm:mb-12 relative group"
			onMouseEnter={() => setIsAutoPlaying(false)}
			onMouseLeave={() => setIsAutoPlaying(true)}
		>
			<div className="relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
				<AnimatePresence mode="wait">
					<BannerSlide
						key={currentIndex}
						banner={banners[currentIndex]}
						isArabic={isArabic}
						onClick={() => router.push(banners[currentIndex].link)}
					/>
				</AnimatePresence>

				{/* Navigation Arrows - Visible on mobile, hover on desktop */}
				<button
					onClick={prevSlide}
					className={`absolute ${isArabic ? "right-2 sm:right-4" : "left-2 sm:left-4"} top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 flex items-center justify-center transition-all hover:scale-110 active:scale-95 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation`}
					aria-label={isArabic ? "السابق" : "Previous"}
				>
					{isArabic ? (
						<ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-900 dark:text-gray-100" />
					) : (
						<ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-900 dark:text-gray-100" />
					)}
				</button>

				<button
					onClick={nextSlide}
					className={`absolute ${isArabic ? "left-2 sm:left-4" : "right-2 sm:right-4"} top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 flex items-center justify-center transition-all hover:scale-110 active:scale-95 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation`}
					aria-label={isArabic ? "التالي" : "Next"}
				>
					{isArabic ? (
						<ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-900 dark:text-gray-100" />
					) : (
						<ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-900 dark:text-gray-100" />
					)}
				</button>

				{/* Pagination */}
				<BannerPagination
					banners={banners}
					currentIndex={currentIndex}
					onSlideClick={goToSlide}
					isArabic={isArabic}
				/>
			</div>
		</motion.section>
	);
}


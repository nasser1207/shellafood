// src/components/Driver/DriverHero.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import ImageSlider, { ImageItem } from "@/components/Utils/ImageSlider";

const DRIVER_IMAGES: ImageItem[] = [
	{ id: 1, url: "/drivers1.jpg", thumbnail: "/drivers1.jpg" },
	{ id: 2, url: "/drivers2.jpg", thumbnail: "/drivers2.jpg" },
	{ id: 3, url: "/drivers3.jpg", thumbnail: "/drivers3.jpg" },
];

export default function DriverHero() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<section className="relative mb-8 overflow-hidden" dir={direction}>
			<ImageSlider 
				images={DRIVER_IMAGES} 
				isArabic={isArabic}
				autoPlayInterval={5000}
			/>
		</section>
	);
}


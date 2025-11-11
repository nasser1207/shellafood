// src/components/Worker/WorkerHero.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import ImageSlider, { ImageItem } from "@/components/Utils/ImageSlider";

const WORKER_IMAGES: ImageItem[] = [
	{ id: 1, url: "/worker.png", thumbnail: "/worker.png" },
];

export default function WorkerHero() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<section className="relative mb-8 overflow-hidden" dir={direction}>
			<ImageSlider 
				images={WORKER_IMAGES} 
				isArabic={isArabic}
				autoPlayInterval={5000}
			/>
		</section>
	);
}


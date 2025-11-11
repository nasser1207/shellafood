// src/components/Partner/PartnerHero.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import ImageSlider, { ImageItem } from "@/components/Utils/ImageSlider";

export default function PartnerHero() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const images: ImageItem[] = [
		{ id: 1, url: "/partner.jpg", thumbnail: "/partner.jpg" },
	];
	return (
		<section className="relative mb-8 overflow-hidden" dir={direction}>
			<ImageSlider isArabic={isArabic} images={images} />
		</section>
	);
}


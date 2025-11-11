// src/components/Investor/InvestorHero.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import VideoSlider, { VideoItem } from "@/components/Utils/VideoSlider";

export default function InvestorHero() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const defaultVideos: VideoItem[] = [
		{ id: 1, url: "/video1.mp4", thumbnail: "/videoframe_0.png" },
		{ id: 2, url: "/video2.mp4", thumbnail: "/videoframe1.png" },
		{ id: 3, url: "/video3.mp4", thumbnail: "/videoframe2.png" },
		{ id: 4, url: "/video4.mp4", thumbnail: "/videoframe3.png" },
	];
	return (
		<section className="mb-6 overflow-hidden sm:mb-8" dir={direction}>
			<VideoSlider videos={defaultVideos} isArabic={isArabic} autoPlayInterval={5000} />
		</section>
	);
}

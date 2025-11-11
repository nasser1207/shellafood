// src/components/Utils/ImageSlider.tsx
"use client";

import { useEffect, useState } from "react";

export interface ImageItem {
	id: number;
	url: string;
	thumbnail: string;
}

interface ImageSliderProps {
	images?: ImageItem[];
	autoPlayInterval?: number;
	isArabic?: boolean;
}



export default function ImageSlider({
	images = [],
	autoPlayInterval = 5000,
	isArabic = true,
}: ImageSliderProps) {
	const [mainImage, setMainImage] = useState<ImageItem | undefined>(images[0]);
	const direction = isArabic ? 'rtl' : 'ltr';

	// Update mainImage when images array changes
	useEffect(() => {
		if (images.length > 0 && (!mainImage || !images.find(img => img.id === mainImage.id))) {
			setMainImage(images[0]);
		} else if (images.length === 0) {
			setMainImage(undefined);
		}
	}, [images, mainImage]);

	// دالة للتقدم إلى الصورة التالية
	const handleNextImage = () => {
		if (!mainImage || images.length === 0) return;
		setMainImage((prevImage) => {
			if (!prevImage) return images[0];
			const currentIndex = images.findIndex((img) => img.id === prevImage.id);
			const nextIndex = (currentIndex + 1) % images.length;
			return images[nextIndex];
		});
	};

	// Auto-play functionality
	useEffect(() => {
		if (images.length > 1 && autoPlayInterval > 0 && mainImage) {
			const intervalId = setInterval(() => {
				handleNextImage();
			}, autoPlayInterval);

			return () => clearInterval(intervalId);
		}
	}, [images, autoPlayInterval, mainImage]);

	// دالة للعودة إلى الصورة السابقة (منطق التنقل اليدوي)
	const handlePrevImage = () => {
		if (!mainImage || images.length === 0) return;
		const currentIndex = images.findIndex((img) => img.id === mainImage.id);
		const prevIndex = (currentIndex - 1 + images.length) % images.length;
		setMainImage(images[prevIndex]);
	};

	// Early return if no images
	if (!images.length || !mainImage) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-8" dir={direction}>
				<p className="text-gray-500 dark:text-gray-400">No images available</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center w-full" dir={direction}>
			{/* حاوية الصور المصغرة - Enhanced for Desktop */}
			{images.length > 1 && (
				<div className={`mb-4 sm:mb-6 flex justify-center gap-3 sm:gap-4 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
					{images.map((image) => (
						<div
							key={image.id}
							className={`relative h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 cursor-pointer overflow-hidden rounded-full shadow-lg transition-all duration-500 border-2 ${
								mainImage.id === image.id
									? "ring-4 ring-green-500 ring-offset-2 border-green-500 scale-110"
									: "border-transparent hover:border-green-300 hover:ring-2 hover:ring-green-300 hover:ring-offset-1 hover:scale-105 opacity-70 hover:opacity-100"
							}`}
							onClick={() => setMainImage(image)}
						>
							<img
								src={image.thumbnail}
								alt={`Thumbnail ${image.id}`}
								className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
							/>
							{/* Active indicator overlay */}
							{mainImage.id === image.id && (
								<div className="absolute inset-0 bg-green-500/20 rounded-full"></div>
							)}
						</div>
					))}
				</div>
			)}

			{/* حاوية الصورة الرئيسية والأسهم - Enhanced Desktop Styling */}
			<div className="relative w-full group">
				{/* Image Container with Modern Styling */}
				<div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl bg-gray-100 dark:bg-gray-800">
					{/* Aspect Ratio Container - Better for Desktop */}
					<div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] xl:h-[500px] 2xl:h-[600px]">
						<img
							key={mainImage.id}
							src={mainImage.url}
							alt={`Main image ${mainImage.id}`}
							className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
						/>
						
						{/* Subtle Gradient Overlay for Depth */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 lg:opacity-100 transition-opacity duration-300"></div>
					</div>

					{/* Navigation Buttons - Enhanced Glassmorphism Style */}
					{images.length > 1 && (
						<>
							{/* Previous Button - Left/Right based on RTL */}
							<button
								className={`absolute top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 backdrop-blur-md p-3 sm:p-4 lg:p-5 shadow-xl transition-all duration-300 hover:scale-125 hover:bg-white border border-white/50 ${
									isArabic ? 'right-3 sm:right-6 lg:right-8' : 'left-3 sm:left-6 lg:left-8'
								} group-hover:opacity-100 opacity-0 lg:opacity-100`}
								onClick={handlePrevImage}
								aria-label={isArabic ? "الصورة السابقة" : "Previous image"}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-700 transition-transform duration-300 group-hover:text-green-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2.5}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d={isArabic ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
									/>
								</svg>
							</button>

							{/* Next Button - Left/Right based on RTL */}
							<button
								className={`absolute top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 backdrop-blur-md p-3 sm:p-4 lg:p-5 shadow-xl transition-all duration-300 hover:scale-125 hover:bg-white border border-white/50 ${
									isArabic ? 'left-3 sm:left-6 lg:left-8' : 'right-3 sm:right-6 lg:right-8'
								} group-hover:opacity-100 opacity-0 lg:opacity-100`}
								onClick={handleNextImage}
								aria-label={isArabic ? "الصورة التالية" : "Next image"}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-700 transition-transform duration-300 group-hover:text-green-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2.5}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d={isArabic ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
									/>
								</svg>
							</button>
						</>
					)}

					{/* Progress Indicator Dots - Desktop Enhancement */}
					{images.length > 1 && (
						<div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
							{images.map((image) => (
								<button
									key={image.id}
									onClick={() => setMainImage(image)}
									className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
										mainImage.id === image.id
											? "w-8 bg-green-500"
											: "w-2 bg-white/60 hover:bg-white/80"
									}`}
									aria-label={`Go to image ${image.id}`}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}


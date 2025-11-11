// src/components/Utils/VideoSlider.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface VideoItem {
	id: number;
	url: string;
	thumbnail: string;
}

interface VideoSliderProps {
	videos?: VideoItem[];
	autoPlayInterval?: number;
	isArabic?: boolean;
}

export default function VideoSlider({
	videos = [],
	autoPlayInterval = 0,
	isArabic: propIsArabic,
}: VideoSliderProps) {
	const [mainVideo, setMainVideo] = useState<VideoItem>(videos[0]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const { language } = useLanguage();
	const isArabic = propIsArabic ?? language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	// Update mainVideo when videos array changes
	useEffect(() => {
		if (videos.length > 0 && (!mainVideo || !videos.find(v => v.id === mainVideo.id))) {
			setMainVideo(videos[0]);
		}
	}, [videos]);

	// Handle video loading
	const handleVideoLoadStart = () => setIsLoading(true);
	const handleVideoCanPlay = () => setIsLoading(false);
	const handleVideoPlay = () => setIsPlaying(true);
	const handleVideoPause = () => setIsPlaying(false);

	// Navigate to next video
	const handleNextVideo = useCallback(() => {
		if (videos.length === 0) return;
		setMainVideo((prevVideo) => {
			const currentIndex = videos.findIndex((v) => v.id === prevVideo.id);
			const nextIndex = (currentIndex + 1) % videos.length;
			return videos[nextIndex];
		});
		setIsPlaying(false);
		if (videoRef.current) {
			videoRef.current.pause();
		}
	}, [videos]);

	// Navigate to previous video
	const handlePrevVideo = useCallback(() => {
		if (videos.length === 0) return;
		setMainVideo((prevVideo) => {
			const currentIndex = videos.findIndex((v) => v.id === prevVideo.id);
			const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
			return videos[prevIndex];
		});
		setIsPlaying(false);
		if (videoRef.current) {
			videoRef.current.pause();
		}
	}, [videos]);

	// Handle video selection
	const handleVideoSelect = useCallback((video: VideoItem) => {
		setMainVideo(video);
		setIsPlaying(false);
		if (videoRef.current) {
			videoRef.current.pause();
		}
	}, []);

	// Touch/swipe handlers for mobile
	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStart(e.touches[0].clientX);
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (!touchStart) return;
		const touchEnd = e.changedTouches[0].clientX;
		const diff = touchStart - touchEnd;
		const minSwipeDistance = 50;

		if (Math.abs(diff) > minSwipeDistance) {
			if (diff > 0) {
				// Swipe left (next video)
				handleNextVideo();
			} else {
				// Swipe right (previous video)
				handlePrevVideo();
			}
		}
		setTouchStart(null);
	};

	// Keyboard navigation
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			
			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
				e.preventDefault();
				if (isArabic) {
					e.key === 'ArrowLeft' ? handleNextVideo() : handlePrevVideo();
				} else {
					e.key === 'ArrowLeft' ? handlePrevVideo() : handleNextVideo();
				}
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [handleNextVideo, handlePrevVideo, isArabic]);

	// Auto-play slideshow (optional)
	useEffect(() => {
		if (videos.length > 1 && autoPlayInterval > 0 && !isPlaying) {
			const intervalId = setInterval(() => {
				handleNextVideo();
			}, autoPlayInterval);

			return () => clearInterval(intervalId);
		}
	}, [videos.length, autoPlayInterval, isPlaying, handleNextVideo]);

	// Early return if no videos
	if (!videos.length) {
		return (
			<div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-12 sm:p-16 lg:p-20 border border-gray-200 dark:border-gray-700" dir={direction}>
				<div className="flex flex-col items-center gap-4">
					<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
						<svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
						</svg>
					</div>
					<p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium">{isArabic ? 'لا توجد فيديوهات متاحة' : 'No videos available'}</p>
				</div>
			</div>
		);
	}

	const currentIndex = videos.findIndex((v) => v.id === mainVideo.id);

	return (
		<div 
			className="flex flex-col lg:flex-row items-start w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6 lg:gap-8" 
			dir={direction}
		>
			{/* Thumbnail Navigation - Mobile: Top, Desktop: Side */}
			{videos.length > 1 && (
				<>
					{/* Mobile: Horizontal Thumbnails with Scroll */}
					<div className={`lg:hidden w-full overflow-x-auto pb-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
						<div className={`flex gap-3 sm:gap-4 min-w-max ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
							{videos.map((video) => (
								<button
									key={video.id}
									onClick={() => handleVideoSelect(video)}
									className={`group relative flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl shadow-lg dark:shadow-xl transition-all duration-300 border-2 ${
										mainVideo.id === video.id
											? "ring-4 ring-green-500 dark:ring-green-400 ring-offset-2 dark:ring-offset-gray-800 border-green-500 dark:border-green-400 scale-105 z-10 shadow-green-500/20 dark:shadow-green-400/20"
											: "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:ring-2 hover:ring-green-300 dark:hover:ring-green-600 hover:ring-offset-1 hover:scale-105 opacity-70 hover:opacity-100 bg-gray-100 dark:bg-gray-800"
									}`}
									aria-label={`${isArabic ? 'اختر الفيديو' : 'Select video'} ${currentIndex + 1}`}
									aria-pressed={mainVideo.id === video.id}
								>
									<img
										src={video.thumbnail}
										alt={`${isArabic ? 'صورة مصغرة' : 'Thumbnail'} ${video.id}`}
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
										loading="lazy"
									/>
									{mainVideo.id === video.id && (
										<div className="absolute inset-0 bg-gradient-to-br from-green-500/30 dark:from-green-400/30 to-transparent rounded-xl sm:rounded-2xl backdrop-blur-[1px]"></div>
									)}
									{mainVideo.id !== video.id && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl">
											<svg className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
												<path d="M8 5v14l11-7z" />
											</svg>
										</div>
									)}
									{/* Active indicator */}
									{mainVideo.id === video.id && (
										<div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 shadow-lg"></div>
									)}
								</button>
							))}
						</div>
					</div>

					{/* Desktop: Vertical Side Thumbnails */}
					<div className={`hidden lg:flex flex-col gap-3 xl:gap-4 flex-shrink-0 ${isArabic ? 'order-2' : 'order-1'}`}>
						{videos.map((video) => (
							<button
								key={video.id}
								onClick={() => handleVideoSelect(video)}
								className={`group relative w-24 h-16 xl:w-28 xl:h-20 2xl:w-32 2xl:h-24 cursor-pointer overflow-hidden rounded-xl xl:rounded-2xl shadow-lg dark:shadow-xl transition-all duration-300 border-2 ${
									mainVideo.id === video.id
										? "ring-4 xl:ring-[5px] ring-green-500 dark:ring-green-400 ring-offset-2 xl:ring-offset-3 dark:ring-offset-gray-800 border-green-500 dark:border-green-400 scale-105 xl:scale-110 z-10 shadow-green-500/30 dark:shadow-green-400/30"
										: "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:ring-2 hover:ring-green-300 dark:hover:ring-green-600 hover:ring-offset-1 hover:scale-105 opacity-70 hover:opacity-100 bg-gray-100 dark:bg-gray-800"
								}`}
								aria-label={`${isArabic ? 'اختر الفيديو' : 'Select video'} ${videos.findIndex(v => v.id === video.id) + 1}`}
								aria-pressed={mainVideo.id === video.id}
							>
								<img
									src={video.thumbnail}
									alt={`${isArabic ? 'صورة مصغرة' : 'Thumbnail'} ${video.id}`}
									className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
									loading="lazy"
								/>
								{mainVideo.id === video.id && (
									<div className="absolute inset-0 bg-gradient-to-br from-green-500/30 dark:from-green-400/30 to-transparent rounded-xl xl:rounded-2xl backdrop-blur-[1px]"></div>
								)}
								{mainVideo.id !== video.id && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl xl:rounded-2xl">
										<svg className="h-7 w-7 xl:h-9 xl:w-9 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
											<path d="M8 5v14l11-7z" />
										</svg>
									</div>
								)}
								{/* Active indicator */}
								{mainVideo.id === video.id && (
									<div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 shadow-lg"></div>
								)}
							</button>
						))}
					</div>
				</>
			)}

			{/* Main Video Container */}
			<div 
				className={`relative w-full group ${isArabic ? 'lg:order-1' : 'lg:order-2'} ${videos.length > 1 ? 'lg:flex-1' : ''}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				{/* Video Container with Modern Styling */}
				<div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-3xl xl:rounded-[2rem] shadow-2xl dark:shadow-3xl bg-gray-900 dark:bg-black border border-gray-800 dark:border-gray-900">
					{/* Aspect Ratio Container */}
					<div className="relative w-full aspect-video lg:aspect-[16/9] xl:aspect-[21/9] xl:h-[600px] 2xl:h-[700px]">
						{isLoading && (
							<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black dark:from-black dark:to-gray-900 z-10">
								<div className="flex flex-col items-center gap-4 lg:gap-6">
									<div className="relative">
										<div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-4 border-gray-700 dark:border-gray-800"></div>
										<div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-t-4 border-green-500 dark:border-green-400 absolute top-0 left-0"></div>
									</div>
									<p className="text-white dark:text-gray-300 text-sm lg:text-base font-medium">{isArabic ? 'جاري تحميل الفيديو...' : 'Loading video...'}</p>
								</div>
							</div>
						)}
						<video
							ref={videoRef}
							key={mainVideo.id}
							controls
							poster={mainVideo.thumbnail}
							className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
							onLoadStart={handleVideoLoadStart}
							onCanPlay={handleVideoCanPlay}
							onPlay={handleVideoPlay}
							onPause={handleVideoPause}
							preload="metadata"
							playsInline
						>
							<source src={mainVideo.url} type="video/mp4" />
							{isArabic ? 'المتصفح الخاص بك لا يدعم تشغيل الفيديو' : 'Your browser does not support the video tag'}
						</video>

						{/* Gradient Overlays for Depth */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
						<div className="absolute inset-0 bg-gradient-to-br from-green-900/10 dark:from-green-900/5 via-transparent to-transparent pointer-events-none"></div>
					</div>

					{/* Navigation Buttons - Enhanced with Dark Mode */}
					{videos.length > 1 && (
						<>
							{/* Previous Button */}
							<button
								className={`absolute top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg p-3 sm:p-4 lg:p-5 xl:p-6 shadow-2xl dark:shadow-3xl transition-all duration-300 hover:scale-110 lg:hover:scale-125 active:scale-95 hover:bg-white dark:hover:bg-gray-700 border border-white/60 dark:border-gray-700/60 ${
									isArabic ? 'right-3 sm:right-4 lg:right-6 xl:right-8' : 'left-3 sm:left-4 lg:left-6 xl:left-8'
								} opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-4 focus:ring-green-500/50 dark:focus:ring-green-400/50`}
								onClick={isArabic ? handleNextVideo : handlePrevVideo}
								aria-label={isArabic ? "الفيديو السابق" : "Previous video"}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400"
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

							{/* Next Button */}
							<button
								className={`absolute top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg p-3 sm:p-4 lg:p-5 xl:p-6 shadow-2xl dark:shadow-3xl transition-all duration-300 hover:scale-110 lg:hover:scale-125 active:scale-95 hover:bg-white dark:hover:bg-gray-700 border border-white/60 dark:border-gray-700/60 ${
									isArabic ? 'left-3 sm:left-4 lg:left-6 xl:left-8' : 'right-3 sm:right-4 lg:right-6 xl:right-8'
								} opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-4 focus:ring-green-500/50 dark:focus:ring-green-400/50`}
								onClick={isArabic ? handlePrevVideo : handleNextVideo}
								aria-label={isArabic ? "الفيديو التالي" : "Next video"}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400"
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

					{/* Progress Indicator Dots - Enhanced */}
					{videos.length > 1 && (
						<div className={`absolute bottom-4 sm:bottom-5 lg:bottom-6 xl:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-2.5 lg:gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
							{videos.map((video, index) => (
								<button
									key={video.id}
									onClick={() => handleVideoSelect(video)}
									className={`h-2 sm:h-2.5 lg:h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 ${
										mainVideo.id === video.id
											? "w-8 sm:w-10 lg:w-12 bg-green-500 dark:bg-green-400 shadow-lg dark:shadow-xl shadow-green-500/50 dark:shadow-green-400/50"
											: "w-2 bg-white/70 dark:bg-gray-400/70 hover:bg-white/90 dark:hover:bg-gray-300/90 hover:w-4 lg:hover:w-6"
									}`}
									aria-label={`${isArabic ? 'انتقل إلى الفيديو' : 'Go to video'} ${index + 1}`}
									aria-current={mainVideo.id === video.id ? 'true' : 'false'}
								/>
							))}
						</div>
					)}
				</div>

				{/* Video Counter Badge - Enhanced */}
				{videos.length > 1 && (
					<div className={`absolute top-4 sm:top-5 lg:top-6 xl:top-8 ${isArabic ? 'left-4 sm:left-5 lg:left-6 xl:left-8' : 'right-4 sm:right-5 lg:right-6 xl:right-8'} z-20 bg-black/75 dark:bg-black/85 backdrop-blur-md text-white px-3 sm:px-4 lg:px-5 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-full lg:rounded-xl text-xs sm:text-sm lg:text-base font-medium lg:font-semibold shadow-xl dark:shadow-2xl border border-white/20 dark:border-gray-700/30`}>
						<span className="hidden sm:inline">{isArabic ? 'فيديو' : 'Video'} </span>
						<span className="font-bold">{currentIndex + 1}</span>
						<span className="opacity-70"> / {videos.length}</span>
					</div>
				)}
			</div>
		</div>
	);
}

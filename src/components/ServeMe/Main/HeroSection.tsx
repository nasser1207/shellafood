"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

interface HeroSectionProps {
	title: string;
	subtitle: string;
	searchPlaceholder: string;
	isArabic: boolean;
	onSearch?: (query: string) => void;
}

/**
 * Hero Section Component
 * Modern, responsive hero section with enhanced UI/UX
 * Features: Gradient background, improved spacing, better mobile experience
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
	title,
	subtitle,
	searchPlaceholder,
	isArabic,
	onSearch,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	const handleSearch = useCallback((e: React.FormEvent) => {
		e.preventDefault();
		if (onSearch && searchQuery.trim()) {
			onSearch(searchQuery.trim());
		}
	}, [onSearch, searchQuery]);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	}, []);

	// Responsive container with gradient background
	const containerClasses = "relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24";
	
	// Decorative background elements
	const bgDecoration = (
		<>
			<div className="absolute top-0 right-0 w-64 h-64 bg-green-200 dark:bg-green-900 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
			<div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 dark:bg-emerald-900 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
			<div className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-200 dark:bg-teal-900 rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
		</>
	);

	const contentClasses = "relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16";
	const gridClasses = "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center";
	const textOrderClasses = isArabic ? "order-2 lg:order-1" : "order-1";
	const textAlignClasses = isArabic ? "text-right" : "text-left";
	const imageOrderClasses = isArabic ? "order-1 lg:order-2" : "order-2";

	// Enhanced search bar styles
	const searchContainerClasses = `relative max-w-2xl mx-auto lg:mx-0 transition-all duration-300 ${isFocused ? "scale-[1.02]" : ""}`;
	const searchIconClasses = `absolute top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
		isFocused ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"
	} ${isArabic ? "right-4 md:right-5" : "left-4 md:left-5"}`;
	const inputClasses = `w-full rounded-2xl border-2 ${
		isFocused ? "border-green-500 dark:border-green-400 shadow-lg shadow-green-500/20 dark:shadow-green-400/20" : "border-gray-200 dark:border-gray-700 shadow-md"
	} bg-white dark:bg-gray-800 py-3.5 sm:py-4 md:py-5 ${
		isArabic ? "pr-12 pl-4 md:pr-14 md:pl-5 text-right" : "pl-12 pr-4 md:pl-14 md:pr-5 text-left"
	} text-base sm:text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-200 hover:border-green-400 dark:hover:border-green-500 hover:shadow-lg`;

	return (
		<div className={containerClasses}>
			{/* Decorative background elements */}
			{bgDecoration}
			
			<div className={contentClasses}>
				<div className={gridClasses}>
					{/* Text Content */}
					<div className={`${textOrderClasses} ${textAlignClasses}`}>
						{/* Title with gradient effect */}
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 sm:mb-5 md:mb-6 leading-tight tracking-tight">
							<span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
								{title}
							</span>
						</h1>
						
						{/* Subtitle with better spacing */}
						<p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
							{subtitle}
						</p>

						{/* Enhanced Search Bar */}
						<form onSubmit={handleSearch} className={searchContainerClasses}>
							<div className="relative">
								<Search className={searchIconClasses} strokeWidth={2.5} />
								<input
									type="text"
									value={searchQuery}
									onChange={handleInputChange}
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
									placeholder={searchPlaceholder}
									className={inputClasses}
									aria-label={searchPlaceholder}
								/>
								{/* Submit button for better UX */}
								<button
									type="submit"
									className={`absolute ${isArabic ? "left-2 top-1/2 -translate-y-1/2" : "right-2 top-1/2 -translate-y-1/2"} bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl font-semibold text-sm sm:text-base hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
									aria-label={isArabic ? "بحث" : "Search"}
								>
									{isArabic ? "بحث" : "Search"}
								</button>
							</div>
						</form>

						{/* Popular searches or quick actions - optional enhancement */}
						<div className={`mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 ${isArabic ? "justify-center lg:justify-start" : "justify-center lg:justify-start"}`}>
							<span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
								{isArabic ? "شائع:" : "Popular:"}
							</span>
							{(isArabic ? ["خدمة", "توصيل", "صيانة"] : ["Service", "Delivery", "Repair"]).map((tag, idx) => (
								<button
									key={idx}
									type="button"
									onClick={() => setSearchQuery(tag)}
									className="text-xs sm:text-sm px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-600 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-1"
								>
									{tag}
								</button>
							))}
						</div>
					</div>

					{/* Image with enhanced styling */}
					<div className={`${imageOrderClasses} flex items-center ${isArabic ? "justify-center lg:justify-start" : "justify-center lg:justify-end"}`}>
						<div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[550px] xl:max-w-[600px] group">
							{/* Decorative glow effect */}
							<div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-300 -z-10 scale-105"></div>
							
							{/* Image container with shadow */}
							<div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
								<Image
									src="/serveme-hero.png"
									alt={isArabic ? "خدمة التوصيل" : "Delivery Service"}
									width={600}
									height={400}
									priority
									className="w-full h-auto object-cover"
									sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, (max-width: 1024px) 450px, (max-width: 1280px) 550px, 600px"
								/>
							</div>
							
							{/* Floating decoration elements */}
							<div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full opacity-20 blur-xl animate-pulse hidden md:block"></div>
							<div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-500 rounded-full opacity-20 blur-xl animate-pulse hidden md:block" style={{ animationDelay: "1s" }}></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};


"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { ServiceCategoryData } from "@/lib/data/services";
import { Search } from "lucide-react";
import { ServiceCard } from "./ServiceCard";

interface ServiceCategoryPageProps {
	serviceData: ServiceCategoryData;
}

// Constants
const HERO_HEIGHT_CLASSES = "relative w-full h-[300px] sm:h-[400px] lg:h-[450px]";
const HERO_GRADIENT_CLASSES = "absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60";
const SECTION_CONTAINER_CLASSES = "bg-gray-50 dark:bg-gray-800 py-12 lg:py-14";
const SECTION_CONTENT_CLASSES = "w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24";
const SECTION_HEADING_CLASSES = "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center";
const GRID_3_COLS_CLASSES = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6";
const GRID_2_COLS_CLASSES = "grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6";
const WHY_CHOOSE_US_GRID_CLASSES = "grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10";
const WORKSHOP_CARD_CLASSES = "group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700";
const WORKSHOP_IMAGE_CLASSES = "relative w-full h-48 sm:h-52 lg:h-56 overflow-hidden bg-gray-100 dark:bg-gray-700";
const VIDEO_CONTAINER_CLASSES = "relative w-full h-[280px] sm:h-[360px] lg:h-[480px] rounded-lg overflow-hidden shadow-lg";
const PLAY_BUTTON_CLASSES = "w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 dark:hover:bg-green-500 group transition-colors duration-200 shadow-xl";

/**
 * Service Category Page Component
 * Displays a category of services (e.g., "Legal Services", "Home Maintenance")
 * Shows all sub-services within this category
 */
const ServiceCategoryPage: React.FC<ServiceCategoryPageProps> = ({ serviceData }) => {
	const { language, t } = useLanguage();
	const router = useRouter();
	const isArabic = language === "ar";

	const [searchQuery, setSearchQuery] = useState("");

	// Memoize computed values
	const title = useMemo(() => isArabic ? serviceData.titleAr : serviceData.titleEn, [isArabic, serviceData.titleAr, serviceData.titleEn]);
	const description = useMemo(() => isArabic ? serviceData.descriptionAr : serviceData.descriptionEn, [isArabic, serviceData.descriptionAr, serviceData.descriptionEn]);
	const mainServices = useMemo(() => isArabic ? serviceData.mainServices.ar : serviceData.mainServices.en, [isArabic, serviceData.mainServices]);
	const keyServices = useMemo(() => isArabic ? serviceData.keyServices.ar : serviceData.keyServices.en, [isArabic, serviceData.keyServices]);

	// Prefetch all service routes on mount for instant navigation
	useEffect(() => {
		mainServices.forEach((service) => {
			router.prefetch(service.path);
		});
		keyServices.forEach((service) => {
			router.prefetch(service.path);
		});
	}, [router, mainServices, keyServices]);
	const whyChooseUs = useMemo(() => isArabic ? serviceData.whyChooseUs.ar : serviceData.whyChooseUs.en, [isArabic, serviceData.whyChooseUs]);
	const availableWorkshops = useMemo(() => isArabic ? serviceData.availableWorkshops.ar : serviceData.availableWorkshops.en, [isArabic, serviceData.availableWorkshops]);

	const handleSearch = useCallback((e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			console.log("Search query:", searchQuery.trim());
			// TODO: Implement search functionality
		}
	}, [searchQuery]);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	}, []);

	const handleBookAppointment = useCallback((workshopName: string) => {
		console.log("Book appointment:", workshopName);
		// TODO: Implement booking functionality
	}, []);

	const handlePlayVideo = useCallback(() => {
		console.log("Play video");
		// TODO: Implement video playback
	}, []);

	const containerClasses = `min-h-screen bg-gray-50 dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`;
	const searchInputClasses = `flex-1 border-0 bg-white dark:bg-gray-800 py-3 sm:py-3.5 ${
		isArabic ? "pr-4 pl-0 text-right" : "pl-4 pr-0 text-left"
	} text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0`;
	const workshopNameClasses = `text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 ${isArabic ? "text-right" : "text-left"}`;
	const flexRowClasses = (isArabic: boolean) => `flex items-center gap-2 ${isArabic ? "flex-row-reverse" : "flex-row"}`;

	return (
		<div className={containerClasses} dir={isArabic ? "rtl" : "ltr"}>
			{/* Hero Section - Full Width Edge to Edge */}
			<div className="w-full pt-6 pb-8">
				<div className="relative w-full overflow-hidden shadow-xl">
					<div className={HERO_HEIGHT_CLASSES}>
						<Image
							src={serviceData.heroImage}
							alt={title}
							fill
							priority
							sizes="100vw"
							className="object-cover"
						/>
						<div className={HERO_GRADIENT_CLASSES} />
						
						{/* Hero Content */}
						<div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8">
							<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 text-center drop-shadow-lg">
								{title}
							</h1>
							<p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 text-center max-w-3xl drop-shadow-md">
								{description}
							</p>

							{/* Search Bar */}
							<form onSubmit={handleSearch} className="w-full max-w-2xl px-4">
								<div className="relative flex shadow-xl rounded-lg overflow-hidden">
									<input
										type="text"
										value={searchQuery}
										onChange={handleInputChange}
										placeholder={t("serviceDetail.searchPlaceholder")}
										className={searchInputClasses}
									/>
									<button
										type="submit"
										className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-6 sm:px-8 transition-colors duration-200 flex items-center justify-center"
										aria-label={t("serviceDetail.searchPlaceholder")}
									>
										<Search className="h-5 w-5" />
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* Main Services Section */}
			<div className={SECTION_CONTAINER_CLASSES}>
				<div className={SECTION_CONTENT_CLASSES}>
					<h2 className={SECTION_HEADING_CLASSES}>
						{t("serviceDetail.mainServicesTitle")}
					</h2>

					<div className={GRID_3_COLS_CLASSES}>
						{mainServices.map((service) => {
							// Generate description from service title if not provided
							const description = isArabic 
								? `${service.title} - خدمة احترافية عالية الجودة مع فنيين مدربين ومعدات حديثة`
								: `${service.title} - Professional high-quality service with trained technicians and modern equipment`;
							
							return (
								<ServiceCard
									key={service.slug}
									title={service.title}
									image={service.image}
									serviceSlugPath={service.path}
									buttonText={t("serviceDetail.requestButton")}
									isArabic={isArabic}
									serviceSlug={service.slug}
									icon={null}
									description={description}
								/>
							);
						})}
					</div>
				</div>
			</div>

			{/* Key Services Section */}
			<div className={SECTION_CONTAINER_CLASSES}>
				<div className={SECTION_CONTENT_CLASSES}>
					<h2 className={SECTION_HEADING_CLASSES}>
						{t("serviceDetail.keyServicesTitle")}
					</h2>

					<div className={GRID_3_COLS_CLASSES}>
						{keyServices.map((service) => {
							// Generate description from service title if not provided
							const description = isArabic 
								? `${service.title} - حلول متخصصة وفعالة بأسعار منافسة وضمان الجودة`
								: `${service.title} - Specialized and effective solutions with competitive prices and quality guarantee`;
							
							return (
								<ServiceCard
									key={service.slug}
									title={service.title}
									image={service.image}
									serviceSlugPath={service.path}
									buttonText={t("serviceDetail.requestButton")}
									isArabic={isArabic}
									serviceSlug={service.slug}
									icon={service.icon}
									description={description}
								/>
							);
						})}
					</div>
				</div>
			</div>

			{/* Why Choose Us Section */}
			<div className="bg-white dark:bg-gray-900 py-12 lg:py-14">
				<div className={SECTION_CONTENT_CLASSES}>
					<h2 className={SECTION_HEADING_CLASSES}>
						{t("serviceDetail.whyChooseUsTitle")}
					</h2>

					<div className={WHY_CHOOSE_US_GRID_CLASSES}>
						{whyChooseUs.map((item, index) => (
							<div
								key={`why-choose-${item.title}-${index}`}
								className="flex flex-col items-center text-center"
							>
								<div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
									<div className="text-green-600 dark:text-green-400">
										{item.icon}
									</div>
								</div>
								<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
									{item.title}
								</h3>
								{item.description && (
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{item.description}
									</p>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Available Workshops Section */}
			<div className={SECTION_CONTAINER_CLASSES}>
				<div className={SECTION_CONTENT_CLASSES}>
					<h2 className={SECTION_HEADING_CLASSES}>
						{t("serviceDetail.availableWorkshopsTitle")}
					</h2>

					<div className={GRID_2_COLS_CLASSES}>
						{availableWorkshops.map((workshop, index) => (
							<div
								key={`workshop-${workshop.name}-${index}`}
								className={WORKSHOP_CARD_CLASSES}
							>
								<div className={WORKSHOP_IMAGE_CLASSES}>
									<Image
										src={workshop.image}
										alt={workshop.name}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								</div>
								<div className="p-4">
									<h3 className={workshopNameClasses}>
										{workshop.name}
									</h3>
									
									<div className="space-y-2 mb-4">
										{/* Rating */}
										<div className={flexRowClasses(isArabic)}>
											<span className="text-yellow-500">⭐</span>
											<span className="text-gray-900 dark:text-gray-100 font-semibold">{workshop.rating}</span>
										</div>

										{/* Distance */}
										<div className={flexRowClasses(isArabic)}>
											<span className="text-green-600 dark:text-green-400">📍</span>
											<span className="text-gray-600 dark:text-gray-400 text-sm">{workshop.distance}</span>
										</div>

										{/* Available Hours */}
										<div className={flexRowClasses(isArabic)}>
											<span className="text-gray-600 dark:text-gray-400">🕐</span>
											<span className="text-gray-600 dark:text-gray-400 text-sm">{workshop.availableHours}</span>
										</div>
									</div>

									<Link
										href="#"
										onClick={(e) => {
											e.preventDefault();
											handleBookAppointment(workshop.name);
										}}
										prefetch={true}
										className="block w-full text-center rounded-md bg-green-600 dark:bg-green-500 text-white py-2.5 px-4 font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
									>
										{t("serviceDetail.bookAppointment")}
									</Link>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Video Section */}
			<div className={`${SECTION_CONTAINER_CLASSES} pb-16`}>
				<div className={SECTION_CONTENT_CLASSES}>
					<h2 className={SECTION_HEADING_CLASSES}>
						{t("serviceDetail.howItWorksTitle")}
					</h2>

					<div className="relative w-full">
						<div className={VIDEO_CONTAINER_CLASSES}>
							<Image
								src={serviceData.videoThumbnail}
								alt={t("serviceDetail.howItWorksTitle")}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 1536px) 90vw, 1400px"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-black/30 flex items-center justify-center">
								<button
									onClick={handlePlayVideo}
									className={PLAY_BUTTON_CLASSES}
									aria-label="Play video"
								>
									<svg className="w-7 h-7 sm:w-9 sm:h-9 text-green-600 dark:text-green-400 group-hover:text-white ml-1 transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path d="M8 5v14l11-7z" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ServiceCategoryPage;

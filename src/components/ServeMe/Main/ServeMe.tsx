"use client";

import React, { useMemo, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroSection } from "@/components/ServeMe/Main/HeroSection";
import { ServicesGrid } from "@/components/ServeMe/Main/ServicesGrid";
import { FeaturesSection } from "@/components/ServeMe/Main/FeaturesSection";
import { Car, Truck, Wrench, Plane, Baby, Scale, Scissors, Hammer, MapPin, Headphones, CheckCircle } from "lucide-react";

/**
 * ServeMe Component (اخدمني)
 * Main component for the serve-me service page
 * Complete design with hero, services grid, and features
 */
export default function ServeMe() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";

	// Memoize services data
	const services = useMemo(() => [
		{
			slug: "car-maintenance",
			path: "/serve-me/car-maintenance",
			title: t("serveMe.carMaintenance"),
			icon: <Car className="w-8 h-8" />,
			image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop",
		},
		{
			slug: "teachers-training",
			path: "/serve-me/teachers-training",
			title: t("serveMe.delivery"),
			icon: <Truck className="w-8 h-8" />,
			image: "/helpsupport.jpg",
		},
		{
			slug: "home-maintenance",
			path: "/serve-me/home-maintenance",
			title: t("serveMe.repair"),
			icon: <Wrench className="w-8 h-8" />,
			image: "/serveme-hero.png",
		},
		{
			slug: "travel-yemen",
			path: "/serve-me/travel-yemen",
			title: t("serveMe.travel"),
			icon: <Plane className="w-8 h-8" />,
			image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop",
		},
		{
			slug: "babysitting",
			path: "/serve-me/babysitting",
			title: t("serveMe.babysitting"),
			icon: <Baby className="w-8 h-8" />,
			image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop",
		},
		{
			slug: "legal-services",
			path: "/serve-me/legal-services",
			title: t("serveMe.legal"),
			icon: <Scale className="w-8 h-8" />,
			image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
		},
		{
			slug: "women-salons",
			path: "/serve-me/women-salons",
			title: t("serveMe.womenSalons"),
			icon: <Scissors className="w-8 h-8" />,
			image: "/serveme-hero.png",
		},
		{
			slug: "men-salons",
			path: "/serve-me/men-salons",
			title: t("serveMe.menSalons"),
			icon: <Scissors className="w-8 h-8" />,
			image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop",
		},
		{
			slug: "construction-materials",
			path: "/serve-me/construction-materials",
			title: t("serveMe.construction"),
			icon: <Hammer className="w-8 h-8" />,
			image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
		},
	], [t]);

	// Memoize features data
	const features = useMemo(() => [
		{
			icon: <MapPin className="w-10 h-10" />,
			title: t("serveMe.features.coverage"),
			description: t("serveMe.features.coverageDesc"),
		},
		{
			icon: <Headphones className="w-10 h-10" />,
			title: t("serveMe.features.support"),
			description: t("serveMe.features.supportDesc"),
		},
		{
			icon: <CheckCircle className="w-10 h-10" />,
			title: t("serveMe.features.reliable"),
			description: t("serveMe.features.reliableDesc"),
		},
	], [t]);

	const handleSearch = useCallback((query: string) => {
		console.log("Search query:", query);
		// TODO: Implement search functionality
	}, []);

	return (
		<div className={`${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			{/* Hero Section */}
			<HeroSection
				title={t("serveMe.title")}
				subtitle={t("serveMe.subtitle")}
				searchPlaceholder={t("serveMe.searchPlaceholder")}
				isArabic={isArabic}
				onSearch={handleSearch}
			/>

			{/* Services Grid */}
			<ServicesGrid
				title={t("serveMe.servicesTitle")}
				buttonText={t("serveMe.requestService")}
				isArabic={isArabic}
				services={services}
			/>

			{/* Features Section */}
			<FeaturesSection
				features={features}
				isArabic={isArabic}
			/>
		</div>
	);
}


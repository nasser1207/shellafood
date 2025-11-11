// HomePage.tsx

"use client";

import { NearbyStore } from "@/lib/types/api";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
	DeliveryAddressHero,
	PromotionalBanner,
	DiscountsSection,
	NearbyStoresSection,
	PopularStoresSection,
} from "@/components/HomePage";
import { CategoriesSlider } from "../Categories/Slider";

// Local Category type for action typing (matches Categories API)
type Category = {
	id: string;
	name: string;
	description?: string;
	image?: string;
};

export default function HomePage({
	getCategoriesAction,
	getNearbyStoresAction,
}: {
	getCategoriesAction: () => Promise<
		| { categories: Category[]; cached: boolean; success: boolean }
		| { error: string }
	>;
	getNearbyStoresAction: (args: {
		lat: number;
		lng: number;
		limit?: number;
		maxDistance?: number;
	}) => Promise<
		| {
				stores: NearbyStore[];
				userLocation: { lat: number; lng: number };
				maxDistance: number;
				total: number;
		  }
		| { error: string }
	>;
}) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const [selectedDeliveryAddress, setSelectedDeliveryAddress] =
		useState<any>(null);

	const handleDeliveryAddressChange = useCallback((address: any) => {
		setSelectedDeliveryAddress(address);
	}, []);

	// Prefetch common routes on mount
	useEffect(() => {
		const routesToPrefetch = [
			"/categories",
			"/nearby-stores",
			"/discounts",
			"/popular-stores",
			"/hyper-shella",
			"/PickUp",
		];
		routesToPrefetch.forEach((route) => router.prefetch(route));
	}, [router]);

	const handleDiscountClick = useCallback((discountTitle: string) => {
		const route = `/store?store=${encodeURIComponent(discountTitle)}&source=discounts`;
		router.prefetch(route);
		router.push(route);
	}, [router]);

	const handlePopularStoreClick = useCallback((storeName: string) => {
		const route = `/store?store=${encodeURIComponent(storeName)}&source=popular`;
		router.prefetch(route);
		router.push(route);
	}, [router]);

	const handleCategoryClick = useCallback(
		(categoryPath: string, categoryName: string) => {
			// Use the path provided from TEST_CATEGORIES
			router.prefetch(categoryPath);
			router.push(categoryPath);
		},
		[router]
	);

	const handleStoreClick = useCallback((storeName: string) => {
		const route = `/store?store=${encodeURIComponent(storeName)}&source=nearby`;
		router.prefetch(route);
		router.push(route);
	}, [router]);

	const handleViewAllClick = useCallback((route: string) => {
		router.prefetch(route);
		router.push(route);
	}, [router]);

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans antialiased"
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* Hero Section with Address Selector */}
			<DeliveryAddressHero onAddressChange={handleDeliveryAddressChange} />

			{/* Main Content */}
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Categories Section */}
				<CategoriesSlider
					categories={[]}
				/>

				{/* Promotional Banner */}
				<PromotionalBanner />

				{/* Nearby Stores Section */}
				<NearbyStoresSection
					getNearbyStoresAction={getNearbyStoresAction}
					selectedLocation={selectedDeliveryAddress}
					onStoreClick={handleStoreClick}
					onViewAll={() => handleViewAllClick("/nearby-stores")}
				/>

				{/* Discounts Section */}
				<DiscountsSection
					onDiscountClick={handleDiscountClick}
					onViewAll={() => handleViewAllClick("/discounts")}
				/>

				{/* Popular Stores Section */}
				<PopularStoresSection categoryName="سوبر ماركت" />
			</div>
		</div>
	);
}

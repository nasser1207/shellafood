"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Store } from "../Utils/StoreCard";
import { Product } from "../Utils/ProductCard";
import DeliveryAddressHero from "./DeliveryAddressHero";
import PromotionalBanner from "./PromotionalBanner";
import CategoriesSection from "./CategoriesSection";
import NearbyStores from "./NearbyStores";
import Discounts from "./Discounts";
import PopularStores from "./PopularStores";
import HowItWorks from "./HowItWorks";
import AppDownload from "./AppDownload";
import Testimonials from "./Testimonials";
import FloatingCart from "./FloatingCart";
import { getCartItemsCount } from "@/lib/utils/cartStorage";
import { TEST_STORES, TEST_CATEGORIES, TEST_PRODUCTS } from "@/lib/data/categories/testData";

export default function HomePage() {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<any>(null);
	const [cartCount, setCartCount] = useState(0);

	const handleDeliveryAddressChange = useCallback((address: any) => {
		setSelectedDeliveryAddress(address);
	}, []);

	// Update cart count
	useEffect(() => {
		const updateCartCount = () => {
			setCartCount(getCartItemsCount());
		};

		updateCartCount();
		window.addEventListener("cartUpdated", updateCartCount);
		return () => window.removeEventListener("cartUpdated", updateCartCount);
	}, []);

	// Prefetch common routes
	useEffect(() => {
		const routesToPrefetch = [
			"/categories",
			"/nearby-stores",
			"/discounts",
			"/popular-stores",
		];
		routesToPrefetch.forEach((route) => router.prefetch(route));
	}, [router]);

	// Prepare categories with additional routes
	const categories = TEST_CATEGORIES.map((cat) => ({
		id: cat.id,
		name: cat.name,
		description: cat.description,
		image: cat.image,
		path:cat.slug=="hypermarket" ? "/categories/supermarket/hypermarket/" : `/categories/${cat.slug}`,
	})).concat([
		{
			id: "pickandorder",
			name: "استلام وتوصيل",
			description: "استلام وتوصيل",
			image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
			path: "/pickandorder",
		},
		{
			id: "serve-me",
			name: "اخدمني",
			description: "اخدمني",
			image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
			path: "/serve-me",
		},
	]);

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans antialiased"
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* Hero Section with Address Selector */}
			<DeliveryAddressHero onAddressChange={handleDeliveryAddressChange} />

			{/* Main Content */}
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
				{/* Categories Section */}
				<CategoriesSection categories={categories} />

				{/* Promotional Banner */}
				<PromotionalBanner />

				{/* Nearby Stores */}
				<NearbyStores stores={TEST_STORES.slice(0, 10) as Store[]} />

				{/* Discounts */}
				<Discounts
					products={TEST_PRODUCTS.filter(
						(p) => p.badge || (p.originalPrice && p.originalPrice > (p.price || 0))
					).slice(0, 8) as Product[]}
				/>

				{/* Popular Stores */}
				<PopularStores stores={TEST_STORES.slice(0, 10) as Store[]} />
			</div>

			{/* How It Works Section */}
			{/* <HowItWorks /> */}

			{/* App Download Section */}
		{/* <AppDownload /> */}

			{/* Testimonials Section */}
			{/* <Testimonials /> */}

			{/* Floating Cart Button */}
			{/* <FloatingCart cartCount={cartCount} /> */}
		</div>
	);
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Store } from "../Utils/StoreCard";
import { Product } from "../Utils/ProductCard";
import DeliveryAddressHero from "./DeliveryAddressHero";
import PromotionalBanner from "./PromotionalBanner";
import CategoriesSection from "./CategoriesSection";
import PreviouslyOrderedStores from "./PreviouslyOrderedStores";
import NearbyStores from "./NearbyStores";
import Discounts from "./Discounts";
import PopularStores from "./PopularStores";
import HowItWorks from "./HowItWorks";
import AppDownload from "./AppDownload";
import Testimonials from "./Testimonials";
import FloatingCart from "./FloatingCart";
import { getCartItemsCount } from "@/lib/utils/cartStorage";
import { TEST_STORES, TEST_CATEGORIES, TEST_PRODUCTS } from "@/lib/data/categories/testData";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<any>(null);
	const [cartCount, setCartCount] = useState(0);
	const [showScrollToTop, setShowScrollToTop] = useState(false);

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
			"/previously-ordered-stores",
		];
		routesToPrefetch.forEach((route) => router.prefetch(route));
	}, [router]);

	// Handle scroll to top visibility
	useEffect(() => {
		const handleScroll = () => {
			setShowScrollToTop(window.scrollY > 400);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

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

				{/* Previously Ordered Stores */}
				<PreviouslyOrderedStores stores={TEST_STORES.slice(0, 5) as Store[]} />

				{/* Nearby Stores */}
				<NearbyStores stores={TEST_STORES.slice(0, 4) as Store[]} />

				{/* Discounts */}
				<Discounts
					products={TEST_PRODUCTS.filter(
						(p) => p.badge || (p.originalPrice && p.originalPrice > (p.price || 0))
					).slice(0, 8) as Product[]}
				/>

				{/* Popular Stores */}
				<PopularStores stores={TEST_STORES.slice(0, 4) as Store[]} />
			</div>

			{/* Scroll to Top Button - Square like cart button */}
			<AnimatePresence>
				{showScrollToTop && (
					<motion.button
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						onClick={scrollToTop}
						className={`fixed ${isArabic ? "right-4" : "left-4"} bottom-6 z-50 w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-2xl flex items-center justify-center active:scale-95 transition-transform hover:shadow-green-500/50`}
						aria-label={isArabic ? 'الانتقال إلى الأعلى' : 'Scroll to top'}
					>
						<ArrowUp className="w-6 h-6 text-white" />
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
}

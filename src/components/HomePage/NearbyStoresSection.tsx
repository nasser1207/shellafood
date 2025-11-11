"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { NearbyStore } from "@/lib/types/api";
import NearbyStoresPage from "./NearbyStoresPage";
import SectionHeader from "./SectionHeader";
import { useLanguage } from "@/contexts/LanguageContext";

interface NearbyStoresSectionProps {
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
	selectedLocation?: any;
	onStoreClick?: (storeName: string) => void;
	onViewAll?: () => void;
}

export default function NearbyStoresSection({
	getNearbyStoresAction,
	selectedLocation,
	onStoreClick,
	onViewAll,
}: NearbyStoresSectionProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.4 }}
			className="mb-16 sm:mb-20"
		>
			<SectionHeader
				title={isArabic ? "المتاجر القريبة منك" : "Nearby Stores"}
				icon={MapPin}
				onViewAll={onViewAll}
				viewAllRoute="/nearby-stores"
				viewAllText={isArabic ? "عرض الكل" : "View All"}
			/>
			<NearbyStoresPage
				onStoreClick={onStoreClick}
				selectedLocation={selectedLocation}
				getNearbyStoresAction={getNearbyStoresAction}
			/>
		</motion.section>
	);
}


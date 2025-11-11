"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import PopularStoresSlider from "./PopularStoresSlider";
import SectionHeader from "./SectionHeader";
import { useLanguage } from "@/contexts/LanguageContext";

interface PopularStoresSectionProps {
	categoryName?: string; // e.g., "سوبر ماركت"
}

export default function PopularStoresSection({
	categoryName = "سوبر ماركت",
}: PopularStoresSectionProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();

	const viewAllRoute = `/popular-stores`;

	const handleViewAll = () => {
		router.prefetch(viewAllRoute);
		router.push(viewAllRoute);
	};

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.6 }}
			className="mb-16 sm:mb-20"
		>
			<SectionHeader
				title={isArabic ? "أشهر المحلات في منطقتك" : "Popular Stores in Your Area"}
				icon={TrendingUp}
				onViewAll={handleViewAll}
				viewAllRoute={viewAllRoute}
				viewAllText={isArabic ? "عرض الكل" : "View All"}
			/>
			<PopularStoresSlider categoryName={categoryName} stores={[]} />
		</motion.section>
	);
}


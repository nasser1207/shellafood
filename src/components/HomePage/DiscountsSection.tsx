"use client";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import DiscountSlider from "./DiscountSlider";
import SectionHeader from "./SectionHeader";
import { useLanguage } from "@/contexts/LanguageContext";

interface DiscountsSectionProps {
	onDiscountClick?: (discountTitle: string) => void;
	onViewAll?: () => void;
}

export default function DiscountsSection({
	onDiscountClick,
	onViewAll,
}: DiscountsSectionProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.5 }}
			className="mb-16 sm:mb-20"
		>
			<SectionHeader
				title={isArabic ? "أقوى الخصومات" : "Best Discounts"}
				icon={Tag}
				onViewAll={onViewAll}
				viewAllRoute="/discounts"
				viewAllText={isArabic ? "عرض الكل" : "View All"}
			/>
			<DiscountSlider
				onDiscountClick={onDiscountClick}
				discounts={[]}
			/>
		</motion.section>
	);
}


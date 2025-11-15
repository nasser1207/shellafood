"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles } from "lucide-react";
import { CategoriesSlider } from "@/components/Categories/Slider";
import { Category } from "@/components/Utils/CategoryCard";
import { useRouter } from "next/navigation";
import { FaStore } from "react-icons/fa";

interface CategoriesSectionProps {
	categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.2 }}
			className="mb-8 sm:mb-12"
		>
				{/* Header with Filters */}
				<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2 mt-2">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl  bg-green-600 shadow-lg">
							<FaStore className="h-5 w-5 text-white" />
						</div>
						<h2 className={`text-xl font-bold text-gray-900 dark:text-white sm:text-2xl ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? "أقسامنا" : "Our Categories"}
						</h2>
					</div>
					<button
						onClick={() => router.push("/categories")}
						className="text-sm cursor-pointer font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
					>
						{isArabic ? "عرض الكل" : "View All"} →
					</button>
				</div>

			</div>

			{/* Categories Slider Container */}
			<div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200/50 dark:bg-gray-800 dark:ring-gray-700/50 sm:p-6">
				<CategoriesSlider categories={categories} />
			</div>
		</motion.section>
	);
}


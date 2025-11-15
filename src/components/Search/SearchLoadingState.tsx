"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchLoadingStateProps {
	message?: string;
}

export default function SearchLoadingState({ message }: SearchLoadingStateProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const defaultMessage = isArabic ? "جاري البحث..." : "Searching...";

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex flex-col items-center justify-center py-20"
		>
			<Loader2 className="w-12 h-12 text-green-600 dark:text-green-400 animate-spin mb-4" />
			<p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
				{message || defaultMessage}
			</p>
		</motion.div>
	);
}


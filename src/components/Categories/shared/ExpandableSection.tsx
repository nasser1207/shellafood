"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExpandableSectionProps {
	title: string;
	titleAr?: string;
	children: ReactNode;
	defaultExpanded?: boolean;
}

export default function ExpandableSection({
	title,
	titleAr,
	children,
	defaultExpanded = false,
}: ExpandableSectionProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	return (
		<div className="border-b border-gray-200 dark:border-gray-700">
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className={`w-full flex items-center justify-between py-4 ${
					isArabic ? "flex-row-reverse text-right" : "text-left"
				}`}
			>
				<h3 className="text-lg font-bold text-gray-900 dark:text-white">
					{isArabic && titleAr ? titleAr : title}
				</h3>
				<ChevronDown
					className={`w-5 h-5 text-gray-400 transition-transform ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</button>
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className="pb-4">{children}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}


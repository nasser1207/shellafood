"use client";

import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterChipProps {
	icon?: LucideIcon;
	label: string;
	labelAr?: string;
	active?: boolean;
	onClick: () => void;
}

export default function FilterChip({
	icon: Icon,
	label,
	labelAr,
	active = false,
	onClick,
}: FilterChipProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<button
			onClick={onClick}
			className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all active:scale-95 ${
				active
					? "bg-green-600 text-white"
					: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
			}`}
		>
			{Icon && <Icon className="w-4 h-4" />}
			{isArabic && labelAr ? labelAr : label}
		</button>
	);
}


"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface SectionHeaderProps {
	title: string;
	icon?: React.ComponentType<{ className?: string }>;
	onViewAll?: () => void;
	viewAllText?: string;
	viewAllRoute?: string;
}

export default function SectionHeader({
	title,
	icon: Icon,
	onViewAll,
	viewAllText,
	viewAllRoute,
}: SectionHeaderProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const defaultText = isArabic ? "عرض الكل" : "View All";
	const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={`mb-6 flex items-center justify-between `}
		>
			<div className={`flex items-center gap-3 `}>
				{Icon && (
					<motion.div
						whileHover={{ scale: 1.1, rotate: 5 }}
						className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10b981]/20 dark:from-[#10b981]/30 via-[#10b981]/15 dark:via-[#10b981]/25 to-[#10b981]/10 dark:to-[#10b981]/20 shadow-sm dark:shadow-md"
					>
						<Icon className="h-6 w-6 text-[#10b981] dark:text-green-400" />
					</motion.div>
				)}
				<h2 className={`text-2xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-3xl ${isArabic ? "text-right" : "text-left"}`}>
					{title}
				</h2>
			</div>
			{viewAllRoute ? (
				<Link
					href={viewAllRoute}
					prefetch={true}
					onMouseEnter={() => router.prefetch(viewAllRoute!)}
					className={`group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10b981]/10 dark:from-[#10b981]/20 to-[#10b981]/5 dark:to-[#10b981]/15 px-4 py-2.5 text-sm font-semibold text-[#10b981] dark:text-green-400 transition-all duration-200 hover:from-[#10b981]/20 dark:hover:from-[#10b981]/30 hover:to-[#10b981]/10 dark:hover:to-[#10b981]/20 hover:shadow-md dark:hover:shadow-lg`}
				>
					<span>{viewAllText || defaultText}</span>
					<ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
				</Link>
			) : (
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onViewAll}
					className={`group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10b981]/10 dark:from-[#10b981]/20 to-[#10b981]/5 dark:to-[#10b981]/15 px-4 py-2.5 text-sm font-semibold text-[#10b981] dark:text-green-400 transition-all duration-200 hover:from-[#10b981]/20 dark:hover:from-[#10b981]/30 hover:to-[#10b981]/10 dark:hover:to-[#10b981]/20 hover:shadow-md dark:hover:shadow-lg`}
				>
					<span>{viewAllText || defaultText}</span>
					<ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
				</motion.button>
			)}
		</motion.div>
	);
}


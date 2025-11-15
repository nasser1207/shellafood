"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
	title: string;
	desc: string;
	Icon: LucideIcon;
	href: string;
	gradient: string;
	index: number;
}

export default function ServiceCard({
	title,
	desc,
	Icon,
	href,
	gradient,
	index,
}: ServiceCardProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.1, duration: 0.6 }}
		>
			<Link href={href} aria-label={title}>
				<div className="group relative h-full cursor-pointer">
					<div
						className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500`}
					/>

					<div className="relative h-full p-5 sm:p-6 md:p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 group-hover:border-transparent rounded-xl sm:rounded-2xl transition-all">
						{/* Icon */}
						<div
							className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4 sm:mb-5 md:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}
						>
							<Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
						</div>

						{/* Title */}
						<h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
							{title}
						</h4>

						{/* Description */}
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 md:mb-6 line-clamp-3">{desc}</p>

						{/* CTA */}
						<div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${isArabic ? "flex-row-reverse" : ""}`}>
							<span
								className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}
							>
								{isArabic ? "سجل الآن" : "Register Now"}
							</span>
							<ArrowRight
								className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
									isArabic 
										? "rotate-180 group-hover:-translate-x-2" 
										: "group-hover:translate-x-2"
								}`}
							/>
						</div>

						{/* Live indicator - Position based on RTL/LTR */}
						<div className={`absolute top-4 sm:top-6 ${isArabic ? "left-4 sm:left-6" : "right-4 sm:right-6"}`}>
							<div
								className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient} animate-pulse`}
							/>
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}


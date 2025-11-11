"use client";

import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InfoCardProps {
	title: string;
	icon: any;
	children: ReactNode;
	className?: string;
}

export default function InfoCard({ title, icon: Icon, children, className = "" }: InfoCardProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`} dir={direction}>
			<div className={`flex items-center gap-3 mb-6 ${isArabic ? 'flex-row justify-start' : 'flex-row justify-start'}`}>
				<div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
					<Icon className="text-gray-600 dark:text-gray-400 text-lg" />
				</div>
				<h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 `}>{title}</h3>
			</div>
			{children}
		</div>
	);
}

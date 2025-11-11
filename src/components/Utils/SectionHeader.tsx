import React from "react";

interface SectionHeaderProps {
	title: string;
	isArabic: boolean;
	className?: string;
}

/**
 * Reusable Section Header Component
 * Displays a consistent section title with green accent bar
 * RTL/LTR aware with proper gradient direction
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, isArabic, className = "" }) => {
	const direction = isArabic ? 'rtl' : 'ltr';
	
	return (
		<div className={`mb-6 ${className}`} dir={direction}>
			<h2 className={`text-xl font-bold text-green-600 dark:text-green-400 md:text-2xl ${isArabic ? "text-right" : "text-left"}`}>
				{title}
			</h2>
			<div className={`mt-2 h-1 w-20 rounded-full bg-gradient-to-r ${
				isArabic 
					? 'from-green-600 dark:from-green-500 to-green-500 dark:to-green-400 ml-auto' 
					: 'from-green-500 dark:from-green-400 to-green-600 dark:to-green-500'
			}`} />
		</div>
	);
};

"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface SecurityActionProps {
	icon: any;
	title: string;
	subtitle: string;
	onClick?: () => void;
	isDanger?: boolean;
}

export default function SecurityAction({ icon: Icon, title, subtitle, onClick, isDanger = false }: SecurityActionProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<button 
			onClick={onClick}
			className={`flex items-center gap-3 p-4 rounded-lg transition-colors text-right ${
				isDanger 
					? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800' 
					: 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
			}`}
			dir={direction}
		>
			<Icon className={`text-lg ${isDanger ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
			<div>
				<div className={`font-medium text-sm ${isDanger ? 'text-red-900 dark:text-red-300' : 'text-gray-900 dark:text-gray-100'}`}>
					{title}
				</div>
				<div className={`text-xs ${isDanger ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
					{subtitle}
				</div>
			</div>
		</button>
	);
}

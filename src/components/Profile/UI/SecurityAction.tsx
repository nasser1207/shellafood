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
					? 'bg-red-50 hover:bg-red-100 border border-red-200' 
					: 'bg-gray-50 hover:bg-gray-100'
			}`}
			dir={direction}
		>
			<Icon className={`text-lg ${isDanger ? 'text-red-600' : 'text-gray-600'}`} />
			<div>
				<div className={`font-medium text-sm ${isDanger ? 'text-red-900' : 'text-gray-900'}`}>
					{title}
				</div>
				<div className={`text-xs ${isDanger ? 'text-red-600' : 'text-gray-500'}`}>
					{subtitle}
				</div>
			</div>
		</button>
	);
}

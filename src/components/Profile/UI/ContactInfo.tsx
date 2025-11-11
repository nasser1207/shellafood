"use client";

import { ReactNode } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaMobileAlt } from "react-icons/fa";

interface ContactInfoProps {
	icon: ReactNode;
	title: string;
	description?: string;
	contactItems: string[];
	isArabic?: boolean;
}

export default function ContactInfo({
	icon,
	title,
	description,
	contactItems,
	isArabic = false
}: ContactInfoProps) {
	const getIcon = (item: string) => {
		const isEmail = item.includes('@');
		const isPhone = item.includes('920000000');
		const isAddress = item.includes('KSA') || item.includes('Saudi') || item.includes('Address');
		const isApp = item.includes('تطبيق') || item.includes('App');
		
		if (isEmail) {
			return <FaEnvelope className="text-green-600 dark:text-green-400 text-sm" />;
		} else if (isPhone) {
			return <FaPhone className="text-green-600 dark:text-green-400 text-sm" />;
		} else if (isAddress) {
			return <FaMapMarkerAlt className="text-green-600 dark:text-green-400 text-sm" />;
		} else {
			return <FaMobileAlt className="text-green-600 dark:text-green-400 text-sm" />;
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
			<div className={`flex items-center gap-3 mb-4 ${isArabic ? 'flex-row' : 'flex-row'}`}>
				<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
					{icon}
				</div>
				<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
					{title}
				</h3>
			</div>
			
			{description && (
				<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-4 leading-relaxed">
					{description}
				</p>
			)}
			
			<div className="space-y-3">
				{contactItems.map((item, index) => (
					<div key={index} className={`flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg ${isArabic ? 'flex-row' : 'flex-row'}`}>
						<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
							{getIcon(item)}
						</div>
						<span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">
							{item}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

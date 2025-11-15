"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaTag, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface VoucherCardProps {
	voucher: {
		title: string;
		subtitle: string;
		details: string[];
		expirationDate: string;
	};
	isExpired?: boolean;
	isArabic?: boolean;
}

export default function VoucherCard({ voucher, isExpired = false, isArabic = false }: VoucherCardProps) {
	const { language } = useLanguage();
	const currentIsArabic = isArabic || language === 'ar';
	const direction = currentIsArabic ? 'rtl' : 'ltr';

	return (
		<div 
			className={`relative flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition-all duration-200 hover:shadow-md ${currentIsArabic ? 'flex-row' : 'flex-row'}`}
			dir={direction}
		>
			{/* Discount Section */}
			<div className={`relative flex w-1/3 flex-col items-center justify-center gap-2 p-4 rounded-l-xl ${currentIsArabic ? 'rounded-r-xl' : 'rounded-l-xl'} ${isExpired ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' : 'bg-gradient-to-br from-green-50 dark:from-green-900/30 to-green-100 dark:to-green-900/50 text-green-700 dark:text-green-400'}`}>
				{/* Status Icon */}
				<div className={`absolute top-2 ${currentIsArabic ? 'left-2' : 'right-2'}`}>
					{isExpired ? (
						<FaTimesCircle className="text-gray-400 dark:text-gray-500 text-sm" />
					) : (
						<FaCheckCircle className="text-green-500 dark:text-green-400 text-sm" />
					)}
				</div>

				{/* Discount Icon */}
				<div className={`flex items-center justify-center w-12 h-12 rounded-full ${isExpired ? 'bg-gray-200 dark:bg-gray-600' : 'bg-green-200 dark:bg-green-800'} mb-2`}>
					<FaTag className={`text-lg ${isExpired ? 'text-gray-500 dark:text-gray-400' : 'text-green-600 dark:text-green-400'}`} />
				</div>

				{/* Discount Amount */}
				<span className={`text-xl font-bold ${isExpired ? 'text-gray-600 dark:text-gray-400' : 'text-green-700 dark:text-green-400'}`}>
					{voucher.title}
				</span>
				
				{/* Subtitle */}
				<span className={`text-sm font-medium text-center ${isExpired ? 'text-gray-500 dark:text-gray-400' : 'text-green-600 dark:text-green-400'}`}>
					{voucher.subtitle}
				</span>
			</div>

			{/* Details Section */}
			<div className={`flex w-2/3 flex-col gap-3 p-4 ${currentIsArabic ? 'text-right' : 'text-left'}`}>
				{/* Details List */}
				<div className="space-y-2">
					{voucher.details.map((detail, index) => (
						<div 
							key={index} 
							className={`flex items-center gap-2 ${currentIsArabic ? 'flex-row' : 'flex-row'}`}
						>
							<div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-gray-400 dark:bg-gray-500' : 'bg-green-500 dark:bg-green-400'} flex-shrink-0`}></div>
							<span className={`text-sm ${isExpired ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
								{detail}
							</span>
						</div>
					))}
				</div>

				{/* Expiration Date */}
				<div className={`flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 ${currentIsArabic ? 'flex-row' : 'flex-row'}`}>
					<FaClock className={`text-xs ${isExpired ? 'text-gray-400 dark:text-gray-500' : 'text-green-500 dark:text-green-400'}`} />
					<span className={`text-xs ${isExpired ? 'text-gray-500 dark:text-gray-400' : 'text-green-600 dark:text-green-400'} font-medium`}>
						{voucher.expirationDate}
					</span>
				</div>

				{/* Action Button */}
				{!isExpired && (
					<button className={`mt-3 w-fit py-2 px-4 bg-green-500 dark:bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-200 ${currentIsArabic ? 'text-right' : 'text-center'}`}>
						{currentIsArabic ? 'استخدم القسيمة' : 'Use Voucher'}
					</button>
				)}
			</div>
		</div>
	);
}

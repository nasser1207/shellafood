"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface InfoFieldProps {
	label: string;
	value: string;
	type?: string;
	editable?: boolean;
	onChange?: (value: string) => void;
}

export default function InfoField({ label, value, type = "text", editable = false, onChange }: InfoFieldProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	// Convert date format for HTML date input (YYYY-MM-DD)
	const formatDateForInput = (dateStr: string) => {
		if (type === 'date' && dateStr) {
			// Handle different date formats
			if (dateStr.includes('/')) {
				const parts = dateStr.split('/');
				if (parts.length === 3) {
					// Convert DD/MM/YYYY or MM/DD/YYYY to YYYY-MM-DD
					if (isArabic) {
						// Arabic format: DD/MM/YYYY
						return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
					} else {
						// English format: MM/DD/YYYY
						return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
					}
				}
			}
		}
		return value;
	};

	// Convert HTML date input back to display format
	const formatDateFromInput = (dateStr: string) => {
		if (type === 'date' && dateStr) {
			const parts = dateStr.split('-');
			if (parts.length === 3) {
				if (isArabic) {
					// Convert to DD/MM/YYYY
					return `${parts[2]}/${parts[1]}/${parts[0]}`;
				} else {
					// Convert to MM/DD/YYYY
					return `${parts[1]}/${parts[2]}/${parts[0]}`;
				}
			}
		}
		return dateStr;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		if (type === 'date') {
			onChange?.(formatDateFromInput(newValue));
		} else {
			onChange?.(newValue);
		}
	};

	return (
		<div className="mb-4 last:mb-0">
			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				{label}
			</label>
			{editable ? (
				<input
					type={type}
					value={type === 'date' ? formatDateForInput(value) : value}
					onChange={handleInputChange}
					className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 text-sm"
					dir={direction}
				/>
			) : (
				<div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100">
					{value}
				</div>
			)}
		</div>
	);
}

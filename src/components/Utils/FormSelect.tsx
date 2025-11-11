import React from "react";

interface FormSelectProps {
	label: string;
	name: string;
	options: { value: string; label: string }[];
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	required?: boolean;
	isArabic?: boolean;
	placeholder?: string;
	className?: string;
	error?: string;
}

/**
 * Reusable Form Select Component
 * Consistent dropdown field with label and styling
 */
export const FormSelect: React.FC<FormSelectProps> = ({
	label,
	name,
	options,
	value,
	onChange,
	required = false,
	isArabic = true,
	placeholder,
	className = "",
	error,
}) => {
	const defaultPlaceholder = placeholder || (isArabic ? "-- اختر --" : "-- Choose --");

	return (
		<div className={`flex flex-col space-y-2 ${className}`}>
			<label
				htmlFor={name}
				className={`text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}
			>
				{label}
				{required && <span className="text-red-500 dark:text-red-400 mr-1">*</span>}
			</label>
			<select
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				className={`rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-200 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:outline-none ${
					isArabic ? "text-right" : "text-left"
				}`}
			>
				<option value="">{defaultPlaceholder}</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{error && (
				<p className={`text-sm text-red-500 dark:text-red-400 ${isArabic ? "text-right" : "text-left"}`}>
					{error}
				</p>
			)}
		</div>
	);
};


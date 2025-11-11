import React from "react";

interface FormInputProps {
	label: string;
	name: string;
	type?: string;
	placeholder?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	isArabic?: boolean;
	max?: string;
	className?: string;
	error?: string;
}

/**
 * Reusable Form Input Component
 * Consistent input field with label and styling
 */
export const FormInput: React.FC<FormInputProps> = ({
	label,
	name,
	type = "text",
	placeholder = "",
	value,
	onChange,
	required = false,
	isArabic = true,
	max,
	className = "",	
	error,
}) => (
	<div className={`flex flex-col space-y-2 ${className}`}>
		<label
			htmlFor={name}
			className={`text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}
		>
			{label}
			{required && <span className="text-red-500 dark:text-red-400 mr-1">*</span>}
		</label>
		<input
			type={type}
			id={name}
			name={name}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			max={max}
			required={required}
			className={`rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-200 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:outline-none ${
				isArabic ? "text-right" : "text-left"
			}`}
		/>
		{error && (
			<p className={`text-sm text-red-500 dark:text-red-400 ${isArabic ? "text-right" : "text-left"}`}>
				{error}
			</p>
		)}
	</div>
);


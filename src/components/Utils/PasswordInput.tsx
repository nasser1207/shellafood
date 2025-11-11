'use client';
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	required?: boolean;
	isArabic?: boolean;
	error?: string;
}

/**
 * Password Input with Show/Hide Toggle
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
	label,
	name,
	value,
	onChange,
	placeholder = "",
	required = false,
	isArabic = true,
	error,
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="flex flex-col space-y-2">
			<label
				htmlFor={name}
				className={`text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}
			>
				{label}
				{required && <span className="text-red-500 dark:text-red-400 mr-1">*</span>}
			</label>
			<div className="relative">
				<input
					type={showPassword ? "text" : "password"}
					id={name}
					name={name}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className={`w-full rounded-lg border ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 p-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-all duration-200 ${
						isArabic ? "text-right pr-12 pl-3" : "text-left pl-3 pr-12"
					}`}
					required={required}
				/>
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className={`absolute top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none ${
						isArabic ? "left-3" : "right-3"
					}`}
					tabIndex={-1}
				>
					{showPassword ? (
						<EyeOff className="h-5 w-5" />
					) : (
						<Eye className="h-5 w-5" />
					)}
				</button>
			</div>
			{error && (
				<p className={`text-sm text-red-500 dark:text-red-400 ${isArabic ? "text-right" : "text-left"}`}>
					{error}
				</p>
			)}
		</div>
	);
};


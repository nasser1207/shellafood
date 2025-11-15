"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
	disabled?: boolean;
}

/**
 * Reusable Form Input Component
 * Consistent input field with label and styling
 * Supports password show/hide toggle when type="password"
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
	disabled = false,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";
	const inputType = isPassword ? (showPassword ? "text" : "password") : type;

	return (
		<div className={cn("flex flex-col space-y-2", className)}>
			<label
				htmlFor={name}
				className={cn(
					"text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base",
					isArabic ? "text-right" : "text-left"
				)}
			>
				{label}
				{required && (
					<span className="ml-1 text-red-500 dark:text-red-400" aria-label="required">
						*
					</span>
				)}
			</label>

			<div className="relative">
				<input
					type={inputType}
					id={name}
					name={name}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					max={max}
					required={required}
					disabled={disabled}
					aria-invalid={error ? "true" : "false"}
					aria-describedby={error ? `${name}-error` : undefined}
					className={cn(
						"w-full rounded-lg border bg-white dark:bg-gray-700 p-3 text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-200 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800",
						error
							? "border-red-500 dark:border-red-400"
							: "border-gray-300 dark:border-gray-600",
						isPassword
							? isArabic
								? "text-right pr-12 pl-3"
								: "text-left pl-3 pr-12"
							: isArabic
								? "text-right"
								: "text-left"
					)}
				/>

				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						disabled={disabled}
						aria-label={showPassword ? "Hide password" : "Show password"}
						className={cn(
							"absolute top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
							isArabic ? "left-3" : "right-3"
						)}
						tabIndex={-1}
					>
						{showPassword ? (
							<EyeOff className="h-5 w-5" aria-hidden="true" />
						) : (
							<Eye className="h-5 w-5" aria-hidden="true" />
						)}
					</button>
				)}
			</div>

			{error && (
				<p
					id={`${name}-error`}
					role="alert"
					aria-live="polite"
					className={cn(
						"text-sm text-red-500 dark:text-red-400",
						isArabic ? "text-right" : "text-left"
					)}
				>
					{error}
				</p>
			)}
		</div>
	);
};


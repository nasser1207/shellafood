"use client";

import React from "react";
import { useTheme } from "next-themes";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputFieldProps {
	label: string;
	value: string;
	onChange: (phone: string) => void;
	isArabic?: boolean;
	required?: boolean;
	name?: string;
	error?: string;
}

/**
 * Reusable Phone Input Component
 * Consistent phone number input with country code
 */
export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
	label,
	value,
	onChange,
	isArabic = true,
	required = false,
	name = "phone",
	error,
}) => {
	const { theme, resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark" || theme === "dark";
	
	// Dynamic styles based on theme
	const inputStyle: React.CSSProperties = {
		width: "100%",
		height: "48px",
		fontSize: "16px",
		direction: "ltr" as const,
		textAlign: "left",
		paddingLeft: "58px",
		paddingRight: "12px",
		borderRadius: "0.5rem",
		border: isDark ? "1px solid #4b5563" : "1px solid #d1d5db",
		backgroundColor: isDark ? "#1f2937" : "white",
		color: isDark ? "#f3f4f6" : "#111827",
		fontFamily: "inherit",
	};
	
	const buttonStyle: React.CSSProperties = {
		height: "48px",
		border: isDark ? "1px solid #4b5563" : "1px solid #d1d5db",
		borderRadius: "0.5rem 0 0 0.5rem",
		backgroundColor: isDark ? "#1f2937" : "white",
		direction: "ltr" as const,
	};

	return (
		<div className="flex flex-col space-y-2">
			<label className={`text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}>
				{label}
				{required && <span className="text-red-500 dark:text-red-400 mr-1">*</span>}
			</label>
			<PhoneInput
				country={"sa"}
				value={value}
				onChange={onChange}
				enableSearch={true}
				inputStyle={inputStyle}
				buttonStyle={buttonStyle}
				containerStyle={{
					direction: "ltr",
					width: "100%",
				}}
				dropdownStyle={{
					direction: "ltr",
					textAlign: "left",
				}}
				searchStyle={{
					width: "90%",
					margin: "0 auto",
					padding: "8px",
				}}
				inputProps={{
					name: name,
					required: required,
					className: "phone-input-field",
					autoComplete: "tel",
				}}
			/>
			{error && (
				<p className={`text-sm text-red-500 dark:text-red-400 ${isArabic ? "text-right" : "text-left"}`}>
					{error}
				</p>
			)}
		<style jsx global>{`
			.phone-input-field:focus {
				outline: none !important;
				border-color: #31A342 !important;
				box-shadow: 0 0 0 3px rgba(49, 163, 66, 0.1) !important;
			}
			.dark .phone-input-field:focus {
				border-color: #4ade80 !important;
				box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1) !important;
			}
			.react-tel-input .flag-dropdown {
				border: none !important;
			}
			.react-tel-input .flag-dropdown:hover {
				background-color: #f9fafb !important;
			}
			.dark .react-tel-input .flag-dropdown:hover {
				background-color: #374151 !important;
			}
			.dark .react-tel-input input {
				background-color: #1f2937 !important;
				color: #f3f4f6 !important;
				border-color: #4b5563 !important;
			}
			.dark .react-tel-input .selected-flag {
				background-color: #1f2937 !important;
				border-color: #4b5563 !important;
			}
			.dark .react-tel-input .country-list {
				background-color: #1f2937 !important;
				color: #f3f4f6 !important;
			}
			.dark .react-tel-input .country:hover {
				background-color: #374151 !important;
			}
			.react-tel-input .selected-flag {
				padding: 0 0 0 12px !important;
			}
			.react-tel-input .country-list {
				text-align: left;
				direction: ltr;
			}
			.react-tel-input .search-box {
				margin: 8px;
				width: calc(100% - 16px) !important;
			}
		`}</style>
	</div>
	);
};


"use client";

import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/lib/utils";

interface PhoneInputFieldProps {
	label: string;
	value: string;
	onChange: (phone: string) => void;
	isArabic?: boolean;
	required?: boolean;
	name?: string;
	error?: string;
	disabled?: boolean;
}

/**
 * Helper function to get phone input styles based on theme and state
 * Note: react-phone-input-2 requires inline styles for inputStyle and buttonStyle
 */
const getPhoneInputStyles = (
	isDark: boolean,
	disabled: boolean
): {
	inputStyle: React.CSSProperties;
	buttonStyle: React.CSSProperties;
} => {
	const baseInputStyle: React.CSSProperties = {
		width: "100%",
		height: "48px",
		fontSize: "16px",
		direction: "ltr",
		textAlign: "left",
		paddingLeft: "58px",
		paddingRight: "12px",
		borderRadius: "0.5rem",
		fontFamily: "inherit",
		transition: "all 0.2s ease-in-out",
	};

	const baseButtonStyle: React.CSSProperties = {
		height: "48px",
		borderRadius: "0.5rem 0 0 0.5rem",
		direction: "ltr",
		transition: "all 0.2s ease-in-out",
	};

	if (isDark) {
		return {
			inputStyle: {
				...baseInputStyle,
				border: "1px solid rgb(75, 85, 99)", // gray-600
				backgroundColor: disabled ? "rgb(55, 65, 81)" : "rgb(31, 41, 55)", // gray-700 : gray-800
				color: "rgb(243, 244, 246)", // gray-100
				opacity: disabled ? 0.5 : 1,
				cursor: disabled ? "not-allowed" : "text",
			},
			buttonStyle: {
				...baseButtonStyle,
				border: "1px solid rgb(75, 85, 99)", // gray-600
				backgroundColor: disabled ? "rgb(55, 65, 81)" : "rgb(31, 41, 55)", // gray-700 : gray-800
				opacity: disabled ? 0.5 : 1,
				cursor: disabled ? "not-allowed" : "pointer",
			},
		};
	}

	return {
		inputStyle: {
			...baseInputStyle,
			border: "1px solid rgb(209, 213, 219)", // gray-300
			backgroundColor: disabled ? "rgb(243, 244, 246)" : "white", // gray-100 : white
			color: "rgb(17, 24, 39)", // gray-900
			opacity: disabled ? 0.5 : 1,
			cursor: disabled ? "not-allowed" : "text",
		},
		buttonStyle: {
			...baseButtonStyle,
			border: "1px solid rgb(209, 213, 219)", // gray-300
			backgroundColor: disabled ? "rgb(243, 244, 246)" : "white", // gray-100 : white
			opacity: disabled ? 0.5 : 1,
			cursor: disabled ? "not-allowed" : "pointer",
		},
	};
};

/**
 * Reusable Phone Input Component
 * 
 * Features:
 * - Dark mode support with full dropdown theming
 * - RTL/LTR text direction based on language
 * - Accessibility (ARIA attributes)
 * - Validation and error states
 * - Disabled state support
 * - Professional UI matching production apps
 * 
 * @example
 * ```tsx
 * <PhoneInputField
 *   label="Phone Number"
 *   value={phone}
 *   onChange={setPhone}
 *   isArabic={false}
 *   required
 *   error={errors.phone}
 * />
 * ```
 */
export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
	label,
	value,
	onChange,
	isArabic = true,
	required = false,
	name = "phone",
	error,
	disabled = false,
}) => {
	const { theme, resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark" || theme === "dark";

	// Memoize styles to prevent unnecessary re-renders
	const { inputStyle, buttonStyle } = useMemo(
		() => getPhoneInputStyles(isDark, disabled),
		[isDark, disabled]
	);

	// Static styles for react-phone-input-2 container
	const containerStyles = useMemo(
		() => ({
			direction: "ltr" as const,
			width: "100%",
		}),
		[]
	);

	const dropdownStyles = useMemo(
		() => ({
			direction: "ltr" as const,
			textAlign: "left" as const,
		}),
		[]
	);

	const searchStyles = useMemo(
		() => ({
			width: "90%",
			margin: "0 auto",
			padding: "8px",
		}),
		[]
	);

	const errorId = `${name}-error`;

	return (
		<div className="flex flex-col space-y-2">
			{/* Label */}
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

			{/* Phone Input */}
			<PhoneInput
				country="sa"
				value={value}
				onChange={onChange}
				enableSearch
				disabled={disabled}
				inputStyle={inputStyle}
				buttonStyle={buttonStyle}
				containerStyle={containerStyles}
				dropdownStyle={dropdownStyles}
				searchStyle={searchStyles}
				inputProps={{
					name,
					required,
					id: name,
					className: "phone-input-field",
					autoComplete: "tel",
					disabled,
					"aria-invalid": error ? "true" : "false",
					"aria-describedby": error ? errorId : undefined,
					"aria-required": required,
				}}
			/>

			{/* Error Message */}
			{error && (
				<p
					id={errorId}
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

			{/* Global styles for react-phone-input-2 - minimal overrides for dark mode */}
			<style jsx global>{`
				/* ===== Focus States ===== */
				.phone-input-field:focus {
					outline: none !important;
					border-color: rgb(49, 163, 66) !important; /* green-600 */
					box-shadow: 0 0 0 3px rgba(49, 163, 66, 0.1) !important;
				}

				.dark .phone-input-field:focus {
					border-color: rgb(74, 222, 128) !important; /* green-400 */
					box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1) !important;
				}

				/* ===== Flag Dropdown ===== */
				.react-tel-input .flag-dropdown {
					border: none !important;
					transition: background-color 0.2s ease-in-out;
				}

				.react-tel-input .flag-dropdown:hover:not(:disabled) {
					background-color: rgb(249, 250, 251) !important; /* gray-50 */
				}

				.dark .react-tel-input .flag-dropdown {
					background-color: rgb(31, 41, 55) !important; /* gray-800 */
					border-color: rgb(75, 85, 99) !important; /* gray-600 */
				}

				.dark .react-tel-input .flag-dropdown:hover:not(:disabled) {
					background-color: rgb(55, 65, 81) !important; /* gray-700 */
				}

				/* ===== Input Field Dark Mode ===== */
				.dark .react-tel-input input {
					background-color: rgb(31, 41, 55) !important; /* gray-800 */
					color: rgb(243, 244, 246) !important; /* gray-100 */
					border-color: rgb(75, 85, 99) !important; /* gray-600 */
				}

				/* ===== Selected Flag ===== */
				.react-tel-input .selected-flag {
					padding: 0 0 0 12px !important;
				}

				.dark .react-tel-input .selected-flag {
					background-color: rgb(31, 41, 55) !important; /* gray-800 */
					border-color: rgb(75, 85, 99) !important; /* gray-600 */
				}

				.dark .react-tel-input .selected-flag:hover {
					background-color: rgb(55, 65, 81) !important; /* gray-700 */
				}

				/* ===== Country List Dropdown - Fully Dark Mode ===== */
				.react-tel-input .country-list {
					text-align: left;
					direction: ltr;
				}

				.dark .react-tel-input .country-list {
					background-color: rgb(31, 41, 55) !important; /* gray-800 */
					color: rgb(243, 244, 246) !important; /* gray-100 */
					border: 1px solid rgb(75, 85, 99) !important; /* gray-600 */
					box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
						0 4px 6px -2px rgba(0, 0, 0, 0.2) !important;
				}

				.dark .react-tel-input .country {
					color: rgb(243, 244, 246) !important; /* gray-100 */
					background-color: rgb(31, 41, 55) !important; /* gray-800 */
				}

				.dark .react-tel-input .country:hover,
				.dark .react-tel-input .country.highlight {
					background-color: rgb(55, 65, 81) !important; /* gray-700 */
				}

				.dark .react-tel-input .country .dial-code {
					color: rgb(243, 244, 246) !important; /* gray-100 */
				}

				.dark .react-tel-input .country .flag {
					opacity: 1 !important;
				}

				/* ===== Search Box in Dropdown ===== */
				.react-tel-input .search-box {
					margin: 8px;
					width: calc(100% - 16px) !important;
				}

				.dark .react-tel-input .search-box {
					background-color: rgb(31, 41, 55) !important; /* gray-800 */
					color: rgb(243, 244, 246) !important; /* gray-100 */
					border: 1px solid rgb(75, 85, 99) !important; /* gray-600 */
				}

				.dark .react-tel-input .search-box:focus {
					outline: none !important;
					border-color: rgb(74, 222, 128) !important; /* green-400 */
					box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.1) !important;
				}

				.dark .react-tel-input .search-box::placeholder {
					color: rgb(156, 163, 175) !important; /* gray-400 */
				}

				/* ===== Divider in Dropdown ===== */
				.dark .react-tel-input .divider {
					border-bottom: 1px solid rgb(75, 85, 99) !important; /* gray-600 */
				}

				/* ===== Scrollbar Dark Mode ===== */
				.dark .react-tel-input .country-list::-webkit-scrollbar {
					width: 8px;
				}

				.dark .react-tel-input .country-list::-webkit-scrollbar-track {
					background: rgb(31, 41, 55) !important; /* gray-800 */
				}

				.dark .react-tel-input .country-list::-webkit-scrollbar-thumb {
					background: rgb(55, 65, 81) !important; /* gray-700 */
					border-radius: 4px;
				}

				.dark .react-tel-input .country-list::-webkit-scrollbar-thumb:hover {
					background: rgb(75, 85, 99) !important; /* gray-600 */
				}

				/* ===== Disabled State ===== */
				.react-tel-input.disabled .flag-dropdown,
				.react-tel-input.disabled input {
					cursor: not-allowed !important;
					opacity: 0.5;
				}
			`}</style>
		</div>
	);
};


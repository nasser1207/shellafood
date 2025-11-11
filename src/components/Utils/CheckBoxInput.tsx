import React from "react";

interface CheckBoxInputProps {
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	label: string;
	isArabic?: boolean;
	name?: string;
	required?: boolean;
	className?: string;
	labelClassName?: string;
	checkboxClassName?: string;
	href?: string;
	linkText?: string;
	showLink?: boolean;
}

/**
 * Reusable Checkbox Input Component
 * Displays a checkbox with label, optionally with a link
 * Can be used for terms agreement or any other checkbox input
 */
export const CheckBoxInput: React.FC<CheckBoxInputProps> = ({
	checked,
	onChange,
	label,
	isArabic = true,
	name = "checkbox",
	required = false,
	className = "",
	labelClassName = "",
	checkboxClassName = "",
	href,
	linkText,
	showLink = false,
}) => {
	const defaultLinkClassName = "font-medium text-green-600 hover:underline";

	return (
		<div className={`flex items-start  ${isArabic ? 'space-x-reverse space-x-3' : 'space-x-3'} ${className}`}>
			<input
				type="checkbox"
				id={name}
				name={name}
				checked={checked}
				onChange={onChange}
				className={`mt-1  h-4 w-4 text-green-600 dark:text-green-400 focus:ring-green-500 dark:focus:ring-green-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded ${checkboxClassName}`}
				required={required}
			/>
			<label 
				htmlFor={name} 
				className={`text-sm mx-2 text-gray-700 dark:text-gray-300 ${isArabic ? 'text-right' : 'text-left'} ${labelClassName}`}
			>
				{label}
				{showLink && href && linkText && (
					<>
						{" "}
						<a
							href={href}
							className={`${defaultLinkClassName} dark:text-green-400 dark:hover:text-green-300`}
							target="_blank"
							rel="noopener noreferrer"
						>
							{linkText}
						</a>
					</>
				)}
			</label>
		</div>
	);
};


'use client';
import React from "react";
import { FormInput } from "../Utils/FormInput";
import PhoneInputField from "../Utils/PhoneInput";
import { SectionHeader } from "../Utils/SectionHeader";

interface PersonalInfoSectionProps {
	fullName: string;
	phoneNumber: string;
	birthDate: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onPhoneChange: (phone: string) => void;
	isArabic: boolean;
	t: (key: string) => string;
	disabled?: boolean;
	errors?: {
		fullName?: string;
		phoneNumber?: string;
		birthDate?: string;
	};
}

/**
 * Personal Information Section
 * Full name, phone number, birth date
 */
export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
	fullName,
	phoneNumber,
	birthDate,
	onChange,
	onPhoneChange,
	isArabic,
	t,	
	errors,
	disabled = false,
}) => {
	return (
		<div>
			<SectionHeader
				title={t("register.personalInfo")}
				isArabic={isArabic}
			/>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* Full Name */}
				<FormInput
					label={t("register.fullName")}
					name="fullName"
					value={fullName}
					onChange={onChange}
					placeholder={isArabic ? "أدخل الاسم الكامل" : "Enter full name"}
					required
					isArabic={isArabic}
					error={errors?.fullName}
					disabled={disabled}
				/>

				{/* Phone Number */}
				<PhoneInputField
					label={t("register.phoneNumber")}
					value={phoneNumber}
					onChange={onPhoneChange}
					isArabic={isArabic}
					required
					name="phoneNumber"
					error={errors?.phoneNumber}
					disabled={disabled}
				/>

				{/* Birth Date */}
				<FormInput
					label={t("register.birthDate")}
					name="birthDate"
					type="date"
					value={birthDate||new Date().toISOString().split('T')[0]}
					onChange={onChange}
					required
					isArabic={isArabic}
					max={new Date().toISOString().split('T')[0]}
					error={errors?.birthDate}
					disabled={disabled}
				/>
			</div>
		</div>
	);
};


'use client';
import React from "react";
import { FormInput } from "../Utils/FormInput";
import { PasswordInput } from "../Utils/PasswordInput";
import { SectionHeader } from "../Utils/SectionHeader";

interface AccountSectionProps {
	email: string;
	password: string;
	confirmPassword: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isArabic: boolean;
	t: (key: string) => string;
	disabled?: boolean;
	errors?: {
		email?: string;
		password?: string;
		confirmPassword?: string;
	};
}

/**
 * Account Section
 * Email, password, confirm password
 */
export const AccountSection: React.FC<AccountSectionProps> = ({
	email,
	password,
	confirmPassword,
	onChange,
	isArabic,
	t,
	errors,
	disabled = false,
}) => {
	return (
		<div>
			<SectionHeader
				title={t("register.accountInfo")}
				isArabic={isArabic}
			/>

			<div className="grid grid-cols-1 gap-6">
				{/* Email */}
				<FormInput
					label={t("register.email")}
					name="email"
					type="email"
					value={email}
					onChange={onChange}
					placeholder={isArabic ? "example@email.com" : "example@email.com"}
					required
					isArabic={isArabic}
					error={errors?.email}
					disabled={disabled}
				/>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Password */}
					<PasswordInput
						label={t("register.password")}
						name="password"
						value={password}
						onChange={onChange}
						placeholder={isArabic ? "أدخل كلمة المرور" : "Enter password"}
						required
						isArabic={isArabic}
						error={errors?.password}
						disabled={disabled}
					/>

					{/* Confirm Password */}
					<PasswordInput
						label={t("register.confirmPassword")}
						name="confirmPassword"
						value={confirmPassword}
						onChange={onChange}
						placeholder={isArabic ? "أعد إدخال كلمة المرور" : "Re-enter password"}
						required
						isArabic={isArabic}
						error={errors?.confirmPassword}
						disabled={disabled}
					/>
				</div>
			</div>
		</div>
	);
};


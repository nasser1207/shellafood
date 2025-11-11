"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { RegisterInput } from "@/lib/validations/register.validation";
import { ServiceResult } from "@/lib/types/service-result";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { AccountSection } from "./AccountSection";
import { NotificationDialog } from "../Utils/NotificationDialog";


interface RegisterFormProps {
	registerAction: (formData: RegisterInput) => Promise<ServiceResult<{ id: string }>>;
}

/**
 * Main Register Form Component
 * Clean, modular registration form with Google Maps integration
 */
export default function RegisterForm({ registerAction }: RegisterFormProps) {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();

	// Form State
	const [formData, setFormData] = useState({
		fullName: "",
		phoneNumber: "",
		birthDate: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	// UI State
	const [notification, setNotification] = useState({
		message: "",
		type: "success" as "success" | "error",
		isVisible: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	/**
	 * Handle input changes
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	/**
	 * Handle phone number change
	 */
	const handlePhoneChange = (phone: string) => {
		setFormData((prev) => ({ ...prev, phoneNumber: phone }));
	};
	/**
	 * Handle form submission
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Convert birthDate string to Date object
			const submitData: RegisterInput = {
				...formData,
				birthDate: new Date(formData.birthDate),
			};

			// Call server action
			const result = await registerAction(submitData);

			if (result.success) {
				setNotification({
					message: isArabic
						? "تم إنشاء الحساب بنجاح! سيتم تحويلك لصفحة تسجيل الدخول..."
						: "Account created successfully! Redirecting to login...",
					type: "success",
					isVisible: true,
				});

				// Redirect to login after 2 seconds
				setTimeout(() => {
					router.push("/");
				}, 2000);
			} else {
				setNotification({
					message: result.error || (isArabic ? "حدث خطأ أثناء التسجيل" : "An error occurred during registration"),
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			setNotification({
				message: isArabic
					? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
					: "An unexpected error occurred. Please try again.",
				type: "error",
				isVisible: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className={`text-center mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
						{t("register.title")}
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						{t("register.subtitle")}
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-6 md:p-8 space-y-8">
					{/* Personal Information */}
					<PersonalInfoSection
						fullName={formData.fullName}
						phoneNumber={formData.phoneNumber}
						birthDate={formData.birthDate}
						onChange={handleChange}
						onPhoneChange={handlePhoneChange}
						isArabic={isArabic}
						t={t}
					/>

					{/* Account Information */}
					<AccountSection
						email={formData.email}
						password={formData.password}
						confirmPassword={formData.confirmPassword}
						onChange={handleChange}
						isArabic={isArabic}
						t={t}
					/>

					

					{/* Submit Button */}
					<div className="pt-6">
						<button
							type="submit"
							disabled={isSubmitting }
							className="w-full rounded-lg bg-green-600 px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									{isArabic ? "جاري التسجيل..." : "Registering..."}
								</span>
							) : (
								t("register.submit")
							)}
						</button>

						{/* Login Link */}
						<p className={`mt-4 text-center text-sm text-gray-600 dark:text-gray-400`}>
							{t("register.haveAccount")}{" "}
							<a href="/login" className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
								{t("register.loginLink")}
							</a>
						</p>
					</div>
				</form>
			</div>

		

			{/* Notification Dialog */}
			<NotificationDialog
				isVisible={notification.isVisible}
				onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
				message={notification.message}
				type={notification.type}
				isArabic={isArabic}
			/>
		</div>
	);
}


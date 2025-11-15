"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { AccountSection } from "./AccountSection";
import { NotificationDialog } from "../Utils/NotificationDialog";
import { FormInput } from "../Utils/FormInput";
import { registerCustomer } from "@/lib/api/user";

/**
 * Main Register Form Component
 * Clean, modular registration form with API integration
 */
export default function RegisterForm() {
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
		referralCode: "",
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
	 * Validate form data
	 */
	const validateForm = (): string | null => {
		if (!formData.fullName.trim()) {
			return isArabic ? "الرجاء إدخال الاسم الكامل" : "Please enter your full name";
		}
		if (!formData.phoneNumber.trim()) {
			return isArabic ? "الرجاء إدخال رقم الهاتف" : "Please enter your phone number";
		}
		if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			return isArabic ? "الرجاء إدخال بريد إلكتروني صحيح" : "Please enter a valid email address";
		}
		if (!formData.password) {
			return isArabic ? "الرجاء إدخال كلمة المرور" : "Please enter a password";
		}
		if (formData.password.length < 8) {
			return isArabic ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters";
		}
		if (formData.password !== formData.confirmPassword) {
			return isArabic ? "كلمات المرور غير متطابقة" : "Passwords do not match";
		}
		return null;
	};

	/**
	 * Handle form submission
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form
		const validationError = validateForm();
		if (validationError) {
			setNotification({
				message: validationError,
				type: "error",
				isVisible: true,
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Normalize phone number - remove spaces, dashes, and other non-digit characters except +
			let normalizedPhone = formData.phoneNumber.replace(/[\s\-\(\)]/g, "");
			
			// Remove country code if present (966 or +966)
			if (normalizedPhone.startsWith("+966")) {
				normalizedPhone = normalizedPhone.substring(4);
			} else if (normalizedPhone.startsWith("966")) {
				normalizedPhone = normalizedPhone.substring(3);
			}
			
			// Remove any leading zeros
			normalizedPhone = normalizedPhone.replace(/^0+/, "");
			
			// Ensure we have 9 digits (without leading 0)
			if (normalizedPhone.length === 10 && normalizedPhone.startsWith("0")) {
				// If it's 10 digits starting with 0, remove the leading 0
				normalizedPhone = normalizedPhone.substring(1);
			}
			
			// Final validation - should be 9 digits (without leading 0)
			if (!/^\d{9}$/.test(normalizedPhone)) {
				setNotification({
					message: isArabic ? "صيغة رقم الهاتف غير صالحة. يجب أن يكون 9 أرقام" : "Invalid phone format. Must be 9 digits",
					type: "error",
					isVisible: true,
				});
				setIsSubmitting(false);
				return;
			}
			
			// Format as +966XXXXXXXXX
			normalizedPhone = "+966" + normalizedPhone;

			// Call API
			const result = await registerCustomer(
				{
					name: formData.fullName,
					phone: normalizedPhone,
					email: formData.email || undefined,
					password: formData.password,
					ref_code: formData.referralCode || undefined,
				},
				language
			);

			// Log full response data for debugging
			console.log("=== Registration Response ===");
			console.log("Full Result:", result);
			console.log("Response Data:", result.data);
			console.log("Response Status:", result.status);
			console.log("Error:", result.error);
			console.log("Message:", result.message);
			
			if (result.data) {
				console.log("Token:", result.data.token);
				console.log("Is Phone Verified:", result.data.is_phone_verified);
				console.log("Is Email Verified:", result.data.is_email_verified);
				console.log("Login Type:", result.data.login_type);
				console.log("User Data:", result.data.user);
			}

			if (result.data && result.data.token) {
				// Check if phone verification is needed (OTP might be sent)
				const needsPhoneVerification = result.data.is_phone_verified === 0;
				const needsEmailVerification = result.data.is_email_verified === 0;
				
				// Check if OTP was sent (check response message)
				const otpMessage = result.message || "";
				const hasOTP = otpMessage.toLowerCase().includes("otp") || 
							  otpMessage.toLowerCase().includes("verification code") ||
							  otpMessage.toLowerCase().includes("كود التحقق");
				
				console.log("=== Verification Status ===");
				console.log("Needs Phone Verification:", needsPhoneVerification);
				console.log("Needs Email Verification:", needsEmailVerification);
				console.log("OTP Message Detected:", hasOTP);
				console.log("Response Message:", otpMessage);

				// Build success message based on verification status
				let successMessage = "";
				if (needsPhoneVerification) {
					successMessage = isArabic
						? "تم إنشاء الحساب بنجاح! تم إرسال كود التحقق إلى رقم هاتفك. يرجى التحقق من رسائلك."
						: "Account created successfully! Verification code has been sent to your phone. Please check your messages.";
				} else if (needsEmailVerification) {
					successMessage = isArabic
						? "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني."
						: "Account created successfully! Please verify your email.";
				} else {
					successMessage = isArabic
						? "تم إنشاء الحساب بنجاح! سيتم تحويلك إلى الصفحة الرئيسية..."
						: "Account created successfully! Redirecting to home...";
				}

				setNotification({
					message: successMessage,
					type: "success",
					isVisible: true,
				});

				// Wait a bit before redirecting to show the notification
				setTimeout(() => {
					router.push("/home");
				}, 2000);
			} else {
				setNotification({
					message: result.error || result.message || (isArabic
						? "حدث خطأ أثناء التسجيل"
						: "An error occurred during registration"),
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
						disabled={isSubmitting}
					/>

					{/* Account Information */}
					<AccountSection
						email={formData.email}
						password={formData.password}
						confirmPassword={formData.confirmPassword}
						onChange={handleChange}
						isArabic={isArabic}
						t={t}
						disabled={isSubmitting}
					/>

					{/* Referral Code (Optional) */}
					<FormInput
						label={isArabic ? "رمز الإحالة (اختياري)" : "Referral Code (Optional)"}
						name="referralCode"
						type="text"
						value={formData.referralCode}
						onChange={handleChange}
						placeholder={isArabic ? "أدخل رمز الإحالة إن وجد" : "Enter referral code if you have one"}
						isArabic={isArabic}
						disabled={isSubmitting}
					/>

					{/* Submit Button */}
					<div className="pt-6">
						<button
							type="submit"
							disabled={isSubmitting}
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
"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { LoginInput } from "@/lib/validations/login.validation";
import { NotificationDialog } from "../Utils/NotificationDialog";
import { FormInput } from "../Utils/FormInput";
import { PasswordInput } from "../Utils/PasswordInput";

/**
 * Main Login Form Component
 * Clean, modular login form with session handling and RTL/LTR support
 */
export default function LoginForm() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();

	// Form State
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	// UI State
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notification, setNotification] = useState({
		message: "",
		type: "success" as "success" | "error",
		isVisible: false,
	});

	// // Check if user is already logged in
	// useEffect(() => {
	// 	const checkLoginStatus = async () => {
	// 		try {
	// 			console.log("🔍 LoginForm: Checking login status via action");

	// 			// Call server action directly (no API route needed)
	// 			const isLoggedIn = await checkLoginAction();
				
	// 			if (isLoggedIn) {
	// 				console.log("✅ LoginForm: User already logged in, redirecting to HomePage");
	// 				router.push("/homePage");
	// 			} else {
	// 				console.log("ℹ️ LoginForm: User not logged in, showing login form");
	// 			}
	// 		} catch (error) {
	// 			console.error("❌ LoginForm: Error checking login status:", error);
	// 		}
	// 	};

	// 	checkLoginStatus();
	// }, [router]);

	/**
	 * Handle input changes
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	/**
	 * Handle form submission
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			console.log("📝 LoginForm: Submitting login form");

			// Call server action
			const result = await {
				success: true,
				data: { userId: "123" },
				error: "",
			};

			if (result.success) {
				console.log("✅ LoginForm: Login successful");

				setNotification({
					message: isArabic
						? "تم تسجيل الدخول بنجاح! جاري التحويل..."
						: "Login successful! Redirecting...",
					type: "success",
					isVisible: true,
				});

				// Immediate redirect after successful login
				router.push("/HomePage");
			} else {
				console.log("❌ LoginForm: Login failed -", result.error);

				setNotification({
					message: "An error occurred during login",
					type: "error",
					isVisible: true,
				});
				setIsSubmitting(false);
			}
		} catch (error) {
			console.error("❌ LoginForm: Unexpected error:", error);

			setNotification({
				message: isArabic
					? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
					: "An unexpected error occurred. Please try again.",
				type: "error",
				isVisible: true,
			});
			setIsSubmitting(false);
		}
	};

	// Show loading while checking login status
	if (isSubmitting) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
				<div className="text-center">
					<div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-green-600 dark:border-green-400 border-t-transparent"></div>
					<p className="mt-4 text-gray-600 dark:text-gray-300">{isArabic ? "جاري التحقق..." : "Checking..."}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 sm:py-12">
			<div className="w-full max-w-[90%] sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
				{/* Header */}
				<div className={`text-center mb-6 sm:mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
						{t("login.title")}
					</h1>
					<p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
						{t("login.subtitle")}
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6">
					{/* Email */}
					<FormInput
						label={t("login.email")}
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						placeholder={isArabic ? "example@email.com" : "example@email.com"}
						required
						isArabic={isArabic}
					/>

					{/* Password */}
					<PasswordInput
						label={t("login.password")}
						name="password"
						value={formData.password}
						onChange={handleChange}
						placeholder={isArabic ? "أدخل كلمة المرور" : "Enter password"}
						required
						isArabic={isArabic}
					/>

					{/* Submit Button */}
					<div className="pt-2 sm:pt-4">
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full rounded-lg bg-green-600 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									<span className="text-sm sm:text-base">
										{isArabic ? "جاري تسجيل الدخول..." : "Logging in..."}
									</span>
								</span>
							) : (
								t("login.submit")
							)}
						</button>

						{/* Register Link */}
						<p className={`mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400`}>
							{t("login.noAccount")}{" "}
							<a href="/register" className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline">
								{t("login.registerLink")}
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


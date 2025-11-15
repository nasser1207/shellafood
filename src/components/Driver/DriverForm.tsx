"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import React, { useState, useEffect } from "react";
import { PhoneInputField } from "@/components/Utils/PhoneInput";
import { UploadFileInput } from "@/components/Utils/UploadFileInput";
import { NotificationDialog } from "@/components/Utils/NotificationDialog";
import { FormInput } from "@/components/Utils/FormInput";
import { SectionHeader } from "@/components/Utils/SectionHeader";
import { CheckBoxInput } from "@/components/Utils/CheckBoxInput";
import { registerDriver, DriverRegistrationData } from "@/lib/api/driver";
import { getZonesList, Zone } from "@/lib/api/partner";

interface DriverFormData {
	// Personal Information
	f_name: string;
	l_name: string;
	phone: string;
	email: string;
	password: string;
	
	// Driver Information
	identity_number: string;
	identity_type: string;
	zone_id: string;
	
	// Optional Files
	identity_image: string;
	driving_license_image: string;
	driver_license_image: string;
	
	// Terms
	agreed: boolean;
}

const INITIAL_FORM_DATA: DriverFormData = {
	f_name: "",
	l_name: "",
	phone: "",
	email: "",
	password: "",
	identity_number: "",
	identity_type: "",
	zone_id: "",
	identity_image: "",
	driving_license_image: "",
	driver_license_image: "",
	agreed: false,
};

export default function DriverForm() {
	const { t, language } = useLanguage();
	const isArabic = language === 'ar';

	const [formData, setFormData] = useState<DriverFormData>(INITIAL_FORM_DATA);
	const [zones, setZones] = useState<Zone[]>([]);
	const [loadingZones, setLoadingZones] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notification, setNotification] = useState({
		message: "",
		type: "success" as "success" | "error",
		isVisible: false,
	});

	// Load zones on mount
	useEffect(() => {
		loadZones();
	}, [language]);

	const loadZones = async () => {
		setLoadingZones(true);
		try {
			const result = await getZonesList(language);
			if (result.data) {
				setZones(result.data);
			} else {
				setNotification({
					message: result.error || (isArabic ? "فشل تحميل المناطق" : "Failed to load zones"),
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			console.error('Error loading zones:', error);
			setNotification({
				message: isArabic ? "خطأ في تحميل المناطق" : "Error loading zones",
				type: "error",
				isVisible: true,
			});
		} finally {
			setLoadingZones(false);
		}
	};

	// Handlers
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		const checked = (e.target as HTMLInputElement).checked;
		
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleUploadComplete = (
		field: "identity_image" | "driving_license_image" | "driver_license_image",
		successMessage: string,
	) => {
		return (url: string) => {
			setFormData((prev) => ({ ...prev, [field]: url }));
			if (url) {
				setNotification({
					message: successMessage,
					type: "success",
					isVisible: true,
				});
			}
		};
	};

	const handleUploadError = (error: Error) => {
		setNotification({
			message: error.message,
			type: "error",
			isVisible: true,
		});
	};

	// Validation
	const validateForm = (): { isValid: boolean; message: string } => {
		// Required fields
		const requiredFields: (keyof DriverFormData)[] = [
			"f_name",
			"l_name",
			"phone",
			"email",
			"password",
			"identity_number",
			"identity_type",
			"zone_id",
		];

		for (const field of requiredFields) {
			const value = formData[field];
			if (!value || (typeof value === "string" && value.trim() === "")) {
				return {
					isValid: false,
					message: isArabic ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
				};
			}
		}

		// Validate first name
		if (formData.f_name.length < 2 || formData.f_name.length > 50) {
			return {
				isValid: false,
				message: isArabic ? "الاسم الأول يجب أن يكون بين 2-50 حرف" : "First name must be between 2-50 characters",
			};
		}

		// Validate last name
		if (formData.l_name.length < 2 || formData.l_name.length > 50) {
			return {
				isValid: false,
				message: isArabic ? "اسم العائلة يجب أن يكون بين 2-50 حرف" : "Last name must be between 2-50 characters",
			};
		}

		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			return {
				isValid: false,
				message: isArabic ? "البريد الإلكتروني غير صحيح" : "Invalid email address",
			};
		}

		// Validate password
		if (formData.password.length < 8) {
			return {
				isValid: false,
				message: isArabic ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters",
			};
		}

		// Validate identity number (10 digits)
		if (!/^\d{10}$/.test(formData.identity_number)) {
			return {
				isValid: false,
				message: isArabic ? "رقم الهوية يجب أن يتكون من 10 أرقام" : "Identity number must be 10 digits",
			};
		}

		// Validate identity type
		if (formData.identity_type !== "nid" && formData.identity_type !== "residence" && formData.identity_type !== "passport" && formData.identity_type !== "driving_license") {
			return {
				isValid: false,
				message: isArabic ? "نوع الهوية غير صالح" : "Invalid identity type",
			};
		}

		// Validate zone
		if (!formData.zone_id) {
			return {
				isValid: false,
				message: isArabic ? "يرجى اختيار المنطقة" : "Please select a zone",
			};
		}

		// Validate identity image is uploaded (required by API)
	

		// Validate terms agreement
		if (!formData.agreed) {
			return {
				isValid: false,
				message: isArabic ? "يجب الموافقة على الشروط والأحكام" : "You must agree to terms and conditions",
			};
		}

		return { isValid: true, message: "" };
	};

	// Helper function to convert URL to File
	const urlToFile = async (url: string, filename: string): Promise<File | undefined> => {
		if (!url) return undefined;
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			return new File([blob], filename, { type: blob.type });
		} catch (error) {
			console.error('Error converting URL to File:', error);
			return undefined;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const validation = validateForm();
		if (!validation.isValid) {
			setNotification({
				message: validation.message,
				type: "error",
				isVisible: true,
			});
			return;
		}

		setIsSubmitting(true);
		try {
			// Convert image URLs to Files if they exist
			const identityImageFile = formData.identity_image 
				? await urlToFile(formData.identity_image, "identity_image.jpg") 
				: undefined;
			const drivingLicenseFile = formData.driving_license_image 
				? await urlToFile(formData.driving_license_image, "driving_license.jpg") 
				: undefined;
			const driverLicenseFile = formData.driver_license_image 
				? await urlToFile(formData.driver_license_image, "driver_license.jpg") 
				: undefined;

			// Normalize phone number - remove spaces, dashes, and other non-digit characters except +
			let normalizedPhone = formData.phone.replace(/[\s\-\(\)]/g, "");
			
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
				return;
			}
			
			// Format as +966XXXXXXXXX
			normalizedPhone = "+966" + normalizedPhone;

			// Prepare data for API
			const registrationData: DriverRegistrationData = {
				f_name: formData.f_name,
				l_name: formData.l_name,
				email: formData.email,
				phone: normalizedPhone,
				identity_number: formData.identity_number,
				identity_type: formData.identity_type,
				zone_id: parseInt(formData.zone_id),
				password: formData.password,
				identity_image: identityImageFile,
				driving_license_image: drivingLicenseFile,
				driver_license_image: driverLicenseFile,
			};

			const result = await registerDriver(registrationData, language);
			
			if (result.data) {
				setNotification({
					message: isArabic ? "تم التسجيل بنجاح!" : "Registration successful!",
					type: "success",
					isVisible: true,
				});
				handleReset();
			} else {
				setNotification({
					message: result.error || (isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			console.error('Error registering driver:', error);
			setNotification({
				message: error instanceof Error ? error.message : (isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
				type: "error",
				isVisible: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleReset = () => {
		setFormData(INITIAL_FORM_DATA);
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			{/* Personal Information Section */}
			<SectionHeader title={isArabic ? "المعلومات الشخصية" : "Personal Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<FormInput
					label={isArabic ? "الاسم الأول" : "First Name"}
					name="f_name"
					type="text"
					placeholder={isArabic ? "أدخل الاسم الأول" : "Enter first name"}
					value={formData.f_name}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "اسم العائلة" : "Last Name"}
					name="l_name"
					type="text"
					placeholder={isArabic ? "أدخل اسم العائلة" : "Enter last name"}
					value={formData.l_name}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<PhoneInputField
					label={isArabic ? "رقم الهاتف" : "Phone Number"}
					value={formData.phone}
					onChange={(phone) =>
						setFormData((prev) => ({ ...prev, phone: phone }))
					}
					isArabic={isArabic}
					required
					name="phone"
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "البريد الإلكتروني" : "Email Address"}
					name="email"
					type="email"
					placeholder={isArabic ? "example@email.com" : "example@email.com"}
					value={formData.email}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "كلمة المرور" : "Password"}
					name="password"
					type="password"
					placeholder={isArabic ? "أدخل كلمة المرور" : "Enter password"}
					value={formData.password}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>
			</div>

			{/* Driver Information Section */}
			<SectionHeader title={isArabic ? "معلومات السائق" : "Driver Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<FormInput
					label={isArabic ? "رقم الهوية" : "Identity Number"}
					name="identity_number"
					type="text"
					placeholder={isArabic ? "1234567890" : "1234567890"}
					value={formData.identity_number}
					onChange={(e) => {
						// Only allow digits and limit to 10 characters
						const value = e.target.value.replace(/\D/g, '').slice(0, 10);
						setFormData((prev) => ({ ...prev, identity_number: value }));
					}}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<div className="flex flex-col">
					<label
						htmlFor="identity_type"
						className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}
					>
						{isArabic ? "نوع الهوية" : "Identity Type"}
						<span className="text-red-500 dark:text-red-400 mr-1">*</span>
					</label>
					<select
						id="identity_type"
						name="identity_type"
						value={formData.identity_type}
						onChange={handleChange}
						disabled={isSubmitting}
						className={`rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 ${isArabic ? "text-right" : "text-left"}`}
						required
					>
						<option value="">{isArabic ? "اختر نوع الهوية" : "Select identity type"}</option>
						<option value="nid">{isArabic ? "هوية وطنية" : "National ID"}</option>
						<option value="residence">{isArabic ? "إقامة" : "Iqama (Residence)"}</option>
						<option value="passport">{isArabic ? "رقم الجواز" : "Passport"}</option>
						<option value="driving_license">{isArabic ? "رخصة القيادة" : "Driving license"}</option>
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isArabic ? "اختر نوع وثيقة الهوية الخاصة بك" : "Select your identity document type"}
					</p>
				</div>

				{/* Zone Selection */}
				<div className="flex flex-col">
					<label className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "المنطقة" : "Zone / Delivery Area"}
						<span className="text-red-500 dark:text-red-400 mr-1">*</span>
					</label>
					<select
						name="zone_id"
						value={formData.zone_id}
						onChange={handleChange}
						disabled={loadingZones || isSubmitting}
						className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-4 py-3 shadow-sm focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
						required
					>
						<option value="">
							{loadingZones 
								? (isArabic ? "جاري التحميل..." : "Loading...") 
								: (isArabic ? "اختر المنطقة" : "Select Zone")}
						</option>
						{zones.map((zone) => (
							<option key={zone.id} value={zone.id}>
								{zone.name}
							</option>
						))}
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isArabic ? "منطقة العمل الخاصة بك" : "Your work area"}
					</p>
				</div>
			</div>

			{/* File Upload Section */}
			<SectionHeader title={isArabic ? "المستندات المطلوبة" : "Required Documents"} isArabic={isArabic} />
			<div className="flex flex-col gap-5 md:flex-row md:justify-start mb-8">
				<UploadFileInput
					label={isArabic ? "صورة الهوية" : "Identity Image"}
					endpoint="imageUploader"
					onUploadComplete={handleUploadComplete(
						"identity_image",
						isArabic ? "تم رفع صورة الهوية بنجاح" : "Identity image uploaded successfully",
					)}
					onUploadError={handleUploadError}
					isArabic={isArabic}
					required
				/>

				<UploadFileInput
					label={isArabic ? "رخصة القيادة" : "Driving License"}
					endpoint="imageUploader"
					onUploadComplete={handleUploadComplete(
						"driving_license_image",
						isArabic ? "تم رفع رخصة القيادة بنجاح" : "Driving license uploaded successfully",
					)}
					onUploadError={handleUploadError}
					isArabic={isArabic}
				/>

				<UploadFileInput
					label={isArabic ? "رخصة السائق" : "Driver License"}
					endpoint="imageUploader"
					onUploadComplete={handleUploadComplete(
						"driver_license_image",
						isArabic ? "تم رفع رخصة السائق بنجاح" : "Driver license uploaded successfully",
					)}
					onUploadError={handleUploadError}
					isArabic={isArabic}
				/>
			</div>

			{/* Terms Agreement */}
			<div className="mt-8">
				<CheckBoxInput
					checked={formData.agreed}
					onChange={handleChange}
					label={isArabic ? "أوافق على" : "I agree to"}
					isArabic={isArabic}
					name="agreed"
					href="/CondtionAterms"
					linkText={isArabic ? "الشروط والأحكام" : "Terms and Conditions"}
					showLink={true}
					required
				/>
			</div>

			{/* Form Actions */}
			<div className="mt-8 flex flex-col justify-start gap-4 sm:flex-row">
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full rounded-lg bg-green-500 dark:bg-green-600 px-10 py-3 font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-green-600 dark:hover:bg-green-700 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:outline-none sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{isSubmitting && (
						<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					)}
					{isSubmitting ? (isArabic ? "جاري الإرسال..." : "Submitting...") : (isArabic ? "إرسال الطلب" : "Submit Application")}
				</button>
				<button
					type="button"
					onClick={handleReset}
					disabled={isSubmitting}
					className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 py-3 font-semibold text-gray-500 dark:text-gray-300 shadow-sm transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isArabic ? "إعادة تعيين" : "Reset"}
				</button>
			</div>

			{/* Notifications */}
			<NotificationDialog
				isArabic={isArabic}
				message={notification.message}
				type={notification.type}
				isVisible={notification.isVisible}
				onClose={() => setNotification({ ...notification, isVisible: false })}
			/>
		</form>
	);
}

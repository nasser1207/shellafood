"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import React, { useState, useEffect } from "react";
import { NotificationDialog } from "@/components/Utils/NotificationDialog";
import { FormInput } from "@/components/Utils/FormInput";
import { SectionHeader } from "@/components/Utils/SectionHeader";
import { UploadFileInput } from "@/components/Utils/UploadFileInput";
import { PhoneInputField } from "@/components/Utils/PhoneInput";
import { registerWorker, WorkerRegistrationData } from "@/lib/api/worker";
import { getZonesList, getModulesByZone, Zone, Module } from "@/lib/api/partner";

interface WorkerFormData {
	// Personal Information
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	
	// Work Information
	driver_type: string;
	area: string;
	vehicle_type: string;
	
	// ID Information
	id_type: string;
	id_number: string;
	id_image: string;
	
	// Optional Fields
	zone_id: string;
	module_id: string;
}

const INITIAL_FORM_DATA: WorkerFormData = {
	first_name: "",
	last_name: "",
	email: "",
	phone_number: "",
	driver_type: "",
	area: "",
	vehicle_type: "",
	id_type: "",
	id_number: "",
	id_image: "",
	zone_id: "",
	module_id: "",
};

export default function WorkerForm() {
	const { t, language } = useLanguage();
	const isArabic = language === 'ar';

	const [formData, setFormData] = useState<WorkerFormData>(INITIAL_FORM_DATA);
	const [zones, setZones] = useState<Zone[]>([]);
	const [modules, setModules] = useState<Module[]>([]);
	const [loadingZones, setLoadingZones] = useState(true);
	const [loadingModules, setLoadingModules] = useState(false);
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

	// Load modules when zone changes
	useEffect(() => {
		if (formData.zone_id) {
			loadModules(parseInt(formData.zone_id));
		} else {
			setModules([]);
			setFormData((prev) => ({ ...prev, module_id: "" }));
		}
	}, [formData.zone_id, language]);

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

	const loadModules = async (zoneId: number) => {
		setLoadingModules(true);
		try {
			const result = await getModulesByZone(zoneId, language);
			if (result.data) {
				setModules(result.data);
			} else {
				setNotification({
					message: result.error || (isArabic ? "فشل تحميل الوحدات" : "Failed to load modules"),
					type: "error",
					isVisible: true,
				});
				setModules([]);
			}
		} catch (error) {
			console.error('Error loading modules:', error);
			setNotification({
				message: isArabic ? "خطأ في تحميل الوحدات" : "Error loading modules",
				type: "error",
				isVisible: true,
			});
			setModules([]);
		} finally {
			setLoadingModules(false);
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
		field: "id_image",
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
		const requiredFields: (keyof WorkerFormData)[] = [
			"first_name",
			"last_name",
			"email",
			"phone_number",
			"driver_type",
			"area",
			"vehicle_type",
			"id_type",
			"id_number",
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
		if (formData.first_name.length < 2 || formData.first_name.length > 50) {
			return {
				isValid: false,
				message: isArabic ? "الاسم الأول يجب أن يكون بين 2-50 حرف" : "First name must be between 2-50 characters",
			};
		}

		// Validate last name
		if (formData.last_name.length < 2 || formData.last_name.length > 50) {
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

		// Validate phone number
		if (!formData.phone_number || formData.phone_number.trim() === "") {
			return {
				isValid: false,
				message: isArabic ? "يرجى إدخال رقم الهاتف" : "Please enter phone number",
			};
		}

		// Validate driver type
		if (formData.driver_type !== "delivery" && formData.driver_type !== "service") {
			return {
				isValid: false,
				message: isArabic ? "نوع العمل غير صالح" : "Invalid work type",
			};
		}

		// Validate vehicle type
		if (!["motorcycle", "car", "bicycle"].includes(formData.vehicle_type)) {
			return {
				isValid: false,
				message: isArabic ? "نوع المركبة غير صالح" : "Invalid vehicle type",
			};
		}

		// Validate ID type
		if (formData.id_type !== "national_id" && formData.id_type !== "iqama") {
			return {
				isValid: false,
				message: isArabic ? "نوع الهوية غير صالح" : "Invalid ID type",
			};
		}

		// Validate ID number (10 digits)
		if (!/^\d{10}$/.test(formData.id_number)) {
			return {
				isValid: false,
				message: isArabic ? "رقم الهوية يجب أن يتكون من 10 أرقام" : "ID number must be 10 digits",
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
			console.error("Error converting URL to File:", error);
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
			// Convert image URL to File if it exists
			const idImageFile = formData.id_image 
				? await urlToFile(formData.id_image, "id_image.jpg") 
				: undefined;

			// Prepare data for API
			const registrationData: WorkerRegistrationData = {
				first_name: formData.first_name,
				last_name: formData.last_name,
				email: formData.email,
				phone_number: formData.phone_number,
				driver_type: formData.driver_type,
				area: formData.area,
				vehicle_type: formData.vehicle_type,
				id_type: formData.id_type,
				id_number: formData.id_number,
				id_image: idImageFile,
				zone_id: formData.zone_id ? parseInt(formData.zone_id) : undefined,
				module_id: formData.module_id ? parseInt(formData.module_id) : undefined,
			};

			const result = await registerWorker(registrationData, language);
			
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
			console.error('Error registering worker:', error);
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
		setModules([]);
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			{/* Personal Information Section */}
			<SectionHeader title={isArabic ? "المعلومات الشخصية" : "Personal Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<FormInput
					label={isArabic ? "الاسم الأول" : "First Name"}
					name="first_name"
					type="text"
					placeholder={isArabic ? "أدخل الاسم الأول" : "Enter first name"}
					value={formData.first_name}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "اسم العائلة" : "Last Name"}
					name="last_name"
					type="text"
					placeholder={isArabic ? "أدخل اسم العائلة" : "Enter last name"}
					value={formData.last_name}
					onChange={handleChange}
					required
					isArabic={isArabic}
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

				<PhoneInputField
					label={isArabic ? "رقم الهاتف" : "Phone Number"}
					value={formData.phone_number}
					onChange={(phone) => setFormData({ ...formData, phone_number: phone })}
					isArabic={isArabic}
					required
					name="phone_number"
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "المنطقة" : "Area"}
					name="area"
					type="text"
					placeholder={isArabic ? "الرياض" : "Riyadh"}
					value={formData.area}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>
			</div>

			{/* Work Information Section */}
			<SectionHeader title={isArabic ? "معلومات العمل" : "Work Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<div className="flex flex-col">
					<label
						htmlFor="driver_type"
						className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}
					>
						{isArabic ? "نوع العمل" : "Work Type"}
						<span className="text-red-500 dark:text-red-400 mr-1">*</span>
					</label>
					<select
						id="driver_type"
						name="driver_type"
						value={formData.driver_type}
						onChange={handleChange}
						disabled={isSubmitting}
						className={`rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 ${isArabic ? "text-right" : "text-left"}`}
						required
					>
						<option value="">{isArabic ? "اختر نوع العمل" : "Select work type"}</option>
						<option value="delivery">{isArabic ? "توصيل" : "Delivery"}</option>
						<option value="service">{isArabic ? "خدمة" : "Service"}</option>
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isArabic ? "اختر نوع العمل الذي تريد القيام به" : "Select the type of work you want to do"}
					</p>
				</div>

				<div className="flex flex-col">
					<label
						htmlFor="vehicle_type"
						className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}
					>
						{isArabic ? "نوع المركبة" : "Vehicle Type"}
						<span className="text-red-500 dark:text-red-400 mr-1">*</span>
					</label>
					<select
						id="vehicle_type"
						name="vehicle_type"
						value={formData.vehicle_type}
						onChange={handleChange}
						disabled={isSubmitting}
						className={`rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 ${isArabic ? "text-right" : "text-left"}`}
						required
					>
						<option value="">{isArabic ? "اختر نوع المركبة" : "Select vehicle type"}</option>
						<option value="motorcycle">{isArabic ? "دراجة نارية" : "Motorcycle"}</option>
						<option value="car">{isArabic ? "سيارة" : "Car"}</option>
						<option value="bicycle">{isArabic ? "دراجة هوائية" : "Bicycle"}</option>
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isArabic ? "اختر نوع المركبة التي ستستخدمها" : "Select the type of vehicle you will use"}
					</p>
				</div>
			</div>

			{/* ID Information Section */}
			<SectionHeader title={isArabic ? "معلومات الهوية" : "ID Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<div className="flex flex-col">
					<label
						htmlFor="id_type"
						className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}
					>
						{isArabic ? "نوع الهوية" : "ID Type"}
						<span className="text-red-500 dark:text-red-400 mr-1">*</span>
					</label>
					<select
						id="id_type"
						name="id_type"
						value={formData.id_type}
						onChange={handleChange}
						disabled={isSubmitting}
						className={`rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 ${isArabic ? "text-right" : "text-left"}`}
						required
					>
						<option value="">{isArabic ? "اختر نوع الهوية" : "Select ID type"}</option>
						<option value="national_id">{isArabic ? "هوية وطنية" : "National ID"}</option>
						<option value="iqama">{isArabic ? "إقامة" : "Iqama (Residence)"}</option>
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isArabic ? "اختر نوع وثيقة الهوية الخاصة بك" : "Select your identity document type"}
					</p>
				</div>

				<FormInput
					label={isArabic ? "رقم الهوية" : "ID Number"}
					name="id_number"
					type="text"
					placeholder={isArabic ? "1234567890" : "1234567890"}
					value={formData.id_number}
					onChange={(e) => {
						// Only allow digits and limit to 10 characters
						const value = e.target.value.replace(/\D/g, '').slice(0, 10);
						setFormData((prev) => ({ ...prev, id_number: value }));
					}}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>
			</div>

			{/* File Upload Section */}
			<div className="mb-8">
				<UploadFileInput
					label={isArabic ? "صورة الهوية" : "ID Image"}
					endpoint="imageUploader"
					onUploadComplete={handleUploadComplete(
						"id_image",
						isArabic ? "تم رفع صورة الهوية بنجاح" : "ID image uploaded successfully",
					)}
					onUploadError={handleUploadError}
					isArabic={isArabic}
				/>
			</div>

			{/* Optional Fields Section */}
			<SectionHeader title={isArabic ? "حقول اختيارية" : "Optional Fields"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				{/* Zone Selection */}
				<div className="flex flex-col">
					<label className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "المنطقة" : "Zone / Delivery Area"}
					</label>
					<select
						name="zone_id"
						value={formData.zone_id}
						onChange={handleChange}
						disabled={loadingZones || isSubmitting}
						className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-4 py-3 shadow-sm focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="">
							{loadingZones 
								? (isArabic ? "جاري التحميل..." : "Loading...") 
								: (isArabic ? "اختر المنطقة (اختياري)" : "Select Zone (Optional)")}
						</option>
						{zones.map((zone) => (
							<option key={zone.id} value={zone.id}>
								{zone.name}
							</option>
						))}
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isArabic ? "منطقة العمل (اختياري)" : "Work area (optional)"}
					</p>
				</div>

				{/* Module Selection */}
				<div className="flex flex-col">
					<label className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "نوع الوحدة" : "Module Type"}
					</label>
					<select
						name="module_id"
						value={formData.module_id}
						onChange={handleChange}
						disabled={!formData.zone_id || loadingModules || isSubmitting}
						className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-4 py-3 shadow-sm focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="">
							{!formData.zone_id 
								? (isArabic ? "اختر المنطقة أولاً" : "Select zone first")
								: loadingModules 
								? (isArabic ? "جاري التحميل..." : "Loading...") 
								: (isArabic ? "اختر نوع الوحدة (اختياري)" : "Select Module Type (Optional)")}
						</option>
						{modules.map((module) => (
							<option key={module.id} value={module.id}>
								{module.module_name}
							</option>
						))}
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isArabic ? "نوع الوحدة (اختياري)" : "Module type (optional)"}
					</p>
				</div>
			</div>

			{/* Form Actions */}
			<div className="mt-8 flex flex-col justify-start gap-4 sm:flex-row">
				<button
					type="submit"
					className="w-full rounded-lg bg-green-500 dark:bg-green-600 px-10 py-3 font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-green-600 dark:hover:bg-green-700 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:outline-none sm:w-auto"
				>
					{isArabic ? "إرسال الطلب" : "Submit Application"}
				</button>
				<button
					type="button"
					onClick={handleReset}
					className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 py-3 font-semibold text-gray-500 dark:text-gray-300 shadow-sm transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none sm:w-auto"
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

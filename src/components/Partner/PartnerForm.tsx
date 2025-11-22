
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
	Autocomplete,
	GoogleMap,
	Marker,
	useLoadScript,
} from "@react-google-maps/api";
import React, { useRef, useState, useEffect } from "react";
import PhoneInputField from "@/components/Utils/PhoneInput";
import { NotificationDialog } from "@/components/Utils/NotificationDialog";
import { FormInput } from "@/components/Utils/FormInput";
import { SectionHeader } from "@/components/Utils/SectionHeader";
import { CheckBoxInput } from "@/components/Utils/CheckBoxInput";
import { UploadFileInput } from "@/components/Utils/UploadFileInput";
import { getZonesList, getModulesByZone, registerPartner, Zone, Module } from "@/lib/api/partner";

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 };
const MAP_ZOOM = 10;
const MAP_HEIGHT = "400px";

interface PartnerFormData {
	// Personal Information
	f_name: string;
	l_name: string;
	phone: string;
	email: string;
	password: string;
	
	// Store Information
	zoneId: string;
	moduleId: string;
	store_name: string;
	address: string;
	latitude: string;
	longitude: string;
	
	// Optional Files
	logo: string;
	cover_photo: string;
	
	// Terms
	agreed: boolean;
}

const INITIAL_FORM_DATA: PartnerFormData = {
	f_name: "",
	l_name: "",
	phone: "",
	email: "",
	password: "",
	zoneId: "",
	moduleId: "",
	store_name: "",
	address: "",
	latitude: "",
	longitude: "",
	logo: "",
	cover_photo: "",
	agreed: false,
};



export default function PartnerForm() {
	const { t, language } = useLanguage();
	const isArabic = language === 'ar';
	
	const [formData, setFormData] = useState<PartnerFormData>(INITIAL_FORM_DATA);
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

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
		libraries: ["places"],
	});
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

	// Load zones on mount
	useEffect(() => {
		loadZones();
	}, [language]);

	// Load modules when zone changes
	useEffect(() => {
		if (formData.zoneId) {
			loadModules(parseInt(formData.zoneId));
		} else {
			setModules([]);
			setFormData((prev) => ({ ...prev, moduleId: "" }));
		}
	}, [formData.zoneId, language]);

	const loadZones = async () => {
		setLoadingZones(true);
		try {
			const result = await getZonesList(language);
			if (result.data) {
				setZones(result.data);
			} else {
				setNotification({
					message: result.error || "Failed to load zones",
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			setNotification({
				message: "Error loading zones",
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
					message: result.error || "Failed to load modules",
					type: "error",
					isVisible: true,
				});
				setModules([]);
			}
		} catch (error) {
			setNotification({
				message: "Error loading modules",
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

	const handlePlaceChanged = () => {
		const place = autocompleteRef.current?.getPlace();
		if (place?.geometry?.location) {
			const lat = place.geometry.location.lat();
			const lng = place.geometry.location.lng();
			const address = place.formatted_address || place.name || "";
			setFormData((prev) => ({
				...prev,
				latitude: lat.toString(),
				longitude: lng.toString(),
				address: address,
			}));
		}
	};

	const handleLocationClick = (e: google.maps.MapMouseEvent) => {
		if (e.latLng) {
			const lat = e.latLng.lat().toString();
			const lng = e.latLng.lng().toString();
			setFormData((prev) => ({
				...prev,
				latitude: lat,
				longitude: lng,
			}));
		}
	};

	const handleGetCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const position = {
						lat: pos.coords.latitude,
						lng: pos.coords.longitude,
					};
					setFormData((prev) => ({
						...prev,
						location: `${position.lat},${position.lng}`,
					}));
				},
				() => {
					setNotification({
						message: t("partnerForm.locationError"),
						type: "error",
						isVisible: true,
					});
				},
			);
		} else {
			setNotification({
				message: t("partnerForm.locationNotSupported"),
				type: "error",
				isVisible: true,
			});
		}
	};

	const handleUploadComplete = (
		field: "logo" | "cover_photo",
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
		const requiredFields: (keyof PartnerFormData)[] = [
			"f_name",
			"l_name",
			"phone",
			"email",
			"password",
			"zoneId",
			"moduleId",
			"store_name",
			"address",
			"latitude",
			"longitude",
		];

		for (const field of requiredFields) {
			const value = formData[field];
			if (!value || (typeof value === "string" && value.trim() === "")) {
				return {
					isValid: false,
					message: t("partnerForm.fillAllFields"),
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

		// Validate zone
		if (!formData.zoneId) {
			return {
				isValid: false,
				message: isArabic ? "يرجى اختيار المنطقة" : "Please select a zone",
			};
		}

		// Validate module
		if (!formData.moduleId) {
			return {
				isValid: false,
				message: isArabic ? "يرجى اختيار نوع المتجر" : "Please select store type",
			};
		}

		// Validate store name
		if (formData.store_name.length < 3 || formData.store_name.length > 100) {
			return {
				isValid: false,
				message: isArabic ? "اسم المتجر يجب أن يكون بين 3-100 حرف" : "Store name must be between 3-100 characters",
			};
		}

		// Validate address
		if (formData.address.length < 5 || formData.address.length > 200) {
			return {
				isValid: false,
				message: isArabic ? "العنوان يجب أن يكون بين 5-200 حرف" : "Address must be between 5-200 characters",
			};
		}

		// Validate coordinates
		const lat = parseFloat(formData.latitude);
		const lng = parseFloat(formData.longitude);
		if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
			return {
				isValid: false,
				message: isArabic ? "يجب تحديد موقع المتجر على الخريطة" : "Store location must be selected on the map",
			};
		}

		// Validate terms agreement
		if (!formData.agreed) {
			return {
				isValid: false,
				message: t("partnerForm.agreeToTerms"),
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
			// Convert image URLs to Files if they exist
			const logoFile = formData.logo ? await urlToFile(formData.logo, "logo.jpg") : undefined;
			const coverPhotoFile = formData.cover_photo ? await urlToFile(formData.cover_photo, "cover_photo.jpg") : undefined;

			// Transform form data to API format
			const apiData = {
				f_name: formData.f_name,
				l_name: formData.l_name,
				phone: formData.phone,
				email: formData.email,
				password: formData.password,
				zone_id: parseInt(formData.zoneId),
				module_id: parseInt(formData.moduleId),
				store_name: formData.store_name,
				address: formData.address,
				latitude: formData.latitude,
				longitude: formData.longitude,
				logo: logoFile,
				cover_photo: coverPhotoFile,
			};
console.log(apiData);
		//	const result = await registerPartner(apiData, language);
		const result = {
			data: {
				message: "Registration successful!",
			},
			error: null,
		};
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

	const mapCenter = formData.latitude && formData.longitude
		? {
				lat: parseFloat(formData.latitude),
				lng: parseFloat(formData.longitude),
			}
		: DEFAULT_CENTER;

	const markerPosition = formData.latitude && formData.longitude
		? {
				lat: parseFloat(formData.latitude),
				lng: parseFloat(formData.longitude),
			}
		: null;

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
					placeholder={isArabic ? "8 أحرف على الأقل" : "At least 8 characters"}
					value={formData.password}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>
			</div>

			{/* Store Information Section */}
			<SectionHeader title={isArabic ? "معلومات المتجر" : "Store Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				{/* Zone Selection */}
				<div className="flex flex-col">
					<label className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "المنطقة" : "Zone / Delivery Area"}
						<span className="text-red-500 dark:text-red-400 mr-1">*</span>
					</label>
					<select
						name="zoneId"
						value={formData.zoneId}
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
						{isArabic ? "منطقة التوصيل الخاصة بمتجرك" : "Your store's delivery area"}
					</p>
				</div>

				{/* Module Selection */}
				<div className="flex flex-col">
					<label className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "نوع المتجر" : "Store Type / Module"}
						<span className="text-red-500 dark:text-red-400 mr-1">*</span>
					</label>
					<select
						name="moduleId"
						value={formData.moduleId}
						onChange={handleChange}
						disabled={!formData.zoneId || loadingModules || isSubmitting}
						className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-4 py-3 shadow-sm focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
						required
					>
						<option value="">
							{!formData.zoneId 
								? (isArabic ? "اختر المنطقة أولاً" : "Select zone first")
								: loadingModules 
								? (isArabic ? "جاري التحميل..." : "Loading...") 
								: (isArabic ? "اختر نوع المتجر" : "Select Store Type")}
						</option>
						{modules.map((module) => (
							<option key={module.id} value={module.id}>
								{module.module_name}
							</option>
						))}
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isArabic ? "نوع عملك (مطعم، بقالة، إلخ)" : "Your business type (restaurant, grocery, etc.)"}
					</p>
				</div>

				<FormInput
					label={isArabic ? "اسم المتجر" : "Store Name"}
					name="store_name"
					type="text"
					placeholder={isArabic ? "أدخل اسم المتجر" : "Enter store name"}
					value={formData.store_name}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "عنوان المتجر" : "Store Address"}
					name="address"
					type="text"
					placeholder={isArabic ? "أدخل العنوان الكامل" : "Enter full address"}
					value={formData.address}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>
			</div>

			{/* File Upload Section */}
			<SectionHeader title={isArabic ? "صور المتجر" : "Store Images"} isArabic={isArabic} />
			<div className="mt-6 flex flex-col gap-5 md:flex-row md:justify-start">
				<UploadFileInput
					label={isArabic ? "شعار المتجر" : "Store Logo"}
					endpoint="imageUploader"
					onUploadComplete={handleUploadComplete(
						"logo",
						isArabic ? "تم رفع الشعار بنجاح" : "Logo uploaded successfully",
					)}
					onUploadError={handleUploadError}
					isArabic={isArabic}
				/>

				<UploadFileInput
					label={isArabic ? "صورة الغلاف" : "Cover Photo"}
					endpoint="imageUploader"
					onUploadComplete={handleUploadComplete(
						"cover_photo",
						isArabic ? "تم رفع صورة الغلاف بنجاح" : "Cover photo uploaded successfully",
					)}
					onUploadError={handleUploadError}
					isArabic={isArabic}
				/>
			</div>

			{/* Location Map Section */}
			<div className="mt-6 flex flex-col">
				<label className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}>
					{t("partnerForm.location")}
					<span className="text-red-500 dark:text-red-400 mr-1">*</span>
				</label>

				<div className="relative" style={{ height: MAP_HEIGHT }}>
					{isLoaded && (
						<div className="absolute top-2 left-1/2 z-50 w-[300px] -translate-x-1/2">
							<Autocomplete
								onLoad={(ac) => (autocompleteRef.current = ac)}
								onPlaceChanged={handlePlaceChanged}
							>
								<input
									type="text"
									placeholder={t("partnerForm.searchLocation")}
									className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 px-4 py-2 shadow focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20"
								/>
							</Autocomplete>
						</div>
					)}

					{isLoaded ? (
						<>
							<GoogleMap
								mapContainerStyle={{ width: "100%", height: "100%" }}
								center={mapCenter}
								zoom={MAP_ZOOM}
								onClick={handleLocationClick}
							>
								{markerPosition && (
									<Marker position={markerPosition} />
								)}
							</GoogleMap>

							<button
								type="button"
								onClick={handleGetCurrentLocation}
								className="absolute top-14 right-0 z-50 rounded-lg bg-blue-500 dark:bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-600 dark:hover:bg-blue-700"
							>
								{t("partnerForm.myLocation")}
							</button>
						</>
					) : (
						<div className="flex h-full items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg">
							<p className="text-gray-600 dark:text-gray-400">{t("partnerForm.loadingMap")}</p>
						</div>
					)}
				</div>
			</div>

			{/* Terms Agreement */}
			<div className="mt-8">
				<CheckBoxInput
					checked={formData.agreed}
					onChange={handleChange}
					label={t("partnerForm.agreeTerms")}
					isArabic={isArabic}
					name="agreed"
					href="/CondtionAterms"
					linkText={t("partnerForm.termsAndConditions")}
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
					{isSubmitting ? (isArabic ? "جاري الإرسال..." : "Submitting...") : t("partnerForm.submit")}
				</button>
				<button
					type="button"
					onClick={handleReset}
					disabled={isSubmitting}
					className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 py-3 font-semibold text-gray-500 dark:text-gray-300 shadow-sm transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{t("partnerForm.reset")}
				</button>
			</div>

			{/* Notification Dialog */}
			<NotificationDialog
				isArabic={isArabic}
				message={notification.message}
				type={notification.type}
				isVisible={notification.isVisible}
				onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
			/>
		</form>
	);
}
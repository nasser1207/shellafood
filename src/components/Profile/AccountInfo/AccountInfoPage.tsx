"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "./Header";
import { InfoCard, InfoField, SecurityAction } from "../UI";
import { FaUser, FaShieldAlt, FaLock, FaIdCard, FaTrash } from "react-icons/fa";

export default function AccountInfoPage() {
	const { language, t } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const [isEditing, setIsEditing] = useState(false);
	
	// Initial user data - replace with actual data from your API
	const initialUserData = {
		personalInfo: {
			fullName: isArabic ? "أحمد محمد العلي" : "Ahmed Mohammed Al-Ali",
			email: "ahmed.mohammed@example.com",
			phone: "+966501234567",
			dateOfBirth: isArabic ? "15/03/1990" : "03/15/1990",
			nationalId: "1234567890",
			address: isArabic ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"
		}
	};

	// State for form data
	const [formData, setFormData] = useState(initialUserData.personalInfo);

	const handleEdit = () => {
		setIsEditing(!isEditing);
	};

	const handleSave = () => {
		// Handle save logic here - you can add API call to save the data
		console.log('Saving data:', formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		// Reset form data to original values
		setFormData(initialUserData.personalInfo);
		setIsEditing(false);
	};

	const handleFieldChange = (field: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};


	return (
		<div className="min-h-screen bg-gray-50" dir={direction}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
				{/* Header */}
				<div className="mb-8">
					<Header 
						onEdit={handleEdit}
						onSettings={() => console.log('Settings clicked')}
					/>
				</div>

				{/* Personal Information */}
				<div className="mb-8">
					<InfoCard 
						title={isArabic ? "المعلومات الشخصية" : "Personal Information"}
						icon={FaUser}
					>
						<div className="space-y-4">
							<InfoField
								label={isArabic ? "الاسم الكامل" : "Full Name"}
								value={formData.fullName}
								editable={isEditing}
								onChange={(value) => handleFieldChange('fullName', value)}
							/>
							<InfoField
								label={isArabic ? "البريد الإلكتروني" : "Email Address"}
								value={formData.email}
								type="email"
								editable={isEditing}
								onChange={(value) => handleFieldChange('email', value)}
							/>
							<InfoField
								label={isArabic ? "رقم الهاتف" : "Phone Number"}
								value={formData.phone}
								type="tel"
								editable={isEditing}
								onChange={(value) => handleFieldChange('phone', value)}
							/>
							<InfoField
								label={isArabic ? "تاريخ الميلاد" : "Date of Birth"}
								value={formData.dateOfBirth}
								type="date"
								editable={isEditing}
								onChange={(value) => handleFieldChange('dateOfBirth', value)}
							/>
							<InfoField
								label={isArabic ? "رقم الهوية" : "National ID"}
								value={formData.nationalId}
								editable={false}
							/>
							<InfoField
								label={isArabic ? "العنوان" : "Address"}
								value={formData.address}
								editable={isEditing}
								onChange={(value) => handleFieldChange('address', value)}
							/>
						</div>
					</InfoCard>
				</div>

				{/* Edit Actions */}
				{isEditing && (
					<div className="mb-8">
						<div className="bg-green-50 border border-green-200 rounded-xl p-4">
							<div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 bg-green-500 rounded-full"></div>
									<span className="text-sm font-medium text-green-700">
										{isArabic ? "وضع التعديل نشط" : "Edit mode is active"}
									</span>
								</div>
								<div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
									<button
										onClick={handleCancel}
										className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
									>
										{isArabic ? "إلغاء" : "Cancel"}
									</button>
									<button
										onClick={handleSave}
										className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
									>
										{isArabic ? "حفظ" : "Save"}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Security Actions */}
				<div className="mt-8">
					<InfoCard 
						title={isArabic ? "إجراءات الأمان" : "Security Actions"}
						icon={FaShieldAlt}
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<SecurityAction
								icon={FaLock}
								title={isArabic ? "تغيير كلمة المرور" : "Change Password"}
								subtitle={isArabic ? "آخر تحديث: منذ شهر" : "Last updated: 1 month ago"}
								onClick={() => console.log('Change password clicked')}
							/>
							<SecurityAction
								icon={FaIdCard}
								title={isArabic ? "التحقق من الهوية" : "Identity Verification"}
								subtitle={isArabic ? "متحقق" : "Verified"}
								onClick={() => console.log('Identity verification clicked')}
							/>
							<SecurityAction
								icon={FaTrash}
								title={isArabic ? "حذف الحساب" : "Delete Account"}
								subtitle={isArabic ? "إجراء نهائي لا يمكن التراجع عنه" : "Permanent action, cannot be undone"}
								onClick={() => console.log('Delete account clicked')}
								isDanger={true}
							/>
						</div>
					</InfoCard>
				</div>
			</div>
		</div>
	);
}

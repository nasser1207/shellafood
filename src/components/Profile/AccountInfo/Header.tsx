"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaUser, FaEdit, FaCog } from "react-icons/fa";

interface HeaderProps {
	onEdit?: () => void;
	onSettings?: () => void;
}

export default function Header({ onEdit, onSettings }: HeaderProps) {
	const { language, t } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8" dir={direction}>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				{/* Title Section */}
				<div className="flex items-center gap-4">
					<div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
						<FaUser className="text-green-600 text-xl" />
					</div>
					<div>
						<h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
							{t("profile.dashboard.accountInfo")}
						</h1>
						<p className="text-gray-600 text-sm lg:text-base mt-1">
							{isArabic 
								? "إدارة معلوماتك الشخصية وإعدادات الحساب" 
								: "Manage your personal information and account settings"
							}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className={`flex gap-3 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
					{onEdit && (
						<button
							onClick={onEdit}
							className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
						>
							<FaEdit className="text-sm" />
							<span>{isArabic ? "تعديل" : "Edit"}</span>
						</button>
					)}
					{onSettings && (
						<button
							onClick={onSettings}
							className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
						>
							<FaCog className="text-sm" />
							<span>{isArabic ? "الإعدادات" : "Settings"}</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

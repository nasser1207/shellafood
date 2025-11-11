"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaMapMarkerAlt, FaPlus, FaCog } from "react-icons/fa";

interface HeaderProps {
	onAddAddress?: () => void;
	onSettings?: () => void;
}

export default function Header({ onAddAddress, onSettings }: HeaderProps) {
	const { language, t } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8" dir={direction}>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				{/* Title Section */}
				<div className="flex items-center gap-4">
					<div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
						<FaMapMarkerAlt className="text-green-600 text-xl" />
					</div>
					<div>
						<h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
							{isArabic ? "العناوين المحفوظة" : "Saved Addresses"}
						</h1>
						<p className="text-gray-600 text-sm lg:text-base mt-1">
							{isArabic 
								? "إدارة عناوين التوصيل والاستلام المحفوظة" 
								: "Manage your saved delivery and pickup addresses"
							}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className={`flex gap-3 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
					{onAddAddress && (
						<button
							onClick={onAddAddress}
							className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
						>
							<FaPlus className="text-sm" />
							<span>{isArabic ? "إضافة عنوان" : "Add Address"}</span>
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

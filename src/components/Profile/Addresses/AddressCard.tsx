"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaHome, FaBuilding, FaStore, FaCheck, FaEye } from "react-icons/fa";

interface Address {
	id: string;
	type: string;
	title: string;
	address: string;
	details: string;
	phone: string;
	isDefault: boolean;
	coordinates: { lat: number; lng: number };
}

interface AddressCardProps {
	address: Address;
	onEdit: (addressId: string) => void;
	onDelete: (addressId: string) => void;
	onSetDefault: (addressId: string) => void;
	onViewMap: (address: Address) => void;
}

export default function AddressCard({ address, onEdit, onDelete, onSetDefault, onViewMap }: AddressCardProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const [isEditing, setIsEditing] = useState(false);

	const getAddressIcon = (type: string) => {
		switch (type) {
			case "home":
				return FaHome;
			case "work":
				return FaBuilding;
			case "store":
				return FaStore;
			default:
				return FaMapMarkerAlt;
		}
	};

	const getAddressTypeColor = (type: string) => {
		switch (type) {
			case "home":
				return "bg-blue-100 text-blue-600";
			case "work":
				return "bg-purple-100 text-purple-600";
			case "store":
				return "bg-orange-100 text-orange-600";
			default:
				return "bg-gray-100 text-gray-600";
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
		onEdit(address.id);
	};

	const handleDelete = () => {
		if (window.confirm(isArabic ? "هل أنت متأكد من حذف هذا العنوان؟" : "Are you sure you want to delete this address?")) {
			onDelete(address.id);
		}
	};

	const handleSetDefault = () => {
		onSetDefault(address.id);
	};

	const handleViewMap = () => {
		onViewMap(address);
	};

	const Icon = getAddressIcon(address.type);

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6 hover:shadow-md transition-all duration-200 hover:border-green-200 dark:hover:border-green-800 w-full overflow-x-hidden" dir={direction}>
			{/* Address Header */}
			<div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-5 gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
				<div className={`flex items-start gap-3 flex-1 min-w-0 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
					<div className={`h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl flex items-center justify-center ${getAddressTypeColor(address.type)} shadow-sm flex-shrink-0`}>
						<Icon className="text-base sm:text-lg md:text-xl" />
					</div>
					<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
						<div className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
							<h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg md:text-xl truncate">
								{address.title}
							</h3>
							{address.isDefault && (
								<span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap">
									{isArabic ? "افتراضي" : "Default"}
								</span>
							)}
						</div>
						<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed line-clamp-2">
							{address.address}
						</p>
					</div>
				</div>
				
				{/* Action Buttons */}
				<div className={`flex gap-2 self-end sm:self-auto ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
					<button
						onClick={handleEdit}
						className="p-2.5 sm:p-2.5 md:p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
						title={isArabic ? "تعديل" : "Edit"}
						aria-label={isArabic ? "تعديل" : "Edit"}
					>
						<FaEdit className="text-sm sm:text-base" />
					</button>
					<button
						onClick={handleDelete}
						className="p-2.5 sm:p-2.5 md:p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
						title={isArabic ? "حذف" : "Delete"}
						aria-label={isArabic ? "حذف" : "Delete"}
					>
						<FaTrash className="text-sm sm:text-base" />
					</button>
				</div>
			</div>

			{/* Address Details */}
			<div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5 md:mb-6">
				<div className={`flex items-start gap-2.5 sm:gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
					<div className="h-8 w-8 sm:h-9 sm:w-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
						<FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm" />
					</div>
					<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
						<p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium mb-1">
							{isArabic ? "العنوان التفصيلي:" : "Detailed Address:"}
						</p>
						<p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
							{address.details}
						</p>
					</div>
				</div>
				<div className={`flex items-center gap-2.5 sm:gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
					<div className="h-8 w-8 sm:h-9 sm:w-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
						<FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm" />
					</div>
					<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
						<p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium mb-1">
							{isArabic ? "رقم الهاتف:" : "Phone Number:"}
						</p>
						<p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
							{address.phone}
						</p>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className={`flex flex-col sm:flex-row gap-2.5 sm:gap-3 ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
				{!address.isDefault && (
					<button
						onClick={handleSetDefault}
						className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 md:py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-medium text-xs sm:text-sm touch-manipulation min-h-[44px] sm:min-h-0 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
					>
						<FaCheck className="text-xs sm:text-sm" />
						<span>{isArabic ? "تعيين كافتراضي" : "Set as Default"}</span>
					</button>
				)}
				<button
					onClick={handleViewMap}
					className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 md:py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-xs sm:text-sm touch-manipulation min-h-[44px] sm:min-h-0 flex-1 sm:flex-initial ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
				>
					<FaEye className="text-xs sm:text-sm" />
					<span>{isArabic ? "عرض على الخريطة" : "View on Map"}</span>
				</button>
			</div>
		</div>
	);
}

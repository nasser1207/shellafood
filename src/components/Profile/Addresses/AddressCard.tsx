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
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:border-green-200" dir={direction}>
			{/* Address Header */}
			<div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3 ${isArabic ? 'flex-row' : 'sm:flex-row'}`}>
				<div className={`flex items-center gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
					<div className={`h-12 w-12 sm:h-10 sm:w-10 rounded-xl sm:rounded-lg flex items-center justify-center ${getAddressTypeColor(address.type)} shadow-sm`}>
						<Icon className="text-lg sm:text-lg" />
					</div>
					<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
						<div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 ${isArabic ? 'sm:flex-row' : 'sm:flex-row'}`}>
							<h3 className="font-semibold text-gray-900 text-lg sm:text-lg truncate">
								{address.title}
							</h3>
							{address.isDefault && (
								<span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium w-fit">
									{isArabic ? "افتراضي" : "Default"}
								</span>
							)}
						</div>
						<p className="text-gray-600 text-sm sm:text-sm leading-relaxed">
							{address.address}
						</p>
					</div>
				</div>
				
				{/* Action Buttons */}
				<div className={`flex gap-2 self-end sm:self-auto ${isArabic ? 'flex-row' : 'flex-row'}`}>
					<button
						onClick={handleEdit}
						className="p-2.5 sm:p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
						title={isArabic ? "تعديل" : "Edit"}
					>
						<FaEdit className="text-sm" />
					</button>
					<button
						onClick={handleDelete}
						className="p-2.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
						title={isArabic ? "حذف" : "Delete"}
					>
						<FaTrash className="text-sm" />
					</button>
				</div>
			</div>

			{/* Address Details */}
			<div className="space-y-3 mb-6">
				<div className={`flex items-start gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
					<div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
						<FaMapMarkerAlt className="text-gray-500 text-sm" />
					</div>
					<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
						<p className="text-gray-700 text-sm font-medium mb-1">
							{isArabic ? "العنوان التفصيلي:" : "Detailed Address:"}
						</p>
						<p className="text-gray-600 text-sm leading-relaxed">
							{address.details}
						</p>
					</div>
				</div>
				<div className={`flex items-center gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
					<div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
						<FaMapMarkerAlt className="text-gray-500 text-sm" />
					</div>
					<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
						<p className="text-gray-700 text-sm font-medium mb-1">
							{isArabic ? "رقم الهاتف:" : "Phone Number:"}
						</p>
						<p className="text-gray-600 text-sm">
							{address.phone}
						</p>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className={`flex flex-col sm:flex-row gap-3 ${isArabic ? 'sm:flex-row' : 'sm:flex-row'}`}>
				{!address.isDefault && (
					<button
						onClick={handleSetDefault}
						className={`flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm touch-manipulation ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
					>
						<FaCheck className="text-xs" />
						<span>{isArabic ? "تعيين كافتراضي" : "Set as Default"}</span>
					</button>
				)}
				<button
					onClick={handleViewMap}
					className={`flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm touch-manipulation ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
				>
					<FaEye className="text-xs" />
					<span>{isArabic ? "عرض على الخريطة" : "View on Map"}</span>
				</button>
			</div>
		</div>
	);
}

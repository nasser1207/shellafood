"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaTimes, FaMapMarkerAlt, FaHome, FaBuilding, FaStore, FaSave, FaMap } from "react-icons/fa";
import MapSelectionModal from "./MapSelectionModal";

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

interface AddEditAddressModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (address: Omit<Address, 'id'>) => void;
	editingAddress?: Address | null;
}

export default function AddEditAddressModal({ isOpen, onClose, onSave, editingAddress }: AddEditAddressModalProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const [formData, setFormData] = useState({
		type: "home",
		title: "",
		address: "",
		details: "",
		phone: "",
		isDefault: false
	});
	const [isMapModalOpen, setIsMapModalOpen] = useState(false);
	const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

	useEffect(() => {
		if (editingAddress) {
			setFormData({
				type: editingAddress.type,
				title: editingAddress.title,
				address: editingAddress.address,
				details: editingAddress.details,
				phone: editingAddress.phone,
				isDefault: editingAddress.isDefault
			});
			setSelectedCoordinates(editingAddress.coordinates);
		} else {
			setFormData({
				type: "home",
				title: "",
				address: "",
				details: "",
				phone: "",
				isDefault: false
			});
			setSelectedCoordinates(null);
		}
	}, [editingAddress, isOpen]);

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleMapSelection = (addressData: { address: string; details: string; coordinates: { lat: number; lng: number } }) => {
		setFormData(prev => ({
			...prev,
			address: addressData.address,
			details: addressData.details || prev.details // Keep existing details if map selection doesn't provide one
		}));
		setSelectedCoordinates(addressData.coordinates);
		setIsMapModalOpen(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			...formData,
			coordinates: selectedCoordinates || { lat: 24.7136, lng: 46.6753 } // Use selected coordinates or default
		});
		onClose();
	};

	const addressTypes = [
		{ value: "home", label: isArabic ? "المنزل" : "Home", icon: FaHome },
		{ value: "work", label: isArabic ? "العمل" : "Work", icon: FaBuilding },
		{ value: "store", label: isArabic ? "المتجر" : "Store", icon: FaStore },
		{ value: "other", label: isArabic ? "أخرى" : "Other", icon: FaMapMarkerAlt }
	];

	if (!isOpen) return null;

	return (
		<div 
			className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200" 
			dir={direction}
			onClick={onClose}
		>
			<div 
				className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Mobile Drag Handle */}
				<div className="sm:hidden w-full pt-3 pb-2 flex justify-center flex-shrink-0">
					<div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
				</div>

				{/* Modal Header - Sticky */}
				<div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0 shadow-sm">
					<h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
						{editingAddress 
							? (isArabic ? "تعديل العنوان" : "Edit Address")
							: (isArabic ? "إضافة عنوان جديد" : "Add New Address")
						}
					</h2>
					<button
						onClick={onClose}
						className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 rounded-xl transition-all touch-manipulation"
						aria-label={isArabic ? "إغلاق" : "Close"}
					>
						<FaTimes className="text-lg sm:text-xl" />
					</button>
				</div>

				{/* Modal Body - Scrollable */}
				<form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6 flex-1 overflow-y-auto">
					{/* Address Type */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
							{isArabic ? "نوع العنوان" : "Address Type"}
						</label>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
							{addressTypes.map((type) => {
								const Icon = type.icon;
								return (
									<button
										key={type.value}
										type="button"
										onClick={() => handleInputChange('type', type.value)}
										className={`flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 touch-manipulation ${
											formData.type === type.value
												? 'border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm'
												: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
										}`}
									>
										<Icon className="text-lg sm:text-xl mb-2" />
										<span className="text-xs sm:text-sm font-medium text-center">{type.label}</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* Address Title */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{isArabic ? "عنوان العنوان" : "Address Title"}
						</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) => handleInputChange('title', e.target.value)}
							placeholder={isArabic ? "مثال: المنزل، العمل، إلخ" : "e.g., Home, Work, etc."}
							className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
							required
							dir={direction}
						/>
					</div>

					{/* Main Address - Mobile Optimized */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{isArabic ? "العنوان الرئيسي" : "Main Address"}
						</label>
						{/* Map Selection Button - Prominent on Mobile */}
						<button
							type="button"
							onClick={() => setIsMapModalOpen(true)}
							className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-4 py-3.5 sm:py-2.5 mb-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 active:scale-[0.98] transition-all text-sm sm:text-xs font-semibold shadow-lg hover:shadow-xl touch-manipulation"
						>
							<FaMap className="text-base sm:text-sm" />
							<span>{isArabic ? "اختيار من الخريطة" : "Select from Map"}</span>
						</button>
						<textarea
							value={formData.address}
							onChange={(e) => handleInputChange('address', e.target.value)}
							placeholder={isArabic ? "أدخل العنوان الرئيسي أو اختر من الخريطة" : "Enter main address or select from map"}
							rows={3}
							className="w-full px-4 py-3 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
							required
							dir={direction}
						/>
						{/* Selected Location Indicator */}
						{selectedCoordinates && (
							<div className="mt-2 flex items-center gap-2 text-xs text-green-600 font-medium">
								<FaMapMarkerAlt className="text-xs" />
								<span>{isArabic ? "تم تحديد الموقع على الخريطة" : "Location selected on map"}</span>
							</div>
						)}
					</div>

					{/* Address Details */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{isArabic ? "تفاصيل إضافية" : "Additional Details"}
						</label>
						<textarea
							value={formData.details}
							onChange={(e) => handleInputChange('details', e.target.value)}
							placeholder={isArabic ? "رقم المبنى، الطابق، رقم الشقة، إلخ" : "Building number, floor, apartment number, etc."}
							rows={2}
							className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
							dir={direction}
						/>
					</div>

					{/* Phone Number */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{isArabic ? "رقم الهاتف" : "Phone Number"}
						</label>
						<input
							type="tel"
							value={formData.phone}
							onChange={(e) => handleInputChange('phone', e.target.value)}
							placeholder={isArabic ? "+966501234567" : "+966501234567"}
							className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
							required
							dir={direction}
						/>
					</div>

					{/* Set as Default */}
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="isDefault"
							checked={formData.isDefault}
							onChange={(e) => handleInputChange('isDefault', e.target.checked)}
							className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
						/>
						<label htmlFor="isDefault" className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{isArabic ? "تعيين كعنوان افتراضي" : "Set as default address"}
						</label>
					</div>

					{/* Modal Footer - Sticky on Mobile */}
					<div className={`flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0 z-10 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-3.5 sm:py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all touch-manipulation shadow-sm"
						>
							{isArabic ? "إلغاء" : "Cancel"}
						</button>
						<button
							type="submit"
							className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 sm:py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] transition-all touch-manipulation shadow-lg hover:shadow-xl"
						>
							<FaSave className="text-base sm:text-sm" />
							<span>{isArabic ? "حفظ" : "Save"}</span>
						</button>
					</div>
				</form>
			</div>

			{/* Map Selection Modal */}
			<MapSelectionModal
				isOpen={isMapModalOpen}
				onClose={() => setIsMapModalOpen(false)}
				onSelectAddress={handleMapSelection}
			/>
		</div>
	);
}

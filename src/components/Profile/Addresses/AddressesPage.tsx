"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAddresses, type Address } from "@/hooks/useAddresses";
import Header from "./Header";
import AddressCard from "./AddressCard";
import AddEditAddressModal from "./AddEditAddressModal";
import MapModal from "./MapModal";
import { InfoCard } from "../UI";
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa";

export default function AddressesPage() {
	const { language, t } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const {
		addresses,
		addAddress,
		updateAddress,
		deleteAddress,
		setDefaultAddress,
	} = useAddresses();

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isMapModalOpen, setIsMapModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [viewingAddress, setViewingAddress] = useState<Address | null>(null);

	const handleEditAddress = (addressId: string) => {
		const address = addresses.find(addr => addr.id === addressId);
		if (address) {
			setEditingAddress(address);
			setIsEditModalOpen(true);
		}
	};

	const handleDeleteAddress = (addressId: string) => {
		if (window.confirm(isArabic ? "هل أنت متأكد من حذف هذا العنوان؟" : "Are you sure you want to delete this address?")) {
			deleteAddress(addressId);
		}
	};

	const handleSetDefault = (addressId: string) => {
		setDefaultAddress(addressId);
	};

	const handleAddAddress = () => {
		setIsAddModalOpen(true);
	};

	const handleViewMap = (address: Address) => {
		setViewingAddress(address);
		setIsMapModalOpen(true);
	};

	const handleSaveAddress = (addressData: Omit<Address, 'id'>) => {
		if (editingAddress) {
			// Edit existing address
			updateAddress(editingAddress.id, addressData);
			setIsEditModalOpen(false);
			setEditingAddress(null);
		} else {
			// Add new address
			addAddress(addressData);
			setIsAddModalOpen(false);
		}
	};

	const handleCloseModals = () => {
		setIsAddModalOpen(false);
		setIsEditModalOpen(false);
		setIsMapModalOpen(false);
		setEditingAddress(null);
		setViewingAddress(null);
	};


	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full overflow-x-hidden">
				{/* Header */}
				<div className="mb-4 sm:mb-6 md:mb-8">
					<Header
						onAddAddress={handleAddAddress}
						onSettings={() => console.log('Settings clicked')}
					/>
				</div>

				{/* Addresses List */}
				<div className="space-y-3 sm:space-y-4 md:space-y-6">
					{addresses.length > 0 ? (
						addresses.map((address) => (
							<AddressCard 
								key={address.id} 
								address={address}
								onEdit={handleEditAddress}
								onDelete={handleDeleteAddress}
								onSetDefault={handleSetDefault}
								onViewMap={handleViewMap}
							/>
						))
					) : (
						<InfoCard 
							title={isArabic ? "لا توجد عناوين محفوظة" : "No Saved Addresses"}
							icon={FaMapMarkerAlt}
						>
							<div className="text-center py-6 sm:py-8">
								<div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
									<FaMapMarkerAlt className="text-gray-400 dark:text-gray-500 text-2xl" />
								</div>
								<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
									{isArabic ? "لم تقم بحفظ أي عناوين بعد" : "You haven't saved any addresses yet"}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
									{isArabic 
										? "أضف عنوانك الأول لتسهيل عملية التوصيل" 
										: "Add your first address to make delivery easier"
									}
								</p>
								<button
									onClick={handleAddAddress}
									className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium mx-auto touch-manipulation"
								>
									<FaPlus className="text-sm" />
									<span>{isArabic ? "إضافة عنوان جديد" : "Add New Address"}</span>
								</button>
							</div>
						</InfoCard>
					)}
				</div>

				{/* Modals */}
				<AddEditAddressModal
					isOpen={isAddModalOpen}
					onClose={handleCloseModals}
					onSave={handleSaveAddress}
				/>

				<AddEditAddressModal
					isOpen={isEditModalOpen}
					onClose={handleCloseModals}
					onSave={handleSaveAddress}
					editingAddress={editingAddress}
				/>

				<MapModal
					isOpen={isMapModalOpen}
					onClose={handleCloseModals}
					address={viewingAddress}
				/>
			</div>
		</div>
	);
}

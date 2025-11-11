"use client";

import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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

	// Mock addresses data - replace with actual data from your API
	const initialAddresses = useMemo(() => [
		{
			id: "1",
			type: "home",
			title: isArabic ? "المنزل" : "Home",
			address: isArabic ? "شارع الملك فهد، حي النخيل، الرياض 12345" : "King Fahd Street, Al-Nakheel District, Riyadh 12345",
			details: isArabic ? "مبنى رقم 123، الطابق الثاني، شقة 45" : "Building 123, 2nd Floor, Apartment 45",
			phone: "+966501234567",
			isDefault: true,
			coordinates: { lat: 24.7136, lng: 46.6753 }
		},
		{
			id: "2",
			type: "work",
			title: isArabic ? "العمل" : "Work",
			address: isArabic ? "شارع العليا، حي العليا، الرياض 12211" : "Al-Olaya Street, Al-Olaya District, Riyadh 12211",
			details: isArabic ? "مبنى المكاتب التجارية، الطابق العاشر" : "Commercial Office Building, 10th Floor",
			phone: "+966501234568",
			isDefault: false,
			coordinates: { lat: 24.6877, lng: 46.7219 }
		},
		{
			id: "3",
			type: "other",
			title: isArabic ? "عنوان آخر" : "Other Address",
			address: isArabic ? "شارع التحلية، حي التحلية، جدة 21432" : "Al-Tahlia Street, Al-Tahlia District, Jeddah 21432",
			details: isArabic ? "فيلا رقم 67" : "Villa 67",
			phone: "+966501234569",
			isDefault: false,
			coordinates: { lat: 21.4858, lng: 39.1925 }
		}
	], [isArabic]);

	const [addresses, setAddresses] = useState(initialAddresses);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isMapModalOpen, setIsMapModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<typeof initialAddresses[0] | null>(null);
	const [viewingAddress, setViewingAddress] = useState<typeof initialAddresses[0] | null>(null);

	// Update addresses when language changes
	useEffect(() => {
		setAddresses(initialAddresses);
	}, [initialAddresses]);

	const handleEditAddress = (addressId: string) => {
		const address = addresses.find(addr => addr.id === addressId);
		if (address) {
			setEditingAddress(address);
			setIsEditModalOpen(true);
		}
	};

	const handleDeleteAddress = (addressId: string) => {
		if (window.confirm(isArabic ? "هل أنت متأكد من حذف هذا العنوان؟" : "Are you sure you want to delete this address?")) {
			setAddresses(prev => prev.filter(addr => addr.id !== addressId));
		}
	};

	const handleSetDefault = (addressId: string) => {
		setAddresses(prev => prev.map(addr => ({
			...addr,
			isDefault: addr.id === addressId
		})));
	};

	const handleAddAddress = () => {
		setIsAddModalOpen(true);
	};

	const handleViewMap = (address: typeof initialAddresses[0]) => {
		setViewingAddress(address);
		setIsMapModalOpen(true);
	};

	const handleSaveAddress = (addressData: Omit<typeof initialAddresses[0], 'id'>) => {
		if (editingAddress) {
			// Edit existing address
			setAddresses(prev => prev.map(addr => 
				addr.id === editingAddress.id 
					? { ...addressData, id: editingAddress.id }
					: addr
			));
			setIsEditModalOpen(false);
			setEditingAddress(null);
		} else {
			// Add new address
			const newAddress = {
				...addressData,
				id: Date.now().toString() // Simple ID generation
			};
			setAddresses(prev => [...prev, newAddress]);
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
		<div className="min-h-screen bg-gray-50" dir={direction}>
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				{/* Header */}
				<div className="mb-6 sm:mb-8">
					<Header
						onAddAddress={handleAddAddress}
						onSettings={() => console.log('Settings clicked')}
					/>
				</div>

				{/* Addresses List */}
				<div className="space-y-4 sm:space-y-6">
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
								<div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<FaMapMarkerAlt className="text-gray-400 text-2xl" />
								</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									{isArabic ? "لم تقم بحفظ أي عناوين بعد" : "You haven't saved any addresses yet"}
								</h3>
								<p className="text-gray-600 text-sm mb-6 leading-relaxed">
									{isArabic 
										? "أضف عنوانك الأول لتسهيل عملية التوصيل" 
										: "Add your first address to make delivery easier"
									}
								</p>
								<button
									onClick={handleAddAddress}
									className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mx-auto touch-manipulation"
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

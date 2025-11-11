"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Plus, Check, X, ChevronDown, Radio } from "lucide-react";
import { AddEditAddressModal, MapModal } from "@/components/Profile/Addresses";
import { reverseGeocode } from "@/lib/maps/utils";

interface Address {
	id: string;
	address: string;
	formattedAddress?: string;
	createdAt: string;
	lat?: number;
	lng?: number;
}

interface AddressSelectorProps {
	language: "en" | "ar";
	selectedAddressId?: string;
	onAddressSelect: (addressId: string) => void;
}

export default function AddressSelector({
	language,
	selectedAddressId,
	onAddressSelect,
}: AddressSelectorProps) {
	const { language: contextLanguage } = useLanguage();
	const isArabic = (language || contextLanguage) === "ar";
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showAddressList, setShowAddressList] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showMapModal, setShowMapModal] = useState(false);
	const [selectedAddressForMap, setSelectedAddressForMap] = useState<Address | null>(null);

	useEffect(() => {
		fetchAddresses();
	}, []);

	const fetchAddresses = async () => {
		setIsLoading(true);
		try {
			const { getAddressesAction } = await import("@/app/actions/address");
			const result = await getAddressesAction();
			if (!result.success) {
				console.error("Failed to fetch addresses:", result.error);
				return;
			}

			const addressesData = result.data?.addresses || [];

			const transformedAddresses: Address[] = addressesData.map((addr: any) => {
				try {
					const [lat, lng] = addr.address.split(",").map(Number);
					if (!isNaN(lat) && !isNaN(lng)) {
						return {
							...addr,
							lat,
							lng,
							formattedAddress: addr.formattedAddress || addr.address,
						};
					}
					return {
						...addr,
						formattedAddress: addr.address,
					};
				} catch {
					return {
						...addr,
						formattedAddress: addr.address,
					};
				}
			});

			setAddresses(transformedAddresses);

			if (transformedAddresses.length > 0 && !selectedAddressId) {
				const firstAddr = transformedAddresses[0];
				onAddressSelect(firstAddr.id);

				if (firstAddr.lat && firstAddr.lng && !firstAddr.formattedAddress) {
					try {
						const { address } = await reverseGeocode(firstAddr.lat, firstAddr.lng, isArabic ? "ar" : "en");
						const updated = { ...firstAddr, formattedAddress: address };
						setAddresses((prev) =>
							prev.map((a) => (a.id === firstAddr.id ? updated : a))
						);
					} catch (error) {
						console.error("Error geocoding address:", error);
					}
				}
			}
		} catch (error) {
			console.error("Error fetching addresses:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddressSave = async (addressData: Omit<any, "id">) => {
		try {
			const coordinates = addressData.coordinates;
			const addressString = `${coordinates.lat},${coordinates.lng}`;

			const { addAddressAction } = await import("@/app/actions/address");
			const result = await addAddressAction({ address: addressString });

			if (result.success) {
				await fetchAddresses();
				setShowAddModal(false);
			} else {
				console.error("Failed to add address:", result.error);
			}
		} catch (error) {
			console.error("Error saving address:", error);
		}
	};

	const handleDeleteAddress = async (addressId: string) => {
		try {
			const { deleteAddressAction } = await import("@/app/actions/address");
			const result = await deleteAddressAction(addressId);

			if (result.success) {
				await fetchAddresses();
				if (selectedAddressId === addressId) {
					const remaining = addresses.filter((a) => a.id !== addressId);
					if (remaining.length > 0) {
						onAddressSelect(remaining[0].id);
					}
				}
			}
		} catch (error) {
			console.error("Error deleting address:", error);
		}
	};

	const handleViewOnMap = (address: Address) => {
		setSelectedAddressForMap(address);
		setShowMapModal(true);
	};

	const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5"
			>
				<div className={`flex items-center justify-between mb-4`}>
					<div className="flex items-center gap-2">
						<MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
						<h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? "عنوان التوصيل" : "Delivery Address"}
						</h3>
					</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setShowAddModal(true)}
						className={`flex items-center gap-2 px-3 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors text-sm font-semibold ${isArabic ? "flex-row-reverse" : ""}`}
					>
						<Plus className="w-4 h-4" />
						<span>{isArabic ? "إضافة عنوان" : "Add Address"}</span>
					</motion.button>
				</div>

				{isLoading ? (
					<div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
				) : selectedAddress ? (
					<div className="space-y-3">
						{/* Selected Address Card with Radio */}
						<motion.div
							whileHover={{ scale: 1.01 }}
							onClick={() => addresses.length > 1 && setShowAddressList(true)}
							className={`p-4 border-2 border-emerald-500 dark:border-emerald-600 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 cursor-pointer transition-all hover:shadow-md ${isArabic ? "text-right" : "text-left"}`}
						>
							<div className={`flex items-start justify-between gap-3`}>
								<div className="flex-1 min-w-0">
									<div className={`flex items-center gap-2 mb-2`}>
										<div className="w-5 h-5 rounded-full border-2 border-emerald-600 dark:border-emerald-500 flex items-center justify-center flex-shrink-0">
											<div className="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-500" />
										</div>
										<span className="font-semibold text-gray-900 dark:text-gray-100">
											{isArabic ? "العنوان المحدد" : "Selected Address"}
										</span>
									</div>
									<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
										{selectedAddress.formattedAddress || selectedAddress.address}
									</p>
									{selectedAddress.lat && selectedAddress.lng && (
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
											{selectedAddress.lat.toFixed(6)}, {selectedAddress.lng.toFixed(6)}
										</p>
									)}
								</div>
								{addresses.length > 1 && (
									<ChevronDown
										className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 ${
											showAddressList ? "rotate-180" : ""
										}`}
									/>
								)}
							</div>
						</motion.div>

						{/* Quick Actions */}
						{selectedAddress.lat && selectedAddress.lng && (
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => handleViewOnMap(selectedAddress)}
								className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium ${isArabic ? "flex-row-reverse" : ""}`}
							>
								<MapPin className="w-4 h-4" />
								<span>{isArabic ? "عرض على الخريطة" : "View on Map"}</span>
							</motion.button>
						)}
					</div>
				) : (
					<div className={`text-center py-8 ${isArabic ? "text-right" : "text-left"}`}>
						<MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
							{isArabic ? "لا توجد عناوين متاحة" : "No addresses available"}
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowAddModal(true)}
							className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
						>
							{isArabic ? "إضافة عنوان جديد" : "Add New Address"}
						</motion.button>
					</div>
				)}
			</motion.div>

			{/* Address List Modal with Radio Selection */}
			<AnimatePresence>
				{showAddressList && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
							onClick={() => setShowAddressList(false)}
						/>
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
							<motion.div
								initial={{ opacity: 0, scale: 0.9, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.9, y: 20 }}
								className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden pointer-events-auto border border-gray-200 dark:border-gray-700 ${isArabic ? "rtl" : "ltr"}`}
								dir={isArabic ? "rtl" : "ltr"}
								onClick={(e) => e.stopPropagation()}
							>
								{/* Header */}
								<div className={`p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 ${isArabic ? "flex-row-reverse" : ""}`}>
									<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
										{isArabic ? "اختر العنوان" : "Select Address"}
									</h3>
									<motion.button
										whileHover={{ scale: 1.1, rotate: 90 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => setShowAddressList(false)}
										className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 shadow-sm"
									>
										<X className="w-5 h-5" />
									</motion.button>
								</div>

								{/* Address List with Radio Cards */}
								<div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-3">
									<AnimatePresence>
										{addresses.map((address, index) => {
											const isSelected = selectedAddressId === address.id;
											return (
												<motion.div
													key={address.id}
													initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
													animate={{ opacity: 1, x: 0 }}
													exit={{ opacity: 0, x: isArabic ? -20 : 20 }}
													transition={{ duration: 0.2, delay: index * 0.05 }}
													onClick={() => {
														onAddressSelect(address.id);
														setShowAddressList(false);
													}}
													className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
														isSelected
															? "border-emerald-500 dark:border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 shadow-md"
															: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:shadow-sm"
													} ${isArabic ? "text-right" : "text-left"}`}
												>
													<div className={`flex items-start justify-between gap-3`}>
														<div className="flex-1 min-w-0">
															<div className={`flex items-center gap-3 mb-2`}>
																<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
																	isSelected
																		? "border-emerald-600 dark:border-emerald-500"
																		: "border-gray-300 dark:border-gray-600"
																}`}>
																	{isSelected && (
																		<motion.div
																			initial={{ scale: 0 }}
																			animate={{ scale: 1 }}
																			className="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-500"
																		/>
																	)}
																</div>
																<span className="font-semibold text-gray-900 dark:text-gray-100">
																	{isArabic ? "العنوان" : "Address"}
																</span>
															</div>
															<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
																{address.formattedAddress || address.address}
															</p>
															{address.lat && address.lng && (
																<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
																	{address.lat.toFixed(6)}, {address.lng.toFixed(6)}
																</p>
															)}
														</div>
														{isSelected && (
															<motion.div
																initial={{ scale: 0 }}
																animate={{ scale: 1 }}
																className="w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center flex-shrink-0"
															>
																<Check className="w-4 h-4 text-white" />
															</motion.div>
														)}
													</div>

													{/* Actions */}
													<div className={`flex items-center gap-2 mt-3 ${isArabic ? "flex-row-reverse justify-start" : ""}`}>
														{address.lat && address.lng && (
															<motion.button
																whileHover={{ scale: 1.05 }}
																whileTap={{ scale: 0.95 }}
																onClick={(e) => {
																	e.stopPropagation();
																	handleViewOnMap(address);
																	setShowAddressList(false);
																}}
																className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
															>
																{isArabic ? "خريطة" : "Map"}
															</motion.button>
														)}
														{addresses.length > 1 && (
															<motion.button
																whileHover={{ scale: 1.05 }}
																whileTap={{ scale: 0.95 }}
																onClick={(e) => {
																	e.stopPropagation();
																	if (window.confirm(isArabic ? "هل أنت متأكد من حذف هذا العنوان؟" : "Are you sure you want to delete this address?")) {
																		handleDeleteAddress(address.id);
																	}
																}}
																className="px-3 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors"
															>
																{isArabic ? "حذف" : "Delete"}
															</motion.button>
														)}
													</div>
												</motion.div>
											);
										})}
									</AnimatePresence>
								</div>

								{/* Footer */}
								<div className={`p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => {
											setShowAddressList(false);
											setShowAddModal(true);
										}}
										className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${isArabic ? "flex-row-reverse" : ""}`}
									>
										<Plus className="w-5 h-5" />
										<span>{isArabic ? "إضافة عنوان جديد" : "Add New Address"}</span>
									</motion.button>
								</div>
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>

			{/* Add/Edit Address Modal */}
			<AddEditAddressModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSave={handleAddressSave}
				editingAddress={null}
			/>

			{/* Map Modal */}
			{selectedAddressForMap && (
				<MapModal
					isOpen={showMapModal}
					onClose={() => {
						setShowMapModal(false);
						setSelectedAddressForMap(null);
					}}
					address={{
						id: selectedAddressForMap.id,
						type: "home",
						title: isArabic ? "العنوان" : "Address",
						address: selectedAddressForMap.formattedAddress || selectedAddressForMap.address,
						details: "",
						phone: "",
						isDefault: false,
						coordinates: selectedAddressForMap.lat && selectedAddressForMap.lng
							? { lat: selectedAddressForMap.lat, lng: selectedAddressForMap.lng }
							: { lat: 24.7136, lng: 46.6753 },
					}}
				/>
			)}
		</>
	);
}

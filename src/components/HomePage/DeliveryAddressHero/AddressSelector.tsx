"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Clock, X, Plus, ChevronDown, Check, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAddresses, type Address } from "@/hooks/useAddresses";
import { AddEditAddressModal, MapModal } from "@/components/Profile/Addresses";

interface AddressSelectorProps {
	onAddressChange?: (address: Address | null) => void;
}

export default function AddressSelector({ onAddressChange }: AddressSelectorProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const {
		addresses,
		defaultAddress,
		addAddress,
		updateAddress,
		deleteAddress,
		setDefaultAddress,
	} = useAddresses();

	const [selectedAddress, setSelectedAddress] = useState<Address | null>(defaultAddress);
	const [address, setAddress] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [showAddressList, setShowAddressList] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showMapModal, setShowMapModal] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [viewingAddress, setViewingAddress] = useState<Address | null>(null);

	// Update selected address when default changes
	useEffect(() => {
		if (defaultAddress && !selectedAddress) {
			setSelectedAddress(defaultAddress);
			onAddressChange?.(defaultAddress);
		}
	}, [defaultAddress, selectedAddress, onAddressChange]);

	// Update parent when selected address changes
	useEffect(() => {
		if (selectedAddress) {
			onAddressChange?.(selectedAddress);
		}
	}, [selectedAddress, onAddressChange]);

	const handleDetectLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const detectedAddress: Address = {
						id: "detected",
						type: "other",
						title: isArabic ? "موقعك الحالي" : "Your current location",
						address: isArabic ? "موقعك الحالي" : "Your current location",
						details: "",
						phone: "",
						isDefault: false,
						coordinates: { lat: position.coords.latitude, lng: position.coords.longitude }
					};
					setAddress(detectedAddress.address);
					setSelectedAddress(detectedAddress);
					onAddressChange?.(detectedAddress);
				},
				() => {
					alert(isArabic ? "تعذر الحصول على موقعك" : "Unable to get your location");
				}
			);
		}
	};

	const handleAddressSave = (addressData: Omit<Address, "id">) => {
		if (editingAddress) {
			updateAddress(editingAddress.id, addressData);
			setEditingAddress(null);
		} else {
			const newAddress = addAddress(addressData);
			setSelectedAddress(newAddress);
			onAddressChange?.(newAddress);
		}
		setShowAddModal(false);
	};

	const handleSelectAddress = (addr: Address) => {
		setSelectedAddress(addr);
		setAddress(addr.address);
		setShowAddressList(false);
		onAddressChange?.(addr);
	};

	const handleViewMap = (addr: Address) => {
		setViewingAddress(addr);
		setShowMapModal(true);
		setShowAddressList(false);
	};

	const handleManageAddresses = () => {
		router.push("/profile/addresses");
	};

	const recentAddresses = addresses.slice(0, 3);

	return (
		<>
			<div className="space-y-3 sm:space-y-4 w-full overflow-x-hidden">
				{/* Label */}
				<div className={`flex items-center justify-between mb-3 sm:mb-4 gap-2 `}>
					<div className={`flex items-center gap-2 sm:gap-3 flex-1 min-w-0 `}>
						<div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg flex-shrink-0">
							<MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
						</div>
						<div className="flex-1 min-w-0">
							<p className={`text-xs sm:text-sm md:text-base font-medium text-gray-500 dark:text-gray-400 truncate ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "عنوان التوصيل" : "Delivery Address"}
							</p>
							<p className={`text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 line-clamp-1 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "أدخل عنوانك أو اختر موقعك" : "Enter your address or select location"}
							</p>
						</div>
					</div>
					{addresses.length > 0 && (
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleManageAddresses}
							className="p-2 sm:p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
							title={isArabic ? "إدارة العناوين" : "Manage Addresses"}
							aria-label={isArabic ? "إدارة العناوين" : "Manage Addresses"}
						>
							<Settings className="w-4 h-4 sm:w-5 sm:h-5" />
						</motion.button>
					)}
				</div>

				{/* Selected Address Display */}
				{selectedAddress && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						onClick={() => addresses.length > 0 && setShowAddressList(true)}
						className={`p-3 sm:p-4 md:p-5 border-2 border-green-500 dark:border-green-600 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 cursor-pointer transition-all hover:shadow-md active:scale-[0.98] touch-manipulation ${isArabic ? "text-right" : "text-left"}`}
					>
						<div className={`flex items-start justify-between gap-2 sm:gap-3 `}>
							<div className="flex-1 min-w-0">
								<div className={`flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap `}>
									<div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-green-600 dark:border-green-500 flex items-center justify-center flex-shrink-0">
										<div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-600 dark:bg-green-500" />
									</div>
									<span className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm md:text-base truncate">
										{selectedAddress.title}
									</span>
									{selectedAddress.isDefault && (
										<span className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
											{isArabic ? "افتراضي" : "Default"}
										</span>
									)}
								</div>
								<p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
									{selectedAddress.address}
								</p>
								{selectedAddress.details && (
									<p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
										{selectedAddress.details}
									</p>
								)}
							</div>
							{addresses.length > 1 && (
								<ChevronDown
									className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 ${
										showAddressList ? "rotate-180" : ""
									}`}
								/>
							)}
						</div>
					</motion.div>
				)}

				{/* Address Input */}
				<div className="relative">
					<input
						type="text"
						value={address}
						onChange={(e) => {
							setAddress(e.target.value);
							setShowSuggestions(true);
						}}
						onFocus={() => setShowSuggestions(true)}
						placeholder={isArabic ? "ابحث عن عنوان..." : "Search for address..."}
						className={`w-full ${isArabic ? "pr-11 sm:pr-14 pl-3 sm:pl-4" : "pl-11 sm:pl-14 pr-3 sm:pr-4"} py-3 sm:py-3.5 md:py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base shadow-lg transition-all min-h-[44px]`}
						dir={isArabic ? "rtl" : "ltr"}
					/>
					<MapPin className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-3 sm:right-4" : "left-3 sm:left-4"} w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 pointer-events-none`} />

					{/* Clear button */}
					{address && (
						<motion.button
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							onClick={() => {
								setAddress("");
								setShowSuggestions(false);
							}}
							className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-10 sm:left-12" : "right-10 sm:right-12"} p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center`}
							aria-label={isArabic ? "مسح" : "Clear"}
						>
							<X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
						</motion.button>
					)}
				</div>

				{/* Quick Actions */}
				<div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 ${isArabic ? "sm:flex-row-reverse" : ""}`}>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleDetectLocation}
						className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3 md:py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base min-h-[44px] touch-manipulation `}
					>
						<Navigation className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
						<span className="whitespace-nowrap">{isArabic ? "اكتشف موقعي" : "Detect Location"}</span>
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => {
							setEditingAddress(null);
							setShowAddModal(true);
						}}
						className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3 md:py-3.5 bg-white dark:bg-gray-800 border-2 border-green-500 dark:border-green-600 text-green-600 dark:text-green-400 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base min-h-[44px] touch-manipulation `}
					>
						<Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
						<span className="whitespace-nowrap">{isArabic ? "إضافة عنوان" : "Add Address"}</span>
					</motion.button>

					{/* Recent Addresses */}
					{recentAddresses.length > 0 && (
						<div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${isArabic ? "sm:flex-row-reverse" : ""}`}>
							<Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 hidden sm:block flex-shrink-0" />
							<div className={`flex flex-wrap gap-2 ${isArabic ? "flex-row-reverse justify-end" : "justify-start"}`}>
								{recentAddresses.map((addr) => (
									<motion.button
										key={addr.id}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => handleSelectAddress(addr)}
										className={`px-3 sm:px-4 py-2 sm:py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-500 transition-all whitespace-nowrap min-h-[36px] touch-manipulation ${
											selectedAddress?.id === addr.id ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
										}`}
									>
										{addr.title}
									</motion.button>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Suggestions Dropdown */}
				{showSuggestions && address && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-64 overflow-y-auto"
					>
						<div className="p-2">
							<div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
								<p className="font-medium text-gray-900 dark:text-gray-100">{address}</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">Riyadh, Saudi Arabia</p>
							</div>
						</div>
					</motion.div>
				)}
			</div>

			{/* Address List Modal */}
			<AnimatePresence>
				{showAddressList && addresses.length > 0 && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
							onClick={() => setShowAddressList(false)}
						/>
						<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
							<motion.div
								initial={{ opacity: 0, scale: 0.9, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.9, y: 20 }}
								className={`bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden pointer-events-auto border border-gray-200 dark:border-gray-700`}
								dir={isArabic ? "rtl" : "ltr"}
								onClick={(e) => e.stopPropagation()}
							>
								{/* Mobile Drag Handle */}
								<div className="sm:hidden w-full pt-3 pb-2 flex justify-center flex-shrink-0">
									<div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
								</div>

								{/* Header */}
								<div className={`p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 sticky top-0 z-10 `}>
									<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
										{isArabic ? "اختر العنوان" : "Select Address"}
									</h3>
									<motion.button
										whileHover={{ scale: 1.1, rotate: 90 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => setShowAddressList(false)}
										className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 shadow-sm touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
										aria-label={isArabic ? "إغلاق" : "Close"}
									>
										<X className="w-5 h-5" />
									</motion.button>
								</div>

								{/* Address List */}
								<div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-180px)] sm:max-h-[60vh] space-y-2 sm:space-y-3">
									{addresses.map((addr, index) => {
										const isSelected = selectedAddress?.id === addr.id;
										return (
											<motion.div
												key={addr.id}
												initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ duration: 0.2, delay: index * 0.05 }}
												onClick={() => handleSelectAddress(addr)}
												className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all touch-manipulation active:scale-[0.98] ${
													isSelected
														? "border-green-500 dark:border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-md"
														: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:shadow-sm"
												} ${isArabic ? "text-right" : "text-left"}`}
											>
												<div className={`flex items-start justify-between gap-2 sm:gap-3 `}>
													<div className="flex-1 min-w-0">
														<div className={`flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 flex-wrap `}>
															<div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
																isSelected
																	? "border-green-600 dark:border-green-500"
																	: "border-gray-300 dark:border-gray-600"
															}`}>
																{isSelected && (
																	<motion.div
																		initial={{ scale: 0 }}
																		animate={{ scale: 1 }}
																		className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-600 dark:bg-green-500"
																	/>
																)}
															</div>
															<span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
																{addr.title}
															</span>
															{addr.isDefault && (
																<span className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
																	{isArabic ? "افتراضي" : "Default"}
																</span>
															)}
														</div>
														<p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
															{addr.address}
														</p>
														{addr.details && (
															<p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
																{addr.details}
															</p>
														)}
													</div>
													{isSelected && (
														<motion.div
															initial={{ scale: 0 }}
															animate={{ scale: 1 }}
															className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0"
														>
															<Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
														</motion.div>
													)}
												</div>
											</motion.div>
										);
									})}
								</div>

								{/* Footer */}
								<div className={`p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 ${isArabic ? "text-right" : "text-left"}`}>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => {
											setShowAddressList(false);
											setEditingAddress(null);
											setShowAddModal(true);
										}}
										className={`w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg min-h-[44px] touch-manipulation text-sm sm:text-base `}
									>
										<Plus className="w-4 h-4 sm:w-5 sm:h-5" />
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
				onClose={() => {
					setShowAddModal(false);
					setEditingAddress(null);
				}}
				onSave={handleAddressSave}
				editingAddress={editingAddress}
			/>

			{/* Map Modal */}
			{viewingAddress && (
				<MapModal
					isOpen={showMapModal}
					onClose={() => {
						setShowMapModal(false);
						setViewingAddress(null);
					}}
					address={viewingAddress}
				/>
			)}
		</>
	);
}


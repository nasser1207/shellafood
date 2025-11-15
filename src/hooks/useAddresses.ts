"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Address {
	id: string;
	type: string;
	title: string;
	address: string;
	details: string;
	phone: string;
	isDefault: boolean;
	coordinates: { lat: number; lng: number };
}

const STORAGE_KEY = "shella_addresses";

export function useAddresses() {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	// Load addresses from localStorage on mount
	const [addresses, setAddresses] = useState<Address[]>(() => {
		if (typeof window === "undefined") return [];
		
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				return Array.isArray(parsed) ? parsed : [];
			}
		} catch (error) {
			console.error("Error loading addresses from localStorage:", error);
		}
		
		// Return default addresses if none exist
		return [
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
		];
	});

	// Save addresses to localStorage whenever they change
	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
			} catch (error) {
				console.error("Error saving addresses to localStorage:", error);
			}
		}
	}, [addresses]);

	// Get default address
	const defaultAddress = useMemo(() => {
		return addresses.find(addr => addr.isDefault) || addresses[0] || null;
	}, [addresses]);

	// Add new address
	const addAddress = useCallback((addressData: Omit<Address, "id">) => {
		const newAddress: Address = {
			...addressData,
			id: Date.now().toString(),
		};

		setAddresses(prev => {
			// If this is set as default, unset all other defaults
			if (newAddress.isDefault) {
				return prev.map(addr => ({ ...addr, isDefault: false })).concat([newAddress]);
			}
			return [...prev, newAddress];
		});

		return newAddress;
	}, []);

	// Update existing address
	const updateAddress = useCallback((addressId: string, addressData: Partial<Address>) => {
		setAddresses(prev => {
			// If setting as default, unset all other defaults
			if (addressData.isDefault) {
				return prev.map(addr => 
					addr.id === addressId 
						? { ...addr, ...addressData }
						: { ...addr, isDefault: false }
				);
			}
			return prev.map(addr => 
				addr.id === addressId ? { ...addr, ...addressData } : addr
			);
		});
	}, []);

	// Delete address
	const deleteAddress = useCallback((addressId: string) => {
		setAddresses(prev => prev.filter(addr => addr.id !== addressId));
	}, []);

	// Set default address
	const setDefaultAddress = useCallback((addressId: string) => {
		setAddresses(prev => prev.map(addr => ({
			...addr,
			isDefault: addr.id === addressId
		})));
	}, []);

	// Get address by ID
	const getAddressById = useCallback((addressId: string) => {
		return addresses.find(addr => addr.id === addressId) || null;
	}, [addresses]);

	return {
		addresses,
		defaultAddress,
		addAddress,
		updateAddress,
		deleteAddress,
		setDefaultAddress,
		getAddressById,
		setAddresses, // For bulk updates if needed
	};
}


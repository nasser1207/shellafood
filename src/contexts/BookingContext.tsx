"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface BookingData {
	serviceId: string;
	serviceName: string;
	serviceNameAr: string;
	unitPrice: number;
	quantity: number;
	date: string | null;
	time: string | null;
	serviceType: "instant" | "scheduled";
	description: string; // Problem description
	images: string[]; // Array of image URLs
	video: string | null; // Video URL
	voice: string | null; // Voice recording URL
	notes: string;
	address: {
		id: string;
		title: string;
		address: string;
		details: string;
		phone: string;
		coordinates: { lat: number; lng: number };
	} | null;
	subtotal: number;
	vat: number;
	total: number;
	paymentMethod: "card" | "apple-pay" | "cash" | "qaydha-wallet" | null;
	bookingId: string | null;
	worker: {
		id: string;
		name: string;
		avatar: string;
		rating: number;
		phone: string;
	} | null;
}

interface BookingContextType {
	bookingData: BookingData | null;
	updateBooking: (data: Partial<BookingData>) => void;
	resetBooking: () => void;
	calculateTotals: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const INITIAL_BOOKING: BookingData = {
	serviceId: "",
	serviceName: "",
	serviceNameAr: "",
	unitPrice: 0,
	quantity: 1,
	date: null,
	time: null,
	serviceType: "scheduled",
	description: "",
	images: [],
	video: null,
	voice: null,
	notes: "",
	address: null,
	subtotal: 0,
	vat: 0,
	total: 0,
	paymentMethod: null,
	bookingId: null,
	worker: null,
};

export function BookingProvider({ children }: { children: ReactNode }) {
	const [bookingData, setBookingData] = useState<BookingData>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("bookingData");
			if (saved) {
				try {
					return JSON.parse(saved);
				} catch {
					return INITIAL_BOOKING;
				}
			}
		}
		return INITIAL_BOOKING;
	});

	// Save to localStorage whenever bookingData changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("bookingData", JSON.stringify(bookingData));
		}
	}, [bookingData]);

	const calculateTotals = useCallback(() => {
		setBookingData((prev) => {
			const subtotal = (prev.unitPrice || 0) * (prev.quantity || 1);
			const vat = subtotal * 0.15; // 15% VAT in Saudi Arabia
			const total = subtotal + vat;

			return {
				...prev,
				subtotal: Math.round(subtotal * 100) / 100,
				vat: Math.round(vat * 100) / 100,
				total: Math.round(total * 100) / 100,
			};
		});
	}, []);

	const updateBooking = useCallback((data: Partial<BookingData>) => {
		setBookingData((prev) => {
			const updated = { ...prev, ...data };
			// Auto-calculate totals when price or quantity changes
			if (data.unitPrice !== undefined || data.quantity !== undefined) {
				const subtotal = (updated.unitPrice || 0) * (updated.quantity || 1);
				const vat = subtotal * 0.15;
				const total = subtotal + vat;
				updated.subtotal = Math.round(subtotal * 100) / 100;
				updated.vat = Math.round(vat * 100) / 100;
				updated.total = Math.round(total * 100) / 100;
			}
			return updated;
		});
	}, []);

	const resetBooking = useCallback(() => {
		setBookingData(INITIAL_BOOKING);
		if (typeof window !== "undefined") {
			localStorage.removeItem("bookingData");
		}
	}, []);

	return (
		<BookingContext.Provider
			value={{
				bookingData,
				updateBooking,
				resetBooking,
				calculateTotals,
			}}
		>
			{children}
		</BookingContext.Provider>
	);
}

export function useBooking() {
	const context = useContext(BookingContext);
	if (context === undefined) {
		throw new Error("useBooking must be used within a BookingProvider");
	}
	return context;
}


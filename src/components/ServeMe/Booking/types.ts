/**
 * Type Definitions for Booking Components
 */

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

export type ServiceType = "instant" | "scheduled";


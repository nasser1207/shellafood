/**
 * Utility to convert between old LocationPoint[] format and new RouteSegment[] format
 * This ensures backward compatibility while migrating to the new architecture
 */

import type { RouteSegment, LocationPoint, PackageDetails } from "../types/routeSegment";

interface OldOrderData {
	transportType: string;
	orderType: string;
	locationPoints: Array<{
		id: string;
		type: "pickup" | "dropoff";
		label: string;
		location: { lat: number; lng: number } | null;
		streetName: string;
		areaName: string;
		city: string;
		building: string;
		additionalDetails: string;
		buildingPhoto: string | null;
		recipientName: string;
		recipientPhone: string;
	}>;
	packageDescription: string;
	packageWeight: string;
	packageDimensions: string;
	specialInstructions: string;
	packageImages?: string[];
	packageVideo?: string | null;
	// Vehicle-specific fields
	truckType?: string;
	cargoType?: string;
	isFragile?: boolean;
	requiresRefrigeration?: boolean;
	loadingEquipmentNeeded?: boolean;
	packageType?: string;
	isDocuments?: boolean;
	isExpress?: boolean;
}

interface NewOrderData {
	transportType: string;
	orderType: string;
	routeSegments: RouteSegment[];
	vehicleOptions: any;
	createdAt?: string;
}

/**
 * Convert new RouteSegments format to old LocationPoint[] format
 * This allows existing Summary and Confirmation pages to work with new data
 */
export function convertToOldFormat(newData: NewOrderData): OldOrderData {
	// Flatten all segments into locationPoints array
	const locationPoints: OldOrderData["locationPoints"] = [];

	newData.routeSegments.forEach((segment, index) => {
		// Add pickup point
		locationPoints.push({
			id: segment.pickupPoint.id,
			type: "pickup",
			label: segment.pickupPoint.label,
			location: segment.pickupPoint.location,
			streetName: segment.pickupPoint.streetName,
			areaName: segment.pickupPoint.areaName,
			city: segment.pickupPoint.city,
			building: segment.pickupPoint.building,
			additionalDetails: segment.pickupPoint.additionalDetails,
			buildingPhoto: segment.pickupPoint.buildingPhoto,
			recipientName: segment.pickupPoint.contactName,
			recipientPhone: segment.pickupPoint.contactPhone,
		});

		// Add dropoff point
		locationPoints.push({
			id: segment.dropoffPoint.id,
			type: "dropoff",
			label: segment.dropoffPoint.label,
			location: segment.dropoffPoint.location,
			streetName: segment.dropoffPoint.streetName,
			areaName: segment.dropoffPoint.areaName,
			city: segment.dropoffPoint.city,
			building: segment.dropoffPoint.building,
			additionalDetails: segment.dropoffPoint.additionalDetails,
			buildingPhoto: segment.dropoffPoint.buildingPhoto,
			recipientName: segment.dropoffPoint.contactName,
			recipientPhone: segment.dropoffPoint.contactPhone,
		});
	});

	// Use data from first segment for package details (for now)
	// In future, this should be handled per-segment
	const firstSegment = newData.routeSegments[0];
	const vehicleOptions = newData.vehicleOptions || {};

	return {
		transportType: newData.transportType,
		orderType: newData.orderType,
		locationPoints,
		packageDescription: firstSegment?.packageDetails.description || "",
		packageWeight: firstSegment?.packageDetails.weight || "",
		packageDimensions: firstSegment?.packageDetails.dimensions || "",
		specialInstructions: firstSegment?.packageDetails.specialInstructions || "",
		packageImages: firstSegment?.packageDetails.images || [],
		packageVideo: firstSegment?.packageDetails.video || null,
		// Vehicle-specific
		truckType: vehicleOptions.truckType || "",
		cargoType: "",
		isFragile: firstSegment?.packageDetails.isFragile || false,
		requiresRefrigeration: firstSegment?.packageDetails.requiresRefrigeration || false,
		loadingEquipmentNeeded: vehicleOptions.loadingEquipmentNeeded || false,
		packageType: vehicleOptions.packageType || "",
		isDocuments: vehicleOptions.isDocuments || false,
		isExpress: vehicleOptions.isExpress || false,
	};
}

/**
 * Detect which format the data is in and convert to old format if needed
 */
export function loadAndConvertOrderData(): OldOrderData | null {
	const storedData = sessionStorage.getItem("pickAndOrderDetails");
	if (!storedData) return null;

	try {
		const parsed = JSON.parse(storedData);

		// Check if it's the new format (has routeSegments)
		if (parsed.routeSegments && Array.isArray(parsed.routeSegments)) {
			return convertToOldFormat(parsed as NewOrderData);
		}

		// It's already in old format
		return parsed as OldOrderData;
	} catch (error) {
		console.error("Error loading order data:", error);
		return null;
	}
}

/**
 * Get all route segments from order data
 * Returns segments with complete package details per segment
 */
export function getRouteSegments(): RouteSegment[] | null {
	const storedData = sessionStorage.getItem("pickAndOrderDetails");
	if (!storedData) return null;

	try {
		const parsed = JSON.parse(storedData);

		// If it's already in new format, return segments directly
		if (parsed.routeSegments && Array.isArray(parsed.routeSegments)) {
			return parsed.routeSegments;
		}

		// If old format, we can't accurately reconstruct segments
		// because package details were shared across all points
		return null;
	} catch (error) {
		console.error("Error loading route segments:", error);
		return null;
	}
}

/**
 * Check if order data is in new RouteSegment format
 */
export function isNewFormat(): boolean {
	const storedData = sessionStorage.getItem("pickAndOrderDetails");
	if (!storedData) return false;

	try {
		const parsed = JSON.parse(storedData);
		return !!(parsed.routeSegments && Array.isArray(parsed.routeSegments));
	} catch {
		return false;
	}
}


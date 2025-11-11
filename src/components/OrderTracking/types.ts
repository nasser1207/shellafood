/**
 * Shared types for Order Tracking components
 */

export interface TimelineStep {
	label: string;
	labelAr?: string;
	time: string;
	comment?: string;
	commentAr?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export interface DriverOrWorker {
	name: string;
	phone?: string;
	photo?: string;
	vehicle?: string;
	id?: string; // Worker/Driver ID
	service?: string; // Service slug
	serviceType?: string; // Service type slug
}

export interface OrderMapData {
	user_lat: number;
	user_lng: number;
	driver_lat?: number;
	driver_lng?: number;
}

export interface OrderItem {
	name: string;
	nameAr?: string;
	quantity: number;
	price: number;
}

export interface OrderData {
	order_id: string;
	type: "product" | "service";
	status: string;
	eta?: string;
	scheduledTime?: string;
	timeline: TimelineStep[];
	driver_or_worker?: DriverOrWorker;
	map: OrderMapData;
	items?: OrderItem[];
	paymentMethod: string;
	address: string;
	totalAmount: number;
	supportPhone?: string;
	// Service information (for service orders)
	service?: string; // Service slug
	serviceType?: string; // Service type slug (e.g., "instant", "scheduled", "emergency")
	// Pricing breakdown for transparency
	basePrice?: number; // Base price (technician price for services, products price for products)
	platformFee?: number; // Platform service fee
	vat?: number; // Value Added Tax (15%)
}

export interface TrackOrderPageProps {
	orderId: string;
	initialData?: OrderData;
}

export type OrderStatus =
	| "pending"
	| "confirmed"
	| "preparing"
	| "assigned"
	| "on_the_way"
	| "in_progress"
	| "delivered"
	| "completed"
	| "cancelled"
	| "failed";


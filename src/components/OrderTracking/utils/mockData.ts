/**
 * Mock data generator for order tracking
 * Extracted for better code organization and maintainability
 */

import { OrderData, TimelineStep } from "../types";

// Constants for mock data
const MOCK_WORKER = {
	name: "Ahmad Al Zahrani",
	phone: "+966500000000",
	photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
	id: "3",
};

const MOCK_DRIVER = {
	name: "Ahmad Al Zahrani",
	phone: "+966500000000",
	photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
	vehicle: "Toyota Yaris",
};

const MOCK_SERVICE_INFO = {
	service: "home-maintenance",
	serviceType: "pest-control",
};

const MOCK_LOCATION = {
	user_lat: 24.7136,
	user_lng: 46.6753,
	driver_lat: 24.7250,
	driver_lng: 46.6900,
};

const MOCK_ADDRESS = "Riyadh, Al Olaya Street, Building 5, Apartment 201";
const MOCK_SUPPORT_PHONE = "+966500000001";

const MOCK_PRODUCT_ITEMS = [
	{
		name: "Chicken Meal",
		nameAr: "وجبة دجاج",
		quantity: 2,
		price: 25.0,
	},
	{
		name: "Burger",
		nameAr: "برجر",
		quantity: 1,
		price: 15.0,
	},
];

/**
 * Generate timeline steps for service orders
 */
function generateServiceTimeline(now: number): TimelineStep[] {
	const oneHourAgo = now - 60 * 60 * 1000;
	const fortyFiveMinsAgo = now - 45 * 60 * 1000;
	const tenMinsAgo = now - 10 * 60 * 1000;

	return [
		{
			label: "Booking Confirmed",
			labelAr: "تم تأكيد الحجز",
			time: new Date(oneHourAgo).toISOString(),
		},
		{
			label: "Technician Assigned",
			labelAr: "تم تعيين الفني",
			time: new Date(fortyFiveMinsAgo).toISOString(),
			comment: "Ahmad Al Zahrani has been assigned",
			commentAr: "تم تعيين أحمد الزهراني",
		},
		{
			label: "Technician on the Way",
			labelAr: "الفني في الطريق",
			time: new Date(tenMinsAgo).toISOString(),
			comment: "Ahmad is on the way to your location",
			commentAr: "أحمد في الطريق إلى موقعك",
		},
	];
}

/**
 * Generate timeline steps for product orders
 */
function generateProductTimeline(now: number): TimelineStep[] {
	const oneHourAgo = now - 60 * 60 * 1000;
	const fortyFiveMinsAgo = now - 45 * 60 * 1000;
	const tenMinsAgo = now - 10 * 60 * 1000;

	return [
		{
			label: "Order Confirmed",
			labelAr: "تم تأكيد الطلب",
			time: new Date(oneHourAgo).toISOString(),
		},
		{
			label: "Preparing Order",
			labelAr: "قيد التحضير",
			time: new Date(fortyFiveMinsAgo).toISOString(),
			comment: "Your order is being prepared",
			commentAr: "جاري تحضير طلبك",
		},
		{
			label: "Out for Delivery",
			labelAr: "قيد التوصيل",
			time: new Date(tenMinsAgo).toISOString(),
			comment: "Rider picked up your order",
			commentAr: "استلم السائق طلبك",
		},
	];
}

/**
 * Generate mock order data based on order ID
 * @param orderId - Order identifier (SRV prefix indicates service order)
 * @returns Mock OrderData object
 */
export function generateMockOrderData(orderId: string): OrderData {
	const isServiceOrder = orderId.includes("SRV");
	const now = Date.now();
	const twentyFiveMinsFromNow = now + 25 * 60 * 1000;

	// Calculate pricing breakdown for transparency
	// Base price: 50 SAR for service/55 SAR total for products
	const basePrice = isServiceOrder ? 50.0 : 55.0; // Base price (technician price for services, products price for products)
	const platformFee = isServiceOrder ? 5.0 : 5.0; // Platform fee
	const subtotal = basePrice + platformFee;
	const vat = Math.round(subtotal * 0.15 * 100) / 100; // VAT 15% (rounded to 2 decimals)
	const totalAmount = Math.round((subtotal + vat) * 100) / 100; // Total rounded to 2 decimals

	const baseOrder: OrderData = {
		order_id: orderId,
		type: isServiceOrder ? "service" : "product",
		status: "on_the_way",
		eta: new Date(twentyFiveMinsFromNow).toISOString(),
		timeline: isServiceOrder ? generateServiceTimeline(now) : generateProductTimeline(now),
		map: MOCK_LOCATION,
		paymentMethod: "Card",
		address: MOCK_ADDRESS,
		totalAmount: totalAmount,
		supportPhone: MOCK_SUPPORT_PHONE,
		// Pricing breakdown for transparency
		basePrice: basePrice,
		platformFee: platformFee,
		vat: vat,
	};

	// Add service-specific data
	if (isServiceOrder) {
		return {
			...baseOrder,
			service: MOCK_SERVICE_INFO.service,
			serviceType: MOCK_SERVICE_INFO.serviceType,
			driver_or_worker: {
				...MOCK_WORKER,
				...MOCK_SERVICE_INFO,
			},
		};
	}

	// Add product-specific data
	return {
		...baseOrder,
		driver_or_worker: MOCK_DRIVER,
		items: MOCK_PRODUCT_ITEMS,
	};
}


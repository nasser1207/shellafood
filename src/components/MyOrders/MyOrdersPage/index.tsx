"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import OrdersTabs from "../OrdersTabs";
import { ProductOrderCard } from "../OrderCards/ProductOrderCard";
import { ServiceOrderCard } from "../OrderCards/ServiceOrderCard";
import { DeliveryOrderCard } from "../OrderCards/DeliveryOrderCard";
import { EmptyOrdersState } from "../shared/EmptyOrdersState";
import { OrderListSkeleton } from "../shared/OrderCardSkeleton";
import { PullToRefreshIndicator } from "../shared/PullToRefreshIndicator";
import { SwipeableOrderCard } from "../shared/SwipeableOrderCard";
import { VirtualizedOrderList } from "../shared/VirtualizedOrderList";
import { OrdersHeader } from "./OrdersHeader";
import { OrdersFilters } from "./OrdersFilters";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useRouter } from "next/navigation";

// Type definitions
interface ProductOrderItem {
	id: string;
	productName: string;
	productNameAr?: string;
	image?: string;
	quantity: number;
	price: number;
}

interface ProductOrder {
	id: string;
	orderNumber: string;
	storeName: string;
	storeNameAr?: string;
	storeLogo?: string;
	status: "pending" | "preparing" | "ready" | "delivering" | "completed" | "cancelled";
	createdAt: string;
	items: ProductOrderItem[];
	totalAmount: number;
	paymentMethod: string;
	paymentStatus: "paid" | "pending" | "failed";
	address?: string;
}

interface ServiceRequest {
	id: string;
	requestNumber: string;
	serviceName: string;
	serviceNameAr?: string;
	serviceImage?: string;
	status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
	workerId?: string;
	workerName?: string;
	workerPhoto?: string;
	address?: string;
	preferredDate?: string;
	preferredTime?: string;
	urgency: "normal" | "urgent" | "emergency";
	paymentMethod?: string;
	paymentStatus?: "paid" | "pending" | "failed";
	totalAmount: number;
	createdAt: string;
	hasImages?: boolean;
}

interface DeliveryOrder {
	id: string;
	orderNumber: string;
	transportType: "motorbike" | "truck";
	status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "completed" | "cancelled";
	createdAt: string;
	senderName: string;
	senderPhone: string;
	senderAddress: string;
	receiverName: string;
	receiverPhone: string;
	receiverAddress: string;
	distance: number;
	deliveryFee: number;
	totalAmount: number;
	paymentMethod: string;
	paymentStatus: "paid" | "pending" | "failed";
	driverName?: string;
	driverPhoto?: string;
	orderType: "one-way" | "multi-direction";
}

// Mock data - Replace with API calls
const mockProductOrders: ProductOrder[] = [
	{
		id: "1",
		orderNumber: "ORD-2025-001",
		storeName: "Al Baik Restaurant",
		storeNameAr: "مطعم البيك",
		storeLogo: "/restlogo.jpg",
		status: "completed",
		createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		items: [
			{
				id: "1",
				productName: "Chicken Meal",
				productNameAr: "وجبة دجاج",
				image: "/byrger.png",
				quantity: 2,
				price: 25.0,
			},
			{
				id: "2",
				productName: "Burger",
				productNameAr: "برجر",
				image: "/byrger.png",
				quantity: 1,
				price: 15.0,
			},
		],
		totalAmount: 65.0,
		paymentMethod: "Card",
		paymentStatus: "paid",
		address: "123 Main Street, Riyadh",
	},
	{
		id: "2",
		orderNumber: "ORD-2025-002",
		storeName: "Coffee Shop",
		storeNameAr: "مقهى",
		status: "delivering",
		createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		items: [
			{
				id: "3",
				productName: "Cappuccino",
				productNameAr: "كابتشينو",
				image: "/coffe.png",
				quantity: 3,
				price: 12.0,
			},
		],
		totalAmount: 36.0,
		paymentMethod: "Mada",
		paymentStatus: "paid",
	},
	{
		id: "3",
		orderNumber: "ORD-2025-003",
		storeName: "Supermarket",
		storeNameAr: "سوبر ماركت",
		status: "preparing",
		createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		items: [
			{
				id: "4",
				productName: "Bread",
				productNameAr: "خبز",
				quantity: 2,
				price: 5.0,
			},
		],
		totalAmount: 10.0,
		paymentMethod: "Cash",
		paymentStatus: "pending",
	},
];

const mockServiceRequests: ServiceRequest[] = [
	{
		id: "1",
		requestNumber: "SRV-2025-001",
		serviceName: "AC Cleaning",
		serviceNameAr: "تنظيف مكيف",
		serviceImage: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400",
		status: "completed",
		workerId: "worker-001",
		workerName: "Ahmed Ali",
		workerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
		address: "Building 5, Apartment 201, King Fahd Road",
		preferredDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		preferredTime: "14:00",
		urgency: "normal",
		paymentMethod: "Card",
		paymentStatus: "paid",
		totalAmount: 150.0,
		createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
		hasImages: true,
	},
	{
		id: "2",
		requestNumber: "SRV-2025-002",
		serviceName: "Plumbing Repair",
		serviceNameAr: "إصلاح سباكة",
		status: "in_progress",
		workerId: "worker-002",
		workerName: "Mohammed Hassan",
		address: "123 Main Street",
		preferredDate: new Date().toISOString(),
		preferredTime: "10:00",
		urgency: "urgent",
		paymentMethod: "Cash",
		paymentStatus: "pending",
		totalAmount: 200.0,
		createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "3",
		requestNumber: "SRV-2025-003",
		serviceName: "Home Cleaning",
		serviceNameAr: "تنظيف منزل",
		status: "assigned",
		address: "456 Park Avenue",
		preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
		urgency: "normal",
		paymentMethod: "Card",
		paymentStatus: "paid",
		totalAmount: 300.0,
		createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
	},
];

const mockDeliveryOrders: DeliveryOrder[] = [
	{
		id: "1",
		orderNumber: "ORD-98765432",
		transportType: "motorbike",
		status: "completed",
		createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		senderName: "أحمد محمد",
		senderPhone: "+966 50 123 4567",
		senderAddress: "شارع الملك فهد، حي النخيل، الرياض - مبنى 15، شقة 302",
		receiverName: "فاطمة علي",
		receiverPhone: "+966 50 987 6543",
		receiverAddress: "شارع الأمير سلطان، حي الورود، الرياض - مبنى 8، شقة 105",
		distance: 10.75,
		deliveryFee: 26.88,
		totalAmount: 26.88,
		paymentMethod: "Card",
		paymentStatus: "paid",
		driverName: "خالد الراشد",
		driverPhoto: "/driver1.jpg",
		orderType: "one-way",
	},
	{
		id: "2",
		orderNumber: "ORD-87654321",
		transportType: "truck",
		status: "in_transit",
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		senderName: "محمد حسن",
		senderPhone: "+966 50 111 2222",
		senderAddress: "شارع العليا، حي العليا، الرياض - مبنى 22، شقة 401",
		receiverName: "سارة أحمد",
		receiverPhone: "+966 50 333 4444",
		receiverAddress: "طريق الملك عبدالله، حي الملز، الرياض - مبنى 10، شقة 205",
		distance: 25.5,
		deliveryFee: 127.5,
		totalAmount: 127.5,
		paymentMethod: "Mada",
		paymentStatus: "paid",
		driverName: "عمر السعود",
		driverPhoto: "/driver2.jpg",
		orderType: "multi-direction",
	},
	{
		id: "3",
		orderNumber: "ORD-76543210",
		transportType: "motorbike",
		status: "assigned",
		createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		senderName: "علي إبراهيم",
		senderPhone: "+966 50 555 6666",
		senderAddress: "شارع التحلية، حي الورود، الرياض - مبنى 5، شقة 101",
		receiverName: "نورة المنصوري",
		receiverPhone: "+966 50 777 8888",
		receiverAddress: "طريق المطار، حي الخليج، الرياض - مبنى 12، شقة 303",
		distance: 15.2,
		deliveryFee: 38.0,
		totalAmount: 38.0,
		paymentMethod: "Card",
		paymentStatus: "paid",
		driverName: "فهد المطيري",
		driverPhoto: "/driver1.jpg",
		orderType: "one-way",
	},
];

export default function MyOrdersPage() {
	const { language } = useLanguage();
	const router = useRouter();
	const isArabic = language === "ar";
	const [activeTab, setActiveTab] = useState<"products" | "services" | "delivery">("products");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<"newest" | "oldest" | "status">("newest");
	const [filterStatus, setFilterStatus] = useState<string>("all");

	// Check URL parameters for tab selection
	useEffect(() => {
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			const tabParam = urlParams.get("tab");
			if (tabParam === "delivery" || tabParam === "services" || tabParam === "products") {
				setActiveTab(tabParam as "products" | "services" | "delivery");
			}
		}
	}, []);

	// Mock API calls - Replace with real API calls
	const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
	const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
	const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Convert Pick and Order data to DeliveryOrder format
	const convertPickAndOrderToDeliveryOrder = useCallback((orderId: string, storedOrderData: any): DeliveryOrder | null => {
		const orderData = storedOrderData.orderData;
		if (!orderData || !orderData.locationPoints) return null;

		const pickupPoints = orderData.locationPoints.filter((p: any) => p.type === "pickup");
		const dropoffPoints = orderData.locationPoints.filter((p: any) => p.type === "dropoff");
		
		if (pickupPoints.length === 0 || dropoffPoints.length === 0) return null;

		const firstPickup = pickupPoints[0];
		const firstDropoff = dropoffPoints[0];
		
		// Calculate distance (mock calculation - in real app would use actual distance)
		const distance = 12.5; // Mock distance in km
		
		// Get creation date from stored data
		const createdAt = new Date(storedOrderData.createdAt || Date.now());
		const hoursSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
		
		// Determine status based on order age and driver assignment
		let status: DeliveryOrder["status"] = "pending";
		if (hoursSinceCreation > 24) {
			status = "completed";
		} else if (hoursSinceCreation > 2) {
			status = "in_transit";
		} else if (hoursSinceCreation > 0.5) {
			status = "picked_up";
		} else if (storedOrderData.driverId || storedOrderData.driverData) {
			status = "assigned";
		}

		// Calculate delivery fee based on transport type and distance
		const transportType = storedOrderData.transportType || orderData.transportType;
		const isMotorbike = transportType === "motorbike";
		const baseFee = isMotorbike ? 2.5 : 5.0;
		const deliveryFee = Math.round((baseFee * distance) * 100) / 100;
		const totalAmount = deliveryFee;

		// Get driver data from stored order
		const driverData = storedOrderData.driverData;

		return {
			id: orderId,
			orderNumber: orderId,
			transportType: (transportType === "motorbike" ? "motorbike" : "truck") as "motorbike" | "truck",
			status,
			createdAt: createdAt.toISOString(),
			senderName: firstPickup.recipientName || "Sender",
			senderPhone: firstPickup.recipientPhone || "+966500000000",
			senderAddress: `${firstPickup.streetName}, ${firstPickup.areaName}, ${firstPickup.city}${firstPickup.building ? ` - ${firstPickup.building}` : ""}`,
			receiverName: firstDropoff.recipientName || "Receiver",
			receiverPhone: firstDropoff.recipientPhone || "+966500000000",
			receiverAddress: `${firstDropoff.streetName}, ${firstDropoff.areaName}, ${firstDropoff.city}${firstDropoff.building ? ` - ${firstDropoff.building}` : ""}`,
			distance,
			deliveryFee,
			totalAmount,
			paymentMethod: "Card",
			paymentStatus: "paid" as const,
			driverName: driverData?.name || driverData?.nameAr,
			driverPhoto: driverData?.avatar,
			orderType: (storedOrderData.orderType === "multi-direction" ? "multi-direction" : "one-way") as "one-way" | "multi-direction",
		};
	}, []);

	// Fetch orders function
	const fetchOrders = useCallback(async () => {
		setIsLoading(true);
		// Simulate API call - Replace with actual API
		await new Promise((resolve) => setTimeout(resolve, 800));
		
		// Load Pick and Order data from sessionStorage
		const pickAndOrderDeliveryOrders: DeliveryOrder[] = [];
		if (typeof window !== "undefined") {
			// Get all keys from sessionStorage that start with "pickAndOrder_"
			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i);
				if (key && key.startsWith("pickAndOrder_")) {
					try {
						const storedData = sessionStorage.getItem(key);
						if (storedData) {
							const parsed = JSON.parse(storedData);
							const orderId = parsed.orderId;
							
							// Convert to DeliveryOrder format
							const deliveryOrder = convertPickAndOrderToDeliveryOrder(orderId, parsed);
							if (deliveryOrder) {
								pickAndOrderDeliveryOrders.push(deliveryOrder);
							}
						}
					} catch (error) {
						console.error("Error parsing Pick and Order data:", error);
					}
				}
			}
		}

		// Merge Pick and Order data with mock data
		const allDeliveryOrders = [...pickAndOrderDeliveryOrders, ...mockDeliveryOrders];
		
		// Sort by creation date (newest first)
		allDeliveryOrders.sort((a, b) => 
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

		setProductOrders(mockProductOrders);
		setServiceRequests(mockServiceRequests);
		setDeliveryOrders(allDeliveryOrders);
		setIsLoading(false);
	}, [convertPickAndOrderToDeliveryOrder]);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	// Pull-to-refresh
	const { isRefreshing, pullDistance } = usePullToRefresh({
		onRefresh: fetchOrders,
		enabled: !isLoading,
	});

	// Calculate statistics
	const stats = useMemo(() => {
		const totalOrders = productOrders.length + serviceRequests.length + deliveryOrders.length;
		const completedOrders = [
			...productOrders.filter((o) => o.status === "completed"),
			...serviceRequests.filter((s) => s.status === "completed"),
			...deliveryOrders.filter((d) => d.status === "completed" || d.status === "delivered"),
		].length;
		const totalAmount = [...productOrders, ...serviceRequests, ...deliveryOrders].reduce(
			(sum, order) => sum + order.totalAmount,
			0
		);
		return { totalOrders, completedOrders, totalAmount };
	}, [productOrders, serviceRequests, deliveryOrders]);

	// Filter and sort data - Memoized for performance
	const filteredProductOrders = useMemo(() => {
		let filtered = [...productOrders];

		// Status filter
		if (filterStatus !== "all") {
			filtered = filtered.filter((order) => order.status === filterStatus);
		}

		// Search filter
		if (searchQuery) {
			const term = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(order) =>
					order.storeName.toLowerCase().includes(term) ||
					order.orderNumber.toLowerCase().includes(term) ||
					order.storeNameAr?.toLowerCase().includes(term)
			);
		}

		// Sort
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "newest":
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case "oldest":
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				case "status":
					const statusOrder: Record<string, number> = {
						completed: 0,
						delivering: 1,
						ready: 2,
						preparing: 3,
						pending: 4,
						cancelled: 5,
					};
					return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
				default:
					return 0;
			}
		});

		return filtered;
	}, [productOrders, searchQuery, sortBy, filterStatus]);

	const filteredServiceRequests = useMemo(() => {
		let filtered = [...serviceRequests];

		// Status filter
		if (filterStatus !== "all") {
			filtered = filtered.filter((request) => request.status === filterStatus);
		}

		// Search filter
		if (searchQuery) {
			const term = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(request) =>
					request.serviceName.toLowerCase().includes(term) ||
					request.requestNumber.toLowerCase().includes(term) ||
					request.serviceNameAr?.toLowerCase().includes(term)
			);
		}

		// Sort
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "newest":
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case "oldest":
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				case "status":
					const statusOrder: Record<string, number> = {
						completed: 0,
						in_progress: 1,
						assigned: 2,
						pending: 3,
						cancelled: 4,
					};
					return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
				default:
					return 0;
			}
		});

		return filtered;
	}, [serviceRequests, searchQuery, sortBy, filterStatus]);

	const filteredDeliveryOrders = useMemo(() => {
		let filtered = [...deliveryOrders];

		// Status filter
		if (filterStatus !== "all") {
			filtered = filtered.filter((order) => order.status === filterStatus);
		}

		// Search filter
		if (searchQuery) {
			const term = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(order) =>
					order.orderNumber.toLowerCase().includes(term) ||
					order.senderName.toLowerCase().includes(term) ||
					order.receiverName.toLowerCase().includes(term) ||
					order.senderAddress.toLowerCase().includes(term) ||
					order.receiverAddress.toLowerCase().includes(term)
			);
		}

		// Sort
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "newest":
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case "oldest":
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				case "status":
					const statusOrder: Record<string, number> = {
						completed: 0,
						delivered: 0,
						in_transit: 1,
						picked_up: 2,
						assigned: 3,
						pending: 4,
						cancelled: 5,
					};
					return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
				default:
					return 0;
			}
		});

		return filtered;
	}, [deliveryOrders, searchQuery, sortBy, filterStatus]);

	// Memoized callbacks
	const handleTabChange = useCallback((tab: "products" | "services" | "delivery") => {
		setActiveTab(tab);
	}, []);

	const handleSearchChange = useCallback((term: string) => {
		setSearchQuery(term);
	}, []);

	const handleSortChange = useCallback((sort: "newest" | "oldest" | "status") => {
		setSortBy(sort);
	}, []);

	const handleFilterStatusChange = useCallback((status: string) => {
		setFilterStatus(status);
	}, []);

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isArabic ? "rtl" : "ltr"}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* Pull-to-Refresh Indicator */}
			<PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />

			{/* Header with Statistics */}
			<OrdersHeader stats={stats} activeTab={activeTab} />

			<div className="container mx-auto px-4 py-6 md:py-8">
				{/* Tabs */}
				<OrdersTabs activeTab={activeTab} onTabChange={handleTabChange} language={language} />

				{/* Search and Filter Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mb-6"
				>
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<OrdersFilters
							searchTerm={searchQuery}
							onSearchChange={handleSearchChange}
							sortBy={sortBy}
							onSortChange={handleSortChange}
							filterStatus={filterStatus}
							onFilterStatusChange={handleFilterStatusChange}
						/>
					</div>
				</motion.div>

				{/* Content */}
				{isLoading ? (
					<OrderListSkeleton />
				) : (
					<AnimatePresence mode="wait">
						{activeTab === "products" ? (
							<motion.div
								key="products"
								initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: isArabic ? -20 : 20 }}
								transition={{ duration: 0.3 }}
								className="space-y-4 sm:space-y-6"
							>
								{filteredProductOrders.length === 0 ? (
									<EmptyOrdersState type="products" />
								) : filteredProductOrders.length > 50 ? (
									<VirtualizedOrderList
										items={filteredProductOrders}
										renderItem={(order, index) => (
											<div className="mb-4 sm:mb-6">
												<SwipeableOrderCard
													onTrack={() => router.push(`/my-orders/${order.orderNumber}/track`)}
													canTrack={true}
												>
													<ProductOrderCard order={order} />
												</SwipeableOrderCard>
											</div>
										)}
										estimateSize={220}
									/>
								) : (
									filteredProductOrders.map((order, index) => (
										<motion.div
											key={order.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05, duration: 0.3 }}
											whileHover={{ y: -2 }}
										>
											<SwipeableOrderCard
												onTrack={() => router.push(`/my-orders/${order.orderNumber}/track`)}
												canTrack={true}
											>
												<ProductOrderCard order={order} />
											</SwipeableOrderCard>
										</motion.div>
									))
								)}
							</motion.div>
						) : activeTab === "services" ? (
							<motion.div
								key="services"
								initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: isArabic ? -20 : 20 }}
								transition={{ duration: 0.3 }}
								className="space-y-4 sm:space-y-6"
							>
								{filteredServiceRequests.length === 0 ? (
									<EmptyOrdersState type="services" />
								) : filteredServiceRequests.length > 50 ? (
									<VirtualizedOrderList
										items={filteredServiceRequests}
										renderItem={(request, index) => (
											<div className="mb-4 sm:mb-6">
												<SwipeableOrderCard
													onTrack={() => router.push(`/my-orders/${request.requestNumber}/track`)}
													canTrack={true}
												>
													<ServiceOrderCard request={request} />
												</SwipeableOrderCard>
											</div>
										)}
										estimateSize={220}
									/>
								) : (
									filteredServiceRequests.map((request, index) => (
										<motion.div
											key={request.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05, duration: 0.3 }}
											whileHover={{ y: -2 }}
										>
											<SwipeableOrderCard
												onTrack={() => router.push(`/my-orders/${request.requestNumber}/track`)}
												canTrack={true}
											>
												<ServiceOrderCard request={request} />
											</SwipeableOrderCard>
										</motion.div>
									))
								)}
							</motion.div>
						) : (
							<motion.div
								key="delivery"
								initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: isArabic ? -20 : 20 }}
								transition={{ duration: 0.3 }}
								className="space-y-4 sm:space-y-6"
							>
								{filteredDeliveryOrders.length === 0 ? (
									<EmptyOrdersState type="delivery" />
								) : filteredDeliveryOrders.length > 50 ? (
									<VirtualizedOrderList
										items={filteredDeliveryOrders}
										renderItem={(order, index) => (
											<div className="mb-4 sm:mb-6">
												<SwipeableOrderCard
													onTrack={() => router.push(`/my-orders/${order.orderNumber}/track`)}
													canTrack={true}
												>
													<DeliveryOrderCard order={order} />
												</SwipeableOrderCard>
											</div>
										)}
										estimateSize={220}
									/>
								) : (
									filteredDeliveryOrders.map((order, index) => (
										<motion.div
											key={order.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05, duration: 0.3 }}
											whileHover={{ y: -2 }}
										>
											<SwipeableOrderCard
												onTrack={() => router.push(`/my-orders/${order.orderNumber}/track`)}
												canTrack={true}
											>
												<DeliveryOrderCard order={order} />
											</SwipeableOrderCard>
										</motion.div>
									))
								)}
							</motion.div>
						)}
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}


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
		orderNumber: "DEL-2025-001",
		transportType: "motorbike",
		status: "completed",
		createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		senderName: "Ahmed Mohammed",
		senderPhone: "+966 50 123 4567",
		senderAddress: "King Fahd Street, Al-Nakheel District, Riyadh",
		receiverName: "Fatima Ali",
		receiverPhone: "+966 50 987 6543",
		receiverAddress: "Prince Sultan Street, Al-Worood District, Riyadh",
		distance: 10.75,
		deliveryFee: 9,
		totalAmount: 9,
		paymentMethod: "Card",
		paymentStatus: "paid",
		driverName: "Khalid Al-Rashid",
		driverPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
		orderType: "one-way",
	},
	{
		id: "2",
		orderNumber: "DEL-2025-002",
		transportType: "truck",
		status: "in_transit",
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		senderName: "Mohammed Hassan",
		senderPhone: "+966 50 111 2222",
		senderAddress: "Olaya Street, Al-Olaya District, Riyadh",
		receiverName: "Sara Ahmed",
		receiverPhone: "+966 50 333 4444",
		receiverAddress: "King Abdullah Road, Al-Malaz District, Riyadh",
		distance: 25.5,
		deliveryFee: 25,
		totalAmount: 25,
		paymentMethod: "Mada",
		paymentStatus: "paid",
		driverName: "Omar Al-Saud",
		orderType: "multi-direction",
	},
	{
		id: "3",
		orderNumber: "DEL-2025-003",
		transportType: "motorbike",
		status: "assigned",
		createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		senderName: "Ali Ibrahim",
		senderPhone: "+966 50 555 6666",
		senderAddress: "Tahlia Street, Al-Wurud District, Riyadh",
		receiverName: "Noura Al-Mansouri",
		receiverPhone: "+966 50 777 8888",
		receiverAddress: "Airport Road, Al-Khaleej District, Riyadh",
		distance: 15.2,
		deliveryFee: 12,
		totalAmount: 12,
		paymentMethod: "Cash",
		paymentStatus: "pending",
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

	// Mock API calls - Replace with real API calls
	const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
	const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
	const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch orders function
	const fetchOrders = useCallback(async () => {
		setIsLoading(true);
		// Simulate API call - Replace with actual API
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setProductOrders(mockProductOrders);
		setServiceRequests(mockServiceRequests);
		setDeliveryOrders(mockDeliveryOrders);
		setIsLoading(false);
	}, []);

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


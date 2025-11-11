"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Filter, ArrowUpDown, Calendar, Clock, TrendingUp, Package, ShoppingBag } from "lucide-react";
import OrdersTabs from "./OrdersTabs";
import ProductOrderCard from "./ProductOrderCard";
import ServiceRequestCard from "./ServiceRequestCard";
import EmptyState from "./EmptyState";

// Mock data types
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

export default function MyOrdersPage() {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [activeTab, setActiveTab] = useState<"products" | "services">("products");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<"newest" | "oldest" | "status">("newest");
	const [showFilterModal, setShowFilterModal] = useState(false);

	// Mock API calls - Replace with real API calls
	const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
	const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate API call
		setIsLoading(true);
		setTimeout(() => {
			setProductOrders(mockProductOrders);
			setServiceRequests(mockServiceRequests);
			setIsLoading(false);
		}, 500);
	}, []);

	// Calculate statistics
	const stats = useMemo(() => {
		const totalOrders = productOrders.length + serviceRequests.length;
		const completedOrders = [
			...productOrders.filter((o) => o.status === "completed"),
			...serviceRequests.filter((s) => s.status === "completed"),
		].length;
		const totalAmount = [...productOrders, ...serviceRequests].reduce(
			(sum, order) => sum + order.totalAmount,
			0
		);
		return { totalOrders, completedOrders, totalAmount };
	}, [productOrders, serviceRequests]);

	// Filter and sort data
	const filteredProductOrders = useMemo(() => {
		let filtered = [...productOrders];

		// Search filter
		if (searchQuery) {
			filtered = filtered.filter(
				(order) =>
					order.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
					order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
					order.storeNameAr?.toLowerCase().includes(searchQuery.toLowerCase())
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
	}, [productOrders, searchQuery, sortBy]);

	const filteredServiceRequests = useMemo(() => {
		let filtered = [...serviceRequests];

		// Search filter
		if (searchQuery) {
			filtered = filtered.filter(
				(request) =>
					request.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
					request.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
					request.serviceNameAr?.toLowerCase().includes(searchQuery.toLowerCase())
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
	}, [serviceRequests, searchQuery, sortBy]);

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isArabic ? "rtl" : "ltr"}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			<div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				{/* Header with Gradient Banner */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="relative mb-6 sm:mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-green-600 via-green-600 to-emerald-600 dark:from-green-700 dark:via-green-700 dark:to-emerald-700 p-6 sm:p-8 text-white shadow-lg"
				>
					{/* Decorative Elements */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full -mr-32 -mt-32"></div>
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 dark:bg-white/5 rounded-full -ml-24 -mb-24"></div>

					<div className="relative z-10">
						<div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isArabic ? "text-right" : "text-left"}`}>
							<div>
								<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
									{isArabic ? "طلباتي" : "My Orders"}
								</h1>
								<p className="text-sm sm:text-base opacity-90">
									{isArabic
										? "إدارة طلبات المنتجات وطلبات الخدمات الخاصة بك"
										: "Manage your product orders and service requests"}
								</p>
							</div>

							{/* Stats Cards */}
							<div className="grid grid-cols-3 gap-3 sm:gap-4">
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.2 }}
									className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center"
								>
									<div className="text-2xl sm:text-3xl font-bold">{stats.totalOrders}</div>
									<div className="text-xs sm:text-sm opacity-90">{isArabic ? "إجمالي الطلبات" : "Total Orders"}</div>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.3 }}
									className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center"
								>
									<div className="text-2xl sm:text-3xl font-bold">{stats.completedOrders}</div>
									<div className="text-xs sm:text-sm opacity-90">{isArabic ? "مكتملة" : "Completed"}</div>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.4 }}
									className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center"
								>
									<div className="text-lg sm:text-xl font-bold">{stats.totalAmount.toFixed(0)}</div>
									<div className="text-xs opacity-90">{isArabic ? "ر.س" : "SAR"}</div>
								</motion.div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Tabs */}
				<OrdersTabs activeTab={activeTab} onTabChange={setActiveTab} language={language} />

				{/* Search and Filter Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mb-6"
				>
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className={`flex flex-col sm:flex-row gap-3 sm:gap-4`}>
							{/* Search */}
							<div className="flex-1 relative">
								<Search
									className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} w-5 h-5 text-gray-400 dark:text-gray-500`}
								/>
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder={isArabic ? "ابحث عن طلب برقم أو اسم المتجر..." : "Search by order number or store name..."}
									className={`w-full ${isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4"} py-3.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 focus:outline-none transition-all bg-gray-50/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
									dir={isArabic ? "rtl" : "ltr"}
								/>
							</div>

							{/* Sort */}
							<div className={`relative ${isArabic ? "sm:mr-auto" : "sm:ml-auto"} sm:w-48`}>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "status")}
									className={`appearance-none w-full ${isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4"} py-3.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 focus:outline-none transition-all bg-gray-50/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 font-semibold text-sm cursor-pointer text-gray-900 dark:text-gray-100`}
									dir={isArabic ? "rtl" : "ltr"}
								>
									<option value="newest">{isArabic ? "الأحدث أولاً" : "Newest First"}</option>
									<option value="oldest">{isArabic ? "الأقدم أولاً" : "Oldest First"}</option>
									<option value="status">{isArabic ? "حسب الحالة" : "By Status"}</option>
								</select>
								<ArrowUpDown
									className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-4" : "right-4"} w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none`}
								/>
							</div>

							{/* Filter Button */}
							<button
								onClick={() => setShowFilterModal(!showFilterModal)}
								className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all bg-white dark:bg-gray-700 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 touch-manipulation text-gray-700 dark:text-gray-200 ${isArabic ? "flex-row-reverse" : ""}`}
							>
								<Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
								<span>{isArabic ? "تصفية" : "Filter"}</span>
							</button>
						</div>
					</div>
				</motion.div>

				{/* Content */}
				{isLoading ? (
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: i * 0.1 }}
								className="h-48 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 animate-pulse"
							>
								<div className="p-6">
									<div className="flex items-center gap-4 mb-4">
										<div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
										<div className="flex-1 space-y-2">
											<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
											<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
										</div>
									</div>
									<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
								</div>
							</motion.div>
						))}
					</div>
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
									<EmptyState type="products" language={language} />
								) : (
									filteredProductOrders.map((order, index) => (
										<motion.div
											key={order.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05, duration: 0.3 }}
											whileHover={{ y: -2 }}
										>
											<ProductOrderCard order={order} language={language} />
										</motion.div>
									))
								)}
							</motion.div>
						) : (
							<motion.div
								key="services"
								initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: isArabic ? -20 : 20 }}
								transition={{ duration: 0.3 }}
								className="space-y-4 sm:space-y-6"
							>
								{filteredServiceRequests.length === 0 ? (
									<EmptyState type="services" language={language} />
								) : (
									filteredServiceRequests.map((request, index) => (
										<motion.div
											key={request.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05, duration: 0.3 }}
											whileHover={{ y: -2 }}
										>
											<ServiceRequestCard request={request} language={language} />
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

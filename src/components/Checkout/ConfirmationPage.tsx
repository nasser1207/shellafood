"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams, useRouter } from "next/navigation";
import ConfirmationCard from "./ConfirmationCard";
import ActionButtons from "./ActionButtons";

interface OrderData {
	order_id: string;
	type: "service" | "product";
	status: "success" | "pending" | "failed";
	payment_method: string;
	total_amount: number;
	currency?: string;
	eta?: string;
	address?: string;
	store_or_provider?: string;
	created_at?: string;
}

export default function ConfirmationPage() {
	const { language } = useLanguage();
	const searchParams = useSearchParams();
	const router = useRouter();
	const isArabic = language === "ar";
	const [orderData, setOrderData] = useState<OrderData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const orderType = searchParams.get("type") || "product";

	useEffect(() => {
		fetchOrderData();
	}, []);

	useEffect(() => {
		if (orderData?.status === "success") {
			// Optional: Auto-redirect to tracking after 10 seconds
			// const timer = setTimeout(() => {
			// 	router.push(`/my-orders`);
			// }, 10000);
			// return () => clearTimeout(timer);
		}
	}, [orderData, isArabic]);

	const fetchOrderData = async () => {
		setIsLoading(true);
		try {
			// Mock API call - replace with actual API endpoint
			// const response = await fetch(`/api/checkout/confirmation?orderId=${orderId}`);
			// const data = await response.json();

			// For now, use mock data based on URL params
			const mockData: OrderData = {
				order_id: `ORD-${Date.now()}`,
				type: orderType === "service" ? "service" : "product",
				status: "success",
				payment_method: "Apple Pay",
				total_amount: 230.0,
				currency: "SAR",
				eta: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 minutes from now
				address: "Riyadh, Al Olaya Street, Building 5, Apartment 201",
				store_or_provider: orderType === "service" ? "AC Pro Maintenance" : "Star Market",
				created_at: new Date().toISOString(),
			};

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 500));
			setOrderData(mockData);
		} catch (error) {
			console.error("Error fetching order data:", error);
			setOrderData({
				order_id: "N/A",
				type: orderType === "service" ? "service" : "product",
				status: "failed",
				payment_method: "N/A",
				total_amount: 0,
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50 dark:from-[#0B0C10] dark:via-[#0B0C10] dark:to-[#1B1D22] flex items-center justify-center p-4">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-gray-600 dark:text-gray-400">
						{isArabic ? "جاري التحميل..." : "Loading..."}
					</p>
				</div>
			</div>
		);
	}

	if (!orderData) {
		return null;
	}

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50 dark:from-[#0B0C10] dark:via-[#0B0C10] dark:to-[#1B1D22] flex items-center justify-center p-4 sm:p-6 ${
				isArabic ? "rtl" : "ltr"
			}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			<div className="w-full max-w-2xl space-y-6">
				{/* Confirmation Card */}
				<ConfirmationCard
					language={language}
					orderId={orderData.order_id}
					type={orderData.type}
					status={orderData.status}
					paymentMethod={orderData.payment_method}
					totalAmount={orderData.total_amount}
					currency={orderData.currency}
					eta={orderData.eta}
					address={orderData.address}
					storeOrProvider={orderData.store_or_provider}
					createdAt={orderData.created_at}
				/>

				{/* Action Buttons */}
				<ActionButtons
					language={language}
					orderId={orderData.order_id}
					type={orderData.type}
					status={orderData.status}
				/>
			</div>
		</div>
	);
}


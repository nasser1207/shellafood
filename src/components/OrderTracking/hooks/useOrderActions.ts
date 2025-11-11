"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { OrderData, TimelineStep } from "../types";
import { RatingModal } from "@/components/ServeMe/Booking/modals";

interface UseOrderActionsProps {
	orderId: string;
	orderData: OrderData | null;
	language: "en" | "ar";
	onOrderUpdate?: (updatedOrder: OrderData) => void;
	showNotification?: (notification: any) => void;
}

export function useOrderActions({
	orderId,
	orderData,
	language,
	onOrderUpdate,
	showNotification,
}: UseOrderActionsProps) {
	const router = useRouter();
	const isArabic = language === "ar";
	const [showRating, setShowRating] = useState(false);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);

	const handleRatingSubmit = useCallback(
		async (rating: number, feedback: string) => {
			try {
				// TODO: Replace with actual API call
				// const response = await fetch(`/api/orders/${orderId}/rating`, {
				//   method: 'POST',
				//   body: JSON.stringify({ rating, feedback }),
				// });
				
				console.log("Rating submitted:", { orderId, rating, feedback });
				
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 1000));
				
				showNotification?.({
					message: isArabic
						? "شكراً لك! تم حفظ تقييمك بنجاح"
						: "Thank you! Your rating has been saved successfully",
					messageAr: "شكراً لك! تم حفظ تقييمك بنجاح",
					type: "success",
					duration: 3000,
				});
				
				setShowRating(false);
			} catch (error) {
				console.error("Error submitting rating:", error);
				showNotification?.({
					message: isArabic
						? "حدث خطأ أثناء حفظ التقييم"
						: "An error occurred while saving your rating",
					messageAr: "حدث خطأ أثناء حفظ التقييم",
					type: "error",
					duration: 5000,
				});
			}
		},
		[orderId, language, showNotification]
	);

	const handleCancel = useCallback(async () => {
		if (!orderData) return;

		setIsCancelling(true);
		try {
			// TODO: Replace with actual API call
			// const response = await fetch(`/api/orders/${orderId}/cancel`, {
			//   method: 'POST',
			// });
			
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Update order status to cancelled
			const cancellationTimelineStep: TimelineStep = {
				label: "Order Cancelled",
				labelAr: "تم إلغاء الطلب",
				time: new Date().toISOString(),
				comment: isArabic ? "تم إلغاء الطلب من قبل المستخدم" : "Order cancelled by user",
				commentAr: "تم إلغاء الطلب من قبل المستخدم",
			};

			const updatedOrder: OrderData = {
				...orderData,
				status: "cancelled",
				timeline: [...orderData.timeline, cancellationTimelineStep],
			};

			onOrderUpdate?.(updatedOrder);
			setShowCancelConfirm(false);
			
			showNotification?.({
				message: isArabic
					? "تم إلغاء الطلب بنجاح"
					: "Order cancelled successfully",
				messageAr: "تم إلغاء الطلب بنجاح",
				type: "success",
				duration: 3000,
			});
		} catch (error) {
			console.error("Error cancelling order:", error);
			showNotification?.({
				message: isArabic
					? "حدث خطأ أثناء إلغاء الطلب"
					: "An error occurred while cancelling the order",
				messageAr: "حدث خطأ أثناء إلغاء الطلب",
				type: "error",
				duration: 5000,
			});
		} finally {
			setIsCancelling(false);
		}
	}, [orderId, orderData, language, onOrderUpdate, showNotification]);

	const handleDownloadInvoice = useCallback(async () => {
		if (!orderData) return;

		setIsDownloadingInvoice(true);
		try {
			// TODO: Replace with actual API call
			// const response = await fetch(`/api/orders/${orderId}/invoice`, {
			//   method: 'GET',
			// });
			// const blob = await response.blob();
			// const url = window.URL.createObjectURL(blob);
			// const a = document.createElement('a');
			// a.href = url;
			// a.download = `invoice-${orderId}.pdf`;
			// document.body.appendChild(a);
			// a.click();
			// document.body.removeChild(a);
			// window.URL.revokeObjectURL(url);
			
			// Simulate download
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			showNotification?.({
				message: isArabic
					? "جاري تحميل الفاتورة..."
					: "Downloading invoice...",
				messageAr: "جاري تحميل الفاتورة...",
				type: "info",
				duration: 2000,
			});
			
			// For now, just log
			console.log("Download invoice for:", orderId);
		} catch (error) {
			console.error("Error downloading invoice:", error);
			showNotification?.({
				message: isArabic
					? "حدث خطأ أثناء تحميل الفاتورة"
					: "An error occurred while downloading the invoice",
				messageAr: "حدث خطأ أثناء تحميل الفاتورة",
				type: "error",
				duration: 5000,
			});
		} finally {
			setIsDownloadingInvoice(false);
		}
	}, [orderId, orderData, language, showNotification]);

	const handleReorder = useCallback(() => {
		if (!orderData?.items) return;
		
		// TODO: Implement reorder logic
		// This could add items to cart or redirect to a reorder page
		router.push("/");
	}, [orderData, router]);

	const handleCallSupport = useCallback((phone?: string) => {
		if (phone) {
			// Remove any non-numeric characters
			const cleanPhone = phone.replace(/\D/g, "");
			// Open WhatsApp with the phone number
			const whatsappUrl = `https://wa.me/${cleanPhone}`;
			window.open(whatsappUrl, "_blank");
		}
	}, []);

	const handleCallDriver = useCallback((phone?: string) => {
		if (phone) {
			// Remove any non-numeric characters
			const cleanPhone = phone.replace(/\D/g, "");
			// Open WhatsApp with the phone number
			const whatsappUrl = `https://wa.me/${cleanPhone}`;
			window.open(whatsappUrl, "_blank");
		}
	}, []);

	const handleChat = useCallback((service?: string, serviceType?: string, workerId?: string) => {
		if (workerId) {
			// Construct the chat route: /worker/[workerId]/chat
			const chatPath = `/worker/${workerId}/chat`;
			router.push(chatPath);
		} else {
			// Log for debugging
			console.warn("Chat not available - missing information:", { 
				service, 
				serviceType, 
				workerId,
				orderType: orderData?.type 
			});
			
			// Show appropriate message based on order type
			const isServiceOrder = orderData?.type === "service";
			if (isServiceOrder) {
				// For service orders, show error about missing info
				showNotification?.({
					message: isArabic
						? "معلومات الفني غير متوفرة. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب."
						: "Worker information not available. Please try again or contact via WhatsApp.",
					messageAr: "معلومات الفني غير متوفرة. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.",
					type: "error",
					duration: 4000,
				});
			} else {
				// For product orders, chat is not available
				showNotification?.({
					message: isArabic
						? "المحادثة غير متوفرة لطلب المنتجات. يرجى التواصل عبر واتساب."
						: "Chat is not available for product orders. Please contact via WhatsApp.",
					messageAr: "المحادثة غير متوفرة لطلب المنتجات. يرجى التواصل عبر واتساب.",
					type: "info",
					duration: 4000,
				});
			}
		}
	}, [language, router, showNotification, orderData]);

	return {
		showRating,
		setShowRating,
		showCancelConfirm,
		setShowCancelConfirm,
		isCancelling,
		isDownloadingInvoice,
		handleRatingSubmit,
		handleCancel,
		handleDownloadInvoice,
		handleReorder,
		handleCallSupport,
		handleCallDriver,
		handleChat,
	};
}


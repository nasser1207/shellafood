"use client";

import { useState, useEffect, useCallback } from "react";
import { OrderData } from "../types";
import {
	calculateETAFromCoordinates,
	formatETA,
	getETATimestamp,
} from "@/lib/utils/etaCalculation";
import {
	requestNotificationPermission,
	notifyOrderStatusChange,
	notifyTechnicianApproaching,
} from "@/lib/utils/browserNotifications";
import { useToastNotifications } from "../ToastNotification";

export function useOrderTracking(
	orderId: string,
	initialData: OrderData | null | undefined,
	language: "en" | "ar"
) {
	const [orderData, setOrderData] = useState<OrderData | null>(initialData || null);
	const [isLoading, setIsLoading] = useState(!initialData);
	const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
	
	// Toast notifications
	const { showNotification, currentNotification, handleClose } = useToastNotifications(language);
	
	// Track previous values for change detection
	const [previousStatus, setPreviousStatus] = useState<string | null>(null);
	const [previousETAMinutes, setPreviousETAMinutes] = useState<number | null>(null);
	const [nearArrivalNotified, setNearArrivalNotified] = useState(false);

	// Request browser notification permission on mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			requestNotificationPermission().then((permission) => {
				if (permission === "granted") {
					console.log("Notification permission granted");
				}
			});
		}
	}, []);

	// Calculate ETA in minutes dynamically
	const getETAMinutes = useCallback((): number | null => {
		if (!orderData) return null;

		// If driver/technician location is available, calculate ETA dynamically
		if (
			orderData.map.driver_lat &&
			orderData.map.driver_lng &&
			(orderData.status === "on_the_way" || orderData.status === "in_progress")
		) {
			const etaMinutes = calculateETAFromCoordinates(
				orderData.map.driver_lat,
				orderData.map.driver_lng,
				orderData.map.user_lat,
				orderData.map.user_lng
			);
			return etaMinutes;
		}

		// Fallback to static ETA if available
		if (orderData.eta) {
			const etaDate = new Date(orderData.eta);
			const now = new Date();
			const diffMinutes = Math.ceil((etaDate.getTime() - now.getTime()) / (1000 * 60));
			return diffMinutes > 0 ? diffMinutes : null;
		}

		return null;
	}, [orderData]);

	// Enhance driver data from sessionStorage if available
	useEffect(() => {
		if (!orderData?.driver_or_worker?.id) return;
		
		const storedDriverData = typeof window !== "undefined" 
			? sessionStorage.getItem(`driver_${orderData.driver_or_worker.id}`)
			: null;
		
		if (storedDriverData) {
			try {
				const parsedDriver = JSON.parse(storedDriverData);
				// Enhance driver data with stored information
				setOrderData((prev) => {
					if (!prev || !prev.driver_or_worker) return prev;
					
					return {
						...prev,
						driver_or_worker: {
							...prev.driver_or_worker,
							name: parsedDriver.name || prev.driver_or_worker.name,
							nameAr: parsedDriver.nameAr || prev.driver_or_worker.name,
							photo: parsedDriver.avatar || prev.driver_or_worker.photo,
							phone: parsedDriver.phone || prev.driver_or_worker.phone,
							vehicle: parsedDriver.vehicleModel || prev.driver_or_worker.vehicle,
						},
					};
				});
			} catch (error) {
				console.error("Error parsing stored driver data:", error);
			}
		}
	}, [orderData?.driver_or_worker?.id]);

	// Update map center when driver location changes
	useEffect(() => {
		if (orderData?.map.driver_lat && orderData?.map.driver_lng) {
			setMapCenter({
				lat: (orderData.map.user_lat + orderData.map.driver_lat) / 2,
				lng: (orderData.map.user_lng + orderData.map.driver_lng) / 2,
			});
		} else if (orderData) {
			setMapCenter({
				lat: orderData.map.user_lat,
				lng: orderData.map.user_lng,
			});
		}
	}, [orderData]);

	// Monitor status changes and show notifications
	useEffect(() => {
		if (!orderData || !previousStatus) {
			if (orderData) {
				setPreviousStatus(orderData.status);
			}
			return;
		}

		// Check if status changed
		if (orderData.status !== previousStatus) {
			const isService = orderData.type === "service";
			const statusMessages: Record<string, { en: string; ar: string }> = {
				confirmed: {
					en: isService ? "Booking confirmed" : "Order confirmed",
					ar: isService ? "تم تأكيد الحجز" : "تم تأكيد الطلب",
				},
				assigned: {
					en: isService ? "Technician assigned to your booking" : "Driver assigned to your order",
					ar: isService ? "تم تعيين فني لحجزك" : "تم تعيين سائق لطلبك",
				},
				preparing: {
					en: "Your order is being prepared",
					ar: "جاري تحضير طلبك",
				},
				on_the_way: {
					en: isService ? "Technician is on the way" : "Driver is on the way",
					ar: isService ? "الفني في الطريق إليك" : "السائق في الطريق إليك",
				},
				in_progress: {
					en: "Work in progress",
					ar: "قيد التنفيذ",
				},
				delivered: {
					en: "Order delivered successfully",
					ar: "تم التوصيل بنجاح",
				},
				completed: {
					en: isService ? "Service completed" : "Order completed",
					ar: isService ? "تم إكمال الخدمة" : "تم إكمال الطلب",
				},
			};

			const message = statusMessages[orderData.status];
			if (message) {
				// Show toast notification
				showNotification({
					message: message.en,
					messageAr: message.ar,
					type: ["completed", "delivered"].includes(orderData.status)
						? "success"
						: "info",
					duration: 5000,
				});

				// Show browser notification (type-aware)
				notifyOrderStatusChange(orderData.status, orderData.order_id, language, orderData.type);
			}

			setPreviousStatus(orderData.status);
		}
	}, [orderData, previousStatus, language, showNotification]);

	// Monitor ETA changes and near arrival
	useEffect(() => {
		if (!orderData) return;

		const currentETA = getETAMinutes();
		
		// Check for near arrival (within 5 minutes)
		if (
			currentETA !== null &&
			currentETA <= 5 &&
			currentETA > 0 &&
			!nearArrivalNotified &&
			(orderData.status === "on_the_way" || orderData.status === "in_progress") &&
			orderData.driver_or_worker?.name
		) {
			const workerName = orderData.driver_or_worker.name;
			const isService = orderData.type === "service";
			const workerLabel = isService
				? language === "ar" ? "الفني" : "Technician"
				: language === "ar" ? "السائق" : "Driver";
			
			// Show toast notification (type-aware)
			showNotification({
				message: `${workerLabel} ${workerName} is arriving in ${currentETA} ${currentETA === 1 ? "min" : "mins"}!`,
				messageAr: `${workerLabel} ${workerName} سيصل خلال ${currentETA} ${currentETA === 1 ? "دقيقة" : "دقائق"}!`,
				type: "warning",
				duration: 8000,
			});

			// Show browser notification (type-aware)
			notifyTechnicianApproaching(currentETA, workerName, language, orderData.type);
			
			setNearArrivalNotified(true);
		}

		// Reset near arrival notification if ETA increases (driver moved away)
		if (currentETA !== null && currentETA > 5) {
			setNearArrivalNotified(false);
		}

		// Track ETA changes for debugging
		if (currentETA !== previousETAMinutes) {
			setPreviousETAMinutes(currentETA);
		}
	}, [orderData, language, showNotification, nearArrivalNotified, previousETAMinutes, getETAMinutes]);

	// Simulate real-time updates with dynamic ETA calculation
	useEffect(() => {
		if (!orderData || orderData.status === "completed" || orderData.status === "delivered" || orderData.status === "cancelled") {
			return;
		}

		const interval = setInterval(() => {
			setOrderData((prev) => {
				if (!prev) return prev;
				
				// Simulate driver movement (in real app, this would come from API)
				const updatedMap = prev.map.driver_lat
					? {
							...prev.map,
							driver_lat: prev.map.driver_lat! + (Math.random() - 0.5) * 0.001,
							driver_lng: prev.map.driver_lng! + (Math.random() - 0.5) * 0.001,
					  }
					: prev.map;

				// Update ETA dynamically if driver location is available
				let updatedETA = prev.eta;
				if (
					updatedMap.driver_lat &&
					updatedMap.driver_lng &&
					(prev.status === "on_the_way" || prev.status === "in_progress")
				) {
					const etaMinutes = calculateETAFromCoordinates(
						updatedMap.driver_lat,
						updatedMap.driver_lng,
						updatedMap.user_lat,
						updatedMap.user_lng
					);
					updatedETA = getETATimestamp(etaMinutes);
				}

				return {
					...prev,
					map: updatedMap,
					eta: updatedETA,
				};
			});
		}, 10000); // Update every 10 seconds

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [orderData]);

	return {
		orderData,
		setOrderData,
		isLoading,
		setIsLoading,
		mapCenter,
		getETAMinutes,
		showNotification,
		currentNotification,
		handleClose,
	};
}


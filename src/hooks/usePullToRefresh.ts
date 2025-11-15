/**
 * Pull-to-refresh hook for mobile
 * Provides pull-to-refresh functionality with visual feedback
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface UsePullToRefreshOptions {
	onRefresh: () => Promise<void>;
	threshold?: number;
	enabled?: boolean;
}

export function usePullToRefresh({
	onRefresh,
	threshold = 80,
	enabled = true,
}: UsePullToRefreshOptions) {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [pullDistance, setPullDistance] = useState(0);
	const startY = useRef(0);
	const isPulling = useRef(false);

	const handleTouchStart = useCallback((e: TouchEvent) => {
		if (!enabled || window.scrollY !== 0 || isRefreshing) return;
		
		startY.current = e.touches[0].clientY;
		isPulling.current = true;
	}, [enabled, isRefreshing]);

	const handleTouchMove = useCallback((e: TouchEvent) => {
		if (!enabled || !isPulling.current || window.scrollY !== 0 || isRefreshing) {
			return;
		}
		
		const currentY = e.touches[0].clientY;
		const distance = Math.max(0, currentY - startY.current);
		setPullDistance(Math.min(distance, threshold * 1.5));
	}, [enabled, isRefreshing, threshold]);

	const handleTouchEnd = useCallback(async () => {
		if (!enabled || !isPulling.current) return;
		
		isPulling.current = false;
		
		if (pullDistance >= threshold && !isRefreshing) {
			setIsRefreshing(true);
			try {
				await onRefresh();
			} catch (error) {
				console.error('Pull to refresh error:', error);
			} finally {
				setIsRefreshing(false);
				setPullDistance(0);
			}
		} else {
			setPullDistance(0);
		}
	}, [enabled, pullDistance, threshold, isRefreshing, onRefresh]);

	useEffect(() => {
		if (!enabled) return;

		document.addEventListener('touchstart', handleTouchStart, { passive: true });
		document.addEventListener('touchmove', handleTouchMove, { passive: true });
		document.addEventListener('touchend', handleTouchEnd, { passive: true });

		return () => {
			document.removeEventListener('touchstart', handleTouchStart);
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleTouchEnd);
		};
	}, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

	return { isRefreshing, pullDistance };
}


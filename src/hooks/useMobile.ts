"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the current viewport is mobile
 * @param breakpoint - Breakpoint in pixels (default: 768)
 * @returns boolean indicating if viewport is mobile
 */
export function useMobile(breakpoint: number = 768): boolean {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Check if we're on the client side
		if (typeof window === "undefined") return;

		const checkMobile = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};

		// Initial check
		checkMobile();

		// Listen for resize events
		window.addEventListener("resize", checkMobile);

		// Cleanup
		return () => {
			window.removeEventListener("resize", checkMobile);
		};
	}, [breakpoint]);

	return isMobile;
}

/**
 * Hook to get viewport dimensions
 * @returns object with width and height
 */
export function useViewport() {
	const [dimensions, setDimensions] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
	});

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return dimensions;
}


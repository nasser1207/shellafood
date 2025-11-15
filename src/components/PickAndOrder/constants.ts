/**
 * Shared constants for PickAndOrder components
 * Centralized configuration for consistency and maintainability
 */

// Color constants
export const COLORS = {
	primary: "#31A342",
	primaryHover: "#2a8f38",
	secondary: "#FA9D2B",
	secondaryHover: "#E88D26",
	success: "#10b981",
	warning: "#f59e0b",
	error: "#ef4444",
} as const;

// Animation durations
export const ANIMATION_DURATION = {
	fast: 0.2,
	normal: 0.3,
	slow: 0.5,
} as const;

// Spacing constants
export const SPACING = {
	section: {
		mobile: "py-12 sm:py-16",
		desktop: "lg:py-20 xl:py-32 2xl:py-40",
	},
	container: {
		mobile: "px-4 sm:px-6",
		desktop: "lg:px-8 xl:px-12 2xl:px-16",
	},
} as const;

// Container max widths
export const MAX_WIDTHS = {
	sm: "max-w-2xl",
	md: "max-w-4xl",
	lg: "max-w-6xl",
	xl: "max-w-7xl xl:max-w-[1400px]",
	"2xl": "2xl:max-w-[1600px]",
} as const;

// Common animation variants
export const ANIMATION_VARIANTS = {
	container: {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	},
	item: {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	},
	fadeIn: {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { duration: 0.4 },
		},
	},
	slideUp: {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6 },
		},
	},
} as const;

// Viewport settings for scroll animations
export const VIEWPORT_SETTINGS = {
	once: true,
	margin: "-100px",
} as const;


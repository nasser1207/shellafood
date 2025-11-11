/**
 * Booking Details Constants
 * Centralized constants for BookingDetailsPage
 */

// Time slots for scheduled services
export const TIME_SLOTS = [
	"08:00", "09:00", "10:00", "11:00", "12:00",
	"13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
] as const;

// Media upload limits
export const MEDIA_LIMITS = {
	MAX_IMAGES: 5,
	MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB in bytes
	MAX_VIDEO_DURATION: 30, // seconds
} as const;

// Allowed video file types
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'] as const;
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm'] as const;

// Geolocation options
export const GEOLOCATION_OPTIONS = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0,
} as const;

// Default location (Riyadh)
export const DEFAULT_LOCATION = {
	lat: 24.7136,
	lng: 46.6753,
} as const;


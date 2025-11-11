/**
 * Validation Utilities for Booking Details
 */

import { MEDIA_LIMITS, ALLOWED_VIDEO_TYPES, ALLOWED_VIDEO_EXTENSIONS } from "./constants";

/**
 * Validates video file type
 */
export const validateVideoType = (file: File): boolean => {
	const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
	return ALLOWED_VIDEO_TYPES.includes(file.type as any) || 
		   ALLOWED_VIDEO_EXTENSIONS.includes(fileExtension as any);
};

/**
 * Validates video file size
 */
export const validateVideoSize = (file: File): boolean => {
	return file.size <= MEDIA_LIMITS.MAX_VIDEO_SIZE;
};

/**
 * Validates video duration
 */
export const validateVideoDuration = (file: File): Promise<boolean> => {
	return new Promise((resolve) => {
		const videoElement = document.createElement('video');
		videoElement.preload = 'metadata';
		videoElement.src = URL.createObjectURL(file);
		
		videoElement.onloadedmetadata = () => {
			window.URL.revokeObjectURL(videoElement.src);
			resolve(videoElement.duration <= MEDIA_LIMITS.MAX_VIDEO_DURATION);
		};
		
		videoElement.onerror = () => {
			window.URL.revokeObjectURL(videoElement.src);
			resolve(false);
		};
	});
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
};


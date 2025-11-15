/**
 * RTL/LTR utility functions
 * Centralized helpers for consistent bidirectional layout handling
 */

/**
 * Get flex direction class based on language
 */
export const getFlexDirection = (isArabic: boolean): string => {
	return isArabic ? "flex-row-reverse" : "";
};

/**
 * Get text alignment class based on language
 */
export const getTextAlign = (isArabic: boolean): string => {
	return isArabic ? "text-right" : "text-left";
};

/**
 * Get float alignment class based on language
 */
export const getFloatAlign = (isArabic: boolean): string => {
	return isArabic ? "float-right" : "float-left";
};

/**
 * Get margin/padding start class based on language
 */
export const getStartMargin = (isArabic: boolean, value: string): string => {
	return isArabic ? `mr-${value}` : `ml-${value}`;
};

/**
 * Get margin/padding end class based on language
 */
export const getEndMargin = (isArabic: boolean, value: string): string => {
	return isArabic ? `ml-${value}` : `mr-${value}`;
};

/**
 * Get order class for grid/flex items based on language
 */
export const getOrder = (isArabic: boolean, order1: string, order2: string): string => {
	return isArabic ? order1 : order2;
};

/**
 * Rotate arrow icon based on language
 */
export const getArrowRotation = (isArabic: boolean): string => {
	return isArabic ? "rotate-180" : "";
};


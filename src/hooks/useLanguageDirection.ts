/**
 * Custom hook for language and direction utilities
 * Centralizes RTL/LTR logic to avoid duplication
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { useMemo } from 'react';

export interface LanguageDirection {
	isArabic: boolean;
	direction: 'rtl' | 'ltr';
	language: string;
}

/**
 * Hook that provides language direction and related utilities
 */
export function useLanguageDirection(): LanguageDirection {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return useMemo(
		() => ({
			isArabic,
			direction,
			language,
		}),
		[isArabic, direction, language]
	);
}


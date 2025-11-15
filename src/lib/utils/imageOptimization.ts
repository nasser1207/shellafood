/**
 * Image optimization utilities
 * Generate blur placeholders and optimize image loading
 */

/**
 * Generate a tiny SVG placeholder for blur effect
 */
export const getImageBlurDataURL = (width = 10, height = 10): string => {
	const svg = `
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'>
			<filter id='b' color-interpolation-filters='sRGB'>
				<feGaussianBlur stdDeviation='1'/>
			</filter>
			<rect width='${width}' height='${height}' fill='%23f0f0f0' filter='url(%23b)'/>
		</svg>
	`.trim();
	
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Get optimized image sizes for responsive images
 */
export const getImageSizes = (variant: 'card' | 'hero' | 'gallery' | 'thumbnail' = 'card'): string => {
	const sizes: Record<string, string> = {
		card: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
		hero: '(max-width: 768px) 100vw, 50vw',
		gallery: '(max-width: 768px) 100vw, 50vw',
		thumbnail: '(max-width: 640px) 25vw, 128px',
	};
	
	return sizes[variant] || sizes.card;
};

/**
 * Get image quality based on context
 */
export const getImageQuality = (variant: 'card' | 'hero' | 'gallery' | 'thumbnail' = 'card'): number => {
	const quality: Record<string, number> = {
		card: 75,
		hero: 85,
		gallery: 90,
		thumbnail: 60,
	};
	
	return quality[variant] || 75;
};


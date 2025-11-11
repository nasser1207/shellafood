export function getSlugFromParam(param: string | string[] | undefined): string {
	if (!param) return '';
	if (Array.isArray(param)) return param[0] || '';
	return param;
}

export function buildCategoryPath(segments: string[]): string {
	return `/categories/${segments.filter(Boolean).join('/')}`;
}

export function extractRouteSegments(pathname: string): {
	category?: string;
	store?: string;
	department?: string;
	product?: string;
} {
	const parts = pathname.split('/').filter(Boolean);
	const segments: Record<string, string> = {};

	if (parts[0] === 'categories') {
		if (parts[1]) segments.category = parts[1];
		if (parts[2]) segments.store = parts[2];
		if (parts[3]) segments.department = parts[3];
		if (parts[4]) segments.product = parts[4];
	}

	return segments;
}

export function validateSlug(slug: string): boolean {
	if (!slug || slug.trim().length === 0) return false;
	return /^[a-z0-9-]+$/.test(slug);
}


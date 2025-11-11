import { Metadata } from 'next';

const SITE_NAME = 'شلة فود';
const SITE_URL = 'https://shellafood.com';
const TWITTER_HANDLE = '@shellafood';

interface CategoryMetadataParams {
	category: string;
	store?: string;
	department?: string;
	product?: string;
}

export function generateCategoryMetadata(params: CategoryMetadataParams): Metadata {
	const { category, store, department, product } = params;
	
	const categoryName = decodeURIComponent(category);
	const storeName = store ? decodeURIComponent(store) : undefined;
	const departmentName = department ? decodeURIComponent(department) : undefined;
	const productName = product ? decodeURIComponent(product).replace(/-/g, ' ') : undefined;

	let title = categoryName;
	let description = `تصفح المتاجر والأقسام في ${categoryName}. اكتشف أفضل المنتجات والعروض في ${SITE_NAME}.`;
	let keywords = [categoryName, 'قسم', 'متاجر', 'أقسام', 'منتجات', 'تسوق', SITE_NAME];

	if (productName && departmentName && storeName) {
		title = `${productName} - ${storeName}`;
		description = `عرض تفاصيل ${productName} من ${departmentName} في ${storeName} ضمن ${categoryName}. أضف إلى السلة واكمل الطلب في ${SITE_NAME}.`;
		keywords = [productName, departmentName, storeName, categoryName, 'تفاصيل المنتج', 'تسوق', SITE_NAME];
	} else if (departmentName && storeName) {
		title = `${departmentName} - ${storeName}`;
		description = `تصفح المنتجات في قسم ${departmentName} في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في ${SITE_NAME}.`;
		keywords = [departmentName, storeName, categoryName, 'منتجات', 'تسوق', SITE_NAME];
	} else if (storeName) {
		title = `${storeName} - ${categoryName}`;
		description = `تصفح الأقسام والمنتجات في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في ${SITE_NAME}.`;
		keywords = [storeName, categoryName, 'متجر', 'أقسام', 'منتجات', 'تسوق', SITE_NAME];
	}

	const urlPath = [
		'/categories',
		encodeURIComponent(category),
		store && encodeURIComponent(store),
		department && encodeURIComponent(department),
		product && encodeURIComponent(product),
	].filter(Boolean).join('/');

	const url = `${SITE_URL}${urlPath}`;

	return {
		title: `${title} | ${SITE_NAME}`,
		description,
		keywords,
		authors: [{ name: SITE_NAME }],
		creator: SITE_NAME,
		publisher: SITE_NAME,
		openGraph: {
			title: `${title} | ${SITE_NAME}`,
			description,
			type: 'website',
			url,
			siteName: SITE_NAME,
			locale: 'ar_SA',
			alternateLocale: ['en_US'],
		},
		twitter: {
			card: 'summary_large_image',
			title: `${title} | ${SITE_NAME}`,
			description,
			creator: TWITTER_HANDLE,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		alternates: {
			canonical: url,
		},
		metadataBase: new URL(SITE_URL),
	};
}


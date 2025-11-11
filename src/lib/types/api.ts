// Consolidated API interfaces (excluding uploadthing)

export interface Discount {
	id: string;
	title: string;
	description: string;
	time: string;
	image: string;
}

export interface Category {
	id: string;
	name: string;
	description?: string;
	image?: string;
}

export interface SearchResult {
	id: string;
	name: string;
	type: "store" | "product";
	image: string | null;
	description?: string;
	rating?: number;
	price?: string;
	storeName?: string;
	hasProducts?: boolean;
	hasCategories?: boolean;
}
// نوع بيانات المتجر
export interface NearbyStore {
	id: string;
	name: string;
	type: string | null;
	rating: number | null;
	image: string | null;
	location: string | null;
	logo: string | null;
	hasProducts: boolean;
	distance: number | null;
	storeLat: number | null;
	storeLng: number | null;
}

// شكل بيانات القسم
export interface StoreCategory {
	id: string;
	name: string;
	storecover: string | null;
	storelogo: string | null;
}

// معلومات المتجر
export interface StoreInfo {
	id: string;
	name: string;
	type: string | null;
	rating: number | null;
	image: string | null;
}

// النتيجة النهائية
export type StoreCategoriesResult =
	| {
			categories: string[];
			storeCategories: StoreCategory[];
			storeExists: true;
			store: StoreInfo;
			cached: boolean;
			success: true;
	  }
	| {
			categories: string[]; // تعديل بدل []
			storeExists: false;
			cached: boolean;
			success: false;
	  }
	| { error: string; success: false };

/**
 * Consolidated type definitions for Categories System
 * Single source of truth for all category-related types
 */

export interface Product {
	id: string;
	slug: string;
	name: string;
	nameAr: string;
	storeId: string;
	department: string;
	image: string;
	images?: string[];
	price: number;
	originalPrice?: number;
	unit: string;
	unitAr: string;
	description: string;
	descriptionAr: string;
	rating: number;
	reviewsCount: number;
	inStock: boolean;
	stockQuantity: number;
	badge?: string;
	badgeAr?: string;
	brand?: string;
	deliveryTime: string;
	deliveryTimeAr: string;
	ingredients?: string[];
	ingredientsAr?: string[];
	nutritionalInfo?: NutritionalInfo;
	allergens?: string[];
	allergensAr?: string[];
	category?: string;
}

export interface NutritionalInfo {
	calories?: number;
	protein?: number;
	carbs?: number;
	fat?: number;
	fiber?: number;
	sugar?: number;
	sodium?: number;
}

export interface Store {
	id: string;
	slug: string;
	name: string;
	nameAr: string;
	image: string;
	logo?: string;
	type: string;
	typeAr: string;
	rating: number;
	reviewsCount?: number;
	deliveryTime: string;
	deliveryTimeAr: string;
	address: string;
	addressAr: string;
	phone?: string;
	email?: string;
	isOpen: boolean;
	isVerified: boolean;
	description?: string;
	descriptionAr?: string;
}

export interface Category {
	id: string;
	slug: string;
	name: string;
	nameAr: string;
	image: string;
	icon?: string;
	color?: string;
	description?: string;
	descriptionAr?: string;
}

export interface Department {
	id: string;
	name: string;
	nameAr: string;
	slug: string;
	icon?: string;
	color?: string;
	productCount?: number;
	description?: string;
	descriptionAr?: string;
}

export type ProductCardVariant = 'default' | 'mobile' | 'compact' | 'list';

export interface ProductCardProps {
	product: Product;
	variant?: ProductCardVariant;
	onClick?: (productId: string) => void;
	onQuickAdd?: (product: Product) => void;
	showActions?: boolean;
	showRating?: boolean;
	showStock?: boolean;
	showDelivery?: boolean;
	className?: string;
	index?: number;
	storeId?: string;
	storeName?: string;
	storeNameAr?: string;
}


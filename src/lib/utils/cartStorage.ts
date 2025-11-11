'use client';

export interface CartProductItem {
	id: string;
	productId: string;
	productName: string;
	productNameAr?: string;
	productImage?: string;
	quantity: number;
	priceAtAdd: number;
	storeId: string;
	storeName: string;
	storeNameAr?: string;
	storeLogo?: string;
	stock?: number;
	hasSpecialOffer?: boolean;
}

const CART_STORAGE_KEY = 'shella_cart_items';

export function getCartItems(): CartProductItem[] {
	if (typeof window === 'undefined') return [];
	
	try {
		const stored = localStorage.getItem(CART_STORAGE_KEY);
		if (!stored) return [];
		return JSON.parse(stored);
	} catch (error) {
		console.error('Error reading cart from localStorage:', error);
		return [];
	}
}

export function saveCartItems(items: CartProductItem[]): void {
	if (typeof window === 'undefined') return;
	
	try {
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
		// Dispatch custom event for cart updates
		window.dispatchEvent(new CustomEvent('cartUpdated'));
	} catch (error) {
		console.error('Error saving cart to localStorage:', error);
	}
}

export function addToCartStorage(item: Omit<CartProductItem, 'id'>): { success: boolean; message: string; requiresClearCart?: boolean } {
	const existingItems = getCartItems();
	
	// Check if cart has items from different store
	if (existingItems.length > 0 && existingItems[0].storeId !== item.storeId) {
		return {
			success: false,
			message: 'You have items from a different store in your cart. Please clear cart first.',
			requiresClearCart: true,
		};
	}
	
	// Check if item already exists
	const existingItemIndex = existingItems.findIndex(
		(i) => i.productId === item.productId && i.storeId === item.storeId
	);
	
	if (existingItemIndex >= 0) {
		// Update quantity
		existingItems[existingItemIndex].quantity += item.quantity;
	} else {
		// Add new item
		const newItem: CartProductItem = {
			...item,
			id: `cart_${Date.now()}_${Math.random().toString(36).substring(7)}`,
		};
		existingItems.push(newItem);
	}
	
	saveCartItems(existingItems);
	return {
		success: true,
		message: 'Product added to cart successfully',
	};
}

export function updateCartItemQuantity(itemId: string, quantity: number): boolean {
	const items = getCartItems();
	const itemIndex = items.findIndex((i) => i.id === itemId);
	
	if (itemIndex < 0) return false;
	
	if (quantity <= 0) {
		items.splice(itemIndex, 1);
	} else {
		items[itemIndex].quantity = quantity;
	}
	
	saveCartItems(items);
	return true;
}

export function removeCartItem(itemId: string): boolean {
	const items = getCartItems();
	const filtered = items.filter((i) => i.id !== itemId);
	saveCartItems(filtered);
	return true;
}

export function clearCartStorage(): void {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(CART_STORAGE_KEY);
	window.dispatchEvent(new CustomEvent('cartUpdated'));
}

export function getCartItemsCount(): number {
	return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
}


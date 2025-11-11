import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Store } from '@/components/Utils/StoreCard';
import { Product } from '@/components/Utils/ProductCard';
import { Department } from '@/components/Utils/DepartmentCard';
import { extractRouteSegments, validateSlug } from './url';

export function navigateToStore(
	router: AppRouterInstance,
	categorySlug: string,
	store: Store
): void {
	if (!categorySlug || !store?.slug) {
		return;
	}
	
	if (!validateSlug(categorySlug) || !validateSlug(store.slug)) {
		return;
	}
	
	router.push(`/categories/${categorySlug}/${store.slug}`);
}

export function navigateToDepartment(
	router: AppRouterInstance,
	categorySlug: string,
	storeSlug: string,
	department: Department
): void {
	if (!categorySlug || !storeSlug || !department?.slug) {
		return;
	}
	
	if (!validateSlug(categorySlug) || !validateSlug(storeSlug) || !validateSlug(department.slug)) {
		return;
	}
	
	router.push(`/categories/${categorySlug}/${storeSlug}/${department.slug}`);
}

export function navigateToProduct(
	router: AppRouterInstance,
	categorySlug: string,
	storeSlug: string,
	departmentSlug: string,
	product: Product
): void {
	if (!categorySlug || !storeSlug || !departmentSlug || !product?.slug) {
		return;
	}
	
	if (!validateSlug(categorySlug) || !validateSlug(storeSlug) || !validateSlug(departmentSlug) || !validateSlug(product.slug)) {
		return;
	}
	
	router.push(`/categories/${categorySlug}/${storeSlug}/${departmentSlug}/${product.slug}`);
}

export function navigateToProductFromContext(
	router: AppRouterInstance,
	product: Product,
	categorySlug?: string,
	storeSlug?: string,
	departmentSlug?: string
): void {
	if (!product?.slug) {
		return;
	}

	let routeCategory = categorySlug;
	let routeStore = storeSlug;
	let routeDepartment = departmentSlug;

	if ((!routeCategory || !routeStore) && typeof window !== 'undefined') {
		const segments = extractRouteSegments(window.location.pathname);
		routeCategory = routeCategory || segments.category || '';
		routeStore = routeStore || segments.store || '';
		routeDepartment = routeDepartment || segments.department || 'food';
	}

	if (!routeCategory || !routeStore) {
		return;
	}

	navigateToProduct(router, routeCategory, routeStore, routeDepartment || 'food', product);
}


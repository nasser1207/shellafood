/**
 * Helper functions for store-related data operations
 */


import { Department } from '@/components/Utils/DepartmentCard';
import { TEST_PRODUCTS, TEST_DEPARTMENTS } from './testData';

/**
 * Get departments that have products in a specific store
 */
export function getDepartmentsByStore(storeId: string): Department[] {
	const storeProducts = TEST_PRODUCTS.filter(p => p.storeId === storeId);
	const departmentNames = new Set(
		storeProducts
			.map(p => p.department)
			.filter((d): d is string => !!d)
	);
	
	// Return departments that match the product departments
	return TEST_DEPARTMENTS.filter(d => departmentNames.has(d.name));
}

/**
 * Get department name (English) from Arabic name or vice versa
 */
export function getDepartmentName(departmentName: string): string {
	const department = TEST_DEPARTMENTS.find(
		d => d.name === departmentName || d.nameAr === departmentName
	);
	return department?.name || departmentName;
}


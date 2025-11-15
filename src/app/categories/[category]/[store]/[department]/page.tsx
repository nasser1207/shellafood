import DepartmentView from '@/components/Categories/Department/DepartmentView';
import { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/utils/categories/metadata';
import { getProductsByStoreAndDepartmentSlug, findStoreBySlug } from '@/lib/data/categories/testData';
import { decodeParam } from '@/lib/utils/categories/url';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; store: string; department: string }> }): Promise<Metadata> {
	const { category, store, department } = await params;
	return generateCategoryMetadata({ 
		category, 
		store, 
		department 
	});
}

export default async function DepartmentRoute({ params }: { params: Promise<{ category: string; store: string; department: string }> }) {
	const { category, store: storeSlug, department: departmentSlug } = await params;

	// Decode URL params
	const decodedStoreSlug = decodeParam(storeSlug);
	const decodedDepartmentSlug = decodeParam(departmentSlug);

	// Find store by slug
	const store = findStoreBySlug(decodedStoreSlug);
	
	// If store not found, return empty products
	if (!store) {
		return <DepartmentView products={[]} />;
	}

	// Get products for this store and department
	const products = getProductsByStoreAndDepartmentSlug(store.id, decodedDepartmentSlug);

	return <DepartmentView products={products} />;
}

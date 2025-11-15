import StorePage from '@/components/Categories/Store/StorePage';
import { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/utils/categories/metadata';
import { 
	findStoreBySlug, 
	getProductsByStore 
} from '@/lib/data/categories/testData';
import { getDepartmentsByStore } from '@/lib/data/categories/storeHelpers';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; store: string }> }): Promise<Metadata> {
	const { category, store } = await params;
	return generateCategoryMetadata({ category, store });
}

export default async function StoreRoute({ params }: { params: Promise<{ category: string; store: string }> }) {
	const { category, store: storeSlug } = await params;

	// Find store by slug
	const store = findStoreBySlug(storeSlug);
	
	// If store not found, return error state
	if (!store) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						Store Not Found
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						The store you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	// Get products for this store
	const allStoreProducts = getProductsByStore(store.id);
	
	// Get departments that have products in this store
	const departments = getDepartmentsByStore(store.id);
	
	// Split products into recommended and popular for display purposes
	// Recommended: products with badges or discounts
	const recommendedProducts = allStoreProducts
		.filter(p => p.badge || (p.originalPrice && p.price && p.originalPrice > p.price))
		.slice(0, 8);
	
	// Pass all products for proper grouping by department
	// The component will handle deduplication and grouping
	const allProducts = allStoreProducts;

	return (
		<StorePage 
			recommendedProducts={recommendedProducts}
			popularProducts={allProducts}
			store={store}
			departments={departments}
		/>
	);
}

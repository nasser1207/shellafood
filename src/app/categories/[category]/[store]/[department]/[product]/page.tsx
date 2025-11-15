import ProductView from '@/components/Categories/Product/ProductView';
import { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/utils/categories/metadata';
import { 
	findProductBySlug, 
	findStoreBySlug,
	findStoreById,
	getRelatedProducts 
} from '@/lib/data/categories/testData';
import { decodeParam } from '@/lib/utils/categories/url';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; store: string; department: string; product: string }> }): Promise<Metadata> {
	const { category, store, department, product } = await params;
	return generateCategoryMetadata({ 
		category, 
		store, 
		department,
		product
	});
}

export default async function ProductRoute({ params }: { params: Promise<{ category: string; store: string; department: string; product: string }> }) {
	const { category, store: storeSlug, department, product: productSlug } = await params;

	// Decode URL params
	const decodedProductSlug = decodeParam(productSlug);
	const decodedStoreSlug = decodeParam(storeSlug);

	// Find product by slug
	const product = findProductBySlug(decodedProductSlug);
	
	// If product not found, return error state
	if (!product) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						Product Not Found
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						The product you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	// Find store by slug or by product's storeId
	let store = findStoreBySlug(decodedStoreSlug);
	if (!store && product.storeId) {
		// If store not found by slug, try to find by product's storeId
		store = findStoreById(product.storeId);
	}

	// Get related products from the same store
	const relatedProducts = product && product.storeId 
		? getRelatedProducts(product.id, product.storeId, 6)
		: [];

	return (
		<ProductView
			product={product}
			relatedProducts={relatedProducts}
			store={store || null}
		/>
	);
}

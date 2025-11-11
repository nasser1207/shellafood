import ProductView from '@/components/Categories/Product/ProductView';
import { Metadata } from 'next';
import { getProductBySlugAction } from '@/app/actions/categories/products.action';
import { generateCategoryMetadata } from '@/lib/utils/categories/metadata';

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
	const { category, store, department, product } = await params;
	const result = await getProductBySlugAction(category, store, department, product);
	
	if (!result.success || !result.product) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">Product not found</h1>
					<p className="text-gray-600">The product you're looking for doesn't exist.</p>
				</div>
			</div>
		);
	}
	
	return (
		<ProductView
			product={result.product}
			relatedProducts={result.relatedProducts || []}
			store={result.store}
		/>
	);
}

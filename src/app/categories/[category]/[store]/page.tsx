import StorePage from '@/components/Categories/Store/StorePage';
import { Metadata } from 'next';
import { getStoreBySlugAction } from '@/app/actions/categories/stores.action';
import { generateCategoryMetadata } from '@/lib/utils/categories/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; store: string }> }): Promise<Metadata> {
	const { category, store } = await params;
	return generateCategoryMetadata({ category, store });
}

export default async function StoreRoute({ params }: { params: Promise<{ category: string; store: string }> }) {
	const { category, store } = await params;
	const result = await getStoreBySlugAction(category, store);
	
	if (!result.success || !result.store) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">Store not found</h1>
					<p className="text-gray-600">The store you're looking for doesn't exist.</p>
				</div>
			</div>
		);
	}

	return (
		<StorePage 
			recommendedProducts={result.recommendedProducts || []}
			popularProducts={result.popularProducts || []}
			store={result.store}
			categories={result.departments || []}
		/>
	);
}

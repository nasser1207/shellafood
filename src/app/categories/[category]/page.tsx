import CategoryPage from '@/components/Categories/Category/CategoryPage';
import { Metadata } from 'next';
import { getStoresByCategoryAction } from '@/app/actions/categories/categories.action';
import { generateCategoryMetadata } from '@/lib/utils/categories/metadata';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
	const { category } = await params;
	return generateCategoryMetadata({ category });
}

export default async function CategoryRoute({ params }: { params: Promise<{ category: string }> }) {
	const { category } = await params;
	const result = await getStoresByCategoryAction(category);

	if (!result.success || !result.category) {
		return <CategoryPage stores={[]} categoryName="" />;
	}

	return <CategoryPage stores={result.stores || []} categoryName={result.category.name} />;
}

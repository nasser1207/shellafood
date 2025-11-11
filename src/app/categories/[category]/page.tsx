import CategoryPage from '@/components/Categories/Category/CategoryPage';
import { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/utils/categories/metadata';
import { TEST_STORES } from '@/lib/data/categories/testData';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
	const { category } = await params;
	return generateCategoryMetadata({ category });
}

export default async function CategoryRoute({ params }: { params: Promise<{ category: string }> }) {
	const { category } = await params;

	return <CategoryPage stores={TEST_STORES} categoryName={category} />;
}

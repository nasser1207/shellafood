import CategoryPage from '@/components/Categories/Category/CategoryPage';
import { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/utils/categories/metadata';
import { getStoresByCategorySlug, getCategoryBySlug } from '@/lib/data/categories/testData';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
	const { category } = await params;
	return generateCategoryMetadata({ category });
}

export default async function CategoryRoute({ params }: { params: Promise<{ category: string }> }) {
	const { category } = await params;

	// Get category info and filter stores by category slug
	const categoryData = getCategoryBySlug(category);
	const stores = getStoresByCategorySlug(category);
	
	// Use category name from data if available, otherwise use the slug
	const categoryName = categoryData?.name || category;

	return <CategoryPage stores={stores} categoryName={categoryName} categorySlug={category} />;
}

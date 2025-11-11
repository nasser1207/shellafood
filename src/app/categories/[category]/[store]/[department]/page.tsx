import DepartmentView from '@/components/Categories/Department/DepartmentView';
import { Metadata } from 'next';
import { getDepartmentProductsAction } from '@/app/actions/categories/departments.action';
import { generateCategoryMetadata } from '@/lib/utils/categories/metadata';

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
	const { category, store, department } = await params;
	const result = await getDepartmentProductsAction(category, store, department);
	
	return <DepartmentView products={result.products || []} />;
}

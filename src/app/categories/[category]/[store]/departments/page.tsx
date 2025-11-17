import { Metadata } from 'next';
import DepartmentsPage from '@/components/Categories/Store/DepartmentsPage';
import { 
	findStoreBySlug, 
} from '@/lib/data/categories/testData';
import { getDepartmentsByStore } from '@/lib/data/categories/storeHelpers';
import { generateCategoryMetadata } from '@/lib/utils/categories/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; store: string }> }): Promise<Metadata> {
	const { category, store } = await params;
	return generateCategoryMetadata({ category, store, department: 'departments' });
}

export default async function AllDepartmentsRoute({ params }: { params: Promise<{ category: string; store: string }> }) {
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

	// Get all departments for this store
	const departments = getDepartmentsByStore(store.id);

	return (
		<DepartmentsPage 
			store={store}
			departments={departments}
			categorySlug={category}
			storeSlug={storeSlug}
		/>
	);
}


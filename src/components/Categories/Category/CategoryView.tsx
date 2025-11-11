"use client";

import StoreCard, { Store } from "@/components/Utils/StoreCard";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { navigateToStore } from "@/lib/utils/categories/navigation";
import { getSlugFromParam } from "@/lib/utils/categories/url";
import PageHeader from "../shared/PageHeader";
import EmptyState from "../shared/EmptyState";

interface CategoryViewProps {
	stores: Store[];
	categoryName?: string;
}

export default function CategoryView({ stores, categoryName }: CategoryViewProps) {
	const { isArabic, direction } = useLanguageDirection();
	const router = useRouter();
	const params = useParams();
	
	const categorySlug = useMemo(() => getSlugFromParam(params?.category), [params?.category]);
	const displayTitle = useMemo(() => categoryName || '', [categoryName]);
	
	const handleStoreClick = useCallback((store: Store) => {
		if (categorySlug && store?.slug) {
			navigateToStore(router, categorySlug, store);
		}
	}, [router, categorySlug]);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<PageHeader
					title={displayTitle}
					description={isArabic ? 'تصفح المتاجر في هذا القسم' : 'Browse stores in this category'}
				/>

				{stores.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						{stores.map((store) => (
							<StoreCard 
								key={store.id} 
								store={store} 
								onClick={handleStoreClick}
							/>
						))}
					</div>
				) : (
					<EmptyState
						icon="🏪"
						title={isArabic ? 'لا توجد متاجر متاحة في هذا القسم' : 'No stores available in this category'}
						description={isArabic ? 'يرجى التحقق مرة أخرى لاحقاً' : 'Please check back later'}
					/>
				)}
			</div>
		</div>
	);
}

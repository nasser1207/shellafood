"use client";

import CategoryView from "@/components/Categories/Category/CategoryView";
import { Store } from "@/components/Utils/StoreCard";

interface CategoryPageProps {
	stores: Store[];
	categoryName?: string;
	categorySlug?: string;
}

export default function CategoryPage({ stores, categoryName, categorySlug }: CategoryPageProps) {
	return <CategoryView stores={stores} categoryName={categoryName} categorySlug={categorySlug} />;
}


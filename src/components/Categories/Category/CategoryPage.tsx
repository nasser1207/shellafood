"use client";

import CategoryView from "@/components/Categories/Category/CategoryView";
import { Store } from "@/components/Utils/StoreCard";

interface CategoryPageProps {
	stores: Store[];
	categoryName?: string;
}

export default function CategoryPage({ stores, categoryName }: CategoryPageProps) {
	return <CategoryView stores={stores} categoryName={categoryName} />;
}


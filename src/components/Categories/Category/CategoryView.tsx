"use client";

import { Store } from "@/components/Utils/StoreCard";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { getSlugFromParam } from "@/lib/utils/categories/url";
import CategoryViewComponent from "../CategoryPage/CategoryView";

interface CategoryViewProps {
	stores: Store[];
	categoryName?: string;
	categorySlug?: string;
}

export default function CategoryView({ stores, categoryName,categorySlug }: CategoryViewProps) {
	const params = useParams();
	const slug =categorySlug || useMemo(() => getSlugFromParam(params?.category), [params?.category]);

	return (
		<CategoryViewComponent
			stores={stores}
			categoryName={categoryName}
			categorySlug={slug}
		/>
	);
}

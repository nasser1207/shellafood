"use client";

import { Store } from "@/components/Utils/StoreCard";
import StoreView from "./StoreView";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/components/Utils/ProductCard";
import { Department } from "@/components/Utils/DepartmentCard";
interface StorePageProps {
	recommendedProducts?: Product[];
	popularProducts?: Product[];
	store: Store;
	categories?: Department[];
}	

export default function StorePage({ recommendedProducts = [], popularProducts = [], store, categories = [] }: StorePageProps) {
	return (
		<StoreView recommendedProducts={recommendedProducts} popularProducts={popularProducts} store={store} departments={categories} />
	);
}

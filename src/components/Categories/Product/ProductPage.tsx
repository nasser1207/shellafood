"use client";

import { Product } from "@/types/categories";
import { Store } from "@/components/Utils/StoreCard";
import ProductViewComponent from "../ProductPage/ProductView";

interface ProductPageProps {
	product: Product;
	relatedProducts: Product[];
	store?: Store | null;
}

export default function ProductPage({
	product,
	relatedProducts,
	store,
}: ProductPageProps) {
	return (
		<ProductViewComponent
			product={product}
			relatedProducts={relatedProducts}
			store={store}
		/>
	);
}


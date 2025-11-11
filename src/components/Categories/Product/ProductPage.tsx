"use client";

import ProductView from "@/components/Categories/Product/ProductView";
import { Product } from "@/components/Utils/ProductCard";

interface ProductPageProps {
	product: Product;
	relatedProducts: Product[];
}

export default function ProductPage({ product, relatedProducts }: ProductPageProps) {
	return <ProductView product={product} relatedProducts={relatedProducts} />;
}


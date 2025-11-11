"use client";

import DepartmentView from "@/components/Categories/Department/DepartmentView";
import { Product } from "@/components/Utils/ProductCard";

interface DepartmentPageProps {
	products: Product[];
}

export default function DepartmentPage({ products }: DepartmentPageProps) {
	return <DepartmentView products={products} />;
}


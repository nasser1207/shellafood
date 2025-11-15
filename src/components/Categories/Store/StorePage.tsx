"use client";

import { Store } from "@/components/Utils/StoreCard";
import { useParams } from "next/navigation";
import { useMemo, memo } from "react";
import { Product } from "@/components/Utils/ProductCard";
import { Department } from "@/components/Utils/DepartmentCard";
import StoreViewComponent from "../StorePage/StoreView";
import MobileStoreView from "../StorePage/MobileStoreView";
import { useMobile } from "@/hooks/useMobile";

interface StorePageProps {
	recommendedProducts?: Product[];
	popularProducts?: Product[];
	store: Store;
	departments?: Department[];
}

function StorePage({
	recommendedProducts = [],
	popularProducts = [],
	store,
	departments = [],
}: StorePageProps) {
	const params = useParams();
	const isMobile = useMobile(768);

	const categorySlug = useMemo(() => {
		if (params?.category) {
			return Array.isArray(params.category) ? params.category[0] : params.category;
		}
		return "";
	}, [params?.category]);

	const storeSlug = useMemo(() => {
		if (params?.store) {
			return Array.isArray(params.store) ? params.store[0] : params.store;
		}
		return "";
	}, [params?.store]);

	// Group products by department
	const productsByDepartment = useMemo(() => {
		const grouped: Record<string, Product[]> = {};
		
		// Combine all products and remove duplicates by ID
		const productMap = new Map<string, Product>();
		[...recommendedProducts, ...popularProducts].forEach((product) => {
			if (!productMap.has(product.id)) {
				productMap.set(product.id, product);
			}
		});
		const allProducts = Array.from(productMap.values());

		// Group products by department
		allProducts.forEach((product) => {
			if (!product.department) return;
			
			// Find the department that matches this product's department
			const department = departments.find(
				(dept) => dept.name === product.department || dept.nameAr === product.department
			);
			
			// Use department slug as key, or department name as fallback
			const deptKey = department?.slug || department?.name || product.department;
			
			if (!grouped[deptKey]) {
				grouped[deptKey] = [];
			}
			grouped[deptKey].push(product);
		});

		// Ensure all departments have entries (even if empty)
		departments.forEach((dept) => {
			const deptKey = dept.slug || dept.name || "";
			if (!grouped[deptKey]) {
				grouped[deptKey] = [];
			}
		});

		return grouped;
		}, [recommendedProducts, popularProducts, departments]);

	const commonProps = {
		store,
		departments,
		productsByDepartment,
		categorySlug,
		storeSlug,
	};

	// Use mobile view on mobile devices, desktop view on larger screens
	return isMobile ? (
		<MobileStoreView {...commonProps} />
	) : (
		<StoreViewComponent {...commonProps} />
	);
}

export default memo(StorePage);

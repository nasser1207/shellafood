"use client";

import { memo, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export interface Department {
	name: string;
	nameAr?: string;
	slug?: string;
	image?: string;
}

interface DepartmentCardProps {
	department: Department;
	category?: string;
	store?: string;
	className?: string;
}

function DepartmentCard({
	department,
	category: propCategory,
	store: propStore,
	className = "",
}: DepartmentCardProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const displayName = isArabic && department.nameAr ? department.nameAr : department.name;
	
	const params = useParams();
	
	const departmentUrl = useMemo(() => {
		let categorySlug = propCategory || '';
		let storeSlug = propStore || '';
		
		if (!categorySlug && params?.category) {
			categorySlug = params.category as string;
		}
		if (!storeSlug && params?.store) {
			storeSlug = params.store as string;
		}
		
		if (!categorySlug || !storeSlug || !department.slug) {
			return '#';
		}
		
		return `/categories/${categorySlug}/${storeSlug}/${department.slug}`;
	}, [propCategory, propStore, department.slug, params]);
	
	return (
		<Link
			href={departmentUrl}
			dir={direction}
			className={`flex flex-col items-center rounded-lg bg-white dark:bg-gray-800 p-2 text-center shadow-sm dark:shadow-gray-900/50 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md ${className}`}
		>
			<div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 mb-2 overflow-hidden">
				{department.image ? (
					<Image
						src={department.image}
						alt={displayName}
						fill
						className="object-cover"
						loading="lazy"
						sizes="64px"
					/>
				) : (
					<span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
						{displayName.slice(0, 3).toUpperCase()}
					</span>
				)}
			</div>
			<p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">{displayName}</p>
		</Link>
	);
}

export default memo(DepartmentCard);

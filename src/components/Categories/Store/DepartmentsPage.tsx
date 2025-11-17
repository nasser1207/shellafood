"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Grid3x3, LayoutGrid, X, Store, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Store as StoreType } from "@/components/Utils/StoreCard";
import { Department } from "@/components/Utils/DepartmentCard";
import Breadcrumbs from "@/components/Categories/shared/Breadcrumbs";
import EmptyState from "@/components/Categories/shared/EmptyState";
import Image from "next/image";
import Link from "next/link";

interface DepartmentsPageProps {
	store: StoreType;
	departments: Department[];
	categorySlug: string;
	storeSlug: string;
}

export default function DepartmentsPage({
	store,
	departments,
	categorySlug,
	storeSlug,
}: DepartmentsPageProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const direction = isArabic ? "rtl" : "ltr";
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
	const [isScrolled, setIsScrolled] = useState(false);

	// Track scroll for header effects
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Filter departments based on search
	const filteredDepartments = useMemo(() => {
		if (!searchTerm.trim()) {
			return departments;
		}

		const searchLower = searchTerm.toLowerCase();
		return departments.filter((dept) => {
			const nameMatch = dept.name?.toLowerCase().includes(searchLower);
			const nameArMatch = dept.nameAr?.toLowerCase().includes(searchLower);
			const descMatch = dept.description?.toLowerCase().includes(searchLower);
			const descArMatch = dept.descriptionAr?.toLowerCase().includes(searchLower);
			return nameMatch || nameArMatch || descMatch || descArMatch;
		});
	}, [departments, searchTerm]);

	const breadcrumbItems = useMemo(
		() => [
			{ label: isArabic ? "الرئيسية" : "Home", href: "/home" },
			{
				label: isArabic ? "الأقسام" : "Categories",
				href: "/categories",
			},
			{
				label: isArabic && store.nameAr ? store.nameAr : store.name,
				href: `/categories/${categorySlug}/${storeSlug}`,
			},
			{ label: isArabic ? "الأقسام" : "Departments" },
		],
		[isArabic, store, categorySlug, storeSlug]
	);

	const content = {
		ar: {
			searchPlaceholder: "ابحث في الأقسام...",
			noResults: "لا توجد أقسام",
			noResultsDesc: "جرب البحث بكلمات أخرى",
			viewGrid: "شبكة",
			viewCompact: "مضغوط",
			clearSearch: "مسح",
			showing: "عرض",
			of: "من",
			departments: "قسم",
			back: "رجوع",
		},
		en: {
			searchPlaceholder: "Search departments...",
			noResults: "No departments found",
			noResultsDesc: "Try different search terms",
			viewGrid: "Grid",
			viewCompact: "Compact",
			clearSearch: "Clear",
			showing: "Showing",
			of: "of",
			departments: "departments",
			back: "Back",
		},
	};

	const t = content[language];

	const handleClearSearch = useCallback(() => {
		setSearchTerm("");
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={direction}>
			{/* Compact Hero Section */}
			<div className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
					{/* Breadcrumbs */}
					<div className="mb-4">
						<Breadcrumbs items={breadcrumbItems} />
					</div>

					{/* Store Header */}
					<div className={`flex items-center gap-3 sm:gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
						{store.logo && (
							<div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
								<Image
									src={store.logo}
									alt={store.name}
									fill
									className="object-cover"
									unoptimized
								/>
							</div>
						)}
						<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
							<h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-0.5 truncate">
								{isArabic && store.nameAr ? store.nameAr : store.name}
							</h1>
							<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
								<Store className="w-4 h-4" />
								<span>{departments.length} {t.departments}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Sticky Search & Filter Bar */}
			<div className={`sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl transition-all duration-200 ${
				isScrolled ? 'shadow-lg border-b border-gray-200 dark:border-gray-800' : 'border-b border-gray-100 dark:border-gray-800'
			}`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
					<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
						{/* Search Bar */}
						<div className="flex-1 relative">
							<Search className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400 pointer-events-none`} />
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder={t.searchPlaceholder}
								className={`
									w-full ${isArabic ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-2.5
									bg-gray-50 dark:bg-gray-800
									border border-gray-200 dark:border-gray-700
									rounded-xl
									text-sm text-gray-900 dark:text-white
									placeholder-gray-500 dark:placeholder-gray-400
									focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
									transition-all duration-200
								`}
							/>
							<AnimatePresence>
								{searchTerm && (
									<motion.button
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										onClick={handleClearSearch}
										className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'} w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors`}
									>
										<X className="w-3.5 h-3.5" />
									</motion.button>
								)}
							</AnimatePresence>
						</div>

						{/* View Toggle & Back */}
						<div className="flex items-center gap-2">
							{/* View Mode Toggle */}
							<div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
								<button
									onClick={() => setViewMode("grid")}
									className={`
										flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
										${viewMode === "grid"
											? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm"
											: "text-gray-600 dark:text-gray-400"
										}
									`}
								>
									<LayoutGrid className="w-4 h-4" />
									<span className="hidden sm:inline">{t.viewGrid}</span>
								</button>
								<button
									onClick={() => setViewMode("compact")}
									className={`
										flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
										${viewMode === "compact"
											? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm"
											: "text-gray-600 dark:text-gray-400"
										}
									`}
								>
									<Grid3x3 className="w-4 h-4" />
									<span className="hidden sm:inline">{t.viewCompact}</span>
								</button>
							</div>

							{/* Back Button */}
							<button
								onClick={() => router.push(`/categories/${categorySlug}/${storeSlug}`)}
								className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
							>
								<ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
								<span className="hidden sm:inline">{t.back}</span>
							</button>
						</div>
					</div>

					{/* Results Counter */}
					<AnimatePresence>
						{searchTerm && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="pt-2 text-sm text-gray-600 dark:text-gray-400"
							>
								{t.showing} <span className="font-semibold text-gray-900 dark:text-white">{filteredDepartments.length}</span> {t.of} <span className="font-semibold">{departments.length}</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Departments Grid */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{filteredDepartments.length > 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className={`
							grid gap-4
							${viewMode === "grid"
								? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
								: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
							}
						`}
					>
						{filteredDepartments.map((department, index) => (
							<motion.div
								key={department.id || index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
							>
								<DepartmentCard
									department={department}
									categorySlug={categorySlug}
									storeSlug={storeSlug}
									isCompact={viewMode === "compact"}
									isArabic={isArabic}
								/>
							</motion.div>
						))}
					</motion.div>
				) : (
					<EmptyState
						icon="🏪"
						title={t.noResults}
						description={t.noResultsDesc}
					/>
				)}
			</div>
		</div>
	);
}

// Modern Department Card Component
interface DepartmentCardProps {
	department: Department;
	categorySlug: string;
	storeSlug: string;
	isCompact: boolean;
	isArabic: boolean;
}

function DepartmentCard({
	department,
	categorySlug,
	storeSlug,
	isCompact,
	isArabic,
}: DepartmentCardProps) {
	const displayName = isArabic && department.nameAr ? department.nameAr : department.name;
	const displayDesc = isArabic && department.descriptionAr ? department.descriptionAr : department.description;
	const departmentUrl = `/categories/${categorySlug}/${storeSlug}/${department.slug}`;

	return (
		<Link
			href={departmentUrl}
			className={`
				group relative flex flex-col h-full
				rounded-xl overflow-hidden
				bg-white dark:bg-gray-900
				border border-gray-200 dark:border-gray-800
				hover:border-green-500 dark:hover:border-green-600
				hover:shadow-xl hover:shadow-green-500/10
				transition-all duration-300
				${isCompact ? 'p-3' : 'p-4'}
			`}
		>
			{/* Image Container */}
			<div className={`
				relative mb-3
				rounded-lg overflow-hidden
				bg-gray-100 dark:bg-gray-800
				${isCompact ? 'h-16 w-16 mx-auto' : 'h-24 w-full'}
				group-hover:scale-105 transition-transform duration-300
			`}>
				{department.image ? (
					<Image
						src={department.image}
						alt={displayName}
						fill
						className="object-cover"
						loading="lazy"
						unoptimized
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<span className={`font-black text-gray-400 dark:text-gray-600 ${isCompact ? 'text-lg' : 'text-2xl'}`}>
							{displayName.slice(0, 2).toUpperCase()}
						</span>
					</div>
				)}
				
				{/* Product Count Badge */}
				{department.productCount !== undefined && department.productCount > 0 && (
					<div className="absolute top-1.5 right-1.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
						{department.productCount}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 flex flex-col text-center">
				<h3 className={`
					font-bold text-gray-900 dark:text-white mb-1
					group-hover:text-green-600 dark:group-hover:text-green-400
					transition-colors
					${isCompact ? 'text-sm' : 'text-base'}
					line-clamp-2
				`}>
					{displayName}
				</h3>
				
				{!isCompact && displayDesc && (
					<p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
						{displayDesc}
					</p>
				)}
			</div>

			{/* Hover Arrow Indicator */}
			<div className={`
				mt-2 pt-2 border-t border-gray-100 dark:border-gray-800
				flex items-center justify-center gap-1
				text-green-600 dark:text-green-400
				opacity-0 group-hover:opacity-100
				transition-opacity duration-200
				${isCompact ? 'text-xs' : 'text-sm'}
			`}>
				<span className="font-medium">{isArabic ? "عرض" : "View"}</span>
				<ArrowLeft className={`w-3 h-3 ${isArabic ? '' : 'rotate-180'}`} />
			</div>
		</Link>
	);
}
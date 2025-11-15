"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import { Store } from "@/components/Utils/StoreCard";
import { motion } from "framer-motion";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import StoreCard from "../StoreCard";
import FiltersSidebar from "../shared/FiltersSidebar";
import Breadcrumbs from "../shared/Breadcrumbs";
import EmptyState from "../shared/EmptyState";
import InfiniteScrollTrigger from "../shared/InfiniteScrollTrigger";
import { useFilters } from "@/hooks/useFilters";
import { staggerContainer } from "@/lib/utils/categories/animations";

interface CategoryViewProps {
  stores: Store[];
  categoryName?: string;
  categorySlug?: string;
}

type ViewMode = "grid" | "list";
type SortOption = "rating" | "deliveryTime" | "price" | "name";

function CategoryView({
  stores,
  categoryName,
  categorySlug,
}: CategoryViewProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilter, clearFilters, hasActiveFilters } = useFilters();

  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/" },
      {
        label: isArabic ? "الأقسام" : "Categories",
        href: "/categories",
      },
      { label: categoryName || "" },
    ],
    [categoryName, isArabic]
  );

  const router = useRouter();
  
  const handleStoreClick = useCallback(
    (store: Store) => {
      if (categorySlug && store?.slug) {
        router.push(`/categories/${categorySlug}/${store.slug}`);
      }
    },
    [router, categorySlug]
  );

  // Filter and sort stores
  const filteredAndSortedStores = useMemo(() => {
    let result = [...stores];

    // Apply filters
    if (filters.rating.length > 0) {
      result = result.filter((store) => {
        const rating = parseFloat(store.rating || "0");
        return filters.rating.some((r) => rating >= r);
      });
    }

    if (filters.features.openNow) {
      result = result.filter((store) => store.isOpen === true);
    }

    if (filters.features.freeDelivery) {
      result = result.filter(
        (store) =>
          store.fee === "0" ||
          store.fee?.toLowerCase().includes("free") ||
          store.feeAr?.toLowerCase().includes("مجاني")
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (
            parseFloat(b.rating || "0") - parseFloat(a.rating || "0")
          );
        case "deliveryTime":
          const aTime = parseInt(a.deliveryTime?.replace(/\D/g, "") || "999");
          const bTime = parseInt(b.deliveryTime?.replace(/\D/g, "") || "999");
          return aTime - bTime;
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

    return result;
  }, [stores, filters, sortBy]);

  const content = {
    ar: {
      title: categoryName || "القسم",
      description: `${filteredAndSortedStores.length} متجر متاح`,
      sortBy: "ترتيب حسب",
      sortOptions: {
        rating: "التقييم",
        deliveryTime: "وقت التوصيل",
        price: "السعر",
        name: "الاسم",
      },
      filters: "الفلاتر",
      viewGrid: "عرض الشبكة",
      viewList: "عرض القائمة",
      noStores: "لا توجد متاجر متاحة في هذا القسم",
      noStoresDesc: "يرجى التحقق مرة أخرى لاحقاً",
    },
    en: {
      title: categoryName || "Category",
      description: `${filteredAndSortedStores.length} stores available`,
      sortBy: "Sort by",
      sortOptions: {
        rating: "Rating",
        deliveryTime: "Delivery Time",
        price: "Price",
        name: "Name",
      },
      filters: "Filters",
      viewGrid: "Grid View",
      viewList: "List View",
      noStores: "No stores available in this category",
      noStoresDesc: "Please check back later",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                {t.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{t.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-green-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  aria-label={t.viewGrid}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-green-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  aria-label={t.viewList}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sort & Filter Bar */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-semibold">{t.filters}</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-green-600" />
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.sortBy}:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-green-500 text-sm font-semibold"
                >
                  {Object.entries(t.sortOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAndSortedStores.length} {isArabic ? "نتيجة" : "results"}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <FiltersSidebar
              filters={filters}
              onFilterChange={updateFilter}
              onClearAll={clearFilters}
            />
          </div>

          {/* Stores Grid/List */}
          <div>
            {filteredAndSortedStores.length > 0 ? (
              <>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredAndSortedStores.map((store, index) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      index={index}
                      onClick={handleStoreClick}
                      className={viewMode === "list" ? "flex-row" : ""}
                    />
                  ))}
                </motion.div>

                {/* Infinite Scroll Trigger */}
                <InfiniteScrollTrigger
                  hasMore={false}
                  isLoading={false}
                  onLoadMore={() => {}}
                />
              </>
            ) : (
              <EmptyState
                icon="🏪"
                title={t.noStores}
                description={t.noStoresDesc}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryView;


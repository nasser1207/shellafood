"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Store } from "@/components/Utils/StoreCard";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid2x2, Grid3x3 } from "lucide-react";
import StoreCard from "../StoreCard";
import FiltersSidebar from "../shared/FiltersSidebar";
import Breadcrumbs from "../shared/Breadcrumbs";
import EmptyState from "../shared/EmptyState";
import Pagination from "./Pagination";
import { useFilters } from "@/hooks/useFilters";
import { staggerContainer } from "@/lib/utils/categories/animations";
import DailyNeeded from "./DailyNeeded";
import { useMobile } from "@/hooks/useMobile";

interface CategoryViewProps {
  stores: Store[];
  categoryName?: string;
  categorySlug?: string;
}

type MobileViewMode = "single" | "double";

function CategoryView({
  stores,
  categoryName,
  categorySlug,
}: CategoryViewProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>("single");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMobile(768);
  const { filters, updateFilter, clearFilters, hasActiveFilters } = useFilters();

  // Responsive items per page
  // Lowered for testing - increase when you have more stores (e.g., 12 for desktop, 10 for mobile)
  const itemsPerPage = useMemo(() => {
    if (isMobile) {
      return mobileViewMode === "double" ? 2 : 2; // Very low for testing with 4 restaurants
    }
    return 2; // Desktop and tablet - Very low for testing (should be 12 normally)
  }, [isMobile, mobileViewMode]);

  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/home" },
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

    if (filters.features.offers) {
      // Mock: Check if store has offers (in real app, check store.hasOffers or store.offers)
      // Using store ID hash to determine offers (consistent mock behavior)
      result = result.filter((store) => {
        const hash = store.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hash % 3 === 0; // ~33% of stores have offers
      });
    }

    if (filters.features.previouslyOrdered) {
      // Mock: Check if user has ordered from this store before
      // In real app, check user's order history
      // For now, use a mock list based on store ID hash
      result = result.filter((store) => {
        const hash = store.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hash % 4 === 0; // ~25% of stores are previously ordered
      });
    }

    if (filters.distanceRange[1] < 50) {
      result = result.filter((store) => {
        const mockDistance = parseFloat(store.location?.split(',')[0] || "0") % 10;
        return mockDistance >= filters.distanceRange[0] && mockDistance <= filters.distanceRange[1];
      });
    }

    // Apply sorting - default to rating (highest first)
    result.sort((a, b) => {
      return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
    });

    return result;
  }, [stores, filters]);

  // Paginate stores
  const paginatedStores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedStores.slice(startIndex, endIndex);
  }, [filteredAndSortedStores, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedStores.length / itemsPerPage) || 1;
  }, [filteredAndSortedStores.length, itemsPerPage]);

  // Reset to page 1 when filters change - use stringified filters to avoid unnecessary resets
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.rating.length,
    filters.features.openNow,
    filters.features.freeDelivery,
    filters.features.offers,
    filters.features.previouslyOrdered,
    filters.distanceRange[0],
    filters.distanceRange[1],
  ]);

  // Reset to page 1 when view mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [mobileViewMode]);

  // Reset to page 1 if current page is invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Handle page change with smooth scroll
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    
    // Smooth scroll to top of stores list
    setTimeout(() => {
      const storesElement = document.getElementById("stores-list");
      if (storesElement) {
        const offset = 100; // Header offset
        const elementPosition = storesElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else {
        // Fallback to top of page
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  }, []);

  // Handle filter changes - reset to page 1
  const handleFilterChange = useCallback((filterType: string, value: any) => {
    setCurrentPage(1);
    updateFilter(filterType, value);
  }, [updateFilter]);

  // Handle clear filters - reset to page 1
  const handleClearFilters = useCallback(() => {
    setCurrentPage(1);
    clearFilters();
  }, [clearFilters]);

  const content = {
    ar: {
      title: categoryName || "القسم",
      subtitle: isArabic 
        ? "اكتشف أفضل المتاجر والمطاعم في هذا القسم"
        : "Discover the best stores and restaurants in this category",
      description: `${filteredAndSortedStores.length} متجر متاح`,
      filters: "الفلاتر",
      noStores: "لا توجد متاجر متاحة في هذا القسم",
      noStoresDesc: "يرجى التحقق مرة أخرى لاحقاً",
    },
    en: {
      title: categoryName || "Category",
      subtitle: "Discover the best stores and restaurants in this category",
      description: `${filteredAndSortedStores.length} stores available`,
      filters: "Filters",
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

        {/* Daily Needed Section - Only for Supermarket (Shown First) */}
        {categorySlug === "supermarket" && (
          <DailyNeeded />
        )}

        {/* Page Header - Moved below Daily Needed for Supermarket */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {t.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Bar - Simplified */}
          <div className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base font-semibold"
              >
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{t.filters}</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-green-600" />
                )}
              </button>

              {/* Mobile View Toggle - Only visible on mobile */}
              <div className="sm:hidden flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setMobileViewMode("single")}
                  className={`p-1.5 rounded transition-colors ${
                    mobileViewMode === "single"
                      ? "bg-green-600 text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  aria-label={isArabic ? "عرض واحد" : "Single view"}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMobileViewMode("double")}
                  className={`p-1.5 rounded transition-colors ${
                    mobileViewMode === "double"
                      ? "bg-green-600 text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  aria-label={isArabic ? "عرض مزدوج" : "Double view"}
                >
                  <Grid2x2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {filteredAndSortedStores.length} {isArabic ? "نتيجة" : "results"}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <FiltersSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearFilters}
            />
          </div>

          {/* Stores Grid - Always 2 columns */}
          <div id="stores-list">
            {filteredAndSortedStores.length > 0 ? (
              <>
                <motion.div
                  key={`stores-page-${currentPage}`}
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className={`grid ${
                    mobileViewMode === "double" 
                      ? "grid-cols-2 gap-2.5" 
                      : "grid-cols-1 gap-4"
                  } sm:grid-cols-2 sm:gap-4 lg:gap-5`}
                >
                  {paginatedStores.map((store) => {
                    // Determine store tags/badges
                    const storeTags: string[] = [];
                    
                    // Check if store is popular/common (high rating or many reviews)
                    const rating = parseFloat(store.rating || "0");
                    if (rating >= 4.5 || (store.reviewsCount && store.reviewsCount > 100)) {
                      storeTags.push(isArabic ? "شائع" : "Popular");
                    }
                    
                    // Check if store is close (mock distance check)
                    if (store.location) {
                      const mockDistance = parseFloat(store.location.split(',')[0] || "0") % 10;
                      if (mockDistance <= 2) {
                        storeTags.push(isArabic ? "قريب مني" : "Close to Me");
                      }
                    }
                    
                    // Check if previously ordered (mock check)
                    const hash = store.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    if (hash % 4 === 0) {
                      storeTags.push(isArabic ? "طلبت منها من قبل" : "Previously Ordered");
                    }
                    
                    return (
                      <div key={store.id} className="w-full">
                        <StoreCard
                          store={store}
                          onClick={handleStoreClick}
                          tags={storeTags}
                          isCompact={mobileViewMode === "double"}
                        />
                      </div>
                    );
                  })}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && filteredAndSortedStores.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredAndSortedStores.length}
                    itemsPerPage={itemsPerPage}
                    maxVisiblePages={isMobile ? 5 : 7}
                  />
                )}
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


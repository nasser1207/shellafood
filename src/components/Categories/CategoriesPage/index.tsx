"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useMemo, memo } from "react";
import { Category } from "@/components/Utils/CategoryCard";
import CategoriesHero from "./CategoriesHero";
import StatsBar from "./StatsBar";
import CategoriesGrid from "./CategoriesGrid";
import CategoriesGridSkeleton from "./CategoriesSkeleton";
import EmptyState from "../shared/EmptyState";
import ServicesSection from "./ServicesSection";
import TopSupermarketSection from "./TopSupermarketSection";

interface CategoriesPageProps {
  categories: (Category & { slug?: string })[];
  isLoading?: boolean;
}

function CategoriesPage({ categories, isLoading = false }: CategoriesPageProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const [searchTerm, setSearchTerm] = useState("");

  // Early return if no categories
  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon="📦"
            title={isArabic ? "لا توجد أقسام متاحة" : "No categories available"}
            description={
              isArabic
                ? "يرجى التحقق مرة أخرى لاحقاً"
                : "Please check back later"
            }
          />
        </div>
      </div>
    );
  }

  // Safety check - ensure categories is an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  const filteredCategories = useMemo(
    () =>
      safeCategories.filter((category) =>
        category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [safeCategories, searchTerm]
  );

  const hasSearchResults = filteredCategories.length > 0;
  const showNoResults = !hasSearchResults && searchTerm.trim().length > 0;

  // Calculate store counts (this would come from API in real app)
  const storeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    safeCategories.forEach((cat) => {
      if (cat?.id) {
        counts[cat.id] = Math.floor(Math.random() * 100) + 10; // Mock data
      }
    });
    return counts;
  }, [safeCategories]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-8 pb-6">
          <CategoriesHero searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

      

        {/* Top Supermarket Section */}
        <TopSupermarketSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Categories Grid Section */}
        <section className="py-12" dir={direction}>
          <div className="mb-8 text-right rtl:text-right ltr:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {isArabic ? "جميع الأقسام" : "All Categories"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isArabic 
                ? "تصفح جميع الأقسام المتاحة واختر ما يناسبك" 
                : "Browse all available categories and choose what suits you"}
            </p>
          </div>

          {isLoading ? (
            <CategoriesGridSkeleton />
          ) : (
            <>
              <CategoriesGrid
                categories={filteredCategories}
                storeCounts={storeCounts}
              />

              {showNoResults && (
                <div className="py-12">
                  <EmptyState
                    icon="🔍"
                    title={isArabic ? "لا توجد نتائج" : "No search results"}
                    description={
                      isArabic
                        ? "جرب البحث بكلمة مختلفة"
                        : "Try searching for a different term"
                    }
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default memo(CategoriesPage);


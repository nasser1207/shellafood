"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, useState, useCallback, memo } from "react";
import { Store } from "@/components/Utils/StoreCard";
import { Product } from "@/components/Utils/ProductCard";
import { Department } from "@/components/Utils/DepartmentCard";
import { Search, SlidersHorizontal } from "lucide-react";
import StoreHero from "./StoreHero";
import StickyTabs from "./StickyTabs";
import DepartmentsSidebar from "./DepartmentsSidebar";
import DepartmentSection from "./DepartmentSection";
import Breadcrumbs from "../shared/Breadcrumbs";
import ProductCard from "../ProductCard";

interface StoreViewProps {
  store: Store;
  departments: Department[];
  productsByDepartment: Record<string, Product[]>;
  categorySlug?: string;
  storeSlug?: string;
}

function StoreView({
  store,
  departments,
  productsByDepartment,
  categorySlug,
  storeSlug,
}: StoreViewProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const [activeTab, setActiveTab] = useState("menu");
  const [activeDepartment, setActiveDepartment] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/" },
      {
        label: isArabic ? "الأقسام" : "Categories",
        href: "/categories",
      },
      {
        label: categorySlug || "",
        href: categorySlug ? `/categories/${categorySlug}` : undefined,
      },
      { label: isArabic && store.nameAr ? store.nameAr : store.name },
    ],
    [categorySlug, store, isArabic]
  );

  const tabs = useMemo(
    () => [
      { id: "menu", label: "Menu", labelAr: "القائمة" },
      { id: "reviews", label: "Reviews", labelAr: "التقييمات" },
      { id: "info", label: "Info", labelAr: "المعلومات" },
      { id: "offers", label: "Offers", labelAr: "العروض" },
    ],
    []
  );

  const handleProductClick = useCallback(
    (productId: string) => {
      // Navigation handled by ProductCard
    },
    []
  );

  const handleQuickView = useCallback((product: Product) => {
    // Quick view modal would open here
    console.log("Quick view:", product);
  }, []);

  const handleDepartmentClick = useCallback(
    (department: Department) => {
      setActiveDepartment(department.slug);
      // Scroll to department section
      const element = document.getElementById(department.slug || "");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return productsByDepartment;

    const filtered: Record<string, Product[]> = {};
    Object.entries(productsByDepartment).forEach(([deptId, products]) => {
      const matching = products.filter((p) => {
        const name = isArabic && p.nameAr ? p.nameAr : p.name;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      if (matching.length > 0) {
        filtered[deptId] = matching;
      }
    });
    return filtered;
  }, [productsByDepartment, searchTerm, isArabic]);

  const content = {
    ar: {
      searchPlaceholder: "ابحث عن منتجات...",
      sort: "ترتيب",
      filter: "فلتر",
    },
    en: {
      searchPlaceholder: "Search products...",
      sort: "Sort",
      filter: "Filter",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
      {/* Hero Banner */}
      <StoreHero store={store} />

      {/* Sticky Navigation Tabs */}
      <StickyTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Departments Sidebar - Sticky */}
          <DepartmentsSidebar
            departments={departments}
            activeDepartment={activeDepartment}
            categorySlug={categorySlug}
            storeSlug={storeSlug}
            onDepartmentClick={handleDepartmentClick}
          />

          {/* Main Content */}
          <main>
            {/* Search & Filter Bar */}
            <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search
                    className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-3" : "left-3"} w-5 h-5 text-gray-400`}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className={`w-full ${isArabic ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white`}
                  />
                </div>
              </div>
            </div>

            {/* Departments with Products */}
            {activeTab === "menu" &&
              departments.map((dept) => {
                // Use department slug or name as key to match productsByDepartment
                const deptKey = dept.slug || dept.name || "";
                const products = filteredProducts[deptKey] || [];
                if (products.length === 0) return null;

                return (
                  <DepartmentSection
                    key={dept.id || dept.slug}
                    department={dept}
                    products={products}
                    categorySlug={categorySlug}
                    storeSlug={storeSlug}
                    onProductClick={handleProductClick}
                    onQuickView={handleQuickView}
                  />
                );
              })}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4">
                  {isArabic ? "التقييمات" : "Reviews"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isArabic
                    ? "لا توجد تقييمات متاحة حالياً"
                    : "No reviews available at the moment"}
                </p>
              </div>
            )}

            {/* Info Tab */}
            {activeTab === "info" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4">
                  {isArabic ? "معلومات المتجر" : "Store Information"}
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    {isArabic
                      ? "معلومات إضافية عن المتجر ستظهر هنا"
                      : "Additional store information will appear here"}
                  </p>
                </div>
              </div>
            )}

            {/* Offers Tab */}
            {activeTab === "offers" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4">
                  {isArabic ? "العروض" : "Offers"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isArabic
                    ? "لا توجد عروض متاحة حالياً"
                    : "No offers available at the moment"}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default memo(StoreView);


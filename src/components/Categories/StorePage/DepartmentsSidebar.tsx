"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Department } from "@/types/categories";
import { Clock, MapPin, Grid3x3, ArrowRight } from "lucide-react";
import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DepartmentsSidebarProps {
  departments: Department[];
  activeDepartment?: string;
  categorySlug?: string;
  storeSlug?: string;
  onDepartmentClick?: (department: Department) => void;
}

function DepartmentsSidebar({
  departments,
  activeDepartment,
  categorySlug,
  storeSlug,
  onDepartmentClick,
}: DepartmentsSidebarProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const router = useRouter();

  const handleClick = useCallback(
    (department: Department) => {
      if (onDepartmentClick) {
        onDepartmentClick(department);
      } else if (categorySlug && storeSlug && department.slug) {
        router.push(
          `/categories/${categorySlug}/${storeSlug}/${department.slug}`
        );
      }
    },
    [onDepartmentClick, categorySlug, storeSlug, router]
  );

  const content = {
    ar: {
      categories: "الأقسام",
      storeInfo: "معلومات المتجر",
      opensAt: "يفتح في",
      closesAt: "يغلق في",
      away: "بعيد",
      minOrder: "الحد الأدنى للطلب",
      freeDelivery: "توصيل مجاني فوق",
      showAll: "عرض الكل",
    },
    en: {
      categories: "Categories",
      storeInfo: "Store Info",
      opensAt: "Opens at",
      closesAt: "Closes at",
      away: "away",
      minOrder: "Min. Order",
      freeDelivery: "Free delivery over",
      showAll: "Show All",
    },
  };

  const t = content[language];

  return (
    <aside dir={direction} className="lg:sticky lg:top-32 space-y-6">
      {/* Departments Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          {t.categories}
        </h3>
        <nav className="space-y-2">
          {departments.map((dept) => {
            const isActive = activeDepartment === dept.slug;
            return (
              <button
                key={dept.slug}
                onClick={() => handleClick(dept)}
                className={`w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isActive
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex-1">
                    {isArabic && dept.nameAr ? dept.nameAr : dept.name}
                  </span>
                  {dept.productCount !== undefined && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {dept.productCount}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
          
          {/* Show All Button */}
          {categorySlug && storeSlug && (
            <Link
              href={`/categories/${categorySlug}/${storeSlug}/departments`}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 flex items-center justify-between gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base ${
                isArabic ? "flex-row-reverse" : ""
              }`}
            >
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Grid3x3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{t.showAll}</span>
              </span>
              <ArrowRight
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isArabic ? "rotate-180" : ""}`}
              />
            </Link>
          )}
        </nav>
      </div>

      {/* Store Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          {t.storeInfo}
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className={isArabic ? "text-right" : "text-left"}>
              <p className="font-semibold text-gray-900 dark:text-white">
                {t.opensAt} 9:00 AM
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {t.closesAt} 11:00 PM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className={isArabic ? "text-right" : "text-left"}>
              <p className="font-semibold text-gray-900 dark:text-white">
                2.5 km {t.away}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Riyadh, Saudi Arabia
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default memo(DepartmentsSidebar);


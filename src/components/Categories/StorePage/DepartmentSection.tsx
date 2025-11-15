"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/components/Utils/ProductCard";
import { Department } from "@/components/Utils/DepartmentCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import ProductCard from "../ProductCard";

interface DepartmentSectionProps {
  department: Department;
  products: Product[];
  categorySlug?: string;
  storeSlug?: string;
  onProductClick?: (productId: string) => void;
  onQuickView?: (product: Product) => void;
}

function DepartmentSection({
  department,
  products,
  categorySlug,
  storeSlug,
  onProductClick,
  onQuickView,
}: DepartmentSectionProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  const displayName =
    isArabic && department.nameAr ? department.nameAr : department.name;

  const viewAllUrl =
    categorySlug && storeSlug && department.slug
      ? `/categories/${categorySlug}/${storeSlug}/${department.slug}`
      : "#";

  const content = {
    ar: {
      items: "عنصر",
      viewAll: "عرض الكل",
    },
    en: {
      items: "items",
      viewAll: "View All",
    },
  };

  const t = content[language];

  return (
    <section
      dir={direction}
      id={department.slug}
      className="mb-12 scroll-mt-24"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {displayName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {products.length} {t.items}
          </p>
        </div>
        {viewAllUrl !== "#" && (
          <Link
            href={viewAllUrl}
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold flex items-center gap-2 transition-colors"
          >
            {t.viewAll}
            <ArrowRight
              className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`}
            />
          </Link>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onClick={onProductClick}
            onQuickView={onQuickView}
            categorySlug={categorySlug}
            storeSlug={storeSlug}
            departmentSlug={department.slug}
          />
        ))}
      </div>
    </section>
  );
}

export default memo(DepartmentSection);


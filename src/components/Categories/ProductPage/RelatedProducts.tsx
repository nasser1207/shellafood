"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/components/Utils/ProductCard";
import { motion } from "framer-motion";
import { memo } from "react";
import ProductCard from "../ProductCard";

interface RelatedProductsProps {
  products: Product[];
  categorySlug?: string;
  storeSlug?: string;
  departmentSlug?: string;
  onProductClick?: (productId: string) => void;
}

function RelatedProducts({
  products,
  categorySlug,
  storeSlug,
  departmentSlug,
  onProductClick,
}: RelatedProductsProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  if (products.length === 0) return null;

  return (
    <section dir={direction} className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isArabic ? "منتجات ذات صلة" : "Related Products"}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onClick={onProductClick}
            categorySlug={categorySlug}
            storeSlug={storeSlug}
            departmentSlug={departmentSlug}
          />
        ))}
      </div>
    </section>
  );
}

export default memo(RelatedProducts);


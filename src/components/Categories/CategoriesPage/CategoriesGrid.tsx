"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { memo } from "react";
import { Category } from "@/components/Utils/CategoryCard";
import CategoryCard from "../CategoryCard";
import { staggerContainer } from "@/lib/utils/categories/animations";

interface CategoriesGridProps {
  categories: (Category & { slug?: string })[];
  storeCounts?: Record<string, number>;
}

function CategoriesGrid({ categories, storeCounts = {} }: CategoriesGridProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <motion.div
      dir={direction}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          index={index}
          storeCount={storeCounts[category.id] || 0}
        />
      ))}
    </motion.div>
  );
}

export default memo(CategoriesGrid);


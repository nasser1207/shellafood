"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Store } from "lucide-react";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import { Category } from "@/components/Utils/CategoryCard";
import { fadeInUp } from "@/lib/utils/categories/animations";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface CategoryCardProps {
  category: Category & { slug?: string };
  index?: number;
  storeCount?: number;
}

function CategoryCard({ category, index = 0, storeCount = 0 }: CategoryCardProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const router = useRouter();

  const handleClick = useCallback(() => {
    // Always use slug for routing (URL-friendly)
    if (category.slug) {
      router.push(`/categories/${category.slug}`);
    }
  }, [router, category.slug]);

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.1 }}
      dir={direction}
      onClick={handleClick}
      className="group relative cursor-pointer"
    >
      {/* Gradient Border on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 rounded-2xl" />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 group-hover:border-transparent transition-all duration-300 h-full">
        {/* Image with gradient overlay */}
        <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes={getImageSizes('card')}
              loading="lazy"
              quality={getImageQuality('card')}
              placeholder="blur"
              blurDataURL={getImageBlurDataURL()}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
              <Store className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Category icon */}
          <div className="absolute top-4 rtl:right-4 ltr:left-4 w-12 h-12 rounded-xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Store className="w-6 h-6 text-white" />
          </div>

          {/* Store count badge */}
          {storeCount > 0 && (
            <div className="absolute bottom-4 rtl:left-4 ltr:right-4 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-bold text-gray-900 dark:text-white shadow-lg">
              {storeCount}+ {isArabic ? "متجر" : "Stores"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="text-right rtl:text-right ltr:text-left">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {category.description}
            </p>
          )}
        </div>

        {/* Arrow indicator */}
        <ArrowRight
          className="absolute bottom-6 rtl:left-6 ltr:right-6 w-5 h-5 text-gray-400 group-hover:text-green-500 dark:group-hover:text-green-400 rtl:rotate-180 group-hover:rtl:-translate-x-1 group-hover:ltr:translate-x-1 transition-all"
        />
      </div>
    </motion.div>
  );
}

export default memo(CategoryCard);


"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Search, MapPin, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";

interface CategoriesHeroProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

function CategoriesHero({ searchTerm = "", onSearchChange }: CategoriesHeroProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  const content = {
    ar: {
      title: "اكتشف أفضل الأقسام",
      subtitle: "تسوق من آلاف المتاجر والمطاعم واحصل على توصيل سريع",
      searchPlaceholder: "ابحث عن قسم...",
      quickActions: [
        { label: "قريب مني", icon: MapPin },
        { label: "مفتوح الآن", icon: Clock },
        { label: "الأعلى تقييماً", icon: Star },
      ],
    },
    en: {
      title: "Discover Best Categories",
      subtitle: "Shop from thousands of stores and restaurants with fast delivery",
      searchPlaceholder: "Search for a category...",
      quickActions: [
        { label: "Nearby", icon: MapPin },
        { label: "Open Now", icon: Clock },
        { label: "Top Rated", icon: Star },
      ],
    },
  };

  const t = content[language];

  return (
    <div
      dir={direction}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 md:p-12 lg:p-16 mb-8"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-right rtl:text-right ltr:text-left"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative max-w-2xl">
            <Search
              className="absolute top-1/2 -translate-y-1/2 rtl:right-4 ltr:left-4 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rtl:pr-12 rtl:pl-4 ltr:pl-12 ltr:pr-4 py-4 rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:ring-4 focus:ring-white/20 text-gray-900 dark:text-white placeholder-gray-500 text-lg shadow-xl transition-all"
            />
          </div>
        </motion.div>

       
      </div>
    </div>
  );
}

export default memo(CategoriesHero);


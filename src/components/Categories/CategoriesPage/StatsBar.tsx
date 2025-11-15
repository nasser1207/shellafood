"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Store, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";

function StatsBar() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  const stats = {
    ar: [
      { icon: Store, value: "1000+", label: "متجر متاح" },
      { icon: Zap, value: "30", label: "دقيقة توصيل سريع" },
      { icon: Star, value: "4.8", label: "متوسط التقييم" },
    ],
    en: [
      { icon: Store, value: "1000+", label: "Stores Available" },
      { icon: Zap, value: "30", label: "Fast Delivery" },
      { icon: Star, value: "4.8", label: "Average Rating" },
    ],
  };

  const items = stats[language];

  return (
    <div
      dir={direction}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      {items.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="text-right rtl:text-right ltr:text-left">
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default memo(StatsBar);


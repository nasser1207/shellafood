"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  Clock,
  Star,
  MapPin,
  Truck,
  Tag,
  BadgeCheck,
  SlidersHorizontal,
  CheckSquare,
  Filter,
  ShoppingBag,
} from "lucide-react";
import { memo } from "react";
import FilterSection from "./FilterSection";

interface Filters {
  deliveryTime: [number, number];
  rating: number[];
  distanceRange: [number, number];
  features: {
    freeDelivery: boolean;
    openNow: boolean;
    offers: boolean;
    verified: boolean;
    topRated: boolean;
    previouslyOrdered: boolean;
  };
}

interface FiltersSidebarProps {
  filters: Filters;
  onFilterChange: (key: string, value: any) => void;
  onClearAll: () => void;
}

function FiltersSidebar({
  filters,
  onFilterChange,
  onClearAll,
}: FiltersSidebarProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      onFilterChange("rating", [...filters.rating, rating]);
    } else {
      onFilterChange(
        "rating",
        filters.rating.filter((r) => r !== rating)
      );
    }
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    onFilterChange("features", {
      ...filters.features,
      [feature]: checked,
    });
  };

  const content = {
    ar: {
      filters: "الفلاتر",
      clearAll: "مسح الكل",
      deliveryTime: "وقت التوصيل",
      rating: "التقييم",
      distanceRange: "نطاق المسافة",
      features: "المميزات",
      freeDelivery: "توصيل مجاني",
      openNow: "مفتوح الآن",
      offers: "عروض متاحة",
      verified: "موثق",
      topRated: "الأعلى تقييماً",
      previouslyOrdered: "طلبت منها من قبل",
      apply: "تطبيق الفلاتر",
      min: "دقيقة",
      andUp: "فأكثر",
    },
    en: {
      filters: "Filters",
      clearAll: "Clear All",
      deliveryTime: "Delivery Time",
      rating: "Rating",
      distanceRange: "Distance Range",
      features: "Features",
      freeDelivery: "Free Delivery",
      openNow: "Open Now",
      offers: "Offers Available",
      verified: "Verified",
      topRated: "Top Rated",
      previouslyOrdered: "I Bought From Them",
      apply: "Apply Filters",
      min: "min",
      andUp: "& up",
    },
  };

  const t = content[language];

  return (
    <aside
      dir={direction}
      className="lg:sticky lg:top-24 space-y-6"
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          {t.filters}
        </h3>
        <button
          onClick={onClearAll}
          className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold transition-colors"
        >
          {t.clearAll}
        </button>
      </div>

      {/* Delivery Time */}
      <FilterSection title={t.deliveryTime} icon={Clock}>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={filters.deliveryTime[1]}
            onChange={(e) =>
              onFilterChange("deliveryTime", [
                filters.deliveryTime[0],
                parseInt(e.target.value),
              ])
            }
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {filters.deliveryTime[0]} {t.min}
            </span>
            <span>
              {filters.deliveryTime[1]} {t.min}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title={t.rating} icon={Star}>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.rating.includes(rating)}
                onChange={(e) => handleRatingChange(rating, e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="flex items-center gap-1">
                {[...Array(rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                {[...Array(5 - rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-gray-300 dark:text-gray-600"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                {t.andUp}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Distance Range */}
      <FilterSection title={t.distanceRange} icon={MapPin}>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={filters.distanceRange[1]}
            onChange={(e) =>
              onFilterChange("distanceRange", [
                filters.distanceRange[0],
                parseInt(e.target.value),
              ])
            }
            className="w-full"
          />
          <div className="flex items-center justify-between gap-2">
            <input
              type="number"
              value={filters.distanceRange[0]}
              onChange={(e) =>
                onFilterChange("distanceRange", [
                  parseInt(e.target.value) || 0,
                  filters.distanceRange[1],
                ])
              }
              className="w-24 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm border-0 focus:ring-2 focus:ring-green-500"
            />
            <span className="text-gray-400">{isArabic ? "كم" : "km"}</span>
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={filters.distanceRange[1]}
              onChange={(e) =>
                onFilterChange("distanceRange", [
                  filters.distanceRange[0],
                  parseInt(e.target.value) || 50,
                ])
              }
              className="w-24 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm border-0 focus:ring-2 focus:ring-green-500"
            />
            <span className="text-gray-400">{isArabic ? "كم" : "km"}</span>
          </div>
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title={t.features} icon={CheckSquare}>
        <div className="space-y-3">
          {[
            { id: "freeDelivery", label: t.freeDelivery, icon: Truck },
            { id: "openNow", label: t.openNow, icon: Clock },
            { id: "offers", label: t.offers, icon: Tag },
            { id: "previouslyOrdered", label: t.previouslyOrdered, icon: ShoppingBag },
            { id: "verified", label: t.verified, icon: BadgeCheck },
            { id: "topRated", label: t.topRated, icon: Star },
          ].map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <label
                key={feature.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.features[feature.id as keyof typeof filters.features]}
                  onChange={(e) =>
                    handleFeatureChange(feature.id, e.target.checked)
                  }
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <FeatureIcon className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  {feature.label}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Apply Button */}
      <button
        onClick={() => {}}
        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
      >
        {t.apply}
      </button>
    </aside>
  );
}

export default memo(FiltersSidebar);


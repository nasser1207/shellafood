"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Star,
  Heart,
  ShoppingCart,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { memo, useCallback, useState } from "react";
import { Store } from "@/components/Utils/StoreCard";
import { fadeInUp } from "@/lib/utils/categories/animations";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useStoreFavorites } from "@/hooks/useFavorites";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface StoreCardProps {
  store: Store;
  index?: number;
  onClick?: (store: Store) => void;
  className?: string;
}

function StoreCard({
  store,
  index = 0,
  onClick,
  className = "",
}: StoreCardProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const { isFavorite, isLoading: favoriteLoading, toggleFavorite } =
    useStoreFavorites(store.id, {
      name: store.name,
      nameAr: store.nameAr,
      image: store.image,
      logo: store.logo || undefined,
      type: store.type,
      typeAr: store.typeAr,
      rating: store.rating,
    });

  const displayName = isArabic && store.nameAr ? store.nameAr : store.name;
  const displayType = isArabic && store.typeAr ? store.typeAr : store.type;
  const displayDeliveryTime =
    isArabic && store.deliveryTimeAr
      ? store.deliveryTimeAr
      : store.deliveryTime;
  const displayFee =
    isArabic && store.feeAr ? store.feeAr : store.fee;
  const displayMinOrder =
    isArabic && store.minimumOrderAr
      ? store.minimumOrderAr
      : store.minimumOrder;

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(store);
    }
  }, [onClick, store]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir={direction}
      onClick={handleClick}
      className={`group cursor-pointer ${className}`}
    >
      <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Store Image */}
        <div className="relative h-48 overflow-hidden">
          {store.image ? (
            <Image
              src={store.image}
              alt={displayName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes={getImageSizes('card')}
              loading="lazy"
              quality={getImageQuality('card')}
              placeholder="blur"
              blurDataURL={getImageBlurDataURL()}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-white" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Status badges */}
          <div className={`absolute top-3 ${isArabic ? 'right-3' : 'left-3'} flex flex-col gap-2`}>
            {store.isOpen && (
              <div className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {isArabic ? "مفتوح الآن" : "Open Now"}
              </div>
            )}
            {!store.isOpen && (
              <div className="px-3 py-1 rounded-full bg-gray-800/90 text-white text-xs font-bold shadow-lg">
                {isArabic ? "مغلق" : "Closed"}
              </div>
            )}
          </div>

          {/* Delivery time */}
          {displayDeliveryTime && (
            <div
              className={`absolute top-3 ${isArabic ? 'left-3' : 'right-3'} px-3 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-bold shadow-lg`}
            >
              ⚡ {displayDeliveryTime}
            </div>
          )}

          {/* Favorite button */}
          <div
            className={`absolute bottom-3 ${isArabic ? 'left-3' : 'right-3'}`}
            onClick={handleFavoriteClick}
          >
            <button className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <Heart
                className={`w-5 h-5 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Store Info */}
        <div className={`p-5 ${isArabic ? 'text-right' : 'text-left'}`}>
          {/* Store logo + name */}
          <div className="flex items-start gap-3 mb-3">
            {store.logo && (
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
                <Image
                  src={store.logo}
                  alt={displayName}
                  width={48}
                  height={48}
                  className="object-cover"
                  quality={getImageQuality('thumbnail')}
                  placeholder="blur"
                  blurDataURL={getImageBlurDataURL(48, 48)}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {displayName}
              </h3>
              {displayType && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {displayType}
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          {store.rating && (
            <div
              className={`flex items-center gap-2 mb-3`}
            >
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {store.rating}
                </span>
              </div>
              {store.reviewsCount && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({store.reviewsCount > 999 ? "999+" : store.reviewsCount}{" "}
                  {isArabic ? "تقييم" : "reviews"})
                </span>
              )}
            </div>
          )}

          {/* Delivery info */}
          <div
            className={`flex items-center justify-between text-sm mb-3`}
          >
            {store.location && (
              <div
                className={`flex items-center gap-1 text-gray-600 dark:text-gray-400`}
              >
                <MapPin className="w-4 h-4" />
                <span>2.5 km</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {displayFee === "0" || displayFee?.toLowerCase().includes("free") ? (
                <span className="text-green-600 dark:text-green-400 font-bold">
                  {isArabic ? "توصيل مجاني" : "Free Delivery"}
                </span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">
                  {displayFee} {isArabic ? "توصيل" : "delivery"}
                </span>
              )}
            </div>
          </div>

          {/* Min order */}
          {displayMinOrder && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              {isArabic ? "الحد الأدنى للطلب:" : "Min. order:"} {displayMinOrder}
            </div>
          )}

          {/* Quick actions on hover */}
          <div
            className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-2xl ${isHovered ? 'opacity-100' : ''}`}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              {isArabic ? "عرض القائمة" : "View Menu"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
            >
              {isArabic ? "اطلب الآن" : "Order Now"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(StoreCard);


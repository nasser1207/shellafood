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
  tags?: string[]; // Tags to display beside minimum order
  isCompact?: boolean; // Compact mode for 2-column view
}

function StoreCard({
  store,
  index = 0,
  onClick,
  className = "",
  tags = [],
  isCompact = false,
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
      <div className={`relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 shadow-lg hover:shadow-2xl transition-all duration-300 ${isCompact ? 'rounded-xl' : ''}`}>
        {/* Store Image */}
        <div className={`relative overflow-hidden ${isCompact ? 'h-32' : 'h-48'}`}>
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
          <div className={`absolute ${isCompact ? 'top-1.5' : 'top-3'} ${isArabic ? (isCompact ? 'right-1.5' : 'right-3') : (isCompact ? 'left-1.5' : 'left-3')} flex flex-col gap-1`}>
            {store.isOpen && (
              <div className={`${isCompact ? 'px-1.5 py-0.5' : 'px-3 py-1'} rounded-full bg-green-500 text-white ${isCompact ? 'text-[9px]' : 'text-xs'} font-bold flex items-center gap-1 shadow-lg`}>
                {!isCompact && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                <span className={isCompact ? 'hidden sm:inline' : ''}>{isArabic ? "مفتوح" : "Open"}</span>
                {!isCompact && <span>{isArabic ? " الآن" : " Now"}</span>}
              </div>
            )}
            {!store.isOpen && (
              <div className={`${isCompact ? 'px-1.5 py-0.5' : 'px-3 py-1'} rounded-full bg-gray-800/90 text-white ${isCompact ? 'text-[9px]' : 'text-xs'} font-bold shadow-lg`}>
                {isArabic ? "مغلق" : "Closed"}
              </div>
            )}
          </div>

          {/* Delivery time */}
          {displayDeliveryTime && !isCompact && (
            <div
              className={`absolute top-3 ${isArabic ? 'left-3' : 'right-3'} px-3 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-bold shadow-lg`}
            >
              ⚡ {displayDeliveryTime}
            </div>
          )}

          {/* Favorite button */}
          {!isCompact && (
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
          )}
        </div>

        {/* Store Info */}
        <div className={`${isCompact ? 'p-3' : 'p-5'} ${isArabic ? 'text-right' : 'text-left'}`}>
          {/* Store logo + name */}
          <div className={`flex items-start gap-2 ${isCompact ? 'mb-2' : 'mb-3'}`}>
            {store.logo && !isCompact && (
              <div className={`${isCompact ? 'w-8 h-8' : 'w-12 h-12'} rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0`}>
                <Image
                  src={store.logo}
                  alt={displayName}
                  width={isCompact ? 32 : 48}
                  height={isCompact ? 32 : 48}
                  className="object-cover"
                  quality={getImageQuality('thumbnail')}
                  placeholder="blur"
                  blurDataURL={getImageBlurDataURL(isCompact ? 32 : 48, isCompact ? 32 : 48)}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className={`${isCompact ? 'text-sm' : 'text-lg'} font-bold text-gray-900 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors`}>
                {displayName}
              </h3>
              {displayType && !isCompact && (
                <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 truncate`}>
                  {displayType}
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          {store.rating && (
            <div
              className={`flex items-center gap-2 ${isCompact ? 'mb-2' : 'mb-3'}`}
            >
              <div className={`flex items-center gap-1 ${isCompact ? 'px-1.5 py-0.5' : 'px-2 py-1'} rounded-lg bg-yellow-50 dark:bg-yellow-900/20`}>
                <Star className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'} fill-yellow-400 text-yellow-400`} />
                <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-bold text-gray-900 dark:text-white`}>
                  {store.rating}
                </span>
              </div>
              {store.reviewsCount && !isCompact && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({store.reviewsCount > 999 ? "999+" : store.reviewsCount}{" "}
                  {isArabic ? "تقييم" : "reviews"})
                </span>
              )}
            </div>
          )}

          {/* Delivery info */}
          {!isCompact && (
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
          )}

          {/* Min order with tags */}
          {displayMinOrder && (
            <div className={`${isCompact ? 'pt-2' : 'pt-3'} border-t border-gray-200 dark:border-gray-700`}>
              <div className={`flex ${isCompact ? 'flex-col gap-1.5' : 'flex-row flex-wrap items-center gap-2 sm:gap-2.5'} ${isArabic ? 'justify-end' : 'justify-start'}`}>
                {/* Minimum Order Text */}
                <div className={`${isCompact ? 'text-[10px] leading-tight' : 'text-xs sm:text-sm leading-snug'} text-gray-600 dark:text-gray-400 ${isCompact ? 'w-full' : 'flex-shrink-0'}`}>
                  <span className="font-medium">{isArabic ? "الحد الأدنى:" : "Min. order:"}</span>{" "}
                  <span className="font-bold text-gray-800 dark:text-gray-200">{displayMinOrder}</span>
                </div>
                {/* Tags beside minimum order - Expert UI/UX Responsive Design */}
                {tags.length > 0 && (
                  <div className={`flex flex-wrap ${isCompact ? 'gap-1 w-full' : 'gap-1.5 sm:gap-2 flex-1 min-w-0'}`}>
                    {tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className={`
                          inline-flex items-center justify-center
                          ${isCompact 
                            ? 'px-1.5 py-0.5 text-[9px] leading-tight min-w-[40px]' 
                            : 'px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs md:text-sm leading-tight min-w-[50px] sm:min-w-[60px]'
                          } 
                          font-bold rounded-full 
                          bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 
                          text-white whitespace-nowrap 
                          shadow-sm hover:shadow-lg 
                          transition-all duration-200 ease-in-out
                          ${isCompact 
                            ? 'hover:opacity-90' 
                            : 'hover:scale-105 hover:from-green-500 hover:to-emerald-500 active:scale-95'
                          }
                          backdrop-blur-sm
                        `}
                        title={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick actions on hover - Hidden in compact mode */}
          {!isCompact && (
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
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(StoreCard);


"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Store } from "@/components/Utils/StoreCard";
import Image from "next/image";
import { Star, Clock, MapPin, Share2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useStoreFavorites } from "@/hooks/useFavorites";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface StoreHeroProps {
  store: Store;
}

function StoreHero({ store }: StoreHeroProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

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
  const displayDeliveryTime =
    isArabic && store.deliveryTimeAr
      ? store.deliveryTimeAr
      : store.deliveryTime;

  const handleLocationClick = () => {
    if (!store.location) return;
    const coords = store.location.split(",").map((c) => parseFloat(c.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      const [lat, lng] = coords;
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    }
  };

  return (
    <div dir={direction} className="relative h-64 md:h-96 overflow-hidden">
      {store.image ? (
        <Image
          src={store.image}
          alt={displayName}
          fill
          className="object-cover"
          priority
          sizes={getImageSizes('hero')}
          quality={getImageQuality('hero')}
          placeholder="blur"
          blurDataURL={getImageBlurDataURL()}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Store info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="container mx-auto">
          <div className="flex items-end gap-6">
            {/* Store logo */}
            {store.logo && (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
                <Image
                  src={store.logo}
                  alt={displayName}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  quality={getImageQuality('thumbnail')}
                  placeholder="blur"
                  blurDataURL={getImageBlurDataURL(96, 96)}
                />
              </div>
            )}

            <div className="flex-1 text-white">
              <h1 className="text-3xl md:text-4xl font-black mb-2">
                {displayName}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                {store.rating && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{store.rating}</span>
                    {store.reviewsCount && (
                      <span className="text-sm">
                        ({store.reviewsCount > 999 ? "999+" : store.reviewsCount}+)
                      </span>
                    )}
                  </div>
                )}
                {displayDeliveryTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{displayDeliveryTime}</span>
                  </div>
                )}
                {store.location && (
                  <button
                    onClick={handleLocationClick}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{isArabic ? "2.5 كم" : "2.5 km"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <div onClick={(e) => e.stopPropagation()}>
                <FavoriteButton
                  isFavorite={isFavorite}
                  isLoading={favoriteLoading}
                  onToggle={toggleFavorite}
                  size="md"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(StoreHero);


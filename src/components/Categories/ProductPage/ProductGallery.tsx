"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import { ZoomIn, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { memo, useState } from "react";
import { Product } from "@/types/categories";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useProductFavorites } from "@/hooks/useFavorites";

interface ProductGalleryProps {
  product: Product;
  storeId?: string;
}

function ProductGallery({ product, storeId }: ProductGalleryProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [selectedImage, setSelectedImage] = useState(
    product.image || ""
  );

  const { isFavorite, isLoading: favoriteLoading, toggleFavorite } =
    useProductFavorites(product.id, {
      name: product.name,
      nameAr: product.nameAr,
      image: product.image,
      price: typeof product.price === "number" ? product.price : 0,
      originalPrice: product.originalPrice,
      unit: product.unit,
      unitAr: product.unitAr,
      storeId: storeId || product.storeId,
    });

  // Use product.image as main image, or create array if multiple images exist
  const images = product.image
    ? [product.image, ...(product.images || [])]
    : [];

  const displayBadge =
    isArabic && product.badgeAr ? product.badgeAr : product.badge;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
            <div className="text-gray-400">No Image</div>
          </div>
        )}

        {/* Badges */}
        {displayBadge && (
          <div className="absolute top-4 left-4">
            <div className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-bold shadow-lg">
              {displayBadge}
            </div>
          </div>
        )}

        {/* Favorite */}
        <div className="absolute top-4 right-4">
          <FavoriteButton
            isFavorite={isFavorite}
            isLoading={favoriteLoading}
            onToggle={toggleFavorite}
            size="md"
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
          />
        </div>

        {/* Zoom button */}
        <button className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-sm font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
          <ZoomIn className="w-5 h-5" />
          <span className="hidden sm:inline">
            {isArabic ? "تكبير" : "Zoom"}
          </span>
        </button>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`relative h-24 rounded-xl overflow-hidden border-2 transition-colors ${
                selectedImage === img
                  ? "border-green-500"
                  : "border-gray-200 dark:border-gray-700 hover:border-green-500"
              }`}
            >
              <Image
                src={img}
                alt={`Product ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(ProductGallery);


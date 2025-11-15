"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Eye,
  ShoppingCart,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { memo, useCallback, useState } from "react";
import { Product } from "@/components/Utils/ProductCard";
import { fadeInUp } from "@/lib/utils/categories/animations";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useProductFavorites } from "@/hooks/useFavorites";
import { navigateToProductFromContext } from "@/lib/utils/categories/navigation";

interface ProductCardProps {
  product: Product;
  index?: number;
  onClick?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (product: Product) => void;
  showAddButton?: boolean;
  className?: string;
  categorySlug?: string;
  storeSlug?: string;
  departmentSlug?: string;
}

function ProductCard({
  product,
  index = 0,
  onClick,
  onAddToCart,
  onQuickView,
  showAddButton = true,
  className = "",
  categorySlug,
  storeSlug,
  departmentSlug,
}: ProductCardProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const { isFavorite, isLoading: favoriteLoading, toggleFavorite } =
    useProductFavorites(product.id, {
      name: product.name,
      nameAr: product.nameAr,
      image: product.image,
      price:
        typeof product.price === "number"
          ? product.price
          : parseFloat(
              (product.price as unknown as number)
                ?.toString()
                .replace(/[^0-9.]/g, "") || "0"
            ),
      originalPrice: product.originalPrice
        ? typeof product.originalPrice === "number"
          ? product.originalPrice
          : parseFloat(
              (product.originalPrice as unknown as number)
                ?.toString()
                .replace(/[^0-9.]/g, "") || "0"
            )
        : (undefined as unknown as number | undefined),
      unit: product.unit,
      unitAr: product.unitAr,
      storeId: product.storeId,
    });

  const displayName = isArabic && product.nameAr ? product.nameAr : product.name;
  const displayUnit =
    isArabic && product.unitAr ? product.unitAr : product.unit;
  const displayBadge =
    isArabic && product.badgeAr ? product.badgeAr : product.badge;

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(product.id);
    } else {
      navigateToProductFromContext(router, product);
    }
  }, [router, product, onClick]);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  };

  const isLowStock =
    product.inStock &&
    product.stockQuantity !== undefined &&
    product.stockQuantity < 10;

  const calculateDiscount = () => {
    if (product.originalPrice && product.price) {
      const original =
        typeof product.originalPrice === "number"
          ? product.originalPrice
          : parseFloat(
              (product.originalPrice as unknown as number)
                ?.toString()
                .replace(/[^0-9.]/g, "") || "0"
            );
      const current =
        typeof product.price === "number"
          ? product.price
          : parseFloat(
              (product.price as unknown as number)
                ?.toString()
                .replace(/[^0-9.]/g, "") || "0"
            );
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir={direction}
      onClick={handleClick}
      className={`group relative ${className}`}
    >
      <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          {product.image ? (
            <Image
              src={product.image}
              alt={displayName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
          )}

          {/* Badges */}
          <div className={`absolute top-3 ${isArabic ? 'right-3' : 'left-3'} flex flex-col gap-2`}>
            {displayBadge && (
              <div className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg">
                {displayBadge}
              </div>
            )}
            {!product.inStock && (
              <div className="px-3 py-1 rounded-full bg-gray-900/80 text-white text-xs font-bold shadow-lg">
                {isArabic ? "نفد" : "Out of Stock"}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div
            className={`absolute top-3 ${isArabic ? 'left-3' : 'right-3'} flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isHovered ? 'opacity-100' : ''}`}
          >
            <button
              onClick={handleFavoriteClick}
              className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
            </button>
            {onQuickView && (
              <button
                onClick={handleQuickViewClick}
                className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
              >
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* Discount Badge */}
          {product.originalPrice && calculateDiscount() > 0 && (
            <div
              className={`absolute bottom-3 ${isArabic ? 'left-3' : 'right-3'} px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg`}
            >
              {isArabic ? "وفر" : "Save"} {calculateDiscount()}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`p-4 ${isArabic ? 'text-right' : 'text-left'}`}>
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {product.brand}
            </p>
          )}

          {/* Name */}
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors min-h-[2.5rem]">
            {displayName}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div
              className={`flex items-center gap-2 mb-3 `}
            >
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {product.rating}
                </span>
              </div>
              {product.reviewsCount && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({product.reviewsCount > 999 ? "999+" : product.reviewsCount})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div
            className={`flex items-center gap-2 mb-4 `}
          >
            {product.price && (
              <span className="text-2xl font-black text-green-600 dark:text-green-400">
                {product.price} {isArabic ? "ريال" : "SAR"}
              </span>
            )}
            {product.originalPrice &&
              product.originalPrice !== product.price && (
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                  {product.originalPrice} {isArabic ? "ريال" : "SAR"}
                </span>
              )}
          </div>

          {/* Unit */}
          {displayUnit && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {isArabic ? "لكل" : "Per"} {displayUnit}
            </p>
          )}

          {/* Add to Cart Button */}
          {product.inStock !== false ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCartClick}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {isArabic ? "إضافة للسلة" : "Add to Cart"}
            </motion.button>
          ) : (
            <button
              disabled
              className="w-full py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl font-bold cursor-not-allowed"
            >
              {isArabic ? "نفد" : "Out of Stock"}
            </button>
          )}

          {/* Stock indicator */}
          {product.inStock && isLowStock && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 text-center">
              {isArabic ? "بقي" : "Only"} {product.stockQuantity}{" "}
              {isArabic ? "متاح" : "left"}!
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);


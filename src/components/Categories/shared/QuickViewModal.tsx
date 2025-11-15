"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { X, Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { Product } from "@/components/Utils/ProductCard";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  categorySlug?: string;
  storeSlug?: string;
  departmentSlug?: string;
}

function QuickViewModal({
  product,
  isOpen,
  onClose,
  categorySlug,
  storeSlug,
  departmentSlug,
}: QuickViewModalProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const displayName = isArabic && product.nameAr ? product.nameAr : product.name;
  const displayBadge =
    isArabic && product.badgeAr ? product.badgeAr : product.badge;

  const handleAddToCart = () => {
    // Add to cart logic
    onClose();
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (product.stockQuantity && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const productUrl =
    categorySlug && storeSlug && departmentSlug && product.slug
      ? `/categories/${categorySlug}/${storeSlug}/${departmentSlug}/${product.slug}`
      : "#";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          dir={direction}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
            aria-label={isArabic ? "إغلاق" : "Close"}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-400">No Image</div>
                </div>
              )}
              {displayBadge && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-sm font-bold">
                  {displayBadge}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {displayName}
              </h2>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{product.rating}</span>
                  </div>
                  {product.reviewsCount && (
                    <span className="text-sm text-gray-500">
                      ({product.reviewsCount} {isArabic ? "تقييم" : "reviews"})
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-black text-green-600 dark:text-green-400">
                  {product.price} {isArabic ? "ريال" : "SAR"}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.originalPrice} {isArabic ? "ريال" : "SAR"}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">
                  {isArabic && product.descriptionAr
                    ? product.descriptionAr
                    : product.description}
                </p>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">
                  {isArabic ? "الكمية" : "Quantity"}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={
                        product.stockQuantity
                          ? quantity >= product.stockQuantity
                          : false
                      }
                      className="px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  {product.stockQuantity && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {isArabic ? "الحد الأقصى:" : "Max:"} {product.stockQuantity}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isArabic ? "إضافة للسلة" : "Add to Cart"}
                </button>
                <Link
                  href={productUrl}
                  className="block w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {isArabic ? "عرض التفاصيل الكاملة" : "View Full Details"}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(QuickViewModal);


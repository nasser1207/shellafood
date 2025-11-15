"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types/categories";
import {
  Star,
  CheckCircle,
  XCircle,
  Truck,
  Shield,
  RefreshCw,
  CreditCard,
  Award,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";
import { memo, useState } from "react";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

function ProductInfo({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}: ProductInfoProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  const displayName = isArabic && product.nameAr ? product.nameAr : product.name;
  const displayDescription =
    isArabic && product.descriptionAr
      ? product.descriptionAr
      : product.description;

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

  const decrementQuantity = () => {
    if (quantity > 1) onQuantityChange(quantity - 1);
  };

  const incrementQuantity = () => {
    if (product.stockQuantity && quantity < product.stockQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const content = {
    ar: {
      reviews: "تقييم",
      askQuestion: "اسأل سؤال",
      per: "لكل",
      inStock: "متوفر",
      outOfStock: "نفد المخزون",
      onlyLeft: "بقي",
      left: "متاح",
      deliveryTime: "وقت التوصيل",
      orderNow: "اطلب الآن، احصل عليه بحلول",
      quantity: "الكمية",
      max: "الحد الأقصى",
      addToCart: "إضافة للسلة",
      buyNow: "اشتري الآن",
      features: [
        { icon: Shield, text: "منتج أصلي 100%" },
        { icon: RefreshCw, text: "إرجاع سهل خلال 7 أيام" },
        { icon: CreditCard, text: "طرق دفع آمنة" },
        { icon: Award, text: "جودة مضمونة" },
      ],
      description: "وصف المنتج",
      nutritionalInfo: "المعلومات الغذائية",
      ingredients: "المكونات",
      storage: "تعليمات التخزين",
    },
    en: {
      reviews: "reviews",
      askQuestion: "Ask Question",
      per: "Per",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      onlyLeft: "Only",
      left: "left",
      deliveryTime: "Delivery Time",
      orderNow: "Order now, get it by",
      quantity: "Quantity",
      max: "Max",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      features: [
        { icon: Shield, text: "100% Authentic Product" },
        { icon: RefreshCw, text: "Easy Returns within 7 days" },
        { icon: CreditCard, text: "Secure Payment Methods" },
        { icon: Award, text: "Quality Guaranteed" },
      ],
      description: "Product Description",
      nutritionalInfo: "Nutritional Information",
      ingredients: "Ingredients",
      storage: "Storage Instructions",
    },
  };

  const t = content[language];

  return (
    <div dir={direction} className="space-y-6">
      {/* Brand */}
      {product.brand && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{product.brand}</p>
      )}

      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
        {displayName}
      </h1>

      {/* Rating & Reviews */}
      {product.rating && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {product.rating}
            </span>
          </div>
          {product.reviewsCount && (
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              ({product.reviewsCount}+ {t.reviews})
            </button>
          )}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2">
            <span>{t.askQuestion}</span>
          </button>
        </div>
      )}

      {/* Price */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800">
        <div className="flex items-baseline gap-3 mb-2">
          {product.price && (
            <span className="text-4xl font-black text-green-600 dark:text-green-400">
              {product.price} {isArabic ? "ريال" : "SAR"}
            </span>
          )}
          {product.originalPrice && calculateDiscount() > 0 && (
            <>
              <span className="text-xl text-gray-400 line-through">
                {product.originalPrice} {isArabic ? "ريال" : "SAR"}
              </span>
              <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-bold">
                {isArabic ? "وفر" : "Save"} {calculateDiscount()}%
              </span>
            </>
          )}
        </div>
        {product.unit && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t.per} {isArabic && product.unitAr ? product.unitAr : product.unit}
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {product.inStock !== false ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{t.inStock}</span>
            {product.stockQuantity && product.stockQuantity < 10 && (
              <span className="text-orange-600 dark:text-orange-400">
                ({t.onlyLeft} {product.stockQuantity} {t.left}!)
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <XCircle className="w-5 h-5" />
            <span className="font-semibold">{t.outOfStock}</span>
          </div>
        )}
      </div>

      {/* Delivery Info */}
      {product.deliveryTime && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                {t.deliveryTime}:{" "}
                {isArabic && product.deliveryTimeAr
                  ? product.deliveryTimeAr
                  : product.deliveryTime}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.orderNow} {new Date(Date.now() + 30 * 60000).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
          {t.quantity}
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={
                product.stockQuantity ? quantity >= product.stockQuantity : false
              }
              className="px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {product.stockQuantity && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t.max}: {product.stockQuantity}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onAddToCart}
          disabled={product.inStock === false}
          className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-6 h-6" />
          {t.addToCart}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onBuyNow}
          disabled={product.inStock === false}
          className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.buyNow}
        </motion.button>
      </div>

      {/* Features/Benefits */}
      <div className="space-y-3">
        {t.features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-semibold">{feature.text}</span>
            </div>
          );
        })}
      </div>

      {/* Description */}
      {displayDescription && (
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-3">{t.description}</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {displayDescription}
          </p>
        </div>
      )}
    </div>
  );
}

export default memo(ProductInfo);


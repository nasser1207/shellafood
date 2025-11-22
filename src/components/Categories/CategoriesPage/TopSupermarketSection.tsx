"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import { ArrowRight, Star, ShoppingCart, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";
import Link from "next/link";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

function TopSupermarketSection() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  const hypermarketData = {
    name: "Hyper Shella",
    nameAr: "هايبر شلة",
    description: "Your one-stop shop for everything you need",
    descriptionAr: "متجرك الشامل لكل ما تحتاجه",
    image: "/supermarketpic.jpg",
    rating: 4.9,
    reviewsCount: 890,
    deliveryTime: "45-60 min",
    deliveryTimeAr: "45-60 دقيقة",
    features: [
      { en: "Wide Product Range", ar: "تشكيلة واسعة من المنتجات" },
      { en: "Fresh Products", ar: "منتجات طازجة" },
      { en: "Fast Delivery", ar: "توصيل سريع" },
      { en: "Best Prices", ar: "أفضل الأسعار" },
    ],
    path: "/categories/supermarket/hyper-shella",
  };

  const displayName = isArabic ? hypermarketData.nameAr : hypermarketData.name;
  const displayDescription = isArabic ? hypermarketData.descriptionAr : hypermarketData.description;
  const displayDeliveryTime = isArabic ? hypermarketData.deliveryTimeAr : hypermarketData.deliveryTime;

  return (
    <section 
      dir={direction}
      className="py-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-right rtl:text-right ltr:text-left"
        >
          <div className="flex items-center gap-3 mb-2 rtl:">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {isArabic ? "المتجر المميز" : "Featured Supermarket"}
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isArabic 
              ? "اكتشف هايبر شلة - متجرك الشامل لكل احتياجاتك" 
              : "Discover Hyper Shella - Your comprehensive store for all your needs"}
          </p>
        </motion.div>

        {/* Hypermarket Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="group"
        >
          <Link href={hypermarketData.path}>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-green-500 dark:group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-2xl">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative h-64 md:h-auto overflow-hidden">
                  {hypermarketData.image ? (
                    <Image
                      src={hypermarketData.image}
                      alt={displayName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes={getImageSizes('hero')}
                      quality={getImageQuality('hero')}
                      placeholder="blur"
                      blurDataURL={getImageBlurDataURL()}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500" />
                  )}
                  
                  {/* Gradient Overlay */}
                  <div 
                    className="absolute inset-0 from-black/60 via-black/30 to-transparent"
                    style={{
                      background: isArabic 
                        ? 'linear-gradient(to left, rgba(0,0,0,0.6), rgba(0,0,0,0.3), transparent)'
                        : 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3), transparent)'
                    }}
                  />

                  {/* Badge */}
                  <div className="absolute top-4 rtl:right-4 ltr:left-4 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-bold flex items-center gap-2 rtl:">
                    <Star className="w-4 h-4 fill-white" />
                    {isArabic ? "المتجر المميز" : "Featured"}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    {/* Name and Rating */}
                    <div className="mb-4">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {displayName}
                      </h3>
                      <div className="flex items-center gap-3 rtl:">
                        <div className="flex items-center gap-1 rtl:">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {hypermarketData.rating}
                          </span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">
                          ({hypermarketData.reviewsCount > 999 ? '999+' : hypermarketData.reviewsCount} {isArabic ? 'تقييم' : 'reviews'})
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {displayDescription}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {hypermarketData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 rtl:">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {isArabic ? feature.ar : feature.en}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Time */}
                    <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg rtl:">
                      <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {isArabic ? "وقت التوصيل: " : "Delivery Time: "}
                        <span className="text-green-600 dark:text-green-400">{displayDeliveryTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-lg rtl: rtl:justify-end ltr:justify-start">
                    <ShoppingCart className="w-6 h-6" />
                    <span>{isArabic ? "تسوق الآن" : "Shop Now"}</span>
                    <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:rtl:-translate-x-2 group-hover:ltr:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(TopSupermarketSection);


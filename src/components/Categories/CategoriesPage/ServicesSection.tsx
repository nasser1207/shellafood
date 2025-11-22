"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import { ArrowRight, Truck, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";
import Link from "next/link";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface Service {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const services: Service[] = [
  {
    id: "serve-me",
    name: "Serve Me",
    nameAr: "اخدمني",
    description: "Professional services at your doorstep",
    descriptionAr: "خدمات احترافية توصل إلى باب منزلك",
    image: "/serveme-hero.png",
    path: "/serve-me",
    icon: Wrench,
  },
  {
    id: "pickandorder",
    name: "Pick & Order",
    nameAr: "استلام وتوصيل",
    description: "Fast and reliable delivery service",
    descriptionAr: "خدمة توصيل سريعة وموثوقة",
    image: "/pickandorder.jpg",
    path: "/pickandorder",
    icon: Truck,
  },
];

function ServicesSection() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  return (
    <section 
      dir={direction}
      className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-right rtl:text-right ltr:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {isArabic ? "خدماتنا" : "Our Services"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isArabic 
              ? "استكشف خدماتنا المميزة التي تجعل حياتك أسهل" 
              : "Explore our premium services that make your life easier"}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const displayName = isArabic ? service.nameAr : service.name;
            const displayDescription = isArabic ? service.descriptionAr : service.description;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group"
              >
                <Link href={service.path}>
                  <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-green-500 dark:group-hover:border-green-500 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      {service.image ? (
                        <Image
                          src={service.image}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                      {/* Icon Badge */}
                      <div className="absolute top-4 rtl:right-4 ltr:left-4 w-14 h-14 rounded-xl bg-white/20 dark:bg-gray-900/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {displayName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {displayDescription}
                      </p>

                      {/* Action Link */}
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold rtl:flex-row-reverse">
                        <span>{isArabic ? "استكشف الخدمة" : "Explore Service"}</span>
                        <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:rtl:-translate-x-2 group-hover:ltr:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(ServicesSection);


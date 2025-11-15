"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import KaidhaRegister from "./KaidhaRegister";


export default function KaidhaForm() {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" dir={direction}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Description Section - Responsive */}
        <section className="relative mb-6 sm:mb-8 rounded-xl bg-[#F6F5F0] dark:bg-gray-800 p-4 sm:p-6 md:p-8 lg:p-12 shadow-sm">
          <div className={`flex h-auto w-full items-end ${isArabic ? 'justify-end' : 'justify-start'}`}>
            <p className={`font-['Readex_Pro'] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#2D3633] dark:text-gray-200 leading-relaxed ${isArabic ? "text-right" : "text-left"}`}>
              {t("kaidha.description")}
            </p>
          </div>
        </section>

        {/* Form Section - Responsive */}
        <section className="mb-6 sm:mb-8 rounded-xl bg-[#FFFFFF] dark:bg-gray-800 p-0 sm:p-2 md:p-4 shadow-md">
          <div className="w-full">
            <KaidhaRegister />
          </div>
        </section>
      </div>
    </main>
  );
}
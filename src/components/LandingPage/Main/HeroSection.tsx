import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";
    return (
<section className="relative mb-8 overflow-hidden rounded-lg shadow-lg dark:shadow-gray-800/50">
<div className="relative">
    {/* صورة الخلفية */}
    <div className="relative h-[300px] w-full sm:h-[400px] md:h-[500px] lg:h-[650px] xl:h-[750px]">
        <img
            src="lanfingpage.jpg"
            alt={isArabic ? "مع شلة كل احتياجاتك بضغطة زر" : "With Shalla, all your needs at the click of a button"}
            className="h-full w-full object-center dark:opacity-80 transition-opacity duration-300"
        />
        {/* Dark overlay for better text readability */}
    </div>
    {/* Content and Button */}
    <div className="font-['Readex Pro'] absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center h-full">
                <div className={` flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-4 text-center ${isArabic ? 'ml-auto mr-8 sm:mr-12 md:mr-16 lg:mr-20' : 'mr-auto ml-8 sm:ml-12 md:ml-16 lg:ml-20'}`}>
                    <h1 className={`leading-tight font-bold text-white dark:text-gray-100 text-center text-2xl md:text-6xl ${isArabic? 'w-full' : ' w-2/3 md:w-full '}`}>
                      <span className="text-green-500 dark:text-green-400 block text-center"><span className="text-green-500 dark:text-green-400 text-center mx-2">{isArabic ? " مع " : "With"}</span>{t("company.name")}</span>
                      <span className="text-white dark:text-gray-100 w-full text-center">{t("landing.hero.title")}</span>
                    </h1>
                    <p className={`hidden md:block font-semibold text-white dark:text-gray-200 text-2xl ${isArabic? 'text-right' : 'text-left'}`}>
                        {t("landing.hero.subtitle")}
                    </p>
                    <a
                        href="/home"
                        className="inline-flex items-center justify-center rounded-lg bg-[#FA9D2B] dark:bg-[#D48925] px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 text-xs sm:text-sm md:text-base lg:text-lg text-white shadow-xl transition-all duration-300 hover:bg-[#D48925] dark:hover:bg-[#B8771F] focus:ring-4 focus:ring-[#FA9D2B]/50 dark:focus:ring-[#D48925]/50 focus:outline-none"
                    >
                        {t("landing.hero.browseButton")}
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
</section>)}
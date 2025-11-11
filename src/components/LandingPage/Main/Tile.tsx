"use client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Tile({
	title,
	desc,
	variant,
	Icon,
}: {
	title: string;
	desc: string;
	variant?: "alt" | "default";
	Icon?: React.ComponentType<any>;
}) {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";
	const isAlt = variant === "alt";
	return (
		<article
			className={`rounded-xl p-6 shadow-md dark:shadow-gray-900/50 transition-transform duration-300 hover:scale-[1.02] ${isAlt ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-700/50"}`}
		>
			<div className={`grid h-full items-start gap-6 ${isArabic ? 'grid-cols-[auto_1fr]' : 'grid-cols-[1fr_auto]'}`}>
				<div className={`relative h-full w-12 rounded-lg bg-emerald-500 dark:bg-emerald-600 ${isArabic ? '' : 'order-2'}`}>
					{Icon && (
						<div className="absolute top-4 left-1/2 -translate-x-1/2">
							<Icon className="h-6 w-6 text-white" />
						</div>
					)}
				</div>

				<div className={`${isArabic ? 'text-right' : 'text-left order-1'}`}>
					<h4 className="mb-2 text-xl font-medium text-gray-800 dark:text-gray-200">{title}</h4>
					<p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{desc}</p>
					<div className="inline-flex items-center gap-2">
						<span className="h-3 w-3 rounded-full bg-amber-500 dark:bg-amber-400" />
						<span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
							{t("landing.tiles.registerNow")}
						</span>
					</div>
				</div>
			</div>
		</article>
	);
}



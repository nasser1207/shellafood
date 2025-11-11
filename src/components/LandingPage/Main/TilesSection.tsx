"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { BriefcaseBusiness, Store, Truck, UsersRound } from "lucide-react";
import Link from "next/link";
import Tile from "./Tile";

export default function TilesSection() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";
	return (
		<section className="space-y-6 bg-[#EAF6EC] dark:bg-gray-800/50">
			<div className="rounded-xl p-10 shadow-lg dark:shadow-gray-900/50 bg-white dark:bg-gray-800">
				<div className={`grid items-center gap-5 md:grid-cols-2 ${isArabic ? '' : 'md:grid-flow-col-dense'}`}>
					<div className={`gap-7 text-center ${isArabic ? 'md:text-right' : 'md:text-left md:col-start-2'}`}>
						<h3 className="mb-2 text-4xl font-semibold text-[#34A853] dark:text-green-400 md:text-5xl">
							{t("landing.qaydha.title")}
						</h3>
						<p className="text-2xl text-gray-700 dark:text-gray-300 md:text-3xl">
							{t("landing.qaydha.subtitle")}
						</p>
						<p className="mt-4 text-sm text-gray-600 dark:text-gray-400 md:text-base">
							{t("landing.qaydha.description")}
						</p>

					<Link
						href="/kaidha"
						className="mt-6 mx-1 inline-flex items-center justify-center rounded-full bg-[#2D943C] dark:bg-green-600 px-8 py-3 text-[#FFFFFF] dark:text-white shadow-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-green-700 "
					>
						{t("landing.qaydha.registerButton")}
					</Link>

						<a
							href="https://www.qaydha.com/"
							className="mt-10 inline-flex items-center justify-center rounded-full bg-[#2D943C] dark:bg-green-600 p-3.5 px-8 py-3 text-[#FFFFFF] dark:text-white shadow-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-green-700"
							target="_blank"
                        >
							{t("landing.qaydha.learnMoreButton")}
						</a>
					</div>
					<img
						src="date.png"
						alt={isArabic ? "تقويم" : "Calendar"}
						className={`h-auto w-full transition-all duration-300 dark:opacity-80 ${isArabic ? '' : 'md:col-start-1'}`}
					/>
				</div>
			</div>

			<div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${isArabic ? '' : 'md:flex-row-reverse'}`}>
				<Link href="/partner" className="cursor-pointer block">
					<Tile
						variant="default"
						title={t("landing.tiles.partner.title")}
						desc={t("landing.tiles.partner.desc")}
						Icon={Store}
					/>
				</Link>
				<Link href="/driver" className="cursor-pointer block">
					<Tile
						variant="alt"
						title={t("landing.tiles.driver.title")}
						desc={t("landing.tiles.driver.desc")}
						Icon={Truck}
					/>
				</Link>
			</div>

			<div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${isArabic ? '' : 'md:flex-row-reverse'}`}>
				<Link href="/investor" className="cursor-pointer block">
					<Tile
						variant="alt"
						title={t("landing.tiles.investor.title")}
						desc={t("landing.tiles.investor.desc")}
						Icon={UsersRound}
					/>
				</Link>
				<Link href="/worker" className="cursor-pointer block">
					<Tile
						variant="default"
						title={t("landing.tiles.worker.title")}
						desc={t("landing.tiles.worker.desc")}
						Icon={BriefcaseBusiness}
					/>
				</Link>
			</div>
		</section>
	);
}



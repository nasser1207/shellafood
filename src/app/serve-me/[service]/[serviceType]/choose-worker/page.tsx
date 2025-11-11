import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getIndividualService, isValidIndividualService, getAllIndividualServicePaths } from "@/lib/data/services";

export async function generateStaticParams() {
	const paths = getAllIndividualServicePaths();
	return paths.map(({ category, service }) => ({
		service: category,
		serviceType: service,
	}));
}

// Cache service data to prevent redundant lookups
const getCachedService = cache((service: string, serviceType: string) => {
	return getIndividualService(service, serviceType);
});

// Dynamic import for client component with loading fallback
const ChooseWorker = dynamic(
	() => import("@/components/ServeMe").then((mod) => ({ default: mod.ChooseWorker })),
	{
		loading: () => <ChooseWorkerLoader />,
		ssr: true,
	}
);

// Loading component for ChooseWorker
function ChooseWorkerLoader() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<div className="flex flex-col lg:flex-row h-screen">
				{/* Left Section - Workers List Skeleton */}
				<div className="flex-1 overflow-y-auto lg:max-h-full">
					<div className="p-4 lg:p-6">
						<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-4"></div>
						<div className="flex flex-wrap gap-2 mb-6">
							{[...Array(4)].map((_, index) => (
								<div key={index} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20 animate-pulse"></div>
							))}
						</div>
						<div className="space-y-4">
							{[...Array(6)].map((_, index) => (
								<div key={index} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<div className="flex items-center gap-4">
										<div className="w-15 h-15 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
										<div className="flex-1 min-w-0">
											<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-2"></div>
											<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				{/* Right Section - Map Skeleton */}
				<div className="w-full hidden md:block lg:w-1/2 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 h-64 lg:h-full">
					<div className="h-full bg-gray-100 dark:bg-gray-800"></div>
				</div>
			</div>
		</div>
	);
}

interface ChooseWorkerPageProps {
	params: Promise<{
		service: string;
		serviceType: string;
	}>;
}

/**
 * Generate metadata for choose worker page
 */
export async function generateMetadata({ params }: ChooseWorkerPageProps): Promise<Metadata> {
	const { service, serviceType } = await params;
	const serviceData = getCachedService(service, serviceType);

	if (!serviceData) {
		return {
			title: "خدمة غير موجودة | شلة فود",
			description: "الخدمة المطلوبة غير متوفرة",
		};
	}

	return {
		title: `اختيار الفني - ${serviceData.titleAr} | اخدمني - شلة فود`,
		description: `اختر الفني المناسب لخدمة ${serviceData.titleAr} من شلة فود.`,
		keywords: [
			serviceData.titleAr,
			serviceData.titleEn,
			"اختيار الفني",
			"اخدمني",
			"شلة فود",
			"خدمات",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `اختيار الفني - ${serviceData.titleAr} | اخدمني - شلة فود`,
			description: `اختر الفني المناسب لخدمة ${serviceData.titleAr}`,
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}/choose-worker`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: `اختيار الفني - ${serviceData.titleAr} | اخدمني - شلة فود`,
			description: `اختر الفني المناسب لخدمة ${serviceData.titleAr}`,
			creator: "@shellafood",
		},
		robots: {
			index: false,
			follow: true,
			googleBot: {
				index: false,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		alternates: {
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}/choose-worker`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}/choose-worker`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}/choose-worker`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

/**
 * Choose Worker Page
 * Dynamic page that displays available workers for a specific service
 * Path: /serve-me/[service]/[serviceType]/choose-worker
 * Optimized with dynamic imports for better performance
 */
export default async function ChooseWorkerPage({ params }: ChooseWorkerPageProps) {
	const { service, serviceType } = await params;
	const serviceData = getCachedService(service, serviceType);

	// If service not found, show 404
	if (!serviceData || !isValidIndividualService(service, serviceType)) {
		notFound();
	}

	return (
		<Suspense fallback={<ChooseWorkerLoader />}>
			<ChooseWorker
				serviceData={serviceData}
				serviceSlug={service}
				serviceTypeSlug={serviceType}
			/>
		</Suspense>
	);
}

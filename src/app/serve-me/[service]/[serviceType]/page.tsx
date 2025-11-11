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
const IndividualServicePage = dynamic(
	() => import("@/components/ServeMe").then((mod) => ({ default: mod.IndividualServicePage })),
	{
		loading: () => <IndividualServiceLoader />,
		ssr: true,
	}
);

// Loading component for IndividualServicePage
function IndividualServiceLoader() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Hero Section Skeleton */}
			<div className="w-full bg-gray-200 dark:bg-gray-800 animate-pulse h-[300px] sm:h-[400px]"></div>

			{/* Content Section Skeleton */}
			<div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Price and Rating */}
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
							<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
						</div>

						{/* Service Features */}
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
							<div className="space-y-3">
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
							</div>
						</div>

						{/* Service Details */}
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
							<div className="space-y-3">
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow sticky top-4">
							<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4 animate-pulse"></div>
							<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

interface IndividualServicePageProps {
	params: Promise<{
		service: string;
		serviceType: string;
	}>;
}

/**
 * Generate metadata for individual service page
 */
export async function generateMetadata({ params }: IndividualServicePageProps): Promise<Metadata> {
	const { service, serviceType } = await params;
	const serviceData = getCachedService(service, serviceType);

	if (!serviceData) {
		return {
			title: "خدمة غير موجودة | شلة فود",
			description: "الخدمة المطلوبة غير متوفرة",
		};
	}

	return {
		title: `${serviceData.titleAr} | اخدمني - شلة فود`,
		description: `${serviceData.descriptionAr} احصل على أفضل الخدمات من شلة فود.`,
		keywords: [
			serviceData.titleAr,
			serviceData.titleEn,
			"اخدمني",
			"شلة فود",
			"خدمات",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `${serviceData.titleAr} | اخدمني - شلة فود`,
			description: serviceData.descriptionAr,
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: `${serviceData.titleAr} | اخدمني - شلة فود`,
			description: serviceData.descriptionAr,
			creator: "@shellafood",
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		alternates: {
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

/**
 * Individual Service Page
 * Dynamic page that displays detailed information about a specific service
 * Path: /serve-me/[service]/[serviceType]
 * Example: /serve-me/legal-services/legal-consultation
 * Optimized with dynamic imports for better performance
 */
export default async function IndividualServPage({ params }: IndividualServicePageProps) {
	const { service, serviceType } = await params;
	const serviceData = getCachedService(service, serviceType);

	// If service not found, show 404
	if (!serviceData || !isValidIndividualService(service, serviceType)) {
		notFound();
	}

	return (
		<Suspense fallback={<IndividualServiceLoader />}>
			<IndividualServicePage
				serviceData={serviceData}
				serviceSlug={service}
				serviceTypeSlug={serviceType}
			/>
		</Suspense>
	);
}


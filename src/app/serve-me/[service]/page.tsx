import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getServiceCategoryBySlug, isValidServiceCategorySlug, getAllServiceCategorySlugs } from "@/lib/data/services";
import ServiceCategoryPage from "@/components/ServeMe/Service/ServiceCategoryPage";

// Cache service category data to prevent redundant lookups
const getCachedServiceCategory = cache((service: string) => {
	return getServiceCategoryBySlug(service);
});

export async function generateStaticParams() {
	const serviceSlugs = getAllServiceCategorySlugs();
	return serviceSlugs.map((service) => ({
		service,
	}));
}

interface PageProps {
	params: Promise<{
		service: string;
	}>;
}

/**
 * Generate metadata for service category page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { service } = await params;
	const serviceData = getCachedServiceCategory(service);

	if (!serviceData || !isValidServiceCategorySlug(service)) {
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
			url: `https://shellafood.com/serve-me/${service}`,
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
			canonical: `https://shellafood.com/serve-me/${service}`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}`,
				"en-US": `https://shellafood.com/serve-me/${service}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

/**
 * Service Category Page
 * Dynamic page that displays all services within a category (e.g., "Legal Services")
 * Path: /serve-me/[service]
 * Optimized with dynamic imports for better performance
 */
export default async function ServiceCatPage({ params }: PageProps) {
	const { service } = await params;
	const serviceData = getCachedServiceCategory(service);

	// If service not found, show 404
	if (!serviceData || !isValidServiceCategorySlug(service)) {
		notFound();
	}

	return (

			<ServiceCategoryPage serviceData={serviceData} />
		
	);
}


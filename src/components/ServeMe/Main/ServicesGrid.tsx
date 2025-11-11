import React, { memo, useCallback } from "react";
import { ServiceCard } from "../Service/ServiceCard";

interface Service {
	slug: string;
	title: string;
	icon: React.ReactNode;
	path: string;
	image: string;
}

interface ServicesGridProps {
	title: string;
	buttonText: string;
	isArabic: boolean;
	services: Service[];
}

/**
 * Services Grid Component
 * Grid layout of all available services
 */
export const ServicesGrid: React.FC<ServicesGridProps> = memo(({
	title,
	buttonText,
	isArabic,
	services,
}) => {
	const handleServiceClick = useCallback((serviceTitle: string) => {
		console.log(`Service clicked: ${serviceTitle}`);
		// TODO: Implement service click logic
	}, []);

	return (
		<div className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
			<div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
				{/* Section Header */}
				<div className="text-center mb-8 sm:mb-12">
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
						{isArabic ? "خدماتنا" : "Our Services"}
					</h2>
					<p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
						{title}
					</p>
				</div>

				{/* Services Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{services.map((service) => {
						// Generate description based on service title
						const description = isArabic 
							? `${service.title} - خدمة احترافية عالية الجودة مع فريق متخصص`
							: `${service.title} - Professional high-quality service with specialized team`;
						
						return (
							<ServiceCard
								key={service.slug}
								title={service.title}
								icon={service.icon}
								serviceSlugPath={service.path}
								image={service.image}
								buttonText={buttonText}
								isArabic={isArabic}
								serviceSlug={service.slug}
								description={description}
								onClick={() => handleServiceClick(service.title)}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
});

ServicesGrid.displayName = "ServicesGrid";


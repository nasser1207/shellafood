import React, { memo } from "react";

interface Feature {
	icon: React.ReactNode;
	title: string;
	description: string;
}

interface FeaturesSectionProps {
	features: Feature[];
	isArabic: boolean;
}

const CONTAINER_CLASSES = "bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 lg:py-20";
const CONTENT_CLASSES = "w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24";
const GRID_CLASSES = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12";
const CARD_CLASSES = "flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 shadow-sm";
const ICON_CONTAINER_CLASSES = "w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4 sm:mb-6";

/**
 * Features Section Component
 * Bottom section showing key features/benefits
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = memo(({
	features,
	isArabic,
}) => {
	return (
		<div className={CONTAINER_CLASSES}>
			<div className={CONTENT_CLASSES}>
				<div className={GRID_CLASSES}>
					{features.map((feature, index) => (
						<div
							key={`feature-${feature.title}-${index}`}
							className={CARD_CLASSES}
						>
							{/* Icon */}
							<div className={ICON_CONTAINER_CLASSES}>
								<div className="text-green-600 dark:text-green-400">
									{feature.icon}
								</div>
							</div>

							{/* Title */}
							<h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
								{feature.title}
							</h3>

							{/* Description */}
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
});

FeaturesSection.displayName = "FeaturesSection";


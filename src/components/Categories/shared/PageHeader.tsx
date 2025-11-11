/**
 * Reusable page header component for category pages
 */

import { memo } from 'react';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';

interface PageHeaderProps {
	title: string;
	description: string;
	icon?: React.ReactNode;
	className?: string;
}

function PageHeader({ title, description, icon, className = '' }: PageHeaderProps) {
	const { isArabic, direction } = useLanguageDirection();

	const defaultIcon = (
		<svg className="text-green-600 dark:text-green-400 h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M3 5a2 2 0 012-2h3.28a2 2 0 011.788 1.106l.724 1.447A2 2 0 0012.28 7H19a2 2 0 012 2v7a2 2 0 01-2 2H9.28a2 2 0 01-1.788-1.106l-.724-1.447A2 2 0 004.28 15H5a2 2 0 01-2-2V5z"/>
		</svg>
	);

	return (
		<div className={`mb-6 sm:mb-8 ${className}`}>
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
						{icon || defaultIcon}
					</div>
					<div className={isArabic ? 'text-right' : 'text-left'}>
						<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
							{title}
						</h1>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
							{description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo(PageHeader);


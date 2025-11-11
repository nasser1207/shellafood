/**
 * Reusable empty state component for categories
 */

import { memo } from 'react';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';

interface EmptyStateProps {
	icon?: string;
	title: string;
	description: string;
	className?: string;
}

function EmptyState({ icon = '📦', title, description, className = '' }: EmptyStateProps) {
	const { direction } = useLanguageDirection();

	return (
		<div
			className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 sm:p-12 shadow-sm dark:shadow-gray-900/50 text-center ${className}`}
			dir={direction}
		>
			<div className="text-6xl mb-4" aria-hidden="true">
				{icon}
			</div>
			<p className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400">
				{title}
			</p>
			<p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
				{description}
			</p>
		</div>
	);
}

export default memo(EmptyState);


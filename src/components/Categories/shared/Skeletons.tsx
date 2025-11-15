/**
 * Unified skeleton system for loading states
 * Consistent loading UI across all pages
 */

"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
	className?: string;
	variant?: 'default' | 'mobile' | 'compact';
}

export const SkeletonCard = memo(({ className = '', variant = 'default' }: SkeletonCardProps) => {
	const isMobile = variant === 'mobile';
	const isCompact = variant === 'compact';
	
	return (
		<div className={cn('animate-pulse', className)}>
			<div className={cn(
				'bg-gray-200 dark:bg-gray-700 rounded-xl mb-3',
				isMobile ? 'aspect-square' : isCompact ? 'aspect-[4/3]' : 'aspect-square'
			)} />
			<div className="space-y-2">
				<div className={cn(
					'bg-gray-200 dark:bg-gray-700 rounded',
					isMobile ? 'h-4' : 'h-4'
				)} />
				<div className={cn(
					'bg-gray-200 dark:bg-gray-700 rounded',
					isMobile ? 'h-4 w-2/3' : 'h-4 w-2/3'
				)} />
				<div className={cn(
					'bg-gray-200 dark:bg-gray-700 rounded',
					isMobile ? 'h-6 w-1/3' : 'h-6 w-1/3'
				)} />
			</div>
		</div>
	);
});

SkeletonCard.displayName = 'SkeletonCard';

interface SkeletonGridProps {
	count?: number;
	columns?: 2 | 3 | 4 | 6;
	variant?: 'default' | 'mobile' | 'compact';
	className?: string;
}

export const SkeletonGrid = memo(({ 
	count = 6, 
	columns = 2,
	variant = 'default',
	className = ''
}: SkeletonGridProps) => {
	const gridCols = {
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4',
		6: 'grid-cols-6',
	};

	return (
		<div className={cn('grid gap-4', gridCols[columns], className)}>
			{[...Array(count)].map((_, i) => (
				<SkeletonCard key={i} variant={variant} />
			))}
		</div>
	);
});

SkeletonGrid.displayName = 'SkeletonGrid';

export const SkeletonPage = memo(() => {
	return (
		<div className="animate-pulse space-y-6 p-4">
			{/* Hero skeleton */}
			<div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
			
			{/* Header skeleton */}
			<div className="space-y-2">
				<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4" />
				<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
			</div>
			
			{/* Grid skeleton */}
			<SkeletonGrid count={6} columns={2} />
		</div>
	);
});

SkeletonPage.displayName = 'SkeletonPage';

export const SkeletonText = memo(({ 
	lines = 3, 
	className = '' 
}: { 
	lines?: number; 
	className?: string;
}) => {
	return (
		<div className={cn('space-y-2', className)}>
			{[...Array(lines)].map((_, i) => (
				<div
					key={i}
					className={cn(
						'h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
						i === lines - 1 && 'w-2/3'
					)}
				/>
			))}
		</div>
	);
});

SkeletonText.displayName = 'SkeletonText';


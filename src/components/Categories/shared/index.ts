/**
 * Barrel exports for shared Categories components
 * Clean imports: import { ProductCard, EmptyState } from '@/components/Categories/shared'
 */

// Unified ProductCard - supports all variants (default, mobile, compact, list)
export { default as ProductCard } from './UnifiedProductCard';
export { default as UnifiedProductCard } from './UnifiedProductCard';
// Legacy exports for backward compatibility
export { default as MobileProductCard } from './MobileProductCard';
export { default as StoreCard } from '../StoreCard/StoreCard';
export { default as FilterSection } from './FilterSection';
export { default as FiltersSidebar } from './FiltersSidebar';
export { default as EmptyState } from './EmptyState';
export { default as PageHeader } from './PageHeader';
export { default as BottomSheet } from './BottomSheet';
export { default as FilterChip } from './FilterChip';
export { default as ExpandableSection } from './ExpandableSection';

// Skeleton components
export { default as MobileStorePageSkeleton } from './MobileStorePageSkeleton';
export { default as MobileProductPageSkeleton } from './MobileProductPageSkeleton';
export { default as ProductCardSkeleton } from './ProductCardSkeleton';
export { default as MobileProductCardSkeleton } from './ProductCardSkeleton'; // Alias for backward compatibility
export { default as MobileDepartmentPageSkeleton } from './MobileDepartmentPageSkeleton';
export { default as StoreCardSkeleton } from './StoreCardSkeleton';


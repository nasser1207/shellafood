'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2 } from 'lucide-react';
import { Product } from '@/components/Utils/ProductCard';
import Image from 'next/image';

interface ReorderProductCardProps {
	product: Product;
	onAddToCart: (product: Product) => void;
	isAdded: boolean;
	isArabic: boolean;
	index: number;
}

export default function ReorderProductCard({
	product,
	onAddToCart,
	isAdded,
	isArabic,
	index,
}: ReorderProductCardProps) {
	const displayName = isArabic && product.nameAr ? product.nameAr : product.name;
	const displayDesc = isArabic && product.descriptionAr ? product.descriptionAr : product.description;
	
	// Format price
	const price = typeof product.price === 'number' 
		? `${product.price.toFixed(2)} ${isArabic ? 'ر.س' : 'SAR'}`
		: product.price || '0 SAR';

	return (
		<motion.div
			initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.05 }}
			className="
				group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4
				bg-white dark:bg-gray-800
				border border-gray-200 dark:border-gray-700
				rounded-xl
				hover:border-green-500 dark:hover:border-green-600
				hover:shadow-md
				transition-all duration-200
			"
		>
			{/* Product Image */}
			<div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
				{product.image ? (
					<Image
						src={product.image}
						alt={displayName}
						fill
						className="object-cover"
						sizes="80px"
						unoptimized
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
						🍽️
					</div>
				)}
			</div>

			{/* Product Info */}
			<div className="flex-1 min-w-0">
				<h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-0.5 truncate">
					{displayName}
				</h4>
				{displayDesc && (
					<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
						{displayDesc}
					</p>
				)}
				<p className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400 mt-1">
					{price}
				</p>
			</div>

			{/* Add Button */}
			<motion.button
				whileTap={isAdded ? undefined : { scale: 0.9 }}
				onClick={() => !isAdded && onAddToCart(product)}
				disabled={isAdded}
				className={`
					w-9 h-9 sm:w-10 sm:h-10 rounded-full
					flex items-center justify-center
					transition-all duration-200
					flex-shrink-0
					${isAdded
						? 'bg-green-600 text-white shadow-lg shadow-green-500/30 cursor-default'
						: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer'
					}
				`}
				aria-label={isAdded ? (isArabic ? 'تمت الإضافة' : 'Added') : (isArabic ? 'أضف للسلة' : 'Add to Cart')}
			>
				<AnimatePresence mode="wait">
					{isAdded ? (
						<motion.div
							key="check"
							initial={{ scale: 0, rotate: -180 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{ type: 'spring', stiffness: 500, damping: 30 }}
						>
							<CheckCircle2 className="w-5 h-5" />
						</motion.div>
					) : (
						<motion.div
							key="plus"
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: 'spring', stiffness: 500, damping: 30 }}
						>
							<Plus className="w-5 h-5" />
						</motion.div>
					)}
				</AnimatePresence>
			</motion.button>
		</motion.div>
	);
}


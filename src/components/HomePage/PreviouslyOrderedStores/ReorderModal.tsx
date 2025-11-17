'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ShoppingBag, Calendar, Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import { Store } from '@/components/Utils/StoreCard';
import { Product } from '@/components/Utils/ProductCard';
import ReorderProductCard from './ReorderProductCard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ReorderModalProps {
	isOpen: boolean;
	onClose: () => void;
	store: Store;
	lastOrderItems: Product[];
	lastOrderDate?: string;
	categorySlug?: string;
	storeSlug?: string;
}

export default function ReorderModal({
	isOpen,
	onClose,
	store,
	lastOrderItems,
	lastOrderDate = '2 days ago',
	categorySlug,
	storeSlug,
}: ReorderModalProps) {
	const { language } = useLanguage();
	const { addToCart } = useCart();
	const router = useRouter();
	const isArabic = language === 'ar';
	const [addingAll, setAddingAll] = useState(false);
	const [addedItems, setAddedItems] = useState<string[]>([]);

	// Close on Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [isOpen, onClose]);

	// Calculate total
	const orderTotal = useMemo(() => {
		return lastOrderItems.reduce((sum, item) => {
			const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price || '0').replace(/[^0-9.]/g, ''));
			return sum + price;
		}, 0);
	}, [lastOrderItems]);

	// Handle add single item
	const handleAddItem = useCallback(async (product: Product) => {
		if (!store.id) return;

		const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || '0').replace(/[^0-9.]/g, ''));

		try {
			await addToCart({
				productId: product.id,
				storeId: store.id,
				quantity: 1,
				productName: product.name,
				productNameAr: product.nameAr,
				productImage: product.image,
				priceAtAdd: price,
				storeName: store.name,
				storeNameAr: store.nameAr,
				storeLogo: store.logo || undefined,
				stock: product.stockQuantity,
			});
			
			// Update state immediately to show checkmark - use array to ensure React detects change
			setAddedItems(prev => {
				// Prevent adding if already added
				if (prev.includes(product.id)) {
					return prev; // Already added, no need to update
				}
				return [...prev, product.id]; // Create new array to trigger re-render
			});
		} catch (error) {
			console.error('Error adding to cart:', error);
		}
	}, [addToCart, store]);

	// Handle add all items
	const handleReorderAll = useCallback(async () => {
		if (!store.id) return;

		setAddingAll(true);
		
		for (const product of lastOrderItems) {
			const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || '0').replace(/[^0-9.]/g, ''));

			await addToCart({
				productId: product.id,
				storeId: store.id,
				quantity: 1,
				productName: product.name,
				productNameAr: product.nameAr,
				productImage: product.image,
				priceAtAdd: price,
				storeName: store.name,
				storeNameAr: store.nameAr,
				storeLogo: store.logo || undefined,
				stock: product.stockQuantity,
			});
			
			// Small delay between additions for smooth UX
			await new Promise(resolve => setTimeout(resolve, 100));
		}
		
		setAddingAll(false);
		
		// Close modal and navigate to cart after short delay
		setTimeout(() => {
			onClose();
			router.push('/cart');
		}, 500);
	}, [lastOrderItems, addToCart, store, onClose, router]);

	// Handle browse store
	const handleBrowseStore = useCallback(() => {
		onClose();
		if (categorySlug && storeSlug) {
			router.push(`/categories/${categorySlug}/${storeSlug}`);
		} else if (store.categoryId && store.slug) {
			// Fallback: try to construct route
			const category = store.categoryId === '1' ? 'restaurants' : 
			                 store.categoryId === '2' ? 'supermarket' :
			                 store.categoryId === '3' ? 'pharmacy' : 'general';
			router.push(`/categories/${category}/${store.slug}`);
		}
	}, [onClose, categorySlug, storeSlug, router, store]);

	const content = {
		ar: {
			title: 'اطلب مجدداً',
			from: 'من',
			lastOrdered: 'آخر طلب',
			items: 'منتجات',
			total: 'المجموع',
			addToCart: 'أضف للسلة',
			added: 'تمت الإضافة',
			reorderAll: 'اطلب الكل',
			browseStore: 'تصفح المتجر',
			close: 'إغلاق',
			adding: 'جاري الإضافة...',
		},
		en: {
			title: 'Order Again',
			from: 'from',
			lastOrdered: 'Last ordered',
			items: 'items',
			total: 'Total',
			addToCart: 'Add to Cart',
			added: 'Added',
			reorderAll: 'Reorder All',
			browseStore: 'Browse Store',
			close: 'Close',
			adding: 'Adding...',
		},
	};

	const t = content[language];

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
						aria-hidden="true"
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ type: 'spring', duration: 0.5 }}
						className={`
							fixed inset-4 md:inset-auto 
							md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
							md:w-full md:max-w-2xl md:max-h-[90vh]
							bg-white dark:bg-gray-900 
							rounded-2xl md:rounded-3xl 
							shadow-2xl 
							z-50 
							flex flex-col
							overflow-hidden
						`}
						dir={isArabic ? 'rtl' : 'ltr'}
						role="dialog"
						aria-modal="true"
						aria-labelledby="reorder-modal-title"
					>
						{/* Header */}
						<div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									{store.logo && (
										<div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
											<Image
												src={store.logo}
												alt={store.name}
												width={48}
												height={48}
												className="object-cover w-full h-full"
												unoptimized
											/>
										</div>
									)}
									<div>
										<h2 id="reorder-modal-title" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
											{t.title}
										</h2>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{t.from} {isArabic && store.nameAr ? store.nameAr : store.name}
										</p>
									</div>
								</div>
								
								<button
									onClick={onClose}
									className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
									aria-label={t.close}
								>
									<X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
								</button>
							</div>

							{/* Order Info */}
							<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
								<div className="flex items-center gap-1.5">
									<Calendar className="w-4 h-4" />
									<span>{t.lastOrdered}: {lastOrderDate}</span>
								</div>
								<div className="flex items-center gap-1.5">
									<Package className="w-4 h-4" />
									<span>{lastOrderItems.length} {t.items}</span>
								</div>
								<div className="flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-400">
									<ShoppingBag className="w-4 h-4" />
									<span>{orderTotal.toFixed(2)} {isArabic ? 'ر.س' : 'SAR'}</span>
								</div>
							</div>
						</div>

						{/* Products List - Scrollable */}
						<div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
							<div className="space-y-3">
								{lastOrderItems.length > 0 ? (
									lastOrderItems.map((product, index) => (
										<ReorderProductCard
											key={product.id}
											product={product}
											onAddToCart={handleAddItem}
											isAdded={addedItems.includes(product.id)}
											isArabic={isArabic}
											index={index}
										/>
									))
								) : (
									<div className="text-center py-8 text-gray-500 dark:text-gray-400">
										<p>{isArabic ? 'لا توجد منتجات في هذا الطلب' : 'No items in this order'}</p>
									</div>
								)}
							</div>
						</div>

						{/* Footer Actions */}
						<div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
							<div className="flex flex-col sm:flex-row gap-3">
								<button
									onClick={handleReorderAll}
									disabled={addingAll || lastOrderItems.length === 0}
									className={`
										flex-1 flex items-center justify-center gap-2 px-6 py-3.5
										bg-gradient-to-r from-green-600 to-emerald-600
										hover:from-green-700 hover:to-emerald-700
										active:scale-95
										disabled:opacity-50 disabled:cursor-not-allowed
										text-white font-semibold rounded-xl
										transition-all duration-200
										shadow-lg shadow-green-500/30
									`}
								>
									<ShoppingBag className="w-5 h-5" />
									<span>
										{addingAll ? t.adding : `${t.reorderAll} - ${lastOrderItems.length} ${t.items}`}
									</span>
								</button>

								<button
									onClick={handleBrowseStore}
									className="
										flex-1 flex items-center justify-center gap-2 px-6 py-3.5
										bg-white dark:bg-gray-800
										hover:bg-gray-50 dark:hover:bg-gray-700
										active:scale-95
										text-gray-700 dark:text-gray-300
										font-semibold rounded-xl
										border-2 border-gray-200 dark:border-gray-700
										transition-all duration-200
									"
								>
									<span>{t.browseStore}</span>
									<ArrowLeft className={`w-4 h-4 ${isArabic ? '' : 'rotate-180'}`} />
								</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}


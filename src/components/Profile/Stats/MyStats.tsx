'use client';

import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaWallet } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
	id: string;
	name: string;
	image: string;
	price: string;
	originalPrice?: string;
	unit: string;
}

interface UserStats {
	availableAmount: number;
	qaidhaAmount: number;
}

export default function MyStats() {
    const { language } = useLanguage();
    const isArabic = language === 'ar';
    const direction = isArabic ? 'rtl' : 'ltr';
	const [mostPurchasedProducts, setMostPurchasedProducts] = useState<Product[]>([]);
	const [userStats, setUserStats] = useState<UserStats>({ availableAmount: 0, qaidhaAmount: 0 });
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserStats = async () => {
			try {
				// جلب المنتجات الأكثر شراءً
				const productsResponse = await fetch('/api/user/most-purchased-products');
				if (productsResponse.ok) {
					const productsData = await productsResponse.json();
					setMostPurchasedProducts(productsData.products || []);
				}

				// جلب إحصائيات المستخدم
				const statsResponse = await fetch('/api/user/stats');
				if (statsResponse.ok) {
					const statsData = await statsResponse.json();
					setUserStats(statsData.stats || { availableAmount: 0, qaidhaAmount: 0 });
				}
			} catch (error) {
				console.error('Error fetching user stats:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserStats();
	}, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10 sm:py-12">
                <div className="animate-spin rounded-full h-7 w-7 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
            <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                        <div className={`flex items-center gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
                            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                <FaWallet className="text-green-600 dark:text-green-400 text-lg" />
                            </div>
                            <div className={isArabic ? 'text-right' : 'text-left'}>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">إحصائياتي</h1>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">نظرة عامة على أرصدتك ونشاطك</p>
                            </div>
                        </div>
                    </div>
                </div>

			{/* إحصائيات المالية */}
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className={`flex flex-col ${isArabic ? 'items-end' : 'items-start'}`}>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">المبلغ المتاح</span>
                            <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                                {userStats.availableAmount.toFixed(2)} ر.س
                            </span>
                        </div>
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <FaWallet className="text-green-600 dark:text-green-400" size={22} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className={`flex flex-col ${isArabic ? 'items-end' : 'items-start'}`}>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">قيدها</span>
                            <span className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {userStats.qaidhaAmount.toFixed(2)} ر.س
                            </span>
                        </div>
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                            <FaWallet className="text-orange-600 dark:text-orange-400" size={22} />
                        </div>
                    </div>
                </div>
                </div>

			{/* المنتجات الأكثر شراءً */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
                <h3 className={`${isArabic ? 'text-right' : 'text-left'} text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6`}>
					المنتجات الأكثر شراءً
				</h3>
				
				{mostPurchasedProducts.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">لا توجد منتجات مشتراة بعد</p>
					</div>
				) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
						{mostPurchasedProducts.map((product) => (
                            <div key={product.id} className={`flex items-center ${isArabic ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50`}>
								<img
									src={product.image}
									alt={product.name}
                                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
								/>
								<div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">{product.name}</h4>
                                    <div className={`flex items-center ${isArabic ? 'space-x-reverse' : ''} space-x-2 mt-1`}>
                                        <span className="text-green-600 dark:text-green-400 font-bold text-xs sm:text-sm">{product.price}</span>
										{product.originalPrice && (
                                            <span className="text-gray-400 dark:text-gray-500 line-through text-[10px] sm:text-xs">{product.originalPrice}</span>
										)}
									</div>
                                    <span className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs">{product.unit}</span>
								</div>
							</div>
						))}
					</div>
				)}
                </div>

			{/* إحصائيات إضافية */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">0</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">إجمالي الطلبات</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">0</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">المتاجر المفضلة</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">0</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">النقاط المكتسبة</div>
                </div>
                </div>
            </div>
        </div>
	);
}

'use client';

import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaWallet } from 'react-icons/fa';

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
					setUserStats({
						availableAmount: statsData.availableAmount || 0,
						qaidhaAmount: statsData.qaidhaAmount || 0
					});
				}
			} catch (error) {
				console.error('خطأ في جلب إحصائيات المستخدم:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserStats();
	}, []);
	return (
		<div className="flex flex-col space-y-8">
			<h2 className="text-right text-2xl font-bold text-gray-800">
				إحصائياتي
			</h2>
			{/* Stats Summary Section */}
			<div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 rounded-lg bg-green-600 p-6 text-white">
				{isLoading ? (
					<>
						<div className="flex flex-col text-right">
							<span className="text-sm font-medium">المبلغ المتاح للشراء</span>
							<div className="mt-1 h-6 w-24 animate-pulse bg-green-500 rounded"></div>
						</div>
						<div className="flex flex-col items-end text-right">
							<div className="flex items-center space-x-2">
								<FaWallet className="text-xl" />
								<span className="text-sm font-medium">المبلغ المقدم من قيدها</span>
							</div>
							<div className="mt-1 h-6 w-24 animate-pulse bg-green-500 rounded"></div>
						</div>
					</>
				) : (
					<>
						<div className="flex flex-col text-right">
							<span className="text-sm font-medium">المبلغ المتاح للشراء</span>
							<span className="mt-1 text-xl font-bold">{userStats.availableAmount.toFixed(1)} ر.س</span>
						</div>
						<div className="flex flex-col items-end text-right">
							<div className="flex items-center space-x-2">
								<FaWallet className="text-xl" />
								<span className="text-sm font-medium">المبلغ المقدم من قيدها</span>
							</div>
							<span className="mt-1 text-xl font-bold">{userStats.qaidhaAmount.toFixed(1)} ر.س</span>
						</div>
					</>
				)}
			</div>

			{/* Most Purchased Products Section */}
			<div className="flex flex-col">
				<h3 className="mb-4 text-right text-xl font-semibold text-gray-800">
					المنتجات الأكثر شراء
				</h3>
				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{[1, 2, 3, 4].map((item) => (
							<div key={item} className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4">
								<div className="mb-2 h-24 w-24 animate-pulse bg-gray-300 rounded"></div>
								<div className="mb-2 flex flex-col items-center space-y-2">
									<div className="h-4 w-32 animate-pulse bg-gray-300 rounded"></div>
									<div className="h-3 w-16 animate-pulse bg-gray-300 rounded"></div>
								</div>
								<div className="mt-auto flex w-full flex-row-reverse items-center justify-start space-x-1">
									<div className="h-5 w-16 animate-pulse bg-gray-300 rounded"></div>
									<div className="h-4 w-12 animate-pulse bg-gray-300 rounded"></div>
								</div>
							</div>
						))}
					</div>
				) : mostPurchasedProducts.length === 0 ? (
					<div className="flex items-center justify-center py-8">
						<p className="text-gray-500">لا توجد منتجات مشتراة سابقاً</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{mostPurchasedProducts.map((product) => (
							<div
								key={product.id}
								className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4"
							>
								<div className="relative">
									<img
										src={product.image}
										alt={product.name}
										className="mb-2 h-24 w-24 object-cover rounded"
									/>
									<FaPlusCircle className="absolute right-0 bottom-0 cursor-pointer text-xl text-green-600" />
								</div>
								<div className="mb-2 flex flex-col items-center">
									<span className="text-center font-semibold text-gray-800">
										{product.name}
									</span>
									<span className="text-center text-sm text-gray-500">
										{product.unit}
									</span>
								</div>
								<div className="mt-auto flex w-full flex-row-reverse items-center justify-start space-x-1 text-right">
									<span className="text-lg font-bold text-orange-500">
										{product.price}
									</span>
									{product.originalPrice && (
										<span className="text-sm text-gray-500 line-through">
											{product.originalPrice}
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
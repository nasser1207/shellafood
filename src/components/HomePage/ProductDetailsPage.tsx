"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";

interface Product {
	id: string;
	name: string;
	description: string;
	image: string;
	mainImage?: string;
	thumbnailImages?: string[];
	category: string;
	newPrice: string;
	oldPrice?: string;
	size?: string;
	store?: {
		id: string;
		name: string;
		type: string;
	};
}

interface ProductDetailsPageProps {
	productId: string;
	onProductClick: (productId: string) => void;
}

export default function ProductDetailsPage({
	productId,
	onProductClick,
}: ProductDetailsPageProps) {
	const [product, setProduct] = useState<Product | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const [showClearCartDialog, setShowClearCartDialog] = useState(false);
	const [pendingProduct, setPendingProduct] = useState<{ productId: string; storeId: string } | null>(null);
	
	const { addToCart, clearCart, isLoading: cartLoading } = useCart();

	useEffect(() => {
		const fetchProductDetails = async () => {
			try {
				// جلب تفاصيل المنتج
				const { getProductByIdAction, getProductsAction } = await import("@/app/actions/products");
				const productResult = await getProductByIdAction(productId);
				
				if (productResult.success && productResult.data) {
					setProduct(productResult.data.product);

					// جلب المنتجات ذات الصلة من نفس الفئة
					if (productResult.data.product?.category) {
						const relatedResult = await getProductsAction({ 
							category: productResult.data.product.category, 
							exclude: productId, 
							limit: 6 
						});
						if (relatedResult.success && relatedResult.data) {
							setRelatedProducts(relatedResult.data.products || []);
						}
					}
				} else if (!productResult.success) {
					console.error("فشل في جلب تفاصيل المنتج:", productResult.error);
				}
			} catch (error) {
				console.error("خطأ في جلب تفاصيل المنتج:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProductDetails();
	}, [productId]);

	// استخدام useState لإدارة حالة فتح/إغلاق قسم الوصف
	const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

	// وظائف إدارة الكمية
	const increaseQuantity = () => {
		setQuantity(prev => prev + 1);
	};

	const decreaseQuantity = () => {
		setQuantity(prev => prev > 1 ? prev - 1 : 1);
	};

	// وظيفة إضافة المنتج للسلة
	const handleAddToCart = async () => {
		if (!product?.store?.id) {
			alert('خطأ: معرف المتجر غير متوفر');
			return;
		}

		const result = await addToCart({ 
			productId: product.id, 
			storeId: product.store.id,
			quantity 
		});
		
		if (result.success) {
			alert(result.message || 'تم إضافة المنتج للسلة بنجاح');
		} else if (result.requiresClearCart) {
			setPendingProduct({ productId: product.id, storeId: product.store.id });
			setShowClearCartDialog(true);
		} else {
			alert(result.error || 'حدث خطأ أثناء إضافة المنتج للسلة');
		}
	};

	// وظيفة إفراغ السلة وإضافة المنتج الجديد
	const handleClearCartAndAdd = async () => {
		if (!pendingProduct) return;

		const cleared = await clearCart();
		if (cleared) {
			const result = await addToCart({ 
				productId: pendingProduct.productId, 
				storeId: pendingProduct.storeId,
				quantity 
			});
			
			if (result.success) {
				alert(result.message || 'تم إضافة المنتج للسلة بنجاح');
			} else {
				alert(result.error || 'حدث خطأ أثناء إضافة المنتج للسلة');
			}
		} else {
			alert('حدث خطأ أثناء إفراغ السلة');
		}
		
		setShowClearCartDialog(false);
		setPendingProduct(null);
	};

	// عرض حالة التحميل
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 p-4 font-sans" dir="rtl">
				<div className="mx-auto max-w-4xl">
					{/* صورة المنتج الرئيسية */}
					<div className="mb-8 h-80 w-full animate-pulse bg-gray-300 rounded-lg"></div>
					
					{/* تفاصيل المنتج */}
					<div className="rounded-lg bg-white p-6 shadow-lg">
						<div className="h-8 w-3/4 animate-pulse bg-gray-300 rounded mb-4"></div>
						<div className="h-6 w-24 animate-pulse bg-gray-300 rounded mb-4"></div>
						<div className="h-4 w-full animate-pulse bg-gray-300 rounded mb-2"></div>
						<div className="h-4 w-2/3 animate-pulse bg-gray-300 rounded mb-4"></div>
					</div>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="p-8 text-center text-red-600">
				عذراً، المنتج المطلوب غير موجود.
			</div>
		);
	}

	const mainProductImage = product.mainImage || product.image;
	const thumbnailImages = product.thumbnailImages || [product.image];

	// المنتجات ذات الصلة تم جلبها من قاعدة البيانات في useEffect

	return (
		<div className="min-h-screen bg-gray-50 pb-20 font-sans" dir="rtl">
			{" "}
			{/* أضف pb-20 لترك مسافة للزر السفلي */}
			<div className="p-4 md:p-8">
				{/* قسم الصورة الرئيسية وتفاصيل المنتج */}
				<div className="flex flex-col gap-8 md:flex-row">
					{/* عمود الصور */}
					<div className="flex flex-1 flex-col items-center">
						<img
							src={mainProductImage}
							alt={product.name}
							className="h-auto w-full max-w-sm rounded-lg shadow-md"
						/>
						<div className="mt-4 flex gap-2 overflow-x-auto">
							{" "}
							{/* إضافة overflow-x-auto لضمان التمرير إذا كان هناك الكثير من الصور */}
							{thumbnailImages.map((img, index) => (
								<img
									key={index}
									src={img}
									alt={`Thumbnail ${index + 1}`}
									className="h-16 w-16 cursor-pointer rounded-lg border-2 border-gray-200 object-cover transition-colors hover:border-green-500"
								/>
							))}
						</div>
					</div>
					{/* عمود التفاصيل */}
					<div className="mt-8 flex-1 text-right md:mt-0">
						<h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
						<p className="text-md mt-2 text-gray-600">{product.description}</p>
						<div className="mt-4 flex items-center justify-end">
							<span className="text-3xl font-bold text-green-600">
								{product.newPrice}
							</span>
							<div className="mr-4 flex items-center overflow-hidden rounded-full border border-gray-300">
								<button 
									onClick={decreaseQuantity}
									disabled={quantity <= 1}
									className="p-2 text-gray-600 hover:bg-gray-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
								<span className="px-4 text-lg font-semibold text-gray-800">
									{quantity}
								</span>
								<button 
									onClick={increaseQuantity}
									className="p-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				<hr className="my-8 border-gray-200" />

				{/* قسم المنتجات ذات الصلة */}
				<section>
					<h2 className="mb-4 text-xl font-bold text-gray-900">
						منتجات ذات صلة
					</h2>
					<div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
						{relatedProducts.length > 0 ? (
							relatedProducts.map((p) => (
								<button
									key={p.id}
									onClick={() => onProductClick(p.id)}
									className="flex w-32 flex-shrink-0 cursor-pointer flex-col items-center rounded-lg bg-white p-2 text-center shadow-sm transition-shadow hover:shadow-md md:w-40"
								>
									<img
										src={p.image}
										alt={p.name}
										className="mb-2 h-24 w-24 rounded-lg object-contain"
									/>
									<p className="w-full truncate text-sm font-semibold text-gray-700">
										{p.name}
									</p>
								</button>
							))
						) : (
							<p className="w-full text-center text-gray-500">
								لا توجد منتجات ذات صلة.
							</p>
						)}
					</div>
				</section>

				<hr className="my-8 border-gray-200" />

				{/* قسم وصف المنتج */}
				<section>
					<div
						className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-100 p-4"
						onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
					>
						<h3 className="text-lg font-bold text-gray-900">وصف المنتج</h3>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`h-6 w-6 transform text-gray-600 transition-transform ${isDescriptionOpen ? "rotate-180" : ""}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 15l7-7 7 7"
							/>
						</svg>
					</div>
					{isDescriptionOpen && (
						<div className="mt-4 rounded-lg bg-white p-4 text-gray-700 shadow-sm">
							<p className="whitespace-pre-wrap">{product.description}</p>{" "}
							{/* استخدام fullDescription */}
						</div>
					)}
				</section>
			</div>
			{/* الشريط الأخضر السفلي الثابت */}
			<div className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between bg-green-700 p-4 text-white shadow-lg">
				<div className="flex items-center">
					<span className="ml-2 text-lg font-bold">{product.newPrice}</span>
					{product.oldPrice && (
						<span className="text-sm line-through opacity-75">
							{product.oldPrice}
						</span>
					)}
				</div>
				<button 
					onClick={handleAddToCart}
					disabled={cartLoading}
					className="flex items-center rounded-full bg-white px-6 py-2 font-semibold text-green-700 transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="ml-2 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					{cartLoading ? 'جاري الإضافة...' : 'أضف إلى السلة'}
				</button>
			</div>

			{/* Dialog لإفراغ السلة */}
			{showClearCartDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg p-6 max-w-md mx-4" dir="rtl">
						<h3 className="text-lg font-bold text-gray-900 mb-4">
							تنبيه
						</h3>
						<p className="text-gray-600 mb-6">
							لا يمكن إضافة منتجات من متاجر مختلفة في نفس السلة. 
							هل تريد إفراغ السلة الحالية وإضافة هذا المنتج؟
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => {
									setShowClearCartDialog(false);
									setPendingProduct(null);
								}}
								className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								إلغاء
							</button>
							<button
								onClick={handleClearCartAndAdd}
								disabled={cartLoading}
								className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
							>
								{cartLoading ? 'جاري المعالجة...' : 'نعم، أفرغ السلة'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

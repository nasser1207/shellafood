"use client";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

interface Product {
	id: string;
	name: string;
	image: string;
	price: string;
	originalPrice: string | null;
	unit: string | null;
	storeId?: string; // إضافة معرف المتجر
	storeName?: string; // إضافة اسم المتجر
}

interface Store {
	id: string;
	name: string;
	type: string;
	rating: string | null;
	image: string | null;
}

export default function Favorites() {
	const [products, setProducts] = useState<Product[]>([]);
	const [stores, setStores] = useState<Store[]>([]);
	const [activeTab, setActiveTab] = useState<"products" | "stores">("products");
	const [addingToCart, setAddingToCart] = useState<string | null>(null);
	const [clearingCart, setClearingCart] = useState(false);
	const { addToCart, clearCart, isLoading: cartLoading } = useCart();
	const router = useRouter(); 

	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				const { getFavoritesAction } = await import("@/app/actions/favorites");
				const result = await getFavoritesAction();
				if (result.success && result.data) {
					setProducts(result.data.favProducts || []);
					setStores(result.data.favStores || []);
				}
			} catch (error) {
				console.error("Error fetching favorites:", error);
			}
		};
		fetchFavorites();
	}, []);

	// دالة التعامل مع النقر على المنتج
	const handleProductClick = (product: Product) => {
		if (product.storeName) {
			router.push(`/product-details?product=${encodeURIComponent(product.name)}&store=${encodeURIComponent(product.storeName)}`);
		}
	};

	// دالة التعامل مع النقر على المتجر
	const handleStoreClick = (store: Store) => {
		router.push(`/store?store=${encodeURIComponent(store.name)}&source=favorites`);
	};

	// دالة إضافة المنتج إلى السلة
	const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
		e.stopPropagation(); // منع النقر على المنتج نفسه
		
		if (!product.storeId) {
			alert("لا يمكن إضافة هذا المنتج للسلة - معلومات المتجر غير متوفرة");
			return;
		}

		setAddingToCart(product.id);
		
		try {
			const result = await addToCart({
				productId: product.id,
				storeId: product.storeId,
				quantity: 1
			});

			if (result.success) {
				alert("تم إضافة المنتج للسلة بنجاح!");
			} else if (result.requiresClearCart) {
				// عرض رسالة تأكيد مع خيارين
				const confirmClear = confirm(
					`لديك منتجات من متجر آخر في السلة.\n\n` +
					`هل تريد تفريغ السلة وإضافة "${product.name}" من ${product.storeName}؟\n\n` +
					`اضغط "موافق" لتفريغ السلة وإضافة المنتج\n` +
					`اضغط "إلغاء" للعودة`
				);
				
				if (confirmClear) {
					await handleClearCartAndAddProduct(product);
				}
			} else {
				alert(result.error || "حدث خطأ أثناء إضافة المنتج للسلة");
			}
		} catch (error) {
			console.error("خطأ في إضافة المنتج للسلة:", error);
			alert("حدث خطأ أثناء إضافة المنتج للسلة");
		} finally {
			setAddingToCart(null);
		}
	};

	// دالة تفريغ السلة وإضافة المنتج الجديد
	const handleClearCartAndAddProduct = async (product: Product) => {
		setClearingCart(true);
		
		try {
			// التحقق من وجود storeId
			if (!product.storeId) {
				alert("لا يمكن إضافة هذا المنتج للسلة - معلومات المتجر غير متوفرة");
				return;
			}

			// تفريغ السلة
			const clearSuccess = await clearCart();
			
			if (clearSuccess) {
				// إضافة المنتج الجديد
				const result = await addToCart({
					productId: product.id,
					storeId: product.storeId,
					quantity: 1
				});

				if (result.success) {
					alert(`تم تفريغ السلة وإضافة "${product.name}" بنجاح!`);
				} else {
					alert(result.error || "تم تفريغ السلة لكن فشل في إضافة المنتج الجديد");
				}
			} else {
				alert("فشل في تفريغ السلة. يرجى المحاولة مرة أخرى.");
			}
		} catch (error) {
			console.error("خطأ في تفريغ السلة وإضافة المنتج:", error);
			alert("حدث خطأ أثناء العملية. يرجى المحاولة مرة أخرى.");
		} finally {
			setClearingCart(false);
		}
	};

	return (
		<div className="flex flex-col">
			{/* تبويبات */}
			<div className="mb-6 flex justify-center border-b border-gray-200 bg-white px-2 py-4">
				<div className="flex flex-row-reverse space-x-6">
					<button
						className={`border-b-2 px-6 pb-2 text-xl font-semibold ${
							activeTab === "products"
								? "border-green-600 text-green-600"
								: "border-transparent text-gray-600 hover:border-green-600"
						}`}
						onClick={() => setActiveTab("products")}
					>
						المنتجات
					</button>
					<button
						className={`border-b-2 px-6 pb-2 text-xl font-semibold ${
							activeTab === "stores"
								? "border-green-600 text-green-600"
								: "border-transparent text-gray-600 hover:border-green-600"
						}`}
						onClick={() => setActiveTab("stores")}
					>
						كل المتاجر
					</button>
				</div>
			</div>

			{/* عرض المنتجات */}
			{activeTab === "products" && (
				<div className="grid grid-cols-3 gap-4">
					{products.map((product) => (
						<div
							key={product.id}
							onClick={() => handleProductClick(product)}
							className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 cursor-pointer hover:shadow-md transition-shadow"
						>
							<div className="relative">
								<img
									src={product.image}
									alt={product.name}
									className="mb-2 h-24 w-24"
								/>
								<FaPlusCircle 
									className={`absolute right-0 bottom-0 cursor-pointer text-xl text-green-600 hover:text-green-700 transition-colors ${
										(addingToCart === product.id || clearingCart) ? 'animate-pulse' : ''
									}`}
									onClick={(e) => handleAddToCart(product, e)}
									title={clearingCart ? "جاري تفريغ السلة..." : "إضافة إلى السلة"}
									style={{ 
										pointerEvents: (addingToCart === product.id || clearingCart) ? 'none' : 'auto',
										opacity: (addingToCart === product.id || clearingCart) ? 0.7 : 1
									}}
								/>
							</div>
							<div className="mb-2 flex flex-col items-center">
								<span className="text-center font-semibold text-gray-800">
									{product.name}
								</span>
								<span className="text-center text-sm text-gray-500">
									{product.unit}
								</span>
								{product.storeName && (
									<span className="text-center text-xs text-blue-600">
										من {product.storeName}
									</span>
								)}
							</div>
							<div className="mt-auto flex w-full flex-row-reverse items-center justify-start space-x-1 text-right">
								<span className="text-lg font-bold text-orange-500">
									{product.price}
								</span>
								<span className="text-sm text-gray-500 line-through">
									{product.originalPrice}
								</span>
							</div>
						</div>
					))}
				</div>
			)}

			{/* عرض المتاجر */}
			{activeTab === "stores" && (
				<div className="mt-4 grid grid-cols-2 gap-4">
					{stores.map((store) => (
						<div
							key={store.id}
							onClick={() => handleStoreClick(store)}
							className="flex flex-col items-center rounded-lg border bg-white p-4 cursor-pointer hover:shadow-md transition-shadow"
						>
							<img
								src={store.image || ""}
								alt={store.name}
								className="mb-2 h-20 w-20"
							/>
							<span className="font-semibold">{store.name}</span>
							<span className="text-sm text-gray-500">{store.type}</span>
							{store.rating && <span className="text-yellow-500">{store.rating} ⭐</span>}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

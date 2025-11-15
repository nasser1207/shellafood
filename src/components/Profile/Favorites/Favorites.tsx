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
	originalPrice: string;
	unit: string;
	storeId?: string; // إضافة معرف المتجر
	storeName?: string; // إضافة اسم المتجر
}

interface Store {
	id: string;
	name: string;
	type: string;
	rating: string;
	image: string;
}

export default function Favorites() {
	const [products, setProducts] = useState<Product[]>([]);
	const [stores, setStores] = useState<Store[]>([]);
	const [activeTab, setActiveTab] = useState<"products" | "stores">("products");
	const [addingToCart, setAddingToCart] = useState<string | null>(null);
	const { addToCart } = useCart();
	const router = useRouter();

	useEffect(() => {
		// جلب المنتجات المفضلة
		const fetchFavoriteProducts = async () => {
			try {
				const result = await {
					success: true,
					data: { favProducts: [], favStores: [] },
					error: "",
				};
				if (result.success && result.data) {
					setProducts(result.data.favProducts || []);
					setStores(result.data.favStores || []);
				}
			} catch (error) {
				console.error("Error fetching favorites:", error);
			}
		};

		// جلب المتاجر المفضلة - using same action as products
		const fetchFavoriteStores = async () => {
			// Already handled in fetchFavoriteProducts
		};

		fetchFavoriteProducts();
	}, []);

	const handleAddToCart = async (product: Product) => {
		if (!product.storeId) {
			alert("خطأ: معرف المتجر غير متوفر");
			return;
		}

		setAddingToCart(product.id);
		try {
			const result = await addToCart({
				productId: product.id,
				storeId: product.storeId,
				quantity: 1,
				priceAtAdd: Number(product.price),
			});
		} catch (error) {
			console.error("Error adding to cart:", error);
			alert("حدث خطأ أثناء إضافة المنتج إلى السلة");
		} finally {
			setAddingToCart(null);
		}
	};

	const handleRemoveFromFavorites = async (productId: string) => {
		try {
			const result = await {
				success: true,
				data: { productId: "123" },
				error: "",
			};

			if (result.success) {
				setProducts(products.filter(p => p.id !== productId));
				alert("تم حذف المنتج من المفضلة");
			} else {
				alert(result.error || "حدث خطأ أثناء حذف المنتج من المفضلة");
			}
		} catch (error) {
			console.error("Error removing from favorites:", error);
			alert("حدث خطأ أثناء حذف المنتج من المفضلة");
		}
	};

	const handleRemoveStoreFromFavorites = async (storeId: string) => {
		try {
			const result = await {
				success: true,
				data: { storeId: "123" },
				error: "",
			};

			if (result.success) {
				setStores(stores.filter(s => s.id !== storeId));
				alert("تم حذف المتجر من المفضلة");
			} else {
				alert(result.error || "حدث خطأ أثناء حذف المتجر من المفضلة");
			}
		} catch (error) {
			console.error("Error removing store from favorites:", error);
			alert("حدث خطأ أثناء حذف المتجر من المفضلة");
		}
	};

	const handleStoreClick = (storeId: string) => {
		router.push(`/store?storeId=${storeId}`);
	};

	return (
		<div className="flex flex-col">
			<h2 className="mb-8 text-right text-2xl font-bold text-gray-800">
				المفضلة لديك
			</h2>

			{/* التبويبات */}
			<div className="mb-6 flex border-b border-gray-200">
				<button
					onClick={() => setActiveTab("products")}
					className={`px-4 py-2 font-semibold transition-colors ${
						activeTab === "products"
							? "border-b-2 border-green-500 text-green-600"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					المنتجات ({products.length})
				</button>
				<button
					onClick={() => setActiveTab("stores")}
					className={`px-4 py-2 font-semibold transition-colors ${
						activeTab === "stores"
							? "border-b-2 border-green-500 text-green-600"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					المتاجر ({stores.length})
				</button>
			</div>

			{/* محتوى التبويبات */}
			{activeTab === "products" ? (
				<div className="space-y-4">
					{products.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500 text-lg">لا توجد منتجات في المفضلة</p>
							<button
								onClick={() => router.push("/categories")}
								className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
							>
								تصفح المنتجات
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{products.map((product) => (
								<div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-48 object-cover"
									/>
									<div className="p-4">
										<h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
										{product.storeName && (
											<p className="text-sm text-gray-500 mb-2">من: {product.storeName}</p>
										)}
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center space-x-2 space-x-reverse">
												<span className="text-lg font-bold text-green-600">{product.price}</span>
												{product.originalPrice && (
													<span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
												)}
											</div>
											<span className="text-sm text-gray-500">{product.unit}</span>
										</div>
										<div className="flex space-x-2 space-x-reverse">
											<button
												onClick={() => handleAddToCart(product)}
												disabled={addingToCart === product.id}
												className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1 space-x-reverse"
											>
												<FaPlusCircle className="text-sm" />
												<span className="text-sm">
													{addingToCart === product.id ? "جاري الإضافة..." : "أضف للسلة"}
												</span>
											</button>
											<button
												onClick={() => handleRemoveFromFavorites(product.id)}
												className="bg-red-100 text-red-600 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors"
											>
												حذف
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			) : (
				<div className="space-y-4">
					{stores.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500 text-lg">لا توجد متاجر في المفضلة</p>
							<button
								onClick={() => router.push("/nearby-stores")}
								className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
							>
								تصفح المتاجر
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{stores.map((store) => (
								<div key={store.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
									<img
										src={store.image}
										alt={store.name}
										className="w-full h-48 object-cover"
									/>
									<div className="p-4">
										<h3 className="font-semibold text-gray-800 mb-2">{store.name}</h3>
										<p className="text-sm text-gray-500 mb-2">{store.type}</p>
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-1 space-x-reverse">
												<span className="text-yellow-500">★</span>
												<span className="text-sm text-gray-600">{store.rating}</span>
											</div>
											<div className="flex space-x-2 space-x-reverse">
												<button
													onClick={() => handleStoreClick(store.id)}
													className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
												>
													زيارة المتجر
												</button>
												<button
													onClick={() => handleRemoveStoreFromFavorites(store.id)}
													className="bg-red-100 text-red-600 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors text-sm"
												>
													حذف
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface SearchResult {
	id: string;
	name: string;
	type: "store" | "product";
	image: string | null;
	description?: string;
	rating?: number;
	price?: string;
	storeName?: string;
	hasProducts?: boolean;
	hasCategories?: boolean;
}

export default function SearchPage() {
	const searchParams = useSearchParams();
	const query = searchParams.get('q') || '';
	
	const [searchTerm, setSearchTerm] = useState(query);
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<'all' | 'stores' | 'products'>('all');

	// البحث عند تغيير الاستعلام
	useEffect(() => {
		if (query) {
			setSearchTerm(query);
			performSearch(query);
		}
	}, [query]);

	// البحث عند الضغط على Enter
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch(e);
		}
	};

	const performSearch = async (term: string) => {
		if (!term.trim()) {
			setResults([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const { searchAction } = await import("@/app/actions/search/search.action");
			const data = await searchAction(term);
			if (data.success && !data.error) {
				setResults(data.results || []);
			} else {
				setError(data.error || 'فشل في البحث');
			}
		} catch (error) {
			console.error('خطأ في البحث:', error);
			setError('خطأ في البحث');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			// تحديث URL مع الاستعلام الجديد
			const url = new URL(window.location.href);
			url.searchParams.set('q', searchTerm.trim());
			window.history.pushState({}, '', url.toString());
			performSearch(searchTerm.trim());
		}
	};

	const handleResultClick = (result: SearchResult) => {
		if (result.type === 'store') {
			// منع النقر على المتاجر التي لا تحتوي على منتجات
			if (!result.hasProducts) {
				return;
			}
			window.location.href = `/store?store=${encodeURIComponent(result.name)}&source=search`;
		} else if (result.type === 'product') {
			window.location.href = `/product-details?product=${encodeURIComponent(result.name)}&store=${encodeURIComponent(result.storeName || '')}`;
		}
	};

	// تصفية النتائج حسب التبويب النشط
	const filteredResults = results.filter(result => {
		if (activeTab === 'all') return true;
		if (activeTab === 'stores') return result.type === 'store';
		if (activeTab === 'products') return result.type === 'product';
		return true;
	});

	// إحصائيات النتائج
	const storesCount = results.filter(r => r.type === 'store').length;
	const productsCount = results.filter(r => r.type === 'product').length;

	return (
		<>
			{/* العنوان */}
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">البحث في شلة</h1>
				<p className="text-lg text-gray-600 max-w-2xl mx-auto">
					ابحث عن المتاجر والمطاعم والمنتجات التي تريدها
				</p>
			</div>

			{/* شريط البحث */}
			<div className="mb-8">
				<form onSubmit={handleSearch} className="max-w-2xl mx-auto">
					<div className="relative">
						<input
							type="text"
							placeholder="ابحث عن المتاجر أو المطاعم أو المنتجات..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyPress={handleKeyPress}
							className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-right text-lg"
						/>
						<button
							type="submit"
							className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</button>
					</div>
				</form>
			</div>

			{/* تبويبات النتائج */}
			{results.length > 0 && (
				<div className="mb-6">
					<div className="flex justify-center space-x-4 space-x-reverse">
						<button
							onClick={() => setActiveTab('all')}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								activeTab === 'all'
									? 'bg-green-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							الكل ({results.length})
						</button>
						<button
							onClick={() => setActiveTab('stores')}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								activeTab === 'stores'
									? 'bg-green-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							المتاجر ({storesCount})
						</button>
						<button
							onClick={() => setActiveTab('products')}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								activeTab === 'products'
									? 'bg-green-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							المنتجات ({productsCount})
						</button>
					</div>
				</div>
			)}

			{/* حالة التحميل */}
			{isLoading && (
				<div className="text-center py-12">
					<div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-[#ADF0D1] mx-auto mb-4"></div>
					<p className="text-gray-600">جاري البحث...</p>
				</div>
			)}

			{/* رسالة الخطأ */}
			{error && (
				<div className="text-center py-12">
					<div className="text-6xl mb-4">❌</div>
					<h3 className="text-xl font-semibold text-gray-700 mb-2">حدث خطأ</h3>
					<p className="text-gray-500">{error}</p>
				</div>
			)}

			{/* إحصائيات النتائج */}
			{!isLoading && !error && results.length > 0 && (
				<div className="mb-6 text-center">
					<p className="text-gray-600">
						تم العثور على <span className="font-semibold text-green-600">{filteredResults.length}</span> نتيجة
						{searchTerm && ` لـ "${searchTerm}"`}
					</p>
				</div>
			)}

			{/* النتائج */}
			{!isLoading && !error && (
				<>
					{filteredResults.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredResults.map((result) => (
								<div
									key={`${result.type}-${result.id}`}
									onClick={() => handleResultClick(result)}
									className={`bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 ${
										result.type === 'store' && !result.hasProducts
											? 'cursor-default opacity-75'
											: 'cursor-pointer transform hover:scale-105 hover:shadow-lg'
									}`}
								>
									{/* صورة النتيجة */}
									<div className="relative mb-4">
										<img
											src={result.image || "/supermarket.png"}
											alt={result.name}
											className="w-full h-32 object-cover rounded-lg"
										/>
										{/* شارة النوع */}
										<div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
											result.type === 'store' 
												? 'bg-blue-100 text-blue-800' 
												: 'bg-green-100 text-green-800'
										}`}>
											{result.type === 'store' ? 'متجر' : 'منتج'}
										</div>
									</div>

									{/* معلومات النتيجة */}
									<div>
										<h3 className="text-lg font-bold text-gray-900 mb-1">{result.name}</h3>
										{result.description && (
											<p className="text-sm text-gray-600 mb-2">{result.description}</p>
										)}
										
										{/* معلومات إضافية للمتاجر */}
										{result.type === 'store' && result.rating && (
											<div className="flex items-center mb-2">
												<div className="flex items-center">
													{[...Array(5)].map((_, i) => (
														<svg
															key={i}
															className={`w-4 h-4 ${
																i < Math.floor(result.rating || 0) 
																	? 'text-yellow-400' 
																	: 'text-gray-300'
															}`}
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
														</svg>
													))}
												</div>
												<span className="text-sm text-gray-600 mr-2">{result.rating}</span>
											</div>
										)}

										{/* رسالة "سيتم الإضافة قريباً" للمتاجر بدون منتجات */}
										{result.type === 'store' && !result.hasProducts && (
											<div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
												<p className="text-xs text-orange-700 text-center font-medium">
													سيتم الإضافة قريباً
												</p>
											</div>
										)}

										{/* معلومات إضافية للمنتجات */}
										{result.type === 'product' && (
											<div className="flex justify-between items-center">
												{result.price && (
													<span className="text-lg font-bold text-green-600">{result.price}</span>
												)}
												{result.storeName && (
													<span className="text-sm text-gray-500">من {result.storeName}</span>
												)}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					) : searchTerm ? (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">🔍</div>
							<h3 className="text-xl font-semibold text-gray-700 mb-2">لم نجد نتائج</h3>
							<p className="text-gray-500">جرب البحث بكلمات مختلفة أو تحقق من الإملاء</p>
						</div>
					) : (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">🔍</div>
							<h3 className="text-xl font-semibold text-gray-700 mb-2">ابدأ البحث</h3>
							<p className="text-gray-500">اكتب في مربع البحث أعلاه للعثور على المتاجر والمنتجات</p>
						</div>
					)}
				</>
			)}
		</>
	);
}

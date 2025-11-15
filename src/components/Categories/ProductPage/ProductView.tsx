"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, useState, useCallback } from "react";
import { Product } from "@/types/categories";
import { Store } from "@/components/Utils/StoreCard";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import Breadcrumbs from "../shared/Breadcrumbs";
import { navigateToProductFromContext } from "@/lib/utils/categories/navigation";

interface ProductViewProps {
  product: Product;
  relatedProducts: Product[];
  store?: Store | null;
}

function ProductView({
  product,
  relatedProducts,
  store,
}: ProductViewProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const categorySlug = useMemo(() => {
    if (params?.category) {
      return Array.isArray(params.category) ? params.category[0] : params.category;
    }
    return "";
  }, [params?.category]);

  const storeSlug = useMemo(() => {
    if (params?.store) {
      return Array.isArray(params.store) ? params.store[0] : params.store;
    }
    return "";
  }, [params?.store]);

  const departmentSlug = useMemo(() => {
    if (params?.department) {
      return Array.isArray(params.department)
        ? params.department[0]
        : params.department;
    }
    return "";
  }, [params?.department]);

  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/" },
      {
        label: isArabic ? "الأقسام" : "Categories",
        href: "/categories",
      },
      {
        label: categorySlug || "",
        href: categorySlug ? `/categories/${categorySlug}` : undefined,
      },
      {
        label: storeSlug || "",
        href:
          categorySlug && storeSlug
            ? `/categories/${categorySlug}/${storeSlug}`
            : undefined,
      },
      {
        label: departmentSlug || "",
        href:
          categorySlug && storeSlug && departmentSlug
            ? `/categories/${categorySlug}/${storeSlug}/${departmentSlug}`
            : undefined,
      },
      {
        label:
          isArabic && product.nameAr ? product.nameAr : product.name,
      },
    ],
    [categorySlug, storeSlug, departmentSlug, product, isArabic]
  );

  const handleAddToCart = useCallback(async () => {
    if (!product.storeId && !store?.id) {
      return;
    }

    const storeId = product.storeId || store?.id;
    if (!storeId) return;

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product.id,
        storeId: storeId,
        quantity,
        productName: product.name,
        productNameAr: product.nameAr,
        productImage: product.image,
        priceAtAdd: typeof product.price === "number" ? product.price : 0,
        storeName: store?.name || "",
        storeNameAr: store?.nameAr,
        storeLogo: store?.logo || undefined,
        stock: product.stockQuantity,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, store, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart().then(() => {
      router.push("/cart");
    });
  }, [handleAddToCart, router]);

  const handleRelatedProductClick = useCallback(
    (productId: string) => {
      const relatedProduct = relatedProducts.find((p) => p.id === productId);
      if (relatedProduct) {
        navigateToProductFromContext(
          router,
          relatedProduct,
          categorySlug,
          storeSlug,
          departmentSlug
        );
      }
    },
    [relatedProducts, categorySlug, storeSlug, departmentSlug, router]
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isArabic ? "المنتج غير موجود" : "Product not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Gallery */}
          <ProductGallery product={product} storeId={store?.id} />

          {/* Product Info */}
          <ProductInfo
            product={product}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts
            products={relatedProducts}
            categorySlug={categorySlug}
            storeSlug={storeSlug}
            departmentSlug={departmentSlug}
            onProductClick={handleRelatedProductClick}
          />
        )}
      </div>
    </div>
  );
}

export default ProductView;


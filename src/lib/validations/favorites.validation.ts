import { z } from "zod";

/**
 * Add Product to Favorites Validation Schema
 */
export const addProductToFavoritesSchema = z.object({
	productId: z.string().min(1, "معرف المنتج مطلوب"),
});

export type AddProductToFavoritesInput = z.infer<typeof addProductToFavoritesSchema>;

/**
 * Remove Product from Favorites Validation Schema
 */
export const removeProductFromFavoritesSchema = z.object({
	productId: z.string().min(1, "معرف المنتج مطلوب"),
});

export type RemoveProductFromFavoritesInput = z.infer<typeof removeProductFromFavoritesSchema>;

/**
 * Add Store to Favorites Validation Schema
 */
export const addStoreToFavoritesSchema = z.object({
	storeId: z.string().min(1, "معرف المتجر مطلوب"),
});

export type AddStoreToFavoritesInput = z.infer<typeof addStoreToFavoritesSchema>;

/**
 * Remove Store from Favorites Validation Schema
 */
export const removeStoreFromFavoritesSchema = z.object({
	storeId: z.string().min(1, "معرف المتجر مطلوب"),
});

export type RemoveStoreFromFavoritesInput = z.infer<typeof removeStoreFromFavoritesSchema>;

/**
 * Check Favorite Status Validation Schema
 */
export const checkFavoriteStatusSchema = z.object({
	id: z.string().min(1, "المعرف مطلوب"),
	type: z.enum(["product", "store"]).refine(
		(val) => val === "product" || val === "store",
		{ message: "النوع يجب أن يكون product أو store" }
	),
});

export type CheckFavoriteStatusInput = z.infer<typeof checkFavoriteStatusSchema>;


import { z } from "zod";

/**
 * Add to Cart Validation Schema
 */
export const addToCartSchema = z.object({
	productId: z.string().min(1, "معرف المنتج مطلوب"),
	storeId: z.string().min(1, "معرف المتجر مطلوب"),
	quantity: z.number().int().positive().default(1),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

/**
 * Update Cart Item Validation Schema
 */
export const updateCartItemSchema = z.object({
	itemId: z.string().min(1, "معرف العنصر مطلوب"),
	quantity: z.number().int().positive().min(1, "الكمية يجب أن تكون أكبر من صفر"),
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

/**
 * Remove Cart Item Validation Schema
 */
export const removeCartItemSchema = z.object({
	itemId: z.string().min(1, "معرف العنصر مطلوب"),
});

export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;


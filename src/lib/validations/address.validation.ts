import { z } from "zod";

/**
 * Add Address Validation Schema
 */
export const addAddressSchema = z.object({
	address: z.string().min(1, "العنوان مطلوب"),
});

export type AddAddressInput = z.infer<typeof addAddressSchema>;

/**
 * Update Address Validation Schema
 */
export const updateAddressSchema = z.object({
	addressId: z.string().min(1, "معرف العنوان مطلوب"),
	address: z.string().min(1, "العنوان مطلوب"),
});

export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

/**
 * Delete Address Validation Schema
 */
export const deleteAddressSchema = z.object({
	addressId: z.string().min(1, "معرف العنوان مطلوب"),
});

export type DeleteAddressInput = z.infer<typeof deleteAddressSchema>;


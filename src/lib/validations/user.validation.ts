import { z } from "zod";

/**
 * Check Email Validation Schema
 */
export const checkEmailSchema = z.object({
	email: z.string().email("البريد الإلكتروني غير صحيح"),
});

export type CheckEmailInput = z.infer<typeof checkEmailSchema>;


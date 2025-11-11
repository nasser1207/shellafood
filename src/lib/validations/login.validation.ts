import { z } from "zod";

/**
 * Login Form Validation Schema
 * Validates user login credentials
 */
export const loginSchema = z.object({
	email: z.string()
		.email("البريد الإلكتروني غير صحيح"),
	
	password: z.string()
		.min(1, "كلمة المرور مطلوبة"),
});

export type LoginInput = z.infer<typeof loginSchema>;


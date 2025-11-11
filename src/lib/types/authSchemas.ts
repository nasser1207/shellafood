import { z } from "zod";
import { BaseZodError } from "./errorUtilities";

export const loginFormSchema = z.object({
	email: z.string().min(8),
	password: z.string().min(8).max(32),
});

export const registerFormSchema = z.object({
	fullName: z.string()
		.min(3, "الاسم الكامل يجب أن يكون 3 أحرف على الأقل")
		.max(100, "الاسم الكامل يجب أن يكون أقل من 100 حرف")
		.regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),
	phoneNumber: z.string().regex(/^(05|5)\d{9}$/, "رقم الهاتف يجب أن يبدأ بـ 05 أو 5 ويحتوي على 9 أرقام بعدها"),
	birthDate: z.date()
		.refine((date) => date !== null && date !== undefined, {
			message: "تاريخ الميلاد مطلوب",
		})
		.refine((date) => {
			const today = new Date();
			const age = today.getFullYear() - date.getFullYear();
			return age >= 13 && age <= 100;
		}, {
			message: "العمر يجب أن يكون بين 13-100 سنة",
		}),
	email: z.string().email("البريد الإلكتروني غير صحيح"),
	password: z.string()
		.min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
		.max(32, "كلمة المرور يجب أن تكون أقل من 32 حرف")
		.regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, "كلمة المرور يجب أن تحتوي على أحرف وأرقام"),
	confirmPassword: z.string(),
	address: z.object({
		formattedAddress: z.string().min(1, "العنوان مطلوب"),
		lat: z.number().refine((lat) => lat !== 0, { message: "يجب تحديد الموقع على الخريطة" }),
		lng: z.number().refine((lng) => lng !== 0, { message: "يجب تحديد الموقع على الخريطة" }),
	}),
}).refine((data) => data.password === data.confirmPassword, {
	message: "كلمة المرور غير متطابقة",
	path: ["confirmPassword"],
});

export type LoginFormError = BaseZodError<typeof loginFormSchema>;
export type RegisterFormError = BaseZodError<typeof registerFormSchema>;

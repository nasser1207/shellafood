import { z } from "zod";

export const workerFormSchema = z.object({
	firstName: z.string()
		.min(2, "الاسم الأول يجب أن يكون حرفين على الأقل")
		.max(50, "الاسم الأول يجب أن يكون أقل من 50 حرف")
		.regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "الاسم الأول يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),
	
	lastName: z.string()
		.min(2, "الاسم الأخير يجب أن يكون حرفين على الأقل")
		.max(50, "الاسم الأخير يجب أن يكون أقل من 50 حرف")
		.regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "الاسم الأخير يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),
	
	deliveryType: z.string()
		.min(1, "نوع التوصيل مطلوب"),
	
	vehicleType: z.string()
		.min(1, "نوع المركبة مطلوب"),
	
	idType: z.string()
		.min(1, "نوع الهوية مطلوب"),
	
	personalIdNumber: z.string()
		.regex(/^\d{10}$/, "الهوية الوطنية يجب أن تحتوي على 10 أرقام بالضبط"),
	
	email: z.string()
		.min(1, "البريد الإلكتروني مطلوب")
		.email("البريد الإلكتروني غير صحيح"),
	
	region: z.string()
		.min(2, "المنطقة يجب أن تكون حرفين على الأقل")
		.max(50, "المنطقة يجب أن تكون أقل من 50 حرف"),
	
	idImage: z.string()
		.min(1, "صورة الهوية مطلوبة"),
	
	Picture: z.string()
		.min(1, "الصورة الشخصية مطلوبة"),
	
	agreed: z.boolean()
		.refine((value) => value === true, {
			message: "يجب الموافقة على الشروط والأحكام",
		}),
});

export type WorkerUserInput = z.infer<typeof workerFormSchema>;

// Legacy type alias for backward compatibility
export type WorkerFormData = WorkerUserInput;


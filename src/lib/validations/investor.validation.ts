import { z } from "zod";

export const investorUserSchema = z.object({
  first_name: z.string()
    .min(2, "الاسم الأول يجب أن يكون حرفين على الأقل")
    .max(30, "الاسم الأول يجب أن يكون أقل من 30 حرف")
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "الاسم الأول يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),
  
  father_name: z.string()
    .min(2, "اسم الأب يجب أن يكون حرفين على الأقل")
    .max(30, "اسم الأب يجب أن يكون أقل من 30 حرف")
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "اسم الأب يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),
  
  family_name: z.string()
    .min(2, "اسم العائلة يجب أن يكون حرفين على الأقل")
    .max(30, "اسم العائلة يجب أن يكون أقل من 30 حرف")
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "اسم العائلة يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),
  
  grandfather_name: z.string()
    .min(2, "اسم الجد يجب أن يكون حرفين على الأقل")
    .max(30, "اسم الجد يجب أن يكون أقل من 30 حرف")
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "اسم الجد يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),
  
  birth_date: z.string()
    .min(1, "تاريخ الميلاد مطلوب")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 80;
    }, {
      message: "العمر يجب أن يكون بين 18-80 سنة",
    }),
  
  national_id: z.string()
    .regex(/^\d{10}$/, "الهوية الوطنية يجب أن تحتوي على 10 أرقام بالضبط"),
  
  email: z.string()
    .email("البريد الإلكتروني غير صحيح"),
  
  phone: z.string()
    .min(1, "رقم الهاتف مطلوب"),
  
  national_address_email: z.string()
    .email("البريد الإلكتروني الوطني غير صحيح"),
  
  region: z.string()
    .min(2, "المنطقة يجب أن تكون حرفين على الأقل")
    .max(50, "المنطقة يجب أن تكون أقل من 50 حرف"),
  
  iban: z.string()
    .min(1, "رقم الآيبان مطلوب"),
  
  bank_name: z.string()
    .min(2, "اسم البنك يجب أن يكون حرفين على الأقل")
    .max(100, "اسم البنك يجب أن يكون أقل من 100 حرف"),
  
  amount: z.string()
    .refine((value) => {
      const amount = parseFloat(value);
      return !isNaN(amount) && amount >= 1000 && amount <= 10000000;
    }, {
      message: "المبلغ يجب أن يكون بين 1,000 - 10,000,000 ريال",
    }),
  
  agreed: z.boolean()
    .refine((value) => value === true, {
      message: "يجب الموافقة على الشروط والأحكام",
    }),
});

export type InvestorUserInput = z.infer<typeof investorUserSchema>;

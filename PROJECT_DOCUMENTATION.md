# مشروع شلة - Documentation شامل

## 📋 نظرة عامة على المشروع

**مشروع شلة** هو تطبيق ويب شامل مبني بتقنية Next.js 14 يوفر منصة متعددة الخدمات للتوصيل والشراكات التجارية. يدعم المشروع اللغتين العربية والإنجليزية مع نظام توثيق متقدم عبر **نفاذ**.

### 🎯 الهدف الرئيسي
إنشاء منصة رقمية متكاملة تربط بين:
- المستثمرين والفرص الاستثمارية
- الشركاء التجاريين والمتاجر
- السائقين وخدمات التوصيل
- العمال وفرص العمل
- العملاء وخدمة التمويل "قيدها"

---

## 🛠 التقنيات المستخدمة

### Frontend Technologies
- **Next.js 14.2.32** - React Framework مع App Router
- **TypeScript** - للكتابة الآمنة والموثوقة
- **Tailwind CSS 4** - للتصميم المتجاوب والحديث
- **React 18.3.1** - مكتبة واجهة المستخدم
- **Framer Motion 12.23.12** - للرسوم المتحركة والتفاعلات

### UI Components & Libraries
- **@radix-ui/react-*** - مكونات UI متاحة ومتقدمة
- **Lucide React** - مكتبة الأيقونات الحديثة
- **React Hook Form** - إدارة النماذج والتحقق
- **React Phone Input 2** - إدخال أرقام الهواتف الدولية

### Backend & Database
- **Drizzle ORM** - للتعامل مع قاعدة البيانات
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **Lucia Auth** - نظام المصادقة والجلسات
- **UploadThing** - خدمة رفع الملفات

### Maps & Location
- **@react-google-maps/api** - خرائط جوجل التفاعلية
- **Geolocation API** - تحديد الموقع الجغرافي

### PDF & Documents
- **React PDF** - عرض وإنشاء ملفات PDF
- **@react-pdf-viewer/** - عارض PDF متقدم

---

## 🏗 هيكل المشروع

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # التخطيط الرئيسي مع Providers
│   ├── page.tsx                 # الصفحة الرئيسية
│   ├── globals.css              # الأنماط العامة
│   │
│   ├── api/                     # API Routes
│   │   ├── proxy/              # Proxy APIs للخدمات الخارجية
│   │   │   ├── nafath/         # نظام نفاذ للتوثيق
│   │   │   │   ├── initiate/   # بدء عملية التوثيق
│   │   │   │   └── checkStatus/ # التحقق من حالة التوثيق
│   │   │   └── contract-pdf/    # إنشاء عقود PDF
│   │   └── uploadthing/        # خدمة رفع الملفات
│   │
│   └── [pages]/                # صفحات التطبيق
│       ├── invstore/           # صفحة المستثمرين
│       ├── partner/            # صفحة الشركاء
│       ├── driver/             # صفحة السائقين
│       ├── worker/             # صفحة العمال
│       └── [other-pages]/      # باقي الصفحات
│
├── components/                  # React Components
│   ├── LandingPage/            # مكونات صفحة الهبوط
│   │   ├── landingpage.tsx     # الصفحة الرئيسية
│   │   ├── InvestoreRegister.tsx # نموذج المستثمر (مع نفاذ)
│   │   ├── partnerregister.tsx  # نموذج الشريك
│   │   ├── driverregister.tsx   # نموذج السائق
│   │   ├── WorkerRegister.tsx   # نموذج العامل
│   │   └── KaidhaRegister.tsx   # نموذج قيدها
│   │
│   ├── HomePage/               # مكونات الصفحة الرئيسية
│   ├── Profile/                # مكونات الملف الشخصي
│   ├── Condetion/             # صفحات الشروط والأحكام
│   ├── ui/                    # مكونات UI أساسية
│   ├── navbar.tsx             # شريط التنقل
│   └── shellafooter.tsx       # التذييل
│
├── contexts/                   # React Contexts
│   └── LanguageContext.tsx    # إدارة اللغة والترجمة
│
├── lib/                       # المكتبات والأدوات
│   ├── auth.ts               # نظام المصادقة
│   ├── db.ts                 # اتصال قاعدة البيانات
│   ├── schema.ts             # مخطط قاعدة البيانات
│   ├── utils.ts              # أدوات مساعدة
│   └── types/                # أنواع TypeScript
│
└── hooks/                     # Custom React Hooks
```

---

## 🔐 نظام التوثيق عبر نفاذ

### نظرة عامة
تم تطوير نظام توثيق متقدم باستخدام خدمة **نفاذ** السعودية للتحقق من الهوية الرقمية.

### مكونات النظام

#### 1. API Endpoints

**أ) `/api/proxy/nafath/initiate`**
```typescript
// بدء عملية التوثيق
POST /api/proxy/nafath/initiate
Content-Type: application/json

// Request Body
{
  "national_id": "1234567890"
}

// Response
{
  "status": "sent",
  "request_id": "uuid-string",
  "external_response": [
    {
      "nationalId": "1234567890",
      "random": "91",
      "transId": "transaction-id",
      "error": "Success"
    }
  ]
}
```

**ب) `/api/proxy/nafath/checkStatus`**
```typescript
// التحقق من حالة التوثيق
POST /api/proxy/nafath/checkStatus
Content-Type: application/json

// Request Body
{
  "request_id": "uuid-string"
}

// Response - موافقة
{
  "status": "approved",
  "national_id": "1234567890",
  "request_id": "uuid-string",
  "full_name_ar": "اسم المستخدم",
  "signed_file_url": "https://example.com/signed-contract.pdf"
}

// Response - رفض
{
  "status": "rejected",
  "request_id": "uuid-string"
}

// Response - انتظار
{
  "status": "pending",
  "request_id": "uuid-string"
}
```

#### 2. تدفق العمل (Workflow)

```mermaid
graph TD
    A[المستخدم يضغط "التوثيق عبر نفاذ"] --> B[فحص الحالة المسبقة]
    B --> C{هل موثق مسبقاً؟}
    C -->|نعم| D[عرض "العقد موثق مسبقاً"]
    C -->|لا| E[استدعاء initiate API]
    E --> F[عرض الرقم العشوائي]
    F --> G[بدء Polling التلقائي]
    G --> H[المستخدم يضغط الرقم في تطبيق نفاذ]
    H --> I[checkStatus كل 3 ثوان]
    I --> J{حالة التوثيق؟}
    J -->|approved| K[عرض العقد الموثق]
    J -->|rejected| L[عرض رسالة الرفض]
    J -->|pending| I
```

#### 3. الكود التطبيقي

**مثال من InvestoreRegister.tsx:**
```typescript
const handleNafathInitiate = async () => {
  try {
    setIsNafathLoading(true);

    // 1. فحص الحالة المسبقة
    const statusResponse = await fetch("/api/proxy/nafath/checkStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ national_id: formData.national_id }),
    });

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      
      if (statusData.status === "approved") {
        // العقد موثق مسبقاً
        setNotification({
          message: "العقد موثق عبر نفاذ مسبقاً",
          type: "success",
          isVisible: true,
        });
        return;
      }
    }

    // 2. بدء عملية التوثيق
    const response = await fetch("/api/proxy/nafath/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ national_id: formData.national_id }),
    });

    const data = await response.json();

    if (data.status === "sent" && data.external_response?.[0]) {
      const random = data.external_response[0].random;
      setNafathRequestId(data.request_id);
      setNafathRandom(random);

      // عرض الرقم العشوائي
      setShowNafathNumber(true);
      
      // بدء الفحص التلقائي
      startAutoPolling(data.request_id);
    }
  } catch (error) {
    // معالجة الأخطاء
  } finally {
    setIsNafathLoading(false);
  }
};
```

---

## 🌐 نظام الترجمة المتعدد اللغات

### الميزات الأساسية
- **دعم اللغتين**: العربية والإنجليزية
- **تبديل فوري**: تحديث الواجهة بدون إعادة تحميل
- **حفظ الاختيار**: في localStorage للجلسات القادمة
- **تحديث HTML**: dir, lang, title تلقائياً
- **واجهة مستخدم**: قائمة منسدلة مع أعلام الدول

### التطبيق التقني

#### 1. LanguageContext
```typescript
// src/contexts/LanguageContext.tsx
export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoaded: boolean;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [isLoaded, setIsLoaded] = useState(false);

  // تحميل اللغة من localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && ['ar', 'en'].includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
      setIsLoaded(true);
    }
  }, []);

  // حفظ اللغة وتحديث HTML
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      document.title = language === 'ar' ? 'شلة' : 'Shellaksa';
    }
  }, [language, isLoaded]);
};
```

#### 2. نظام الترجمات
```typescript
const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.investor': 'المستثمر',
    'nav.partner': 'الشريك',
    'nav.driver': 'السائق',
    
    // Forms
    'form.firstName': 'الاسم الأول',
    'form.submit': 'إرسال',
    'form.nafathAuth': 'التوثيق عبر نفاذ',
    
    // Messages
    'form.nafathSuccess': 'تم التوثيق بنجاح',
    'form.nafathError': 'خطأ في عملية التوثيق',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.investor': 'Investor',
    'nav.partner': 'Partner',
    'nav.driver': 'Driver',
    
    // Forms
    'form.firstName': 'First Name',
    'form.submit': 'Submit',
    'form.nafathAuth': 'Nafath Authentication',
    
    // Messages
    'form.nafathSuccess': 'Authentication Successful',
    'form.nafathError': 'Authentication Error',
  }
};
```

#### 3. استخدام الترجمة في المكونات
```typescript
// في أي مكون
const { t, language } = useLanguage();

return (
  <div>
    <h1>{t('nav.home')}</h1>
    <button>{t('form.submit')}</button>
  </div>
);
```

---

## 📝 النماذج والتحقق من البيانات

### نموذج المستثمر (InvestoreRegister)

#### الحقول الأساسية
```typescript
interface InvestoreFormData {
  // البيانات الشخصية
  first_name: string;
  father_name: string;
  family_name: string;
  grandfather_name: string;
  birth_date: string;
  national_id: string;
  
  // معلومات الاتصال
  email: string;
  phone: string;
  national_address_email: string;
  region: string;
  
  // البيانات المصرفية
  iban: string;
  bank_name: string;
  amount: string;
  
  // الموافقة
  agreed: boolean;
}
```

#### التحقق من صحة البيانات
```typescript
const validateForm = () => {
  const requiredFields = [
    "first_name", "father_name", "family_name", 
    "grandfather_name", "birth_date", "national_id",
    "email", "phone", "national_address_email", 
    "region", "iban", "bank_name", "amount"
  ];

  for (const field of requiredFields) {
    if (!formData[field] || formData[field].trim() === "") {
      return {
        isValid: false,
        message: t('form.fillAllFields'),
      };
    }
  }

  if (!formData.agreed) {
    return {
      isValid: false,
      message: t('form.agreeToTerms'),
    };
  }

  return { isValid: true, message: "" };
};
```

#### إنشاء العقد
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const validation = validateForm();
  
  if (!validation.isValid) {
    setNotification({
      message: validation.message,
      type: "error",
      isVisible: true,
    });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch("/api/proxy/contract-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("فشل إنشاء ملف PDF");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
    setIsOpen(true);
    setIsContractGenerated(true);
  } catch (error) {
    setNotification({
      message: error.message || t('form.contractError'),
      type: "error",
      isVisible: true,
    });
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📱 مكونات واجهة المستخدم

### مكون الإشعارات (Notification)
```typescript
const Notification = ({
  message,
  type,
  isVisible,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-opacity-50 absolute inset-0 bg-black" onClick={onClose} />
      <div className={`relative mx-4 w-full max-w-sm rounded-lg p-4 shadow-lg transition-all duration-300 ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* أيقونة حسب النوع */}
            <span className="text-sm font-medium sm:text-base">{message}</span>
          </div>
          <button onClick={onClose} className="ml-4 flex-shrink-0 text-white hover:text-gray-200">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
```

### مكون إدخال الهاتف
```typescript
<PhoneInput
  country={"sa"}
  value={formData.phone}
  onChange={(phone) => setFormData({ ...formData, phone: phone })}
  inputStyle={{
    width: "100%",
    direction: "ltr",
    textAlign: "left",
    paddingRight: "52px",
  }}
  buttonStyle={{ height: "100%", width: "6%", direction: "ltr" }}
  containerStyle={{ direction: "rtl" }}
  inputProps={{
    name: "phone",
    required: true,
    className: "rounded-lg border border-gray-300 p-3 text-right focus:ring-green-500 focus:outline-none",
  }}
/>
```

### واجهة عرض الرقم العشوائي (نفاذ)
```typescript
{showNafathNumber && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="relative w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg text-center">
      <h3 className="text-lg font-bold mb-4 text-gray-800">التوثيق عبر نفاذ</h3>
      <p className="mb-4 text-gray-600">الرقم العشوائي:</p>
      <div className="text-3xl font-bold text-green-600 mb-6 p-4 bg-gray-100 rounded-lg">
        {nafathRandom}
      </div>
      <p className="text-sm text-gray-600 mb-4">
        اضغط على هذا الرقم في تطبيق نفاذ على هاتفك المحمول
      </p>
      
      <div className="flex items-center justify-center mb-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
        <span className="text-sm text-gray-600">جاري انتظار التوثيق...</span>
      </div>
      
      <button
        onClick={() => {
          if (pollingInterval) clearInterval(pollingInterval);
          setPollingInterval(null);
          setShowNafathNumber(false);
        }}
        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
      >
        إلغاء
      </button>
    </div>
  </div>
)}
```

---

## 🔧 APIs ونقاط النهاية

### 1. نظام نفاذ

#### `/api/proxy/nafath/initiate`
- **الغرض**: بدء عملية التوثيق عبر نفاذ
- **الطريقة**: POST
- **المدخلات**: `{ national_id: string }`
- **المخرجات**: `{ status, request_id, external_response }`

#### `/api/proxy/nafath/checkStatus`
- **الغرض**: التحقق من حالة التوثيق
- **الطريقة**: POST
- **المدخلات**: `{ request_id: string }`
- **المخرجات**: `{ status, national_id, full_name_ar, signed_file_url }`

### 2. إنشاء العقود

#### `/api/proxy/contract-pdf`
- **الغرض**: إنشاء عقد PDF من بيانات النموذج
- **الطريقة**: POST
- **المدخلات**: `InvestoreFormData`
- **المخرجات**: ملف PDF

### 3. رفع الملفات

#### `/api/uploadthing`
- **الغرض**: رفع الصور والملفات
- **الطريقة**: GET, POST
- **المدخلات**: ملفات (حد أقصى 4MB)
- **المخرجات**: `{ url: string }`

---

## 🎨 التصميم والأنماط

### نظام الألوان
```css
:root {
  /* الألوان الأساسية */
  --primary-green: #31A342;
  --primary-green-hover: #288435;
  --success-green: #10B981;
  --error-red: #EF4444;
  
  /* الألوان الرمادية */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-300: #D1D5DB;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
}
```

### أنماط النماذج
```css
/* حقول الإدخال */
.form-input {
  @apply w-full rounded-md border border-gray-300 p-2.5 shadow-sm 
         focus:border-green-500 focus:ring-green-500;
}

/* الأزرار الأساسية */
.btn-primary {
  @apply rounded-lg bg-[#31A342] px-8 py-3 font-semibold text-white 
         shadow-sm transition-colors duration-300 hover:bg-[#288435] 
         focus:outline-none;
}

/* الأزرار الثانوية */
.btn-secondary {
  @apply rounded-lg bg-white px-8 py-3 font-semibold text-[#31A342] 
         shadow-sm transition-colors duration-300 hover:bg-gray-50 
         focus:outline-none border-2 border-[#31A342];
}
```

### التصميم المتجاوب
```css
/* الشبكة المتجاوبة */
.form-grid {
  @apply grid grid-cols-1 gap-6 md:grid-cols-2;
}

/* النماذج المتجاوبة */
.form-container {
  @apply mx-auto w-full max-w-4xl space-y-6 p-4 md:p-8;
}

/* الأزرار المتجاوبة */
.btn-responsive {
  @apply w-full sm:w-auto;
}
```

---

## 📊 إدارة الحالة

### React Context للغة
```typescript
// استخدام Context في المكونات
const { language, setLanguage, t, isLoaded } = useLanguage();

// التحقق من تحميل البيانات
if (!isLoaded) {
  return <div>Loading...</div>;
}
```

### حالة النماذج
```typescript
// حالة النموذج الأساسية
const [formData, setFormData] = useState<FormData>({
  // القيم الافتراضية
});

// حالة التحميل والأخطاء
const [isLoading, setIsLoading] = useState(false);
const [notification, setNotification] = useState({
  message: "",
  type: "success" as "success" | "error",
  isVisible: false,
});
```

### حالة نفاذ
```typescript
// حالة التوثيق
const [isNafathLoading, setIsNafathLoading] = useState(false);
const [nafathRequestId, setNafathRequestId] = useState<string | null>(null);
const [nafathRandom, setNafathRandom] = useState<string | null>(null);
const [showNafathNumber, setShowNafathNumber] = useState(false);

// الـ Polling التلقائي
const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
```

---

## 🧪 الاختبار والجودة

### اختبار نظام نفاذ
```typescript
// اختبار سيناريوهات مختلفة
describe('Nafath Authentication', () => {
  test('should initiate nafath process', async () => {
    // اختبار بدء العملية
  });
  
  test('should handle approved status', async () => {
    // اختبار حالة الموافقة
  });
  
  test('should handle rejected status', async () => {
    // اختبار حالة الرفض
  });
});
```

### اختبار الترجمة
```typescript
describe('Language System', () => {
  test('should switch between Arabic and English', () => {
    // اختبار تبديل اللغة
  });
  
  test('should persist language choice', () => {
    // اختبار حفظ اختيار اللغة
  });
});
```

### معايير الجودة
- **TypeScript**: فحص الأنواع
- **ESLint**: فحص جودة الكود
- **Prettier**: تنسيق الكود
- **Responsive Design**: اختبار على أجهزة مختلفة

---

## 🚀 التطوير والنشر

### متطلبات التطوير
```json
{
  "node": ">=18.0.0",
  "npm": ">=8.0.0",
  "typescript": "^5.0.0"
}
```

### أوامر التطوير
```bash
# تثبيت المتطلبات
npm install

# تشغيل الخادم المحلي
npm run dev

# بناء المشروع
npm run build

# تشغيل الإنتاج
npm start

# فحص الكود
npm run lint
```

### متغيرات البيئة
```env
# قاعدة البيانات
DATABASE_URL="postgresql://..."

# خدمة رفع الملفات
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."

# خرائط جوجل
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."

# نفاذ (إذا لزم الأمر)
NAFATH_API_URL="https://shellafood.com/api/v1"
```

---

## 🔒 الأمان والخصوصية

### حماية البيانات
- **تشفير البيانات الحساسة** أثناء النقل والتخزين
- **التحقق من صحة المدخلات** في الخادم والعميل
- **حماية من CSRF** باستخدام Next.js tokens
- **تنظيف البيانات** قبل التخزين

### نظام نفاذ
- **توثيق ثنائي العامل** عبر تطبيق نفاذ
- **تشفير end-to-end** للتوثيق
- **انتهاء صلاحية الجلسات** تلقائياً
- **سجل عمليات التوثيق** للمراجعة

### خصوصية المستخدمين
- **حماية البيانات الشخصية** حسب القوانين السعودية
- **حق المستخدم في الحذف** والتعديل
- **شفافية استخدام البيانات**
- **موافقة صريحة** على جمع البيانات

---

## 📈 الأداء والتحسين

### تحسينات Next.js
- **Server-Side Rendering (SSR)** للصفحات الرئيسية
- **Static Generation** للمحتوى الثابت
- **Image Optimization** تلقائياً
- **Code Splitting** للمكونات الكبيرة

### تحسينات قاعدة البيانات
- **فهرسة الجداول** للاستعلامات السريعة
- **Connection Pooling** لإدارة الاتصالات
- **Caching** للبيانات المتكررة
- **Query Optimization** باستخدام Drizzle ORM

### تحسينات الواجهة
- **Lazy Loading** للمكونات الثقيلة
- **Debouncing** لعمليات البحث
- **Memoization** للحسابات المعقدة
- **Virtual Scrolling** للقوائم الطويلة

---

## 🛠 استكشاف الأخطاء وإصلاحها

### مشاكل شائعة

#### 1. مشاكل نفاذ
```typescript
// مشكلة: الـ polling لا يتوقف
// الحل: تنظيف intervals في useEffect
useEffect(() => {
  return () => {
    if (pollingInterval) clearInterval(pollingInterval);
  };
}, [pollingInterval]);

// مشكلة: request_id غير صحيح
// الحل: التحقق من وجود البيانات قبل الاستخدام
if (data.status === "sent" && data.external_response?.[0]) {
  const requestId = data.request_id;
  // استخدام requestId
}
```

#### 2. مشاكل الترجمة
```typescript
// مشكلة: الترجمة لا تظهر
// الحل: التحقق من تحميل البيانات
const { t, isLoaded } = useLanguage();

if (!isLoaded) {
  return <div>Loading...</div>;
}

// مشكلة: اتجاه النص خاطئ
// الحل: التحقق من dir attribute
useEffect(() => {
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
}, [language]);
```

#### 3. مشاكل النماذج
```typescript
// مشكلة: البيانات لا تُحفظ
// الحل: التحقق من state updates
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

### سجلات الأخطاء
```typescript
// تسجيل الأخطاء للمراقبة
try {
  // العملية
} catch (error) {
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userId: user?.id,
    action: 'nafath-authentication'
  });
}
```

---

## 📚 مراجع ومصادر

### وثائق التقنيات
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team)

### خدمات خارجية
- [نفاذ - الهوية الرقمية](https://nafath.sa)
- [UploadThing](https://uploadthing.com)
- [Google Maps API](https://developers.google.com/maps)

### أدوات التطوير
- [React Hook Form](https://react-hook-form.com)
- [Radix UI](https://www.radix-ui.com)
- [Lucide Icons](https://lucide.dev)
- [Framer Motion](https://www.framer.com/motion)

---

## 🤝 المساهمة والتطوير

### إرشادات المساهمة
1. **Fork** المشروع
2. **إنشاء branch** للميزة الجديدة
3. **اتباع معايير الكود** المحددة
4. **إضافة اختبارات** للميزات الجديدة
5. **تحديث الوثائق** عند الحاجة
6. **إنشاء Pull Request** مع وصف مفصل

### معايير الكود
```typescript
// تسمية المتغيرات
const userName = 'john_doe';          // camelCase
const USER_ROLE = 'admin';            // UPPER_CASE للثوابت
const ApiEndpoint = '/api/users';     // PascalCase للأنواع

// تسمية الدوال
const handleSubmit = () => {};        // handle + Action
const validateForm = () => {};        // verb + Noun
const getUserData = async () => {};   // async للدوال غير المتزامنة

// تسمية المكونات
const UserProfile = () => {};         // PascalCase
const NavbarComponent = () => {};     // Component suffix
```

### إضافة ميزات جديدة
1. **تحليل المتطلبات** بدقة
2. **تصميم واجهة المستخدم** أولاً
3. **كتابة الاختبارات** قبل الكود
4. **تطوير المكونات** بشكل تدريجي
5. **اختبار شامل** على أجهزة مختلفة
6. **مراجعة الكود** من فريق آخر

---

## 📞 الدعم والتواصل

### للمطورين
- **GitHub Issues**: لتقارير الأخطاء والاقتراحات
- **GitHub Discussions**: للنقاشات والأسئلة
- **Pull Requests**: للمساهمات

### للمستخدمين
- **دليل المستخدم**: في الموقع الإلكتروني
- **الأسئلة الشائعة**: صفحة FAQ
- **الدعم الفني**: عبر البريد الإلكتروني

### معلومات المشروع
- **اسم المشروع**: شلة (Shellaksa)
- **الإصدار**: 1.0.0
- **تاريخ الإنشاء**: 2024
- **آخر تحديث**: ديسمبر 2024
- **الرخصة**: خاصة
- **المطور**: فريق شلة

---

*هذا الدليل يغطي جميع جوانب مشروع شلة التقنية والوظيفية. للمزيد من المعلومات أو الاستفسارات، يرجى التواصل مع فريق التطوير.*

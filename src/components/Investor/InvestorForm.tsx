"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import React, { useState } from "react";
import ContractModal from "./ContractModal";

// Types
interface FormData {
  first_name: string;
  father_name: string;
  family_name: string;
  grandfather_name: string;
  birth_date: string;
  national_id: string;
  email: string;
  phone: string;
  national_address_email: string;
  region: string;
  iban: string;
  bank_name: string;
  amount: string;
  agreed: boolean;
}

interface NafathResponse {
  status: string;
  request_id?: string;
  external_response?: Array<{ random: string }>;
  full_name_ar?: string;
  national_id?: string;
  signed_file_url?: string;
}

export default function InvestorForm() {
  // Base URL - Update this with your actual API URL
  const BASE_URL = "https://shellafood.com"; // TODO: Update this

  // Form state
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    father_name: "",
    family_name: "",
    grandfather_name: "",
    birth_date: "",
    national_id: "",
    email: "",
    phone: "",
    national_address_email: "",
    region: "",
    iban: "",
    bank_name: "",
    amount: "",
    agreed: false,
  });

  // Workflow state
  const [currentStep, setCurrentStep] = useState<'form' | 'verification' | 'complete'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [nafathCode, setNafathCode] = useState<string | null>(null);
  const [nafathRequestId, setNafathRequestId] = useState<string | null>(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [contractPdfUrl, setContractPdfUrl] = useState<string | null>(null);
  const [signedContractUrl, setSignedContractUrl] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [investorId, setInvestorId] = useState<string | null>(null);
  const [signedContractData, setSignedContractData] = useState<NafathResponse | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
const { language} = useLanguage();	
const isArabic = language === 'ar';
const direction = isArabic ? 'rtl' : 'ltr';
  // Notification state
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error" | "info",
    isVisible: false,
  });

  // Translation helper
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ar: {
        personalInfo: 'البيانات الشخصية',
        contactInfo: 'معلومات الاتصال',
        bankingInfo: 'معلومات البنك',
        firstName: 'الاسم الأول',
        fatherName: 'اسم الأب',
        familyName: 'اسم العائلة',
        grandfatherName: 'اسم الجد',
        birthDate: 'تاريخ الميلاد',
        nationalId: 'رقم الهوية الوطنية',
        email: 'البريد الإلكتروني',
        phone: 'رقم الجوال',
        nationalAddressEmail: 'بريد العنوان الوطني',
        region: 'المنطقة',
        iban: 'رقم الآيبان',
        bankName: 'اسم البنك',
        amount: 'المبلغ المراد استثماره',
        agreeTerms: 'أوافق على الشروط والأحكام',
        submit: 'إرسال الطلب',
        processing: 'جاري المعالجة...',
        nafathTitle: 'التحقق من الهوية - نفاذ',
        nafathCode: 'كود التحقق',
        nafathInstructions: 'افتح تطبيق نفاذ على جوالك وأدخل الكود التالي للموافقة:',
        waitingApproval: 'بانتظار الموافقة...',
        contractTitle: 'معاينة العقد',
        downloadContract: 'تحميل العقد',
        confirmSign: 'تأكيد وتوقيع',
        successTitle: 'تم التسجيل بنجاح!',
        successMessage: 'تم تسجيلك كمستثمر وتوقيع العقد بنجاح',
        startNew: 'بدء تسجيل جديد',
        previewContract: 'معاينة العقد (اختياري)',
        cancelVerification: 'إلغاء التحقق',
        backToForm: 'العودة للنموذج',
      },
      en: {
        personalInfo: 'Personal Information',
        contactInfo: 'Contact Information',
        bankingInfo: 'Banking Information',
        firstName: 'First Name',
        fatherName: 'Father Name',
        familyName: 'Family Name',
        grandfatherName: 'Grandfather Name',
        birthDate: 'Birth Date',
        nationalId: 'National ID',
        email: 'Email',
        phone: 'Phone',
        nationalAddressEmail: 'National Address Email',
        region: 'Region',
        iban: 'IBAN',
        bankName: 'Bank Name',
        amount: 'Investment Amount',
        agreeTerms: 'I agree to terms and conditions',
        submit: 'Submit Application',
        processing: 'Processing...',
        nafathTitle: 'Identity Verification - Nafath',
        nafathCode: 'Verification Code',
        nafathInstructions: 'Open Nafath app on your phone and enter this code to approve:',
        waitingApproval: 'Waiting for approval...',
        contractTitle: 'Contract Preview',
        downloadContract: 'Download Contract',
        confirmSign: 'Confirm & Sign',
        successTitle: 'Registration Successful!',
        successMessage: 'You have been registered as an investor and the contract has been signed',
        startNew: 'Start New Registration',
        previewContract: 'Preview Contract (Optional)',
        cancelVerification: 'Cancel Verification',
        backToForm: 'Back to Form',
      }
    };
    return translations[language][key] || key;
  };

  // API Functions
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    // For FormData, don't set Content-Type (browser sets it automatically with boundary)
    const isFormData = options.body instanceof FormData;
    const headers: HeadersInit = {
      'X-LANG': language,
      'Accept': 'application/json',
      ...(options.headers || {}),
    };

    // Remove Content-Type for FormData requests to let browser set it automatically
    if (isFormData && 'Content-Type' in headers) {
      delete (headers as any)['Content-Type'];
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response;
  };

  // Step 1: Preview Contract PDF (Optional)
  const previewContract = async () => {
    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'agreed') {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await apiCall('/api/v1/investor/contract-pdf?pdf=1', {
        method: 'POST',
        headers: {
          'Accept': 'application/pdf',
        },
        body: formDataToSend,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setContractPdfUrl(url);
      
      // Show the PDF in a modal immediately
      setShowPdfModal(true);
      
      showNotification(isArabic ? 'تم تحميل العقد بنجاح' : 'Contract loaded successfully', 'success');
    } catch (error: any) {
      console.error('Error in previewContract:', error);
      showNotification(error.message || (isArabic ? 'فشل تحميل العقد' : 'Failed to load contract'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Initiate Nafath Authentication
  const initiateNafath = async () => {
    try {
      setIsLoading(true);
      const response = await apiCall('/api/v1/investor/nafath/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          national_id: formData.national_id,
          is_refresh: false,
        }),
      });

      const data: NafathResponse = await response.json();
      
      if (data.request_id && data.external_response?.[0]?.random) {
        setNafathRequestId(data.request_id);
        setNafathCode(data.external_response[0].random);
        setCurrentStep('verification');
        setPollingAttempts(0);
        
        // Start polling for status
        startPolling();
      } else {
        throw new Error(isArabic ? 'فشل في بدء التحقق' : 'Failed to initiate verification');
      }
    } catch (error: any) {
      console.error('Error in initiateNafath:', error);
      showNotification(error.message || (isArabic ? 'خطأ في بدء التحقق' : 'Error initiating verification'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Check Nafath Status (Polling)
  const checkNafathStatus = async () => {
    try {
      const response = await apiCall('/api/v1/investor/nafath/checkStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          national_id: formData.national_id,
        }),
      });

      const data: NafathResponse = await response.json();
      
      if (data.status === 'approved') {
        stopPolling();
        showNotification(
          isArabic ? `تم التحقق بنجاح - ${data.full_name_ar}` : `Verified successfully - ${data.full_name_ar}`,
          'success'
        );
        // After verification, proceed directly to registration
        await finalizeRegistration();
        return true;
      } else if (data.status === 'pending') {
        return false;
      } else {
        stopPolling();
        throw new Error(isArabic ? 'فشل التحقق' : 'Verification failed');
      }
    } catch (error: any) {
      console.error('Error in checkNafathStatus:', error);
      showNotification(error.message || (isArabic ? 'خطأ في التحقق' : 'Verification error'), 'error');
      return false;
    }
  };

  // Polling mechanism
  const startPolling = () => {
    const interval = setInterval(async () => {
      setPollingAttempts(prev => {
        const newCount = prev + 1;
        
        // Timeout after 40 attempts (2 minutes with 3-second intervals)
        if (newCount >= 40) {
          stopPolling();
          showNotification(
            isArabic ? 'انتهت مهلة التحقق. يرجى المحاولة مرة أخرى' : 'Verification timeout. Please try again',
            'error'
          );
          setCurrentStep('form');
          return 0;
        }
        
        return newCount;
      });

      await checkNafathStatus();
    }, 3000); // Poll every 3 seconds

    setPollingInterval(interval);
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const cancelVerification = () => {
    stopPolling();
    setCurrentStep('form');
    setNafathCode(null);
    setNafathRequestId(null);
    setPollingAttempts(0);
  };

  // Step 3: Final Registration + Sign Contract
  const finalizeRegistration = async () => {
    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'agreed') {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await apiCall('/api/v1/investor/register', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (data.id && data.is_completed) {
        setInvestorId(data.id);
        
        // After registration, fetch the signed contract
        await fetchSignedContract();
      } else {
        throw new Error(isArabic ? 'فشل في إكمال التسجيل' : 'Failed to complete registration');
      }
    } catch (error: any) {
      console.error('Error in finalizeRegistration:', error);
      showNotification(error.message || (isArabic ? 'خطأ في التسجيل' : 'Registration error'), 'error');
      setIsLoading(false);
    }
  };

  // Fetch signed contract after registration
  const fetchSignedContract = async () => {
    try {
      const response = await apiCall('/api/v1/investor/nafath/checkStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          national_id: formData.national_id,
        }),
      });

      const data: NafathResponse = await response.json();
      
      if (data.signed_file_url) {
        setSignedContractUrl(data.signed_file_url);
        setSignedContractData(data);
        setCurrentStep('complete');
        showNotification(
          isArabic ? 'تم التسجيل والتوقيع بنجاح!' : 'Registration and signing completed successfully!',
          'success'
        );
      } else {
        throw new Error(isArabic ? 'لم يتم العثور على العقد الموقع' : 'Signed contract not found');
      }
    } catch (error: any) {
      console.error('Error in fetchSignedContract:', error);
      showNotification(error.message || (isArabic ? 'خطأ في جلب العقد الموقع' : 'Error fetching signed contract'), 'error');
      // Still show complete step even if contract fetch fails
      setCurrentStep('complete');
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation
  const validateForm = (): { isValid: boolean; message: string } => {
    const requiredFields: (keyof FormData)[] = [
      'first_name', 'father_name', 'family_name', 'grandfather_name',
      'birth_date', 'national_id', 'email', 'phone', 'national_address_email',
      'region', 'iban', 'bank_name', 'amount'
    ];

    for (const field of requiredFields) {
      if (!formData[field] || (formData[field] as string).trim() === '') {
        return { 
          isValid: false, 
          message: isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields' 
        };
      }
    }

    if (!/^\d{10}$/.test(formData.national_id)) {
      return { 
        isValid: false, 
        message: isArabic ? 'الهوية الوطنية يجب أن تحتوي على 10 أرقام' : 'National ID must be 10 digits' 
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email) || !emailRegex.test(formData.national_address_email)) {
      return { 
        isValid: false, 
        message: isArabic ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address' 
      };
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 1000 || amount > 10000000) {
      return { 
        isValid: false, 
        message: isArabic ? 'المبلغ يجب أن يكون بين 1,000 - 10,000,000 ريال' : 'Amount must be between 1,000 - 10,000,000 SAR' 
      };
    }

    if (!formData.agreed) {
      return { 
        isValid: false, 
        message: isArabic ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to terms and conditions' 
      };
    }

    return { isValid: true, message: '' };
  };

  // Form submission handler
  const handleSubmit = () => {
    const validation = validateForm();
    if (!validation.isValid) {
      showNotification(validation.message, 'error');
      return;
    }

    initiateNafath();
  };

  // Notification helper
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      first_name: "",
      father_name: "",
      family_name: "",
      grandfather_name: "",
      birth_date: "",
      national_id: "",
      email: "",
      phone: "",
      national_address_email: "",
      region: "",
      iban: "",
      bank_name: "",
      amount: "",
      agreed: false,
    });
    setCurrentStep('form');
    setNafathCode(null);
    setNafathRequestId(null);
    setContractPdfUrl(null);
    setSignedContractUrl(null);
    setSignedContractData(null);
    setInvestorId(null);
    setPollingAttempts(0);
    stopPolling();
  };

  return (
    <section className="mb-6 bg-white dark:bg-gray-900 p-3 md:mb-8 md:p-12" dir={direction}>
      <div className="mx-auto max-w-5xl">
        {/* Progress Indicator */}
        <div className="mb-6 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 shadow-lg dark:shadow-gray-900/50 sm:mb-8 sm:p-6">
          <div className="flex items-center justify-between">
            {[
              { key: 'form', label: isArabic ? 'البيانات' : 'Form', icon: '📝' },
              { key: 'verification', label: isArabic ? 'التحقق' : 'Verify', icon: '🔐' },
              { key: 'complete', label: isArabic ? 'مكتمل' : 'Done', icon: '✅' }
            ].map((step, index) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all duration-500 transform ${
                    (currentStep === 'form' && step.key === 'form') ||
                    (currentStep === 'verification' && ['form', 'verification'].includes(step.key)) ||
                    (currentStep === 'complete')
                      ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg dark:shadow-gray-900/50 scale-110'
                      : 'bg-gray-200 dark:bg-gray-700 scale-100'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`mt-2 sm:mt-3 text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                    (currentStep === 'form' && step.key === 'form') ||
                    (currentStep === 'verification' && ['form', 'verification'].includes(step.key)) ||
                    (currentStep === 'complete')
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`h-2 flex-1 mx-2 sm:mx-3 transition-all duration-500 rounded-full ${
                    (currentStep === 'verification' && step.key === 'form') ||
                    (currentStep === 'complete')
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Form */}
        {currentStep === 'form' && (
          <div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 md:p-8">
            <div className={`flex items-center gap-3 mb-6 sm:mb-8 `}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-xl sm:text-2xl shadow-md">
                📝
              </div>
              <div className={isArabic ? 'text-right' : 'text-left'}>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                  {isArabic ? 'تسجيل مستثمر جديد' : 'New Investor Registration'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields'}
                </p>
              </div>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              {/* Personal Information */}
              <div className="space-y-4 sm:space-y-5">
                <div className={`flex items-center gap-2 pb-3 border-b-2 border-gray-200 dark:border-gray-700 `}>
                  <span className="text-lg sm:text-xl">👤</span>
                  <h3 className={`text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {t('personalInfo')}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label={t('firstName')} name="first_name" value={formData.first_name} onChange={handleChange} required />
                  <FormField label={t('fatherName')} name="father_name" value={formData.father_name} onChange={handleChange} required />
                  <FormField label={t('familyName')} name="family_name" value={formData.family_name} onChange={handleChange} required />
                  <FormField label={t('grandfatherName')} name="grandfather_name" value={formData.grandfather_name} onChange={handleChange} required />
                  <FormField label={t('birthDate')} name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} required />
                  <FormField label={t('nationalId')} name="national_id" type="text" value={formData.national_id} onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData(prev => ({ ...prev, national_id: numericValue }));
                  }} placeholder="1234567890" required helper={isArabic ? '10 أرقام بالضبط' : '10 digits exactly'} />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 sm:space-y-5">
                <div className={`flex items-center gap-2 pb-3 border-b-2 border-gray-200 dark:border-gray-700 `}>
                  <span className="text-lg sm:text-xl">📞</span>
                  <h3 className={`text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {t('contactInfo')}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label={t('email')} name="email" type="email" value={formData.email} onChange={handleChange} required />
                  <FormField label={t('phone')} name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+966500000000" required />
                  <FormField label={t('nationalAddressEmail')} name="national_address_email" type="email" value={formData.national_address_email} onChange={handleChange} required />
                  <FormField label={t('region')} name="region" value={formData.region} onChange={handleChange} placeholder={isArabic ? 'الرياض' : 'Riyadh'} required />
                </div>
              </div>

              {/* Banking Information */}
              <div className="space-y-4 sm:space-y-5">
                <div className={`flex items-center gap-2 pb-3 border-b-2 border-gray-200 dark:border-gray-700 `}>
                  <span className="text-lg sm:text-xl">🏦</span>
                  <h3 className={`text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {t('bankingInfo')}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label={t('iban')} name="iban" value={formData.iban} onChange={handleChange} placeholder="SA1234567890123456789012" required />
                  <FormField label={t('bankName')} name="bank_name" value={formData.bank_name} onChange={handleChange} placeholder={isArabic ? 'مصرف الراجحي' : 'Al Rajhi Bank'} required />
                  <div className="md:col-span-2">
                    <FormField label={t('amount')} name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="50000" required helper={isArabic ? '1,000 - 10,000,000 ريال سعودي' : '1,000 - 10,000,000 SAR'} />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className={`flex items-start gap-3 p-4 sm:p-5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm `}>
                <input
                  type="checkbox"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                />
                <label className={`text-sm text-gray-700 dark:text-gray-300 cursor-pointer ${isArabic ? 'text-right' : 'text-left'}`}>
                  {t('agreeTerms')}
                </label>
              </div>

              {/* Contract Preview Section (if already loaded) */}
              {contractPdfUrl && currentStep === 'form' && (
                <div className="mt-6 p-4 sm:p-5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                  <div className={`flex items-center justify-between mb-4 `}>
                    <div className={`flex items-center gap-2 `}>
                      <span className="text-lg sm:text-xl">📄</span>
                      <span className={`font-semibold text-gray-800 dark:text-gray-200 ${isArabic ? 'text-right' : 'text-left'}`}>
                        {isArabic ? 'تم تحميل العقد' : 'Contract Loaded'}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowPdfModal(true)}
                      className="px-3 sm:px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white transition-all text-xs sm:text-sm"
                    >
                      {isArabic ? 'عرض العقد' : 'View Contract'}
                    </button>
                  </div>
                  <p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {isArabic 
                      ? 'يمكنك معاينة العقد قبل المتابعة. سيتم استخدام نفس العقد عند التوقيع.' 
                      : 'You can preview the contract before proceeding. The same contract will be used for signing.'}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                <button
                  onClick={previewContract}
                  disabled={isLoading}
                  className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  <div className={`flex items-center justify-center gap-2 `}>
                    <span>📄</span>
                    <span>{t('previewContract')}</span>
                  </div>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t('processing')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>🚀</span>
                      <span>{t('submit')}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Nafath Verification */}
        {currentStep === 'verification' && (
          <div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 md:p-8 text-center">
            <div className="mb-6 sm:mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg dark:shadow-gray-900/50">
                <span className="text-4xl sm:text-5xl">🔐</span>
              </div>
              <h2 className={`text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3 ${isArabic ? 'text-right' : 'text-left'}`}>
                {t('nafathTitle')}
              </h2>
              <p className={`text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto ${isArabic ? 'text-right' : 'text-left'}`}>
                {t('nafathInstructions')}
              </p>
            </div>

            {nafathCode && (
              <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 sm:p-10 md:p-12 mb-6 sm:mb-8 border-2 border-green-200 dark:border-green-800/50 shadow-xl dark:shadow-2xl overflow-hidden">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgb(34, 197, 94) 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }}></div>
                </div>
                
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500"></div>
                
                <div className="relative z-10">
                  {/* Label */}
                  <div className={`flex items-center gap-2 mb-4 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <p className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>
                      {t('nafathCode')}
                    </p>
                  </div>
                  
                  {/* Code Display */}
                  <div className={`relative ${isArabic ? 'text-right' : 'text-left'}`}>
                    <div className="inline-block bg-white dark:bg-gray-800/80 px-6 py-4 rounded-lg border-2 border-green-100 dark:border-green-900/50 shadow-lg backdrop-blur-sm">
                      <div className={`text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent tracking-[0.2em] font-mono ${isArabic ? 'text-right' : 'text-left'}`}>
                        {nafathCode}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full relative"></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {t('waitingApproval')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              <div className={`flex items-center gap-3 text-gray-600 dark:text-gray-400 `}>
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-green-600"></div>
                <span className="font-medium text-sm sm:text-base">{t('waitingApproval')}</span>
                <span className="text-xs sm:text-sm bg-green-100 dark:bg-green-900/30 px-2 sm:px-3 py-1 rounded-full font-semibold">
                  {pollingAttempts}/40
                </span>
              </div>
              
              <button
                onClick={cancelVerification}
                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600 text-sm sm:text-base"
              >
                {t('cancelVerification')}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {currentStep === 'complete' && (
          <div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg dark:shadow-gray-900/50 animate-bounce">
                <span className="text-4xl sm:text-5xl">✅</span>
              </div>
              <h2 className={`text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3 ${isArabic ? 'text-right' : 'text-left'}`}>
                {t('successTitle')}
              </h2>
              <p className={`text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto ${isArabic ? 'text-right' : 'text-left'}`}>
                {t('successMessage')}
              </p>
              
              {/* Contract Data Info */}
              {signedContractData && (
                <div className="mb-6 bg-white dark:bg-gray-700 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                  <div className={`space-y-3 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {signedContractData.full_name_ar && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {isArabic ? 'الاسم الكامل' : 'Full Name'}
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                          {signedContractData.full_name_ar}
                        </p>
                      </div>
                    )}
                    {signedContractData.national_id && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {isArabic ? 'رقم الهوية الوطنية' : 'National ID'}
                        </p>
                        <p className="text-sm sm:text-base font-mono font-semibold text-gray-800 dark:text-gray-200">
                          {signedContractData.national_id}
                        </p>
                      </div>
                    )}
                    {signedContractData.request_id && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {isArabic ? 'رقم الطلب' : 'Request ID'}
                        </p>
                        <p className="text-sm sm:text-base font-mono font-semibold text-gray-800 dark:text-gray-200">
                          {signedContractData.request_id}
                        </p>
                      </div>
                    )}
                    {signedContractData.status && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {isArabic ? 'الحالة' : 'Status'}
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400">
                          {signedContractData.status === 'approved' ? (isArabic ? 'موافق عليه' : 'Approved') : signedContractData.status}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {investorId && (
                <div className="inline-block bg-white dark:bg-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm mb-6">
                  <p className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {isArabic ? 'رقم المستثمر' : 'Investor ID'}
                  </p>
                  <p className="text-base sm:text-lg font-mono font-bold text-green-600 dark:text-green-400">
                    {investorId}
                  </p>
                </div>
              )}
            </div>

            {/* Signed Contract Display */}
            {signedContractUrl && (
              <div className="mb-6 bg-white dark:bg-gray-700 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-600 shadow-sm">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-lg sm:text-xl">📄</span>
                    <span className={`font-semibold text-gray-800 dark:text-gray-200 ${isArabic ? 'text-right' : 'text-left'}`}>
                      {isArabic ? 'العقد الموقع' : 'Signed Contract'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setContractPdfUrl(signedContractUrl);
                      setShowPdfModal(true);
                    }}
                    className="px-3 sm:px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white transition-all text-xs sm:text-sm"
                  >
                    {isArabic ? 'عرض العقد' : 'View Contract'}
                  </button>
                </div>
                <p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                  {isArabic 
                    ? 'تم توقيع العقد بنجاح. يمكنك عرضه أو تحميله.' 
                    : 'Contract has been signed successfully. You can view or download it.'}
                </p>
                <div className={`flex flex-col sm:flex-row gap-3 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                  <button
                    onClick={() => {
                      setContractPdfUrl(signedContractUrl);
                      setShowPdfModal(true);
                    }}
                    className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white transition-all shadow-md hover:shadow-lg"
                  >
                    <div className={`flex items-center justify-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span>👁️</span>
                      <span>{isArabic ? 'عرض العقد' : 'View Contract'}</span>
                    </div>
                  </button>
                  <a
                    href={signedContractUrl}
                    download="signed-investment-contract.pdf"
                    className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-center shadow-sm hover:shadow-md"
                  >
                    <div className={`flex items-center justify-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span>⬇️</span>
                      <span>{t('downloadContract')}</span>
                    </div>
                  </a>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={resetForm}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
              >
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span>🔄</span>
                  <span>{t('startNew')}</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        {(contractPdfUrl || signedContractUrl) && (
          <ContractModal
            isOpen={showPdfModal}
            onClose={() => setShowPdfModal(false)}
            fileUrl={signedContractUrl || contractPdfUrl || ''}
          />
        )}

        {/* Notification */}
        {notification.isVisible && (
          <div className={`fixed bottom-6 ${isArabic ? 'left-6' : 'right-6'} z-50 animate-slide-up max-w-md`}>
            <div className={`px-6 py-4 rounded-xl shadow-2xl ${
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } text-white flex items-center gap-3 border-2 border-white/20`}>
              <div className="text-2xl">
                {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : 'ℹ'}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(prev => ({ ...prev, isVisible: false }))}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </section>
  );
}

// Form Field Component
function FormField({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  helper
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  helper?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm sm:text-base"
      />
      {helper && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helper}</p>
      )}
    </div>
  );
}
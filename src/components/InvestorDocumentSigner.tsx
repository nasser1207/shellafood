// components/InvestorDocumentSigner.tsx

"use client";

import React, { useState } from 'react';
import { DocumentSigner } from './DocumentSigner';
import { useLanguage } from '@/contexts/LanguageContext';

interface InvestorDocumentSignerProps {
  nationalId: string;
  investorData?: {
    first_name: string;
    family_name: string;
    email: string;
    phone: string;
    amount: string;
    [key: string]: any;
  };
  onSignComplete?: (signedDocument: string) => void;
  onError?: (error: string) => void;
}

export const InvestorDocumentSigner: React.FC<InvestorDocumentSignerProps> = ({
  nationalId,
  investorData,
  onSignComplete,
  onError
}) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  
  const [showSigner, setShowSigner] = useState(false);

  const handleSignComplete = (signedDocument: string) => {
    console.log('Investor document signed successfully');
    onSignComplete?.(signedDocument);
    
    // You can also save the signed document to your database here
    // Example: await investorRepository.updateSignedDocument(investorId, signedDocument);
  };

  const handleError = (error: string) => {
    console.error('Investor document signing error:', error);
    onError?.(error);
  };

  if (!showSigner) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6" dir={direction}>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className={`text-2xl font-bold mb-6 ${isArabic ? 'text-right' : 'text-left'}`}>
            {isArabic ? 'توقيع عقد الاستثمار' : 'Investment Contract Signing'}
          </h2>
          
          {investorData && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                {isArabic ? 'بيانات المستثمر:' : 'Investor Information:'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">
                    {isArabic ? 'الاسم:' : 'Name:'}
                  </span>
                  <span className="ml-2">
                    {investorData.first_name} {investorData.family_name}
                  </span>
                </div>
                <div>
                  <span className="font-medium">
                    {isArabic ? 'رقم الهوية:' : 'National ID:'}
                  </span>
                  <span className="ml-2">{nationalId}</span>
                </div>
                <div>
                  <span className="font-medium">
                    {isArabic ? 'البريد الإلكتروني:' : 'Email:'}
                  </span>
                  <span className="ml-2">{investorData.email}</span>
                </div>
                <div>
                  <span className="font-medium">
                    {isArabic ? 'رقم الهاتف:' : 'Phone:'}
                  </span>
                  <span className="ml-2">{investorData.phone}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">
                    {isArabic ? 'مبلغ الاستثمار:' : 'Investment Amount:'}
                  </span>
                  <span className="ml-2">{investorData.amount} {isArabic ? 'ريال' : 'SAR'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className={`text-gray-600 mb-4 ${isArabic ? 'text-right' : 'text-left'}`}>
              {isArabic 
                ? 'لبدء عملية توقيع عقد الاستثمار، يرجى النقر على الزر أدناه'
                : 'To start the investment contract signing process, please click the button below'
              }
            </p>
            
            <button
              onClick={() => setShowSigner(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {isArabic ? 'بدء توقيع العقد' : 'Start Contract Signing'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DocumentSigner
      nationalIds={[nationalId]}
      onSignComplete={handleSignComplete}
      onError={handleError}
    />
  );
};

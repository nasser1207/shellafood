"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DocumentSignerProps {
  nationalIds: string[];
  onSignComplete?: (signedDocument: string) => void;
  onError?: (error: string) => void;
}

export const DocumentSigner: React.FC<DocumentSignerProps> = ({
  nationalIds,
  onSignComplete,
  onError
}) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('idle');

  const handleSign = async () => {
    if (!nationalIds || nationalIds.length === 0) {
      onError?.('رقم الهوية الوطنية مطلوب');
      return;
    }

    setIsLoading(true);
    setStatus('signing');

    try {
      // Initiate Nafath authentication
      const response = await fetch('/api/nafath/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalIds }),
      });

      if (!response.ok) {
        throw new Error('فشل في بدء عملية التوثيق');
      }

      const data = await response.json();
      
      if (data.success && data.requestId) {
        setStatus('waiting');
        // Poll for result
        pollForResult(data.requestId);
      } else {
        throw new Error(data.message || 'فشل في بدء العملية');
      }
    } catch (error) {
      setStatus('error');
      onError?.(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const pollForResult = async (requestId: string) => {
    // Simple polling implementation
    // In production, you'd want to use websockets or server-sent events
    const maxAttempts = 30;
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch(`/api/nafath/status?requestId=${requestId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'approved') {
            clearInterval(interval);
            setStatus('completed');
            onSignComplete?.(data.signedDocument || '');
          } else if (data.status === 'failed') {
            clearInterval(interval);
            setStatus('error');
            onError?.(data.error || 'فشل في التوثيق');
          }
        }
      } catch (error) {
        // Continue polling
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setStatus('error');
        onError?.('انتهى وقت الانتظار');
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`text-2xl font-bold mb-6 ${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic ? 'توقيع الوثيقة' : 'Document Signing'}
        </h2>
        
        <div className="space-y-4">
          <p className={isArabic ? 'text-right' : 'text-left'}>
            {isArabic 
              ? 'سيتم توقيع الوثيقة باستخدام نفاذ'
              : 'The document will be signed using Nafath'
            }
          </p>
          
          {status === 'idle' && (
            <button
              onClick={handleSign}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isArabic ? 'بدء التوقيع' : 'Start Signing'}
            </button>
          )}
          
          {status === 'signing' && (
            <div className="text-center">
              <p>{isArabic ? 'جاري بدء العملية...' : 'Starting process...'}</p>
            </div>
          )}
          
          {status === 'waiting' && (
            <div className="text-center">
              <p>{isArabic ? 'في انتظار التوثيق...' : 'Waiting for authentication...'}</p>
            </div>
          )}
          
          {status === 'completed' && (
            <div className="text-center text-green-600">
              <p>{isArabic ? 'تم التوقيع بنجاح' : 'Signing completed successfully'}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center text-red-600">
              <p>{isArabic ? 'حدث خطأ' : 'An error occurred'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


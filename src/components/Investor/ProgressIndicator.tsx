// src/components/Investor/ProgressIndicator.tsx
"use client";

import React from 'react';

type WorkflowStep = 'form' | 'verification' | 'contract' | 'signing' | 'complete';

interface ProgressIndicatorProps {
  currentStep: WorkflowStep;
  isArabic: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, isArabic }) => {
  const steps = [
    { key: 'form', label: isArabic ? 'البيانات' : 'Data' },
    { key: 'verification', label: isArabic ? 'التحقق' : 'Verify' },
    { key: 'contract', label: isArabic ? 'العقد' : 'Contract' },
    { key: 'signing', label: isArabic ? 'التوقيع' : 'Sign' },
    { key: 'complete', label: isArabic ? 'مكتمل' : 'Complete' }
  ];

  const isStepCompleted = (stepKey: string) => {
    const stepOrder = ['form', 'verification', 'contract', 'signing', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepKey);
    return stepIndex <= currentIndex;
  };

  const isStepActive = (stepKey: string) => {
    return currentStep === stepKey;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              isStepCompleted(step.key)
                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-2 ${
                isStepCompleted(step.key) && !isStepActive(step.key)
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

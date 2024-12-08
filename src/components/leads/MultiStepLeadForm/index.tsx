import React, { useState } from 'react';
import { Check } from 'lucide-react';
import StepIndicator from './StepIndicator';
import ContactInfo from './steps/ContactInfo';
import TripDetails from './steps/TripDetails';
import AdditionalInfo from './steps/AdditionalInfo';
import ReviewSubmit from './steps/ReviewSubmit';
import { Lead } from '../../../types/leads';

const STEPS = [
  { title: 'Contact Info', component: ContactInfo },
  { title: 'Trip Details', component: TripDetails },
  { title: 'Additional Info', component: AdditionalInfo },
  { title: 'Review & Submit', component: ReviewSubmit }
];

interface MultiStepLeadFormProps {
  onSubmit: (data: Lead) => Promise<void>;
  onCancel: () => void;
}

export default function MultiStepLeadForm({ onSubmit, onCancel }: MultiStepLeadFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Lead>>({
    status: 'new',
    source: 'manual'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepSubmit = (stepData: Partial<Lead>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    handleNext();
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(formData as Lead);
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
          <div className="relative flex justify-between">
            {STEPS.map((step, index) => (
              <StepIndicator
                key={index}
                step={index + 1}
                title={step.title}
                isActive={currentStep === index}
                isCompleted={currentStep > index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <CurrentStepComponent
          data={formData}
          onSubmit={handleStepSubmit}
          isLastStep={currentStep === STEPS.length - 1}
          onFinalSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Cancel
        </button>
        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Back
            </button>
          )}
          {currentStep < STEPS.length - 1 && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
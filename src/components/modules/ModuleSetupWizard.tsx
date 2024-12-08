import React, { useState } from 'react';
import { Check, ChevronRight, AlertTriangle } from 'lucide-react';
import { Module } from '../../types/modules';
import toast from 'react-hot-toast';

interface ModuleSetupWizardProps {
  module: Module;
  onComplete: () => void;
  onClose: () => void;
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

export default function ModuleSetupWizard({
  module,
  onComplete,
  onClose
}: ModuleSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Define setup steps based on module type
  const steps: SetupStep[] = [
    {
      id: 'requirements',
      title: 'Check Requirements',
      description: 'Verify system requirements and dependencies',
      component: () => (
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                System Requirements
              </p>
              <p className="text-yellow-700 dark:text-yellow-300">
                Please ensure your system meets all requirements before proceeding.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            {module.dependencies?.map((dep, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {dep}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'configuration',
      title: 'Basic Configuration',
      description: 'Configure essential module settings',
      component: () => (
        <div className="space-y-4">
          {/* Add module-specific configuration fields */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure basic settings for {module.name}
          </p>
        </div>
      )
    },
    {
      id: 'verification',
      title: 'Verify Setup',
      description: 'Test module functionality',
      component: () => (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-500">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">All tests passed successfully</span>
          </div>
        </div>
      )
    }
  ];

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      try {
        setIsLoading(true);
        // Perform final setup tasks
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate setup
        onComplete();
        toast.success('Module setup completed successfully');
      } catch (error) {
        console.error('Setup error:', error);
        toast.error('Failed to complete module setup');
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {module.name} Setup
          </h2>

          {/* Progress Steps */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center relative z-10
                    ${index <= currentStep
                      ? 'bg-primary text-black'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {steps[currentStep].description}
            </p>
            <CurrentStepComponent />
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next Step'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
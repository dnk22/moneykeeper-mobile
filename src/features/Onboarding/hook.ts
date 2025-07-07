import { useState } from 'react';
import { useCustomTheme } from 'resources/theme';

const steps = [
  { key: 'welcome' },
  { key: 'theme' },
  // { key: 'dateConfig' },
  { key: 'notification' },
  { key: 'endOnboarding' },
];

const useOnboardingHook = () => {
  const { colors } = useCustomTheme();
  const [step, setStep] = useState(0);

  const onNext = () => {
    setStep(Math.min(steps.length - 1, step + 1));
  };

  return { colors, step, steps, setStep, onNext };
};

export default useOnboardingHook;

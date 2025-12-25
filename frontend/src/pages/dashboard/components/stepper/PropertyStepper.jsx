// frontend\src\pages\dashboard\components\stepper\PropertyStepper.jsx
"use client";

import { useState } from "react";
import StepIndicator from "./StepIndicator";

// Steps
import StepPropertyStatus from "../steps/StepPropertyStatus";
import StepIdentity from "../steps/PropertyIdentityForm";
import StepLocation from "../steps/StepPropertyLocation";
import StepLegalStatus from "../steps/StepPropertyLegalStatus";
import StepOwnership from "../steps/StepPropertyOwnership";
import StepBoundaries from "../steps/StepPropertyBoundariesInfo";
import StepAdditionalInfo from "../steps/StepPropertyAdditionalInfo";

const steps = [
  StepPropertyStatus,
  StepIdentity,
  StepLocation,
  StepLegalStatus,
  StepBoundaries,
  StepOwnership,
  StepAdditionalInfo,
];

export default function PropertyStepper({ draft, isLoading } = {}) {
  // <--- propها رو optional اضافه کردم، اما اگر استفاده نمی‌کنی، می‌تونی برشون داری
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(
    new Array(steps.length).fill(false)
  );

  // حرکت به قدم بعدی
  const next = () => {
    setCompleted((prev) => {
      const newCompleted = [...prev];
      newCompleted[currentStep] = true;
      return newCompleted;
    });
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  // حرکت به قدم قبلی
  const back = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const StepComponent = steps[currentStep];
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow ">
      {/* نشانگر مرحله */}
      <StepIndicator
        currentStep={currentStep}
        completed={completed}
        setCurrentStep={setCurrentStep}
      />

      {/* Step فعلی */}
      <StepComponent next={next} back={back} />
    </div>
  );
}

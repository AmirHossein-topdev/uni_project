// frontend/src/pages/dashboard/components/stepper/PropertyStepper.jsx
"use client";

import { useState, useRef } from "react";
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

export default function PropertyStepper({ onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(
    new Array(steps.length).fill(false)
  );
  const stepRef = useRef(null); // ref برای کامپوننتِ فعلی

  const next = () => {
    setCompleted((prev) => {
      const newCompleted = [...prev];
      newCompleted[currentStep] = true;
      return newCompleted;
    });
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const back = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // وقتی کاربر روی دکمه نهایی داخل Stepper می‌زند:
  const handleFinalSubmit = async () => {
    try {
      // اگر Step فعلی متد save ارائه کرده، ابتدا آن را اجرا کن
      if (stepRef.current && typeof stepRef.current.save === "function") {
        await stepRef.current.save();
      }
      // سپس onSubmit والد را صدا بزن
      if (typeof onSubmit === "function") {
        await onSubmit();
      }
    } catch (err) {
      // اگر لازم است خطای محلی مدیریت شود، اینجا قرار بده
      console.error(
        "Error while saving current step before final submit:",
        err
      );
      throw err;
    }
  };

  const StepComponent = steps[currentStep];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow ">
      <StepIndicator
        currentStep={currentStep}
        completed={completed}
        setCurrentStep={setCurrentStep}
      />

      {/* فقط یک Step در یک زمان mount می‌شود؛ به آن ref می‌دهیم */}
      <StepComponent ref={stepRef} next={next} back={back} />
    </div>
  );
}

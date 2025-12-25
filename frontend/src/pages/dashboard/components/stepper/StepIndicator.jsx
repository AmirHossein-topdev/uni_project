// frontend\src\pages\dashboard\components\stepper\StepIndicator.jsx
"use client";

import React from "react";

// لیست مراحل با اموجی‌های رنگی
const stepsConfig = [
  { label: "وضعیت ملک", icon: "🏠" },
  { label: "شناسنامه", icon: "📑" },
  { label: "موقعیت", icon: "📍" },
  { label: "وضعیت حقوقی", icon: "⚖️" },
  { label: "حدود اربعه", icon: "📐" },
  { label: "مالکیت", icon: "🔑" },
  { label: "سایر اطلاعات", icon: "✨" },
];

export default function StepIndicator({
  currentStep,
  completed = {},
  errors = {},
  setCurrentStep,
}) {
  return (
    <div className="w-full py-5 px-4 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 mb-5 overflow-x-auto">
      <div className="flex items-start min-w-[800px] justify-between relative px-2">
        {stepsConfig.map((step, index) => {
          const isCompleted = completed[index];
          const hasError = errors[index];
          const isActive = index === currentStep;

          // استایل‌های پویا برای ظرف آیکون
          let containerClasses = "bg-slate-50 border-slate-100 text-gray-400 "; // غیرفعال
          if (isCompleted) {
            containerClasses =
              "bg-green-50 border-green-200 opacity-100 shadow-md shadow-green-50";
          }
          if (hasError) {
            containerClasses =
              "bg-red-50 border-red-200 opacity-100 animate-pulse";
          }
          if (isActive) {
            containerClasses =
              "bg-white border-blue-500 ring-4 ring-blue-50 shadow-xl opacity-100 scale-110 z-20";
          }

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative group cursor-pointer transition-all duration-300"
              onClick={() => setCurrentStep(index)}
            >
              {/* خطوط رابط انیمیشنی */}
              {index < stepsConfig.length - 1 && (
                <div className="absolute top-7 left-1/2 w-full h-[4px] -z-10 bg-gray-100 rounded-full">
                  <div
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-400 to-emerald-400 w-full"
                        : "w-0"
                    }`}
                  />
                </div>
              )}

              {/* باکس آیکون */}
              <div
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${containerClasses}`}
              >
                {/* آیکون اصلی که همیشه نمایش داده می‌شود */}
                <span
                  className={`text-2xl transition-transform duration-300 ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                >
                  {step.icon}
                </span>

                {/* نشانگر تیک سبز (Badge) در گوشه */}
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                )}

                {/* نشانگر خطا (Badge) در گوشه */}
                {hasError && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                    <span className="text-white text-[10px] font-bold">!</span>
                  </div>
                )}
              </div>

              {/* متن و وضعیت پایین */}
              <div className="mt-4 flex flex-col items-center">
                <span
                  className={`text-[13px] font-black transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 scale-110"
                      : isCompleted
                      ? "text-green-600"
                      : hasError
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>

                {/* نوارهای وضعیت زیر عنوان */}
                <div className="mt-2 h-1.5 rounded-full overflow-hidden w-12 bg-gray-100">
                  {isCompleted ? (
                    <div className="h-full bg-green-500 w-full rounded-full" />
                  ) : hasError ? (
                    <div className="h-full bg-red-500 w-full rounded-full" />
                  ) : isActive ? (
                    <div className="h-full bg-blue-500 w-full rounded-full animate-shimmer" />
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* استایل برای انیمیشن‌های کاستوم */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

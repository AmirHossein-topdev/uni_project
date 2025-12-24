"use client";

const steps = [
  "وضعیت ملک",
  "شناسنامه",
  "موقعیت",
  "وضعیت حقوقی",
  "حدود اربعه",
  "مالکیت",
  "سایر اطلاعات",
];

export default function StepIndicator({
  currentStep,
  completed,
  setCurrentStep,
}) {
  return (
    <div className="flex justify-between items-start mb-10 p-4 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {steps.map((label, index) => {
        const isCompleted = completed[index];
        const isActive = index === currentStep;

        // تعیین استایل‌های مختلف بر اساس وضعیت
        const circleClasses = `w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300 ease-in-out shrink-0 ${
          isCompleted
            ? "bg-green-500 text-white shadow-lg shadow-green-200" // تکمیل شده
            : isActive
            ? "bg-blue-600 text-white ring-4 ring-blue-200 shadow-xl shadow-blue-300" // فعال/فعلی
            : "bg-gray-200 text-gray-600 border border-gray-300" // غیرفعال/آینده
        }`;

        const labelClasses = `mt-2 text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
          isCompleted
            ? "text-green-600"
            : isActive
            ? "text-blue-600 font-extrabold"
            : "text-gray-500"
        }`;

        // اتصال‌دهنده خطی
        const connectorClasses = `absolute top-1/2 left-full transform -translate-y-2.5 h-0.5 w-full ${
          isCompleted ? "bg-green-500" : "bg-gray-300"
        }`;
        // این کانکتور باید فقط برای آیتم‌هایی نمایش داده شود که اولین آیتم نیستند.

        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center relative cursor-pointer"
            onClick={() => setCurrentStep(index)}
          >
            {/* خط اتصال‌دهنده (به جز مرحله اول) */}
            {index < steps.length - 1 && (
              <div
                className={connectorClasses}
                style={{
                  width: "calc(100% - 20px)",
                  right: "calc(50% + 20px)",
                }}
              />
            )}

            <div className="flex flex-col items-center justify-center">
              {/* دایره نشانگر */}
              <div className={circleClasses}>
                {isCompleted ? (
                  "✔️"
                ) : isActive ? (
                  index + 1
                ) : (
                  <span className="animate-spin">⏳</span>
                )}
              </div>

              {/* متن مرحله */}
              <div className={labelClasses}>{label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// frontend\src\pages\dashboard\components\steps\StepPropertyBoundariesInfo.jsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBoundaries } from "@/redux/features/propertyDraftSlice";
import dynamic from "next/dynamic";
// --- استایل‌های پایه ---
const inputBaseClasses =
  "p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full bg-white text-gray-800 shadow-sm placeholder-gray-400";
// -------------------------------------------------------------
// کامپوننت FormField را خارج از بدنه اصلی قرار می‌دهیم تا در هر رندر
// مجدداً ایجاد نشود — این تغییر اصلی برای حل مشکل پرش فوکوس است.
// -------------------------------------------------------------
const FormField = ({ label, name, children, required = false, icon }) => (
  <div className="flex flex-col space-y-1">
    <label
      htmlFor={name}
      className="text-sm font-medium text-gray-700 flex items-center gap-1"
    >
      {icon && <span>{icon}</span>}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);
// ------------------ کمکی: تبدیل ارقام فارسی به انگلیسی ------------------
const persianToEnglishDigits = (str = "") => {
  if (!str) return "";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  const englishDigits = "0123456789";
  return str
    .split("")
    .map((ch) => {
      const p = persianDigits.indexOf(ch);
      if (p > -1) return englishDigits[p];
      const a = arabicDigits.indexOf(ch);
      if (a > -1) return englishDigits[a];
      return ch;
    })
    .join("");
};
// فیلتر برای ورودی‌های عدد صحیح (فقط ارقام)
const filterIntegerInput = (raw) => {
  if (raw == null) return "";
  let v = String(raw);
  v = v.replace(/\s+/g, "");
  v = persianToEnglishDigits(v);
  v = v.replace(/[^0-9]/g, "");
  return v;
};
// فیلتر برای ورودی‌های اعشاری (مختصات): اجازه ارقام و یک نقطه
const filterDecimalInput = (raw) => {
  if (raw == null) return "";
  let v = String(raw);
  v = v.replace(/\s+/g, "");
  v = v.replace(/,/g, "."); // اگر کاربر با ویرگول وارد کرد، به نقطه تبدیل شود
  v = persianToEnglishDigits(v);
  v = v.replace(/[^0-9.\-]/g, "");
  const parts = v.split(".");
  if (parts.length > 1) {
    v = parts[0] + "." + parts.slice(1).join("");
  }
  v = v.replace(/(?!^)-/g, "");
  return v;
};
// =================================================================
// کامپوننت اصلی
// =================================================================
export default function StepPropertyBoundariesInfo({ next, back }) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const dispatch = useDispatch();
  const boundariesDraft = useSelector(
    (state) => state.propertyDraft.boundaries
  );
  const [form, setForm] = useState({
    boundaryStatus: boundariesDraft?.boundaryStatus || "",
    coordinatesX:
      boundariesDraft?.coordinates?.x ?? boundariesDraft?.coordinatesX ?? "",
    coordinatesY:
      boundariesDraft?.coordinates?.y ?? boundariesDraft?.coordinatesY ?? "",
    north: boundariesDraft?.north || "",
    south: boundariesDraft?.south || "",
    east: boundariesDraft?.east || "",
    west: boundariesDraft?.west || "",
    mapProvider: boundariesDraft?.mapProvider || "Google Map",
    landArea: boundariesDraft?.landArea ?? "",
    buildingArea: boundariesDraft?.buildingArea ?? "",
    approvedBufferArea: boundariesDraft?.approvedBufferArea ?? "",
    notes: boundariesDraft?.notes || "",
  });
  // تابع مشترک تغییر مقدار ورودی‌ها
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // اگر چک باکس بود
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    let newValue = value;
    // فیلتر ورودی‌ها بر اساس اسم فیلد
    if (["landArea", "buildingArea", "approvedBufferArea"].includes(name)) {
      newValue = filterIntegerInput(newValue);
    } else if (["coordinatesX", "coordinatesY"].includes(name)) {
      newValue = filterDecimalInput(newValue);
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };
  // باز کردن مودال
  const openMap = () => {
    setIsMapOpen(true);
  };
  // بسته شدن مودال
  const closeMap = () => {
    setIsMapOpen(false);
  };
  // تایید انتخاب نقشه
  const confirmMapSelection = (position) => {
    // مقدار را به رشته با 6 رقم اعشار می‌گذاریم (رشته برای کنترل ورودی)
    setForm((prev) => ({
      ...prev,
      coordinatesY:
        position.lat != null ? position.lat.toFixed(6) : prev.coordinatesY,
      coordinatesX:
        position.lng != null ? position.lng.toFixed(6) : prev.coordinatesX,
    }));
    closeMap();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      coordinates: {
        x:
          form.coordinatesX !== ""
            ? parseFloat(persianToEnglishDigits(String(form.coordinatesX)))
            : null,
        y:
          form.coordinatesY !== ""
            ? parseFloat(persianToEnglishDigits(String(form.coordinatesY)))
            : null,
      },
      landArea: form.landArea !== "" ? Number(form.landArea) : null,
      buildingArea: form.buildingArea !== "" ? Number(form.buildingArea) : null,
      approvedBufferArea:
        form.approvedBufferArea !== "" ? Number(form.approvedBufferArea) : null,
    };
    dispatch(setBoundaries(payload));
    next();
  };
  const handleBack = () => {
    // قبل از بازگشت، نسخهٔ رشته‌ای را هم ذخیره کنیم تا ورودی‌ها حفظ شوند
    dispatch(
      setBoundaries({
        ...form,
        coordinates: { x: form.coordinatesX, y: form.coordinatesY },
      })
    );
    back();
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
        loading: () => <p>در حال بارگذاری نقشه...</p>,
      }),
    []
  );

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 bg-gray-50 rounded-xl shadow-lg w-full max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-extrabold text-gray-800 border-b pb-3 mb-4">
          📍 اطلاعات حدود و موقعیت ملک
        </h2>
        {/* --- بخش 1: وضعیت و مرجع --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="وضعیت حدود" name="boundaryStatus" required>
            <select
              name="boundaryStatus"
              value={form.boundaryStatus}
              onChange={handleChange}
              className={inputBaseClasses}
              required
            >
              <option value="">انتخاب وضعیت</option>
              <option value="تحدید حدود شده">تحدید حدود شده</option>
              <option value="تحدید حدود نشده">تحدید حدود نشده</option>
            </select>
          </FormField>
          <FormField label="مرجع نقشه" name="mapProvider">
            <select
              name="mapProvider"
              value={form.mapProvider}
              onChange={handleChange}
              className={inputBaseClasses}
            >
              <option value="Google Map">Google Map</option>
              <option value="OpenStreetMap">OpenStreetMap</option>
              <option value="Sanad">سامانه ثبت</option>
            </select>
          </FormField>
        </div>
        {/* --- بخش 2: مختصات جغرافیایی (با دکمه نقشه) --- */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-blue-800">
              🌐 مختصات جغرافیایی (UTM/GPS)
            </h3>
            {/* دکمه باز کردن نقشه */}
            <button
              type="button"
              onClick={openMap}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-full transition shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              انتخاب از روی نقشه
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="مختصات X (طول جغرافیایی)" name="coordinatesX">
              {/* از type=text استفاده می‌کنیم تا کنترل کامل رشته و نگهداری کرسر داشته باشیم */}
              <input
                type="text"
                name="coordinatesX"
                inputMode="decimal"
                pattern="[0-9.,-]*"
                value={form.coordinatesX}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="مثلاً 51.4234"
                dir="ltr"
              />
            </FormField>
            <FormField label="مختصات Y (عرض جغرافیایی)" name="coordinatesY">
              <input
                type="text"
                name="coordinatesY"
                inputMode="decimal"
                pattern="[0-9.,-]*"
                value={form.coordinatesY}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="مثلاً 35.7890"
                dir="ltr"
              />
            </FormField>
          </div>
        </div>
        <div className="border-t border-gray-200 my-2"></div>
        {/* --- بخش 3: حدود اربعه --- */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-700">🧭 حدود اربعه</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="حد شمالی" name="north" icon="⬆️">
              <input
                name="north"
                value={form.north}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="مثلاً خیابان اصلی"
              />
            </FormField>
            <FormField label="حد جنوبی" name="south" icon="⬇️">
              <input
                name="south"
                value={form.south}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="مثلاً ملک مجاور"
              />
            </FormField>
            <FormField label="حد شرقی" name="east" icon="➡️">
              <input
                name="east"
                value={form.east}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="مثلاً دیوار مشترک"
              />
            </FormField>
            <FormField label="حد غربی" name="west" icon="⬅️">
              <input
                name="west"
                value={form.west}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="مثلاً کوچه"
              />
            </FormField>
          </div>
        </div>
        <div className="border-t border-gray-200 my-2"></div>
        {/* --- بخش 4: مساحت‌ها --- */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-700">📐 اطلاعات مساحت</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="مساحت عرصه (زمین)" name="landArea">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="landArea"
                value={form.landArea}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="متر مربع"
                dir="ltr"
              />
            </FormField>
            <FormField label="مساحت اعیان (بنا)" name="buildingArea">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="buildingArea"
                value={form.buildingArea}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="متر مربع"
                dir="ltr"
              />
            </FormField>
            <FormField label="حریم مصوب" name="approvedBufferArea">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="approvedBufferArea"
                value={form.approvedBufferArea}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="متر مربع"
                dir="ltr"
              />
            </FormField>
          </div>
        </div>
        {/* --- توضیحات --- */}
        <FormField label="توضیحات تکمیلی حدود" name="notes">
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className={inputBaseClasses}
            placeholder="هرگونه نکته..."
          />
        </FormField>
        {/* --- دکمه‌های ناوبری --- */}
        <div className="flex justify-between pt-6 border-t mt-6">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
          >
            ⬅️ قبلی
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
          >
            بعدی ➡️
          </button>
        </div>
      </form>
      {/* --- کامپوننت مودال نقشه جدا شده --- */}
      {/* فقط در کلاینت رندر شود */}
      {isMounted && isMapOpen && (
        <Map
          isOpen={isMapOpen}
          onClose={closeMap}
          onConfirm={confirmMapSelection}
          initialLat={form.coordinatesY || 0}
          initialLng={form.coordinatesX || 0}
          mapProvider={form.mapProvider}
        />
      )}
    </>
  );
}

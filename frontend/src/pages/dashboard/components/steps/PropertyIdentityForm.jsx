"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIdentity } from "@/redux/features/propertyDraftSlice";

// استایل پایه برای تمام ورودی‌ها و Select ها
const inputBaseClasses =
  "p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full bg-white text-gray-800 shadow-sm appearance-none";
// appearance-none برای Selectها ضروری است تا استایل‌های مرورگر را حذف کند و ظاهر یکنواخت شود.

export default function PropertyIdentityForm({ next, back }) {
  const dispatch = useDispatch();
  const identityDraft = useSelector((state) => state.propertyDraft.identity);

  const [form, setForm] = useState({
    structureType: "",
    administrativeDivision: "",
    title: "",
    populationCode: "",
    propertyType: "",
    usageType: "",
    previousUsage: "",
    notes: "",
  });

  const [enums, setEnums] = useState({
    structureType: [],
    administrativeDivision: [],
    propertyType: [],
    usageType: [],
    previousUsage: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // بارگذاری داده های قبلی Draft هنگام mount کردن
  useEffect(() => {
    if (identityDraft) {
      setForm(identityDraft);
    }
  }, [identityDraft]);

  // گرفتن enum ها از API
  useEffect(() => {
    async function fetchEnums() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/property-identity-enums");
        const data = await res.json();
        setEnums({
          structureType: data.structureType || [],
          administrativeDivision: data.administrativeDivision || [],
          propertyType: data.propertyType || [],
          usageType: data.usageType || [],
          previousUsage: data.previousUsage || [],
        });
      } catch (err) {
        console.error("خطا در دریافت enum ها:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEnums();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setIdentity(form));
    next();
  };

  const handleBack = () => {
    dispatch(setIdentity(form));
    back();
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-xl font-medium text-blue-600">
          در حال بارگذاری اطلاعات...
        </div>
      </div>
    );

  // یک کامپوننت کوچک برای ساختار دهی به ورودی
  const FormField = ({
    label,
    name,
    children,
    required = false,
    type = "text",
  }) => (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 pr-1">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-gray-50 rounded-xl shadow-lg w-full max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-extrabold text-gray-800 border-b pb-3 mb-4">
        🔍 اطلاعات شناسنامه‌ای ملک
      </h2>

      {/* ورودی‌ها و Select ها در چیدمان دو ستونی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* نوع ساختار */}
        <FormField label="نوع ساختار" name="structureType" required>
          <select
            name="structureType"
            value={form.structureType}
            onChange={handleChange}
            className={inputBaseClasses}
            required
          >
            <option value="">انتخاب کنید</option>
            {enums.structureType.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </FormField>

        {/* تقسیمات کشوری */}
        <FormField label="تقسیمات کشوری" name="administrativeDivision" required>
          <select
            name="administrativeDivision"
            value={form.administrativeDivision}
            onChange={handleChange}
            className={inputBaseClasses}
            required
          >
            <option value="">انتخاب کنید</option>
            {enums.administrativeDivision.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </FormField>

        {/* عنوان ملک */}
        <FormField label="عنوان ملک" name="title" required>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className={inputBaseClasses}
            placeholder="مثلاً آپارتمان شماره ۳"
            required
          />
        </FormField>

        {/* کد جمعیتی */}
        <FormField label="کد جمعیتی (اختیاری)" name="populationCode">
          <input
            type="number"
            name="populationCode"
            value={form.populationCode}
            onChange={handleChange}
            className={inputBaseClasses}
            placeholder="کد جمعیتی ملک"
          />
        </FormField>

        {/* نوع ملک */}
        <FormField label="نوع ملک" name="propertyType">
          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            className={inputBaseClasses}
          >
            <option value="">انتخاب کنید</option>
            {enums.propertyType.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </FormField>

        {/* نوع بهره‌برداری */}
        <FormField label="نوع بهره‌برداری (کاربری فعلی)" name="usageType">
          <select
            name="usageType"
            value={form.usageType}
            onChange={handleChange}
            className={inputBaseClasses}
          >
            <option value="">انتخاب کنید</option>
            {enums.usageType.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </FormField>

        {/* کاربری قبلی */}
        <FormField label="کاربری قبلی" name="previousUsage">
          <select
            name="previousUsage"
            value={form.previousUsage}
            onChange={handleChange}
            className={inputBaseClasses}
          >
            <option value="">انتخاب کنید</option>
            {enums.previousUsage.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* توضیحات (تمام عرض) */}
      <FormField label="توضیحات (اختیاری)" name="notes">
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className={inputBaseClasses}
          placeholder="توضیحات تکمیلی یا نکات خاص درباره ملک"
        />
      </FormField>

      {/* دکمه‌های ناوبری */}
      <div className="flex justify-between pt-6 border-t mt-6">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
        >
          ➡️ قبلی
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
        >
          بعدی ⬅️
        </button>
      </div>
    </form>
  );
}

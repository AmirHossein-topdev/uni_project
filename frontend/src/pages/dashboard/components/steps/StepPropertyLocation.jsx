"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "@/redux/features/propertyDraftSlice";
import { useGetLocationEnumsQuery } from "@/redux/features/locationApi";

// استایل پایه برای تمام ورودی‌ها و Select ها
const inputBaseClasses =
  "p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full bg-white text-gray-800 placeholder-gray-400 shadow-sm";

// کامپوننت FormField برای اضافه کردن لیبل بالای هر فیلد
const FormField = ({ label, name, children, required = false }) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-light text-gray-800">
      {label}
      {required && <span className="text-red-500 pr-1">*</span>}
    </label>
    {children}
  </div>
);

const StepPropertyLocation = ({ next, back }) => {
  const dispatch = useDispatch();
  const locationDraft = useSelector((s) => s.propertyDraft.location);

  const { data, isLoading } = useGetLocationEnumsQuery();

  const [form, setForm] = useState({
    province: "",
    city: "",
    county: "",
    district: "",
    village: "",
    ruralDistrict: "",
    region: "",
    neighborhood: "",
    mainStreet: "",
    subStreet: "",
    alley: "",
    postalCode: "",
    separatedPlate: "",
    mainPlate: "",
    subPlate: "",
    sectionPlate: "",
    pieceNumber: "",
    fullAddress: "",
  });

  /* Draft restore */
  useEffect(() => {
    if (locationDraft) setForm(locationDraft);
  }, [locationDraft]);

  const provinces = data?.provinces || [];
  const cities =
    form.province && data?.citiesByProvince?.[form.province]
      ? data.citiesByProvince[form.province]
      : [];

  // تابع کمکی برای تبدیل ارقام فارسی به انگلیسی
  const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(
      /[۰-۹]/g,
      (d) => englishDigits[persianDigits.indexOf(d)]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // برای فیلدهای عددی: فقط ارقام (فارسی یا انگلیسی) قبول کن و به انگلیسی تبدیل کن
    const numericFields = [
      "postalCode",
      "separatedPlate",
      "mainPlate",
      "subPlate",
      "plate",
      "sectionPlate",
      "pieceNumber",
    ];
    if (numericFields.includes(name)) {
      // فیلتر فقط ارقام (فارسی یا انگلیسی)
      newValue = newValue.replace(/[^۰-۹0-9]/g, "");
      // تبدیل به انگلیسی
      newValue = persianToEnglishDigits(newValue);
    }

    if (name === "province") {
      setForm((p) => ({ ...p, province: newValue, city: "" }));
      return;
    }

    setForm((p) => ({ ...p, [name]: newValue }));
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch(setLocation(form));
    next();
  };

  const goBack = () => {
    dispatch(setLocation(form));
    back();
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-xl font-medium text-blue-600">
          در حال بارگذاری...
        </div>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className="space-y-6 p-6 bg-gray-50 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-extrabold text-gray-800 border-b pb-3 mb-4">
        📍 موقعیت مکانی ملک
      </h2>

      {/* انتخاب استان و شهر (در یک سطر دو ستونه) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="استان" name="province" required>
          <select
            name="province"
            value={form.province}
            onChange={handleChange}
            required
            className={inputBaseClasses}
          >
            <option value="">انتخاب استان</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="شهر" name="city" required>
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            disabled={!cities.length}
            required
            className={`${inputBaseClasses} ${
              !cities.length ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          >
            <option value="">انتخاب شهر</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* آدرس‌های سطح بالاتر (3 ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="شهرستان" name="county">
          <input
            name="county"
            value={form.county}
            onChange={handleChange}
            placeholder="نام شهرستان"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="بخش" name="district">
          <input
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="نام بخش"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="دهستان" name="ruralDistrict">
          <input
            name="ruralDistrict"
            value={form.ruralDistrict}
            onChange={handleChange}
            placeholder="نام دهستان"
            className={inputBaseClasses}
          />
        </FormField>
      </div>

      {/* آدرس‌های محلی (3 ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="روستا" name="village">
          <input
            name="village"
            value={form.village}
            onChange={handleChange}
            placeholder="نام روستا"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="منطقه" name="region">
          <input
            name="region"
            value={form.region}
            onChange={handleChange}
            placeholder="نام منطقه"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="محله" name="neighborhood">
          <input
            name="neighborhood"
            value={form.neighborhood}
            onChange={handleChange}
            placeholder="نام محله"
            className={inputBaseClasses}
          />
        </FormField>
      </div>

      {/* جزئیات خیابان و کوچه (3 ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="خیابان اصلی" name="mainStreet">
          <input
            name="mainStreet"
            value={form.mainStreet}
            onChange={handleChange}
            placeholder="نام خیابان اصلی"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="خیابان فرعی" name="subStreet">
          <input
            name="subStreet"
            value={form.subStreet}
            onChange={handleChange}
            placeholder="نام خیابان فرعی"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="کوچه" name="alley">
          <input
            name="alley"
            value={form.alley}
            onChange={handleChange}
            placeholder="نام کوچه"
            className={inputBaseClasses}
          />
        </FormField>
      </div>

      {/*  پلاک و کد پستی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="پلاک" name="plate">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="plate"
            value={form.plate}
            onChange={handleChange}
            placeholder="پلاک"
            className={inputBaseClasses}
          />
        </FormField>
        <FormField label="کد پستی" name="postalCode">
          <input
            name="postalCode"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.postalCode}
            onChange={handleChange}
            maxLength={10}
            placeholder="مثلاً ۱۲۳۴۵۶۷۸۹۰"
            className={inputBaseClasses}
          />
        </FormField>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 pt-4 border-t mt-6">
        🔢 جزئیات ثبتی ملک (اختیاری)
      </h3>

      {/* پلاک‌ها و قطعه (3 ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="پلاک اصلی" name="mainPlate">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="mainPlate"
            value={form.mainPlate}
            onChange={handleChange}
            placeholder="مثلاً ۱۲۳"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="پلاک فرعی" name="subPlate">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="subPlate"
            value={form.subPlate}
            onChange={handleChange}
            placeholder="مثلاً ۴۵"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="پلاک تفکیکی" name="separatedPlate">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="separatedPlate"
            value={form.separatedPlate}
            onChange={handleChange}
            placeholder="مثلاً ۶۷۸"
            className={inputBaseClasses}
          />
        </FormField>
      </div>

      {/* شماره قطعه و ... (2 ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="قطعه" name="sectionPlate">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="sectionPlate"
            value={form.sectionPlate}
            onChange={handleChange}
            placeholder="مثلاً ۹۰"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="شماره قطعه" name="pieceNumber">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="pieceNumber"
            value={form.pieceNumber}
            onChange={handleChange}
            placeholder="مثلاً ۱۰۱"
            className={inputBaseClasses}
          />
        </FormField>
      </div>

      {/* آدرس کامل (تمام عرض) */}
      <FormField label="آدرس کامل" name="fullAddress">
        <textarea
          name="fullAddress"
          value={form.fullAddress}
          onChange={handleChange}
          placeholder="مثلاً طبقه، واحد، توضیحات تکمیلی"
          rows={3}
          className={inputBaseClasses}
        />
      </FormField>

      {/* دکمه‌های ناوبری */}
      <div className="flex justify-between pt-6 border-t mt-6">
        <button
          type="button"
          onClick={goBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
        >
          ➡️ قبلی
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold  rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
        >
          بعدی ⬅️
        </button>
      </div>
    </form>
  );
};

export default StepPropertyLocation;

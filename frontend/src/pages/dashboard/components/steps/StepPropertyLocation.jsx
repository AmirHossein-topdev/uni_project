"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "@/redux/features/propertyDraftSlice";
import { useGetLocationEnumsQuery } from "@/redux/features/locationApi";

// استایل پایه برای تمام ورودی‌ها و Select ها
const inputBaseClasses =
  "p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full bg-white text-gray-800 placeholder-gray-500 shadow-sm";

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "province") {
      setForm((p) => ({ ...p, province: value, city: "" }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
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
      </div>

      {/* آدرس‌های سطح بالاتر (3 ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="county"
          value={form.county}
          onChange={handleChange}
          placeholder="شهرستان"
          className={inputBaseClasses}
        />
        <input
          name="district"
          value={form.district}
          onChange={handleChange}
          placeholder="بخش"
          className={inputBaseClasses}
        />
        <input
          name="ruralDistrict"
          value={form.ruralDistrict}
          onChange={handleChange}
          placeholder="دهستان"
          className={inputBaseClasses}
        />
      </div>

      {/* آدرس‌های محلی (3 ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="village"
          value={form.village}
          onChange={handleChange}
          placeholder="روستا"
          className={inputBaseClasses}
        />
        <input
          name="region"
          value={form.region}
          onChange={handleChange}
          placeholder="منطقه"
          className={inputBaseClasses}
        />
        <input
          name="neighborhood"
          value={form.neighborhood}
          onChange={handleChange}
          placeholder="محله"
          className={inputBaseClasses}
        />
      </div>

      {/* جزئیات خیابان و کوچه (3 ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="mainStreet"
          value={form.mainStreet}
          onChange={handleChange}
          placeholder="خیابان اصلی"
          className={inputBaseClasses}
        />
        <input
          name="subStreet"
          value={form.subStreet}
          onChange={handleChange}
          placeholder="خیابان فرعی"
          className={inputBaseClasses}
        />
        <input
          name="alley"
          value={form.alley}
          onChange={handleChange}
          placeholder="کوچه"
          className={inputBaseClasses}
        />
      </div>

      {/* کد پستی */}
      <input
        name="postalCode"
        value={form.postalCode}
        onChange={handleChange}
        maxLength={10}
        placeholder="کد پستی"
        className={inputBaseClasses}
      />

      <h3 className="text-xl font-semibold text-gray-700 pt-4 border-t mt-6">
        🔢 جزئیات ثبتی ملک (اختیاری)
      </h3>

      {/* پلاک‌ها و قطعه (3 ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="mainPlate"
          value={form.mainPlate}
          onChange={handleChange}
          placeholder="پلاک اصلی"
          className={inputBaseClasses}
        />
        <input
          name="subPlate"
          value={form.subPlate}
          onChange={handleChange}
          placeholder="پلاک فرعی"
          className={inputBaseClasses}
        />
        <input
          name="separatedPlate"
          value={form.separatedPlate}
          onChange={handleChange}
          placeholder="پلاک تفکیکی"
          className={inputBaseClasses}
        />
      </div>

      {/* شماره قطعه و ... (2 ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="sectionPlate"
          value={form.sectionPlate}
          onChange={handleChange}
          placeholder="قطعه"
          className={inputBaseClasses}
        />
        <input
          name="pieceNumber"
          value={form.pieceNumber}
          onChange={handleChange}
          placeholder="شماره قطعه"
          className={inputBaseClasses}
        />
      </div>

      {/* آدرس کامل (تمام عرض) */}
      <textarea
        name="fullAddress"
        value={form.fullAddress}
        onChange={handleChange}
        placeholder="آدرس کامل (مثلاً طبقه، واحد، توضیحات تکمیلی)"
        rows={3}
        className={inputBaseClasses}
      />

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

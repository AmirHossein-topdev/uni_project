"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "@/redux/features/propertyDraftSlice";
import { useGetLocationEnumsQuery } from "@/redux/features/locationApi";
import {
  MapPin,
  Navigation,
  Map as MapIcon,
  Home,
  Hash,
  Binary,
  ChevronLeft,
  ChevronRight,
  Milestone,
} from "lucide-react";

const inputClasses =
  "w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white/50 text-slate-700 shadow-sm transition-all duration-300 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 font-medium";

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6 mt-4">
    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-sm">
      <Icon size={22} />
    </div>
    <h3 className="text-lg font-black text-slate-800 tracking-tight">
      {title}
    </h3>
    <div className="flex-1 h-px bg-gradient-to-r from-slate-100 to-transparent"></div>
  </div>
);

const FormField = ({ label, name, children, required = false }) => (
  <div className="flex flex-col space-y-2 group">
    <label
      htmlFor={name}
      className="text-sm font-bold text-slate-600 px-1 transition-colors group-focus-within:text-blue-600"
    >
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <div className="relative">{children}</div>
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
    plate: "",
    fullAddress: "",
  });

  useEffect(() => {
    if (locationDraft) setForm(locationDraft);
  }, [locationDraft]);

  const provinces = data?.provinces || [];
  const cities =
    form.province && data?.citiesByProvince?.[form.province]
      ? data.citiesByProvince[form.province]
      : [];

  const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str
      .toString()
      .replace(/[۰-۹]/g, (d) => englishDigits[persianDigits.indexOf(d)]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

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
      newValue = newValue.replace(/[^۰-۹0-9]/g, "");
      newValue = persianToEnglishDigits(newValue);
    }

    setForm((prev) => {
      let updated;

      if (name === "province") {
        updated = { ...prev, province: newValue, city: "" };
      } else {
        updated = { ...prev, [name]: newValue };
      }

      // همزمان آپدیت Redux
      dispatch(setLocation(updated));

      return updated;
    });
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch(setLocation(form));
    next();
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold tracking-tight animate-pulse">
          در حال فراخوانی اطلاعات...
        </p>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-4xl mx-auto bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/60 space-y-8"
    >
      <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-100 text-white">
          <MapPin size={28} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          📍 موقعیت مکانی ملک
        </h2>
      </div>

      {/* بخش ۱: تقسیمات کشوری */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="استان" name="province" required>
          <select
            name="province"
            value={form.province}
            onChange={handleChange}
            required
            className={inputClasses}
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
            className={`${inputClasses} ${
              !cities.length ? "bg-slate-100 opacity-60" : ""
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="شهرستان" name="county">
          <input
            name="county"
            value={form.county}
            onChange={handleChange}
            placeholder="نام شهرستان"
            className={inputClasses}
          />
        </FormField>
        <FormField label="بخش" name="district">
          <input
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="نام بخش"
            className={inputClasses}
          />
        </FormField>
        <FormField label="دهستان" name="ruralDistrict">
          <input
            name="ruralDistrict"
            value={form.ruralDistrict}
            onChange={handleChange}
            placeholder="نام دهستان"
            className={inputClasses}
          />
        </FormField>
      </div>

      {/* بخش ۲: آدرس محلی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="روستا" name="village">
          <input
            name="village"
            value={form.village}
            onChange={handleChange}
            placeholder="نام روستا"
            className={inputClasses}
          />
        </FormField>
        <FormField label="منطقه" name="region">
          <input
            name="region"
            value={form.region}
            onChange={handleChange}
            placeholder="نام منطقه"
            className={inputClasses}
          />
        </FormField>
        <FormField label="محله" name="neighborhood">
          <input
            name="neighborhood"
            value={form.neighborhood}
            onChange={handleChange}
            placeholder="نام محله"
            className={inputClasses}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="خیابان اصلی" name="mainStreet">
          <input
            name="mainStreet"
            value={form.mainStreet}
            onChange={handleChange}
            placeholder="نام خیابان اصلی"
            className={inputClasses}
          />
        </FormField>
        <FormField label="خیابان فرعی" name="subStreet">
          <input
            name="subStreet"
            value={form.subStreet}
            onChange={handleChange}
            placeholder="نام خیابان فرعی"
            className={inputClasses}
          />
        </FormField>
        <FormField label="کوچه" name="alley">
          <input
            name="alley"
            value={form.alley}
            onChange={handleChange}
            placeholder="نام کوچه"
            className={inputClasses}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="پلاک" name="plate">
          <input
            name="plate"
            type="text"
            inputMode="numeric"
            value={form.plate}
            onChange={handleChange}
            placeholder="پلاک"
            className={inputClasses}
          />
        </FormField>
        <FormField label="کد پستی" name="postalCode">
          <input
            name="postalCode"
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={form.postalCode}
            onChange={handleChange}
            placeholder="۱۰ رقم"
            className={inputClasses}
          />
        </FormField>
      </div>

      {/* بخش ۳: جزئیات ثبتی */}
      <section className="pt-6 border-t border-slate-100">
        <SectionTitle icon={Binary} title="🔢 جزئیات ثبتی ملک (اختیاری)" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="پلاک اصلی" name="mainPlate">
            <input
              name="mainPlate"
              type="text"
              inputMode="numeric"
              value={form.mainPlate}
              onChange={handleChange}
              placeholder="۱۲۳"
              className={inputClasses}
            />
          </FormField>
          <FormField label="پلاک فرعی" name="subPlate">
            <input
              name="subPlate"
              type="text"
              inputMode="numeric"
              value={form.subPlate}
              onChange={handleChange}
              placeholder="۴۵"
              className={inputClasses}
            />
          </FormField>
          <FormField label="پلاک تفکیکی" name="separatedPlate">
            <input
              name="separatedPlate"
              type="text"
              inputMode="numeric"
              value={form.separatedPlate}
              onChange={handleChange}
              placeholder="۶۷۸"
              className={inputClasses}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FormField label="قطعه" name="sectionPlate">
            <input
              name="sectionPlate"
              type="text"
              inputMode="numeric"
              value={form.sectionPlate}
              onChange={handleChange}
              placeholder="۹۰"
              className={inputClasses}
            />
          </FormField>
          <FormField label="شماره قطعه" name="pieceNumber">
            <input
              name="pieceNumber"
              type="text"
              inputMode="numeric"
              value={form.pieceNumber}
              onChange={handleChange}
              placeholder="۱۰۱"
              className={inputClasses}
            />
          </FormField>
        </div>
      </section>

      <FormField label="آدرس کامل" name="fullAddress">
        <textarea
          name="fullAddress"
          value={form.fullAddress}
          onChange={handleChange}
          rows={3}
          className={`${inputClasses} resize-none`}
          placeholder="طبقه، واحد و..."
        />
      </FormField>

      <div className="flex justify-between pt-8 border-t border-slate-100 mt-10">
        <button
          type="button"
          onClick={back}
          className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95"
        >
          <ChevronRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />{" "}
          قبلی
        </button>
        <button
          type="submit"
          className="group flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95"
        >
          بعدی{" "}
          <ChevronLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
        </button>
      </div>
    </form>
  );
};

export default StepPropertyLocation;

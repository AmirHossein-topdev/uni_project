"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIdentity } from "@/redux/features/propertyDraftSlice";
import {
  Search,
  Building2,
  MapPin,
  Tag,
  Users,
  Briefcase,
  History,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// استایل‌های امضای سبک X1
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

  useEffect(() => {
    if (identityDraft) {
      setForm(identityDraft);
    }
  }, [identityDraft]);

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

  const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str
      .toString()
      .replace(/[۰-۹]/g, (d) => englishDigits[persianDigits.indexOf(d)]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (["populationCode"].includes(name)) {
      newValue = newValue.replace(/[^۰-۹0-9]/g, "");
      newValue = persianToEnglishDigits(newValue);
    }

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // ⭐ همزمان آپدیت Redux
      dispatch(setIdentity(updated));

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setIdentity(form));
    next();
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold tracking-tight animate-pulse">
          در حال فراخوانی شناسنامه ملک...
        </p>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/60 space-y-10"
    >
      {/* هدر فرم X1 */}
      <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-100 text-white">
          <Search size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            شناسنامه فنی و کاربری
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            جزئیات ساختاری و نوع بهره‌برداری ملک را تکمیل کنید
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* بخش اول: اطلاعات ساختاری */}
        <section>
          <SectionTitle icon={Building2} title="مشخصات ساختاری و اداری" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField label="عنوان ملک" name="title" required>
              <div className="relative">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="نام یا عنوان شناسایی ملک"
                  required
                />
                <Tag
                  className="absolute left-4 top-3.5 text-slate-300"
                  size={18}
                />
              </div>
            </FormField>

            <FormField label="نوع ساختار" name="structureType" required>
              <select
                name="structureType"
                value={form.structureType}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">انتخاب کنید...</option>
                {enums.structureType.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="تقسیمات کشوری"
              name="administrativeDivision"
              required
            >
              <div className="relative">
                <select
                  name="administrativeDivision"
                  value={form.administrativeDivision}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                >
                  <option value="">انتخاب منطقه...</option>
                  {enums.administrativeDivision.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
                <MapPin
                  className="absolute left-4 top-3.5 text-slate-300 pointer-events-none"
                  size={18}
                />
              </div>
            </FormField>

            <FormField label="کد جمعیتی (اختیاری)" name="populationCode">
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  name="populationCode"
                  value={form.populationCode}
                  onChange={handleChange}
                  className={inputClasses}
                  maxLength={10}
                  placeholder="کد ۱۰ رقمی"
                />
                <Users
                  className="absolute left-4 top-3.5 text-slate-300"
                  size={18}
                />
              </div>
            </FormField>
          </div>
        </section>

        {/* بخش دوم: نوع کاربری */}
        <section className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
          <SectionTitle icon={Briefcase} title="کاربری و بهره‌برداری" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField label="نوع ملک" name="propertyType">
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">انتخاب کنید...</option>
                {enums.propertyType.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="نوع بهره‌برداری (فعلی)" name="usageType">
              <select
                name="usageType"
                value={form.usageType}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">انتخاب کاربری...</option>
                {enums.usageType.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="کاربری قبلی" name="previousUsage">
              <div className="relative">
                <select
                  name="previousUsage"
                  value={form.previousUsage}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">انتخاب کاربری قبلی...</option>
                  {enums.previousUsage.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
                <History
                  className="absolute left-4 top-3.5 text-slate-300 pointer-events-none"
                  size={18}
                />
              </div>
            </FormField>
          </div>
        </section>

        {/* بخش سوم: توضیحات تکمیلی */}
        <section>
          <SectionTitle icon={FileText} title="یادداشت‌ها" />
          <FormField label="توضیحات تکمیلی" name="notes">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              className={`${inputClasses} resize-none`}
              placeholder="هرگونه نکته یا توضیح فنی که باید در شناسنامه ملک ثبت شود..."
            />
          </FormField>
        </section>
      </div>

      {/* دکمه‌های ناوبری X1 */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-10">
        <button
          type="button"
          onClick={back}
          className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
        >
          <ChevronRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
          مرحله قبلی
        </button>

        <button
          type="submit"
          className="group flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95"
        >
          ثبت و مرحله بعدی
          <ChevronLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
        </button>
      </div>
    </form>
  );
}

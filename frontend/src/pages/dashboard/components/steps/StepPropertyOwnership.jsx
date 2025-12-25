"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOwnership } from "@/redux/features/propertyDraftSlice";
import { useCallback } from "react";
import {
  User,
  ShieldCheck,
  History,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// استایل پیشرفته اینپوت‌ها
const inputClasses =
  "w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white/50 text-slate-700 shadow-sm transition-all duration-300 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 font-medium";

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-5 mt-2">
    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
      <Icon size={20} />
    </div>
    <h3 className="text-md font-bold text-slate-800">{title}</h3>
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

export default function StepPropertyOwnership({ next, back }) {
  const dispatch = useDispatch();
  const ownershipDraft = useSelector((state) => state.propertyDraft.ownership);

  const [form, setForm] = useState({});
  const [enums, setEnums] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEnums() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/property-ownership-enums");
        const data = await res.json();
        setEnums(data);

        const initialForm = {
          ownerName: ownershipDraft?.ownerName || "",
          dispute: ownershipDraft?.dispute || "",
          ownerType: ownershipDraft?.ownerType || data.ownerType[0] || "",
          ownershipStatus:
            ownershipDraft?.ownershipStatus || data.ownershipStatus[0] || "",
          ownershipAmount: ownershipDraft?.ownershipAmount || "",
          ownershipConfirmedStatus:
            ownershipDraft?.ownershipConfirmedStatus ||
            data.ownershipConfirmedStatus[0] ||
            "",
          possessorType:
            ownershipDraft?.possessorType || data.possessorType[0] || "",
          possessorName: ownershipDraft?.possessorName || "",
          possessionYear: ownershipDraft?.possessionYear || "",
          possessionReason:
            ownershipDraft?.possessionReason || data.possessionReason[0] || "",
          disputeParty:
            ownershipDraft?.disputeParty || data.disputeParty[0] || "",
          disputePossessorName: ownershipDraft?.disputePossessorName || "",
        };
        setForm(initialForm);
      } catch (err) {
        console.error("خطا در بارگذاری enumها:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEnums();
  }, [ownershipDraft]);

  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      if (dataset.group) {
        return {
          ...prev,
          [dataset.group]: {
            ...prev[dataset.group],
            [name]: newValue,
          },
        };
      } else {
        return {
          ...prev,
          [name]: newValue,
        };
      }
    });
  };

  // ذخیره در Redux وقتی input blur شد
  const handleBlur = () => {
    dispatch(setOwnership(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setOwnership(form));
    next();
  };

  const handleBack = () => {
    dispatch(setOwnership(form));
    back();
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">
          در حال فراخوانی اطلاعات...
        </p>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/60 space-y-10"
    >
      {/* هدر بخش */}
      <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-100 text-white">
          <User size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            اطلاعات مالکیت
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            مشخصات قانونی و وضعیت تصرف ملک را وارد نمایید
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {/* بخش اول: اطلاعات مالک */}
        <section>
          <SectionTitle icon={ShieldCheck} title="مشخصات مالک اصلی" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField label="نام کامل مالک" name="ownerName" required>
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses}
                placeholder="مثال: محمد محمدی"
                required
              />
            </FormField>

            <FormField label="نوع مالک" name="ownerType" required>
              <select
                name="ownerType"
                value={form.ownerType}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses}
                required
              >
                {enums.ownerType?.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="وضعیت سند" name="ownershipStatus" required>
              <select
                name="ownershipStatus"
                value={form.ownershipStatus}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses}
                required
              >
                {enums.ownershipStatus?.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="وضعیت تثبیت مالکیت"
              name="ownershipConfirmedStatus"
            >
              <select
                name="ownershipConfirmedStatus"
                value={form.ownershipConfirmedStatus}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses}
              >
                {enums.ownershipConfirmedStatus?.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="میزان سهم (دانگ)" name="ownershipAmount">
              <input
                name="ownershipAmount"
                value={form.ownershipAmount}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses}
                placeholder="مثلاً: ۶ دانگ تمام"
              />
            </FormField>
          </div>
        </section>

        {/* بخش دوم: وضعیت تصرف */}
        <section className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
          <SectionTitle icon={History} title="سابقه و وضعیت تصرف" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField label="نوع متصرف فعلی" name="possessorType">
              <select
                name="possessorType"
                value={form.possessorType}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses}
              >
                {enums.possessorType?.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="نام متصرف" name="possessorName">
              <input
                name="possessorName"
                value={form.possessorName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses}
                placeholder="نام شخص یا نهاد"
              />
            </FormField>

            <FormField label="سال شروع تصرف" name="possessionYear">
              <input
                name="possessionYear"
                type="number"
                value={form.possessionYear}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses}
                placeholder="۱۳۸۰"
              />
            </FormField>

            <FormField label="علت تصرف" name="possessionReason">
              <select
                name="possessionReason"
                value={form.possessionReason}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses}
              >
                {enums.possessionReason?.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="معارض" name="dispute">
              <select
                name="dispute"
                value={form.dispute}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses}
              >
                {enums.dispute?.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </section>

        {/* بخش سوم: اختلافات حقوقی */}
        {form.dispute !== "ندارد" && (
          <section>
            <SectionTitle icon={AlertCircle} title="وضعیت اختلافات" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField label="طرف اختلاف حقوقی" name="disputeParty">
                <select
                  name="disputeParty"
                  value={form.disputeParty}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClasses}
                >
                  {enums.disputeParty?.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="نام طرف اختلاف" name="disputePossessorName">
                <input
                  name="disputePossessorName"
                  value={form.disputePossessorName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClasses}
                  placeholder="نام مدعی"
                />
              </FormField>
            </div>
          </section>
        )}
      </div>

      {/* دکمه‌های ناوبری */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-10">
        <button
          type="button"
          onClick={handleBack}
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

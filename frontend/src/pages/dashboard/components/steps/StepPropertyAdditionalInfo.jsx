"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  resetDraft,
  setAdditionalInfo,
} from "@/redux/features/propertyDraftSlice";
import {
  Info,
  Building2,
  Calendar,
  Hash,
  Zap,
  Droplets,
  Flame,
  Wind,
  ShieldCheck,
  AlertTriangle,
  TreePine,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Layers,
  Router,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// استایل‌های امضای سبک X1
const inputClasses =
  "w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white/50 text-slate-700 shadow-sm transition-all duration-300 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 font-medium";

const checkboxClasses =
  "w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer";

const FormField = ({ label, name, children, required = false, icon: Icon }) => (
  <div className="flex flex-col space-y-2 group">
    <label
      htmlFor={name}
      className="text-sm font-bold text-slate-600 px-1 transition-colors group-focus-within:text-blue-600 flex items-center gap-2"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {children}
      {Icon && (
        <Icon
          className="absolute left-4 top-3.5 text-slate-300 pointer-events-none"
          size={18}
        />
      )}
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg shadow-indigo-100 text-white">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-lg font-black text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
    </div>
  </div>
);

export default function StepPropertyAdditionalInfo({ next, back }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const draft = useSelector((state) => state.propertyDraft);

  const additionalDraft = useSelector(
    (state) => state.propertyDraft.additionalInfo
  );

  const [form, setForm] = useState({});
  const [enums, setEnums] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEnums() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/property-additional-enums");
        const data = await res.json();
        setEnums(data);

        const initialForm = {
          buildingArea: additionalDraft?.buildingArea || "",
          landArea: additionalDraft?.landArea || "",
          constructionYear: additionalDraft?.constructionYear || "",
          description: additionalDraft?.description || "",
          numberOfBuildings: additionalDraft?.numberOfBuildings || "",
          subscriptionNumber: additionalDraft?.subscriptionNumber || "",
          securityCouncilApproved:
            additionalDraft?.securityCouncilApproved || "",
          securityLevel: additionalDraft?.securityLevel || "",
          potentialThreats: additionalDraft?.potentialThreats || "",
          environmentValue: additionalDraft?.environmentValue || "",
          notes: additionalDraft?.notes || "",
          utilities: {
            electricity: additionalDraft?.utilities?.electricity || false,
            water: additionalDraft?.utilities?.water || false,
            gas: additionalDraft?.utilities?.gas || false,
            sewage: additionalDraft?.utilities?.sewage || false,
            otherUtilities: additionalDraft?.utilities?.otherUtilities || "",
          },
        };
        setForm(initialForm);
      } catch (err) {
        console.error("خطا در دریافت اطلاعات اولیه:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEnums();
  }, [additionalDraft]);

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
    dispatch(setAdditionalInfo(form));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ذخیره آخرین مرحله در draft
    dispatch(setAdditionalInfo(form));

    const cleanLegalStatus = { ...(draft.legalStatus || {}) };

    if (!cleanLegalStatus.ordinaryDocumentType) {
      delete cleanLegalStatus.ordinaryDocumentType;
    }

    if (!cleanLegalStatus.noDocumentType) {
      delete cleanLegalStatus.noDocumentType;
    }

    const payload = {
      status: {
        ...draft.status,
        propertyIdCode: String(draft.status?.propertyIdCode || uuidv4()), // به String تبدیل کن
        propertyNumber: draft.status?.propertyNumber || 0,
      },
      identity: draft.identity || {},
      location: draft.location || {},
      legalStatus: cleanLegalStatus,
      ownership: draft.ownership || {},
      boundaries: draft.boundaries || {},
      additionalInfo: form || {},
    };

    console.log("📦 Payload ارسال‌شده به بک‌اند:", payload);
    console.log("Draft قبل از ارسال:", draft);

    try {
      const res = await fetch("http://localhost:7000/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("❌ پاسخ JSON نیست:", jsonErr);
      }

      console.log("📨 Response status:", res.status);
      console.log("📨 Response data:", data);

      if (!res.ok) {
        // اگر خطای مدل Mongoose بود، لاگ کامل را هم چاپ کن
        console.error("🛑 خطای سرور:", data?.error || "Unknown server error");
        throw new Error(data?.error || "خطای نامشخص از سرور");
      }

      // موفقیت
      dispatch(resetDraft());

      await Swal.fire({
        icon: "success",
        title: "ثبت موفق",
        text: "ملک با موفقیت در سامانه ثبت شد",
        confirmButtonText: "باشه",
      });

      router.push("/dashboard/main/properties");
      // در صورت نیاز به ریدایرکت
      // router.push(`/properties/${data.propertyId}`);
    } catch (err) {
      console.error("🔥 خطا در ثبت ملک:", err);

      await Swal.fire({
        icon: "error",
        title: "ثبت ناموفق",
        text: err.message || "ثبت اطلاعات انجام نشد",
        confirmButtonText: "باشه",
      });
    }
  };

  const handleBack = () => {
    dispatch(setAdditionalInfo(form));
    back();
  };

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <span className="text-slate-500 font-bold animate-pulse">
          در حال آماده‌سازی فرم...
        </span>
      </div>
    );

  // ترجمه انشعابات برای نمایش
  const utilityLabels = {
    electricity: { label: "برق", icon: Zap, color: "text-yellow-500" },
    water: { label: "آب", icon: Droplets, color: "text-blue-500" },
    gas: { label: "گاز", icon: Flame, color: "text-orange-500" },
    sewage: { label: "فاضلاب", icon: Wind, color: "text-emerald-500" },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/60 space-y-12"
    >
      <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 text-white">
          <Info size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            اطلاعات تکمیلی ملک
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            جزئیات فنی، انشعابات و سطوح حفاظتی
          </p>
        </div>
      </div>

      {/* بخش ۱: مشخصات فنی */}
      <section>
        <SectionHeader
          icon={Layers}
          title="مشخصات ساختمانی"
          subtitle="متراژ و اطلاعات فیزیکی بنا"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            label="متراژ بنا (متر مربع)"
            name="buildingArea"
            icon={Building2}
          >
            <input
              type="number"
              name="buildingArea"
              value={form.buildingArea}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses}
              placeholder="120"
            />
          </FormField>
          <FormField label="متراژ زمین (متر مربع)" name="landArea">
            <input
              type="number"
              name="landArea"
              value={form.landArea}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses}
              placeholder="200"
            />
          </FormField>
          <FormField label="سال ساخت" name="constructionYear" icon={Calendar}>
            <input
              type="number"
              name="constructionYear"
              value={form.constructionYear}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses}
              placeholder="1400"
            />
          </FormField>
          <FormField label="تعداد ساختمان" name="numberOfBuildings">
            <input
              type="number"
              name="numberOfBuildings"
              value={form.numberOfBuildings}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses}
              placeholder="1"
            />
          </FormField>
          <FormField label="شماره اشتراک" name="subscriptionNumber" icon={Hash}>
            <input
              type="text"
              name="subscriptionNumber"
              value={form.subscriptionNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses}
            />
          </FormField>
        </div>
      </section>

      {/* بخش ۲: انشعابات */}
      <section className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
        <SectionHeader
          icon={Zap}
          title="وضعیت انشعابات"
          subtitle="امکانات و زیرساخت‌های متصل"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(utilityLabels).map(
            ([key, { label, icon: Icon, color }]) => (
              <label
                key={key}
                className="relative flex flex-col items-center p-4 bg-white rounded-2xl border-2 border-transparent hover:border-blue-200 transition-all cursor-pointer group shadow-sm"
              >
                <input
                  type="checkbox"
                  name={key}
                  data-group="utilities"
                  checked={form.utilities?.[key] || false}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="absolute top-3 right-3 w-5 h-5 rounded-md border-2 border-slate-200 text-blue-600 focus:ring-blue-500"
                />
                <Icon
                  size={32}
                  className={`${color} mb-2 transition-transform group-hover:scale-110`}
                />
                <span className="text-sm font-bold text-slate-700">
                  {label}
                </span>
              </label>
            )
          )}
        </div>
        <FormField label="سایر انشعابات و توضیحات" name="otherUtilities">
          <input
            type="text"
            name="otherUtilities"
            data-group="utilities"
            value={form.utilities?.otherUtilities || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses}
            placeholder="مثلاً فیبر نوری، چاه عمیق و..."
          />
        </FormField>
      </section>

      {/* بخش ۳: سطوح حفاظتی */}
      <section>
        <SectionHeader
          icon={ShieldCheck}
          title="امنیت و حفاظت"
          subtitle="رده‌بندی‌های حفاظتی و تهدیدات"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FormField
            label="رده حفاظتی (شورای امنیت کشور)"
            name="securityCouncilApproved"
          >
            <select
              name="securityCouncilApproved"
              value={form.securityCouncilApproved}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses}
            >
              <option value="">انتخاب کنید</option>
              {enums.securityCouncilApproved?.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="سطح حفاظتی" name="securityLevel">
            <select
              name="securityLevel"
              value={form.securityLevel}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses}
            >
              <option value="">انتخاب کنید</option>
              {enums.securityLevel?.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="تهدیدات و آسیب‌پذیری‌ها"
            name="potentialThreats"
            icon={AlertTriangle}
          >
            <input
              type="text"
              name="potentialThreats"
              value={form.potentialThreats}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses}
            />
          </FormField>
          <FormField
            label="ارزشمندی محیط"
            name="environmentValue"
            icon={TreePine}
          >
            <input
              type="text"
              name="environmentValue"
              value={form.environmentValue}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses}
            />
          </FormField>
        </div>
      </section>

      {/* توضیحات نهایی */}
      <FormField label="توضیحات تکمیلی" name="notes" icon={FileText}>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          className={`${inputClasses} resize-none`}
          placeholder="هرگونه توضیح یا مورد خاص دیگر را در اینجا بنویسید..."
        />
      </FormField>

      {/* ناوبری */}
      <div className="flex justify-between pt-10 border-t border-slate-100">
        <button
          type="button"
          onClick={handleBack}
          className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95"
        >
          <ChevronRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
          مرحله قبل
        </button>
        <button
          type="submit"
          className="group flex items-center gap-2 px-10 py-3.5 rounded-2xl 
             bg-gradient-to-r from-emerald-600 to-green-600 
             text-white font-bold shadow-xl shadow-green-200 
             hover:shadow-green-300 transition-all active:scale-95"
        >
          ثبت نهایی
          <ChevronLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
        </button>
      </div>
    </form>
  );
}

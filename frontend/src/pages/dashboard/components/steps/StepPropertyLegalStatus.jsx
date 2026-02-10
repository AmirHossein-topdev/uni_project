"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLegalStatus } from "../../../../redux/features/propertyDraftSlice";
import {
  Scale,
  FileText,
  Fingerprint,
  Calendar,
  Hash,
  Layers,
  Maximize,
  User,
  UserCheck,
  Share2,
  UploadCloud,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
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

const FormField = ({ label, name, children, required = false, icon: Icon }) => (
  <div className="flex flex-col space-y-2 group">
    <label
      htmlFor={name}
      className="text-sm font-bold text-slate-600 px-1 transition-colors group-focus-within:text-blue-600"
    >
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
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

export default function StepPropertyLegalStatus({ next, back }) {
  const dispatch = useDispatch();
  const draft = useSelector((s) => s.propertyDraft.legalStatus);

  const [form, setForm] = useState({
    property: draft?.property || undefined,
    legalStatus: draft?.legalStatus || "",
    officialDocumentType: draft?.officialDocumentType || "",
    ordinaryDocumentType: draft?.ordinaryDocumentType || "",
    noDocumentType: draft?.noDocumentType || "",
    definiteDocumentType: draft?.definiteDocumentType || "",
    nationalPropertyId: draft?.nationalPropertyId ?? "",
    sadaId: draft?.sadaId || "",
    registrationNumber: draft?.registrationNumber || "",
    registrationDate:
      draft?.registrationDate &&
      !isNaN(new Date(draft.registrationDate).getTime())
        ? new Date(draft.registrationDate).toISOString().slice(0, 10)
        : "",
    officeNumber: draft?.officeNumber || "",
    pageNumber: draft?.pageNumber || "",
    documentNumber: draft?.documentNumber || "",
    area: draft?.area ?? "",
    ownershipAmount: draft?.ownershipAmount || "",
    registrationSection: draft?.registrationSection || "",
    registrationPlate: draft?.registrationPlate || "",
    seller: draft?.seller || "",
    buyer: draft?.buyer || "",
    transferMethod: draft?.transferMethod || "",
    leadsToNewDeed: !!draft?.leadsToNewDeed,
    noDeedTransferDate: draft?.noDeedTransferDate
      ? new Date(draft.noDeedTransferDate).toISOString().slice(0, 10)
      : "",
    notes: draft?.notes || "",
    documentFile: draft?.documentFile || "",
    documentFileName: draft?.documentFileName || "",
  });

  const [enums, setEnums] = useState({
    legalStatus: [],
    officialDocumentType: [],
    definiteDocumentType: [],
    ordinaryDocumentType: [],
    noDocumentType: [],
    transferMethod: [],
  });
  const [loadingEnums, setLoadingEnums] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadEnums() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/enums/legal`,
        );
        if (!res.ok) throw new Error("failed to fetch enums");
        const data = await res.json();
        if (!mounted) return;
        setEnums({
          legalStatus: data.legalStatus || [],
          officialDocumentType: data.officialDocumentType || [],
          ordinaryDocumentType: data.ordinaryDocumentType || [],
          noDocumentType: data.noDocumentType || [],
          definiteDocumentType: data.definiteDocumentType || [],
          transferMethod: data.transferMethod || [],
        });
        console.log("====================================");
        console.log(data);
        console.log("====================================");
      } catch (err) {
        console.error("خطا در دریافت enumها:", err);
      } finally {
        if (mounted) setLoadingEnums(false);
      }
    }
    loadEnums();
    return () => {
      mounted = false;
    };
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
    const numericFields = ["nationalPropertyId", "area"];
    if (numericFields.includes(name)) {
      newValue = newValue.replace(/[^۰-۹0-9]/g, "");
      newValue = persianToEnglishDigits(newValue);
    }
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // ⭐ همزمان آپدیت Redux
      dispatch(setLegalStatus(updated));

      return updated;
    });
  };

  const handleJalaliDateChange = (e) => {
    const { name, value } = e.target;

    // فقط عدد
    let digits = value.replace(/\D/g, "").slice(0, 8);

    let formatted = digits;

    if (digits.length > 4) {
      formatted = digits.slice(0, 4) + "/" + digits.slice(4);
    }
    if (digits.length > 6) {
      formatted =
        digits.slice(0, 4) + "/" + digits.slice(4, 6) + "/" + digits.slice(6);
    }

    setForm((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,

      nationalPropertyId:
        form.nationalPropertyId !== ""
          ? Number(form.nationalPropertyId)
          : undefined,

      area: form.area !== "" ? Number(form.area) : undefined,

      registrationDate: form.registrationDate
        ? new Date(form.registrationDate)
        : undefined,

      noDeedTransferDate: form.noDeedTransferDate
        ? new Date(form.noDeedTransferDate)
        : undefined,
    };

    // ❌ حذف فیلدهای enum اگر خالی هستند
    if (!payload.ordinaryDocumentType) {
      delete payload.ordinaryDocumentType;
    }

    if (!payload.noDocumentType) {
      delete payload.noDocumentType;
    }

    dispatch(setLegalStatus(payload));
    next();
  };

  const handleBack = () => {
    dispatch(setLegalStatus({ ...form }));
    back();
  };

  if (loadingEnums) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold tracking-tight animate-pulse">
          در حال فراخوانی ضوابط قانونی...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/60 space-y-10"
    >
      {/* هدر فرم */}
      <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 text-white">
          <Scale size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            وضعیت حقوقی و اسناد
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            اطلاعات ثبتی و قانونی ملک را با دقت وارد کنید
          </p>
        </div>
      </div>
      <div className="space-y-12">
        {/* بخش ۱: نوع مالکیت */}
        <section>
          <SectionTitle icon={FileText} title="مشخصات سند" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="وضعیت کلی سند" name="legalStatus" required>
              <select
                name="legalStatus"
                value={form.legalStatus}
                onChange={handleChange}
                required
                className={inputClasses}
              >
                <option value="">انتخاب کنید</option>
                {enums.legalStatus.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </FormField>

            {/* فیلدهای شرطی سند */}
            {form.legalStatus === "سند رسمی" && (
              <FormField label="نوع سند رسمی" name="officialDocumentType">
                <select
                  name="officialDocumentType"
                  value={form.officialDocumentType}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">انتخاب نوع سند...</option>
                  {enums.officialDocumentType.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            {/* فیلدهای شرطی سند */}
            {form.officialDocumentType === "سند قطعی" && (
              <FormField label="نوع سند قعطی" name="definiteDocumentType">
                <select
                  name="definiteDocumentType"
                  value={form.definiteDocumentType}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">انتخاب نوع سند...</option>
                  {enums.definiteDocumentType.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            {form.legalStatus === "سند عادی" && (
              <FormField label="نوع سند عادی" name="ordinaryDocumentType">
                <select
                  name="ordinaryDocumentType"
                  value={form.ordinaryDocumentType}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">انتخاب نوع...</option>
                  {enums.ordinaryDocumentType.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            {form.legalStatus === "فاقد سند" && (
              <FormField label="علت فاقد سند بودن" name="noDocumentType">
                <select
                  name="noDocumentType"
                  value={form.noDocumentType}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">انتخاب علت...</option>
                  {enums.noDocumentType.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            <FormField
              label="ارجاع به ملک (کد داخلی)"
              name="property"
              icon={Fingerprint}
            >
              <input
                name="property"
                value={form.property}
                onChange={handleChange}
                placeholder="شناسه داخلی"
                className={inputClasses}
              />
            </FormField>
          </div>
        </section>

        {/* بخش ۲: جزئیات ثبتی */}
        {form.legalStatus !== "فاقد سند" && (
          <section className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
            <SectionTitle icon={Layers} title="اطلاعات ثبتی و دفتری" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label="شناسه ملی ملک"
                name="nationalPropertyId"
                icon={Hash}
              >
                <input
                  name="nationalPropertyId"
                  type="text"
                  inputMode="numeric"
                  value={form.nationalPropertyId}
                  onChange={handleChange}
                  placeholder="فقط ارقام"
                  className={inputClasses}
                />
              </FormField>
              <FormField label="شناسه سادا" name="sadaId" icon={Hash}>
                <input
                  name="sadaId"
                  value={form.sadaId}
                  onChange={handleChange}
                  placeholder="کد سادا"
                  className={inputClasses}
                />
              </FormField>
              <FormField
                label="شماره ثبت"
                name="registrationNumber"
                icon={Hash}
              >
                <input
                  name="registrationNumber"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  placeholder="مثلاً ۱۲۳/۴"
                  className={inputClasses}
                />
              </FormField>
              <FormField
                label="تاریخ ثبت"
                name="registrationDate"
                icon={Calendar}
              >
                <input
                  name="registrationDate"
                  value={form.registrationDate}
                  onChange={handleJalaliDateChange}
                  placeholder="۱۴۰۲/۰۱/۰۱"
                  className={inputClasses}
                />
              </FormField>
              <FormField label="شماره دفتر" name="officeNumber">
                <input
                  name="officeNumber"
                  value={form.officeNumber}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </FormField>
              <FormField label="شماره صفحه" name="pageNumber">
                <input
                  name="pageNumber"
                  value={form.pageNumber}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </FormField>
            </div>
          </section>
        )}

        {/* بخش ۳: مشخصات فنی و مالکیت */}
        <section>
          <SectionTitle icon={Maximize} title="ابعاد و حدود مالکیت" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="شماره مدرک" name="documentNumber">
              <input
                name="documentNumber"
                value={form.documentNumber}
                onChange={handleChange}
                className={inputClasses}
              />
            </FormField>
            <FormField label="مساحت (متر مربع)" name="area" icon={Maximize}>
              <input
                name="area"
                type="text"
                inputMode="numeric"
                value={form.area}
                onChange={handleChange}
                placeholder="مثلاً ۵۰۰"
                className={inputClasses}
              />
            </FormField>
            <FormField
              label="میزان مالکیت"
              name="ownershipAmount"
              icon={CheckCircle2}
            >
              <input
                name="ownershipAmount"
                value={form.ownershipAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  // حذف تمام اعداد فارسی و انگلیسی
                  const cleaned = value.replace(/[0-9۰-۹]/g, "");
                  handleChange({
                    target: {
                      name: "ownershipAmount",
                      value: cleaned,
                    },
                  });
                }}
                placeholder="مثلاً شش دانگ"
                className={inputClasses}
              />
            </FormField>

            <FormField label="بخش ثبتی" name="registrationSection">
              <input
                name="registrationSection"
                value={form.registrationSection}
                onChange={(e) => {
                  const value = e.target.value;
                  // حذف تمام اعداد فارسی و انگلیسی
                  const cleaned = value.replace(/[0-9۰-۹]/g, "");
                  handleChange({
                    target: {
                      name: "registrationSection",
                      value: cleaned,
                    },
                  });
                }}
                className={inputClasses}
              />
            </FormField>

            <FormField label="پلاک ثبتی" name="registrationPlate">
              <input
                name="registrationPlate"
                value={form.registrationPlate}
                onChange={handleChange}
                className={inputClasses}
              />
            </FormField>
          </div>
        </section>

        {/* بخش ۴: طرفین و انتقال */}
        <section className="bg-blue-50/30 p-6 rounded-[2.5rem] border border-blue-100/50">
          <SectionTitle icon={Share2} title="طرفین قرارداد و نحوه انتقال" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="فروشنده / واگذارکننده" name="seller" icon={User}>
              <input
                name="seller"
                value={form.seller}
                onChange={handleChange}
                placeholder="نام کامل"
                className={inputClasses}
              />
            </FormField>
            <FormField
              label="خریدار / منتقل‌الیه"
              name="buyer"
              icon={UserCheck}
            >
              <input
                name="buyer"
                value={form.buyer}
                onChange={handleChange}
                placeholder="نام کامل"
                className={inputClasses}
              />
            </FormField>
            <FormField label="نحوه انتقال" name="transferMethod">
              <select
                name="transferMethod"
                value={form.transferMethod}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">انتخاب کنید...</option>
                {enums.transferMethod.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="فایل پیوست سند (ZIP/RAR)" name="documentFile">
              <div className="relative group/file">
                <input
                  type="file"
                  accept=".zip,.rar"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // 👈 بلافاصله اسم فایل رو نشون بده (قبل از آپلود)
                    setForm((p) => ({
                      ...p,
                      documentFileName: file.name,
                    }));

                    const formData = new FormData();
                    formData.append("documentFile", file);

                    const res = await fetch("/api/upload/upload-document", {
                      method: "POST",
                      body: formData,
                    });

                    const data = await res.json();

                    if (data.success) {
                      setForm((p) => ({
                        ...p,
                        documentFile: data.filePath, // ذخیره مسیر
                        documentFileName: data.originalName,
                      }));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div
                  className={`${inputClasses} flex items-center justify-between bg-white group-hover/file:border-blue-300 transition-colors`}
                >
                  <span
                    className="text-slate-600 truncate max-w-[180px]"
                    title={form.documentFileName || ""}
                  >
                    {form.documentFileName
                      ? form.documentFileName
                      : "بارگذاری فایل..."}
                  </span>

                  <UploadCloud className="text-blue-500" size={20} />
                </div>
              </div>
            </FormField>

            {form.legalStatus === "فاقد سند" && (
              <FormField
                label="تاریخ انتقال"
                name="noDeedTransferDate"
                icon={Calendar}
              >
                <input
                  name="noDeedTransferDate"
                  value={form.noDeedTransferDate}
                  onChange={handleJalaliDateChange}
                  placeholder="۱۴۰۲/۰۱/۰۱"
                  className={inputClasses}
                />
              </FormField>
            )}
          </div>

          <div className="mt-8 p-4 bg-white/80 rounded-2xl border border-blue-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="relative flex items-center">
              <input
                id="leadsToNewDeed"
                name="leadsToNewDeed"
                type="checkbox"
                checked={form.leadsToNewDeed}
                onChange={handleChange}
                className="w-6 h-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
              />
            </div>
            <label
              htmlFor="leadsToNewDeed"
              className="text-sm font-bold text-slate-700 cursor-pointer select-none"
            >
              این انتقال منجر به صدور سند جدید می‌شود
            </label>
          </div>
        </section>

        {/* توضیحات نهایی */}
        <section>
          <SectionTitle icon={ClipboardList} title="یادداشت‌های تکمیلی" />
          <FormField label="توضیحات و ملاحظات حقوقی" name="notes">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              className={`${inputClasses} resize-none`}
              placeholder="هرگونه مورد حقوقی، معارض یا توضیح اضافی..."
            />
          </FormField>
        </section>
      </div>
      {/* ناوبری */}
      <div className="flex items-center justify-between pt-10 border-t border-slate-100 mt-10">
        <button
          type="button"
          onClick={handleBack}
          className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95"
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
          ثبت و مرحله نهایی
          <ChevronLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
        </button>
      </div>
    </form>
  );
}

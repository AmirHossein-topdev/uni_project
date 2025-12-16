"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLegalStatus } from "@/redux/features/propertyDraftSlice";

// استایل پایه برای تمام ورودی‌ها و Select ها
const inputBaseClasses =
  "p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full bg-white text-gray-800 shadow-sm placeholder-gray-400";

// استایل برای چک‌باکس‌ها
const checkboxBaseClasses =
  "h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer";

// کامپوننت کمکی برای نمایش فیلدها (خارج از بدنه اصلی برای جلوگیری از re-mount)
const FormField = ({ label, name, children, required = false }) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 pr-1">*</span>}
    </label>
    {children}
  </div>
);

export default function StepPropertyLegalStatus({ next, back }) {
  const dispatch = useDispatch();
  const draft = useSelector((s) => s.propertyDraft.legalStatus);

  const [form, setForm] = useState({
    property: draft?.property || "",
    legalStatus: draft?.legalStatus || "",
    officialDocumentType: draft?.officialDocumentType || "",
    ordinaryDocumentType: draft?.ordinaryDocumentType || "",
    noDocumentType: draft?.noDocumentType || "",
    nationalPropertyId: draft?.nationalPropertyId ?? "",
    sadaId: draft?.sadaId || "",
    registrationNumber: draft?.registrationNumber || "",
    registrationDate: draft?.registrationDate
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
    documentFile: draft?.documentFile || "",
    noDeedTransferDate: draft?.noDeedTransferDate
      ? new Date(draft.noDeedTransferDate).toISOString().slice(0, 10)
      : "",
    notes: draft?.notes || "",
  });

  const [enums, setEnums] = useState({
    legalStatus: [],
    officialDocumentType: [],
    ordinaryDocumentType: [],
    noDocumentType: [],
    transferMethod: [],
  });
  const [loadingEnums, setLoadingEnums] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadEnums() {
      try {
        const res = await fetch("/api/property-legal-enums");
        if (!res.ok) throw new Error("failed to fetch enums");
        const data = await res.json();
        if (!mounted) return;
        setEnums({
          legalStatus: data.legalStatus || [],
          officialDocumentType: data.officialDocumentType || [],
          ordinaryDocumentType: data.ordinaryDocumentType || [],
          noDocumentType: data.noDocumentType || [],
          transferMethod: data.transferMethod || [],
        });
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
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // برای فیلدهای عددی: فقط ارقام (فارسی یا انگلیسی) قبول کن و به انگلیسی تبدیل کن
    const numericFields = ["nationalPropertyId", "area"];
    if (numericFields.includes(name)) {
      // فیلتر فقط ارقام (فارسی یا انگلیسی)
      newValue = newValue.replace(/[^۰-۹0-9]/g, "");
      // تبدیل به انگلیسی
      newValue = persianToEnglishDigits(newValue);
    }

    setForm((p) => ({ ...p, [name]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      property: form.property || undefined,
      legalStatus: form.legalStatus || undefined,
      officialDocumentType: form.officialDocumentType || undefined,
      ordinaryDocumentType: form.ordinaryDocumentType || undefined,
      noDocumentType: form.noDocumentType || undefined,
      nationalPropertyId:
        form.nationalPropertyId !== ""
          ? Number(form.nationalPropertyId)
          : undefined,
      sadaId: form.sadaId || undefined,
      registrationNumber: form.registrationNumber || undefined,
      registrationDate: form.registrationDate
        ? new Date(form.registrationDate)
        : undefined,
      officeNumber: form.officeNumber || undefined,
      pageNumber: form.pageNumber || undefined,
      documentNumber: form.documentNumber || undefined,
      area: form.area !== "" ? Number(form.area) : undefined,
      ownershipAmount: form.ownershipAmount || undefined,
      registrationSection: form.registrationSection || undefined,
      registrationPlate: form.registrationPlate || undefined,
      seller: form.seller || undefined,
      buyer: form.buyer || undefined,
      transferMethod: form.transferMethod || undefined,
      leadsToNewDeed: !!form.leadsToNewDeed,
      documentFile: form.documentFile || undefined,
      noDeedTransferDate: form.noDeedTransferDate
        ? new Date(form.noDeedTransferDate)
        : undefined,
      notes: form.notes || undefined,
    };
    dispatch(setLegalStatus(payload));
    next();
  };

  const handleBack = () => {
    dispatch(
      setLegalStatus({
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
      })
    );
    back();
  };

  const handleJalaliDateChange = (e) => {
    const { name, value } = e.target;

    // فقط عدد
    let v = value.replace(/[^\d]/g, "");

    // محدودیت طول: 8 رقم (YYYYMMDD)
    if (v.length > 8) v = v.slice(0, 8);

    // ساخت فرمت YYYY/MM/DD
    let formatted = v;
    if (v.length > 4 && v.length <= 6) {
      formatted = `${v.slice(0, 4)}/${v.slice(4)}`;
    } else if (v.length > 6) {
      formatted = `${v.slice(0, 4)}/${v.slice(4, 6)}/${v.slice(6)}`;
    }

    setForm((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  if (loadingEnums) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-xl font-medium text-blue-600">
          در حال بارگذاری گزینه‌ها...
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-gray-50 rounded-xl shadow-lg w-full max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-extrabold text-gray-800 border-b pb-3 mb-4">
        ⚖️ وضعیت حقوقی ملک
      </h2>

      {/* بخش اصلی: وضعیت سند */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="وضعیت کلی سند" name="legalStatus" required>
          <select
            name="legalStatus"
            value={form.legalStatus}
            onChange={handleChange}
            required
            className={inputBaseClasses}
          >
            <option value="">انتخاب کنید</option>
            {enums.legalStatus.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </FormField>

        {/* فیلد اختیاری ارجاع */}
        <FormField label="ارجاع به ملک (کد داخلی/ObjectId)" name="property">
          <input
            name="property"
            value={form.property}
            onChange={handleChange}
            placeholder="شناسه داخلی (اختیاری)"
            className={inputBaseClasses}
          />
        </FormField>

        {/* رندرهای شرطی بر اساس وضعیت سند */}
        {form.legalStatus === "سند رسمی" && (
          <FormField label="نوع سند رسمی" name="officialDocumentType">
            <select
              name="officialDocumentType"
              value={form.officialDocumentType}
              onChange={handleChange}
              className={inputBaseClasses}
            >
              <option value="">انتخاب کنید</option>
              {enums.officialDocumentType.map((v) => (
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
              className={inputBaseClasses}
            >
              <option value="">انتخاب کنید</option>
              {enums.ordinaryDocumentType.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
        )}

        {form.legalStatus === "فاقد سند" && (
          <FormField label="نوع (فاقد سند)" name="noDocumentType">
            <select
              name="noDocumentType"
              value={form.noDocumentType}
              onChange={handleChange}
              className={inputBaseClasses}
            >
              <option value="">انتخاب کنید</option>
              {enums.noDocumentType.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
        )}
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* سایر اطلاعات با چیدمان Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="شناسه ملی ملک (فقط ارقام)" name="nationalPropertyId">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="nationalPropertyId"
            value={String(form.nationalPropertyId ?? "")}
            onChange={handleChange}
            placeholder="مثلاً ۱۲۳۴۵۶"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="شناسه سادا" name="sadaId">
          <input
            name="sadaId"
            value={form.sadaId}
            onChange={handleChange}
            placeholder="شناسه سادا"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="شماره ثبت" name="registrationNumber">
          <input
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={handleChange}
            placeholder="مثلاً ۱۲۳/۴"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="تاریخ ثبت" name="registrationDate">
          <input
            name="registrationDate"
            value={form.registrationDate}
            onChange={handleJalaliDateChange}
            placeholder="ــــ/ــــ/ــــ"
            className={inputBaseClasses}
            inputMode="numeric"
          />
        </FormField>

        <FormField label="شماره دفتر" name="officeNumber">
          <input
            name="officeNumber"
            value={form.officeNumber}
            onChange={handleChange}
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="شماره صفحه" name="pageNumber">
          <input
            name="pageNumber"
            value={form.pageNumber}
            onChange={handleChange}
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="شماره مدرک" name="documentNumber">
          <input
            name="documentNumber"
            value={form.documentNumber}
            onChange={handleChange}
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="مساحت (متر مربع)" name="area">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="area"
            value={String(form.area ?? "")}
            onChange={handleChange}
            placeholder="مثلاً ۱۲۳"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="میزان مالکیت" name="ownershipAmount">
          <input
            name="ownershipAmount"
            value={form.ownershipAmount}
            onChange={handleChange}
            placeholder="مثلاً شش دانگ"
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="بخش ثبتی" name="registrationSection">
          <input
            name="registrationSection"
            value={form.registrationSection}
            onChange={handleChange}
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="پلاک ثبتی" name="registrationPlate">
          <input
            name="registrationPlate"
            value={form.registrationPlate}
            onChange={handleChange}
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="فروشنده" name="seller">
          <input
            name="seller"
            value={form.seller}
            onChange={handleChange}
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="خریدار" name="buyer">
          <input
            name="buyer"
            value={form.buyer}
            onChange={handleChange}
            className={inputBaseClasses}
          />
        </FormField>

        <FormField label="نحوه انتقال" name="transferMethod">
          <select
            name="transferMethod"
            value={form.transferMethod}
            onChange={handleChange}
            className={inputBaseClasses}
          >
            <option value="">انتخاب کنید</option>
            {enums.transferMethod.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="فایل سند (zip / rar)">
          <div className="relative">
            <input
              type="file"
              accept=".zip,.rar"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("documentFile", file);

                fetch("/api/upload/upload-document", {
                  method: "POST",
                  body: formData,
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success) {
                      setForm((p) => ({
                        ...p,
                        documentFile: data.filePath,
                      }));
                    }
                  });
              }}
              className={`${inputBaseClasses} cursor-pointer`}
            />
            {/* آیکن داخل input */}
            <span className="absolute text-2xl left-3 top-1/2 -translate-y-1/2 cursor-pointer pointer-events-none">
              📂
            </span>
          </div>
        </FormField>

        {/* فیلد شرطی تاریخ انتقال برای فاقد سند */}
        {form.legalStatus === "فاقد سند" && (
          <FormField label="تاریخ انتقال (فاقد سند)" name="noDeedTransferDate">
            <input
              name="noDeedTransferDate"
              type="date"
              value={form.noDeedTransferDate}
              onChange={handleChange}
              className={inputBaseClasses}
            />
          </FormField>
        )}
      </div>

      {/* چک باکس ویژه */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg mt-4">
        <input
          id="leadsToNewDeed"
          name="leadsToNewDeed"
          type="checkbox"
          checked={!!form.leadsToNewDeed}
          onChange={handleChange}
          className={checkboxBaseClasses}
        />
        <label
          htmlFor="leadsToNewDeed"
          className="font-medium text-gray-700 cursor-pointer select-none"
        >
          این انتقال منجر به صدور سند جدید می‌شود
        </label>
      </div>

      {/* توضیحات */}
      <FormField label="توضیحات و یادداشت‌ها" name="notes">
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          className={inputBaseClasses}
          placeholder="هرگونه توضیحات تکمیلی..."
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

// frontend/src/pages/dashboard/components/steps/StepPropertyLegalStatus.jsx
"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLegalStatus } from "@/redux/features/propertyDraftSlice";

const StepPropertyLegalStatus = ({ next, back }) => {
  const dispatch = useDispatch();

  // خواندن داده‌های قبلی Draft
  const legalStatusDraft = useSelector(
    (state) => state.propertyDraft.legalStatus
  );

  const [form, setForm] = useState({
    legalStatus: legalStatusDraft?.legalStatus || "",
    courtCaseNumber: legalStatusDraft?.courtCaseNumber || "",
    documents: legalStatusDraft?.documents || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setLegalStatus(form)); // ذخیره در Draft
    next(); // رفتن به استپ بعد
  };

  const handleBack = () => {
    dispatch(setLegalStatus(form)); // ذخیره در Draft قبل از برگشت
    back(); // رفتن به استپ قبلی
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <h2 className="text-lg font-bold">وضعیت حقوقی ملک</h2>

      <div>
        <label className="block mb-1 font-semibold">وضعیت حقوقی ملک</label>
        <input
          name="legalStatus"
          value={form.legalStatus}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="مثلاً آزاد، توقیف شده، مشاع"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">
          شماره پرونده قضایی (در صورت وجود)
        </label>
        <input
          name="courtCaseNumber"
          value={form.courtCaseNumber}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="شماره پرونده"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">اسناد و مدارک مرتبط</label>
        <input
          name="documents"
          value={form.documents}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="توضیح یا نام سند"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          قبلی
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800"
        >
          بعدی
        </button>
      </div>
    </form>
  );
};

export default StepPropertyLegalStatus;

"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOwnership } from "@/redux/features/propertyDraftSlice";

const StepPropertyOwnership = ({ next, back }) => {
  const dispatch = useDispatch();

  // خواندن داده‌های قبلی Draft
  const ownershipDraft = useSelector((state) => state.propertyDraft.ownership);

  const [form, setForm] = useState({
    ownerName: ownershipDraft?.ownerName || "",
    ownerNationalCode: ownershipDraft?.ownerNationalCode || "",
    ownershipType: ownershipDraft?.ownershipType || "",
    coOwners: ownershipDraft?.coOwners || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setOwnership(form)); // ذخیره در Draft
    next(); // رفتن به استپ بعد
  };

  const handleBack = () => {
    dispatch(setOwnership(form)); // ذخیره در Draft قبل از برگشت
    back(); // رفتن به استپ قبلی
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <h2 className="text-lg font-bold">اطلاعات مالکیت ملک</h2>

      <div>
        <label className="block mb-1 font-semibold">نام مالک</label>
        <input
          name="ownerName"
          value={form.ownerName}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="نام مالک"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">کد ملی مالک</label>
        <input
          name="ownerNationalCode"
          value={form.ownerNationalCode}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="کد ملی"
          maxLength={10}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">نوع مالکیت</label>
        <input
          name="ownershipType"
          value={form.ownershipType}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="مثلاً شخصی، حقوقی، مشاع"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">
          سایر مالکان (در صورت مشاع)
        </label>
        <input
          name="coOwners"
          value={form.coOwners}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="نام سایر مالکان"
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

export default StepPropertyOwnership;

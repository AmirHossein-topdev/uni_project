"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdditionalInfo } from "@/redux/features/propertyDraftSlice";

const StepPropertyAdditionalInfo = ({ next, back }) => {
  const dispatch = useDispatch();

  // گرفتن داده‌های قبلی Draft
  const additionalDraft = useSelector(
    (state) => state.propertyDraft.additionalInfo
  );

  const [form, setForm] = useState({
    buildingArea: additionalDraft?.buildingArea || "",
    landArea: additionalDraft?.landArea || "",
    constructionYear: additionalDraft?.constructionYear || "",
    description: additionalDraft?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ذخیره در Draft
    dispatch(setAdditionalInfo(form));
    // رفتن به استپ بعد
    next();
  };

  const handleBack = () => {
    // ذخیره داده‌ها هنگام برگشت
    dispatch(setAdditionalInfo(form));
    back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <h2 className="text-lg font-bold">اطلاعات تکمیلی ملک</h2>

      <div>
        <label className="block mb-1 font-semibold">متراژ بنا (متر مربع)</label>
        <input
          name="buildingArea"
          type="number"
          value={form.buildingArea}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="مثلاً 120"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">
          متراژ زمین (متر مربع)
        </label>
        <input
          name="landArea"
          type="number"
          value={form.landArea}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="مثلاً 200"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">سال ساخت</label>
        <input
          name="constructionYear"
          type="number"
          value={form.constructionYear}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="مثلاً 1399"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">توضیحات تکمیلی</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="توضیح کوتاه درباره ملک"
        />
      </div>

      <div className="flex justify-between mt-4">
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

export default StepPropertyAdditionalInfo;

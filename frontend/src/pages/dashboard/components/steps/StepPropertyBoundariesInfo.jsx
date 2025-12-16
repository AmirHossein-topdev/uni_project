"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBoundaries } from "@/redux/features/propertyDraftSlice";

const StepPropertyBoundariesInfo = ({ next, back }) => {
  const dispatch = useDispatch();

  // گرفتن داده‌های قبلی Draft
  const boundariesDraft = useSelector(
    (state) => state.propertyDraft.boundaries
  );

  const [form, setForm] = useState({
    northBoundary: boundariesDraft?.northBoundary || "",
    southBoundary: boundariesDraft?.southBoundary || "",
    eastBoundary: boundariesDraft?.eastBoundary || "",
    westBoundary: boundariesDraft?.westBoundary || "",
    notes: boundariesDraft?.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ذخیره در Draft
    dispatch(setBoundaries(form));
    // رفتن به استپ بعد
    next();
  };

  const handleBack = () => {
    // ذخیره داده‌ها هنگام برگشت
    dispatch(setBoundaries(form));
    back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <h2 className="text-lg font-bold">اطلاعات حدود و مرز ملک</h2>

      <div>
        <label className="block mb-1 font-semibold">حد شمالی</label>
        <input
          name="northBoundary"
          value={form.northBoundary}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="مثلاً خیابان اصلی"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">حد جنوبی</label>
        <input
          name="southBoundary"
          value={form.southBoundary}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="مثلاً پارکینگ"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">حد شرقی</label>
        <input
          name="eastBoundary"
          value={form.eastBoundary}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="مثلاً دیوار همسایه"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">حد غربی</label>
        <input
          name="westBoundary"
          value={form.westBoundary}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="مثلاً کوچه"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">توضیحات اضافی</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border border-black rounded-md px-3 py-2 outline-none"
          placeholder="توضیح کوتاه درباره حدود ملک"
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

export default StepPropertyBoundariesInfo;

"use client";
import React from "react";

export default function TypeStatusFields({ type, homeType, status, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="mb-1 font-semibold text-gray-700 block">
          نوع ملک
        </label>
        <select
          name="type"
          value={type}
          onChange={onChange}
          className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
        >
          <option value="مسکونی">مسکونی</option>
          <option value="تجاری">تجاری</option>
          <option value="زمین">زمین</option>
          <option value="صنعتی">صنعتی</option>
          <option value="سایر">سایر</option>
        </select>
      </div>

      {type === "مسکونی" && (
        <div>
          <label className="mb-1 font-semibold text-gray-700 block">
            نوع خانه
          </label>
          <select
            name="homeType"
            value={homeType}
            onChange={onChange}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
          >
            <option value="آپارتمان">آپارتمان</option>
            <option value="ویلایی">ویلایی</option>
            <option value="دوبلکس">دوبلکس</option>
            <option value="پنت‌هاوس">پنت‌هاوس</option>
            <option value="سوئیت">سوئیت</option>
            <option value="سایر">سایر</option>
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 font-semibold text-gray-700 block">وضعیت</label>
        <select
          name="status"
          value={status}
          onChange={onChange}
          className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
        >
          <option value="در دسترس">در دسترس</option>
          <option value="غیرفعال">غیرفعال</option>
          <option value="در حال تعمیر">در حال تعمیر</option>
        </select>
      </div>
    </div>
  );
}

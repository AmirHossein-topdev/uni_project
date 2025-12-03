"use client";
import React from "react";

export default function PriceFields({
  area,
  price,
  discount,
  onChange,
  onPriceChange,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div>
        <label className="mb-1 font-semibold text-gray-700 block">
          مساحت (متر مربع)
        </label>
        <input
          type="number"
          name="area"
          value={area}
          onChange={onChange}
          className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
        />
      </div>
      <div>
        <label className="mb-1 font-semibold text-gray-700 block">قیمت</label>
        <input
          type="text"
          name="price"
          value={price ? Number(price).toLocaleString("en-US") : ""}
          onChange={onPriceChange}
          className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
        />
      </div>
      <div>
        <label className="mb-1 font-semibold text-gray-700 block">تخفیف</label>
        <input
          type="number"
          name="discount"
          value={discount}
          onChange={onChange}
          className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
        />
      </div>
    </div>
  );
}

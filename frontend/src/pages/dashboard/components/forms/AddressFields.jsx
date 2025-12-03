"use client";
import React from "react";

const ADDRESS_LABELS = {
  country: "کشور",
  state: "استان",
  city: "شهر",
  district: "محله / منطقه",
  street: "خیابان",
  alley: "کوچه",
  floor: "طبقه",
  unit: "واحد",
  buildingNumber: "پلاک",
  postalCode: "کدپستی",
};

export default function AddressFields({ address, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {Object.entries(address).map(([key, value]) => (
        <div key={key}>
          <label className="mb-1 font-semibold text-gray-700 block">
            {ADDRESS_LABELS[key] || key}{" "}
            {/* اگر فارسی موجود نبود، همان key انگلیسی */}
          </label>
          <input
            type="text"
            name={`address.${key}`}
            value={value}
            onChange={onChange}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
          />
        </div>
      ))}
    </div>
  );
}

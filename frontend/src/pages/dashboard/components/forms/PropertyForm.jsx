"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { components } from "react-select";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });
import { useAddPropertyMutation } from "../../../../redux/features/propertyApi";
import { useGetOwnersQuery } from "../../../../redux/features/ownerApi";

import FileUpload from "./FileUpload";
import AddressFields from "./AddressFields";
import PriceFields from "./PriceFields";
import TypeStatusFields from "./TypeStatusFields";

export default function PropertyForm() {
  const router = useRouter();
  const { data: owners } = useGetOwnersQuery();
  const [addProperty] = useAddPropertyMutation();

  const [formData, setFormData] = useState({
    title: "",
    type: "مسکونی",
    homeType: "آپارتمان",
    status: "در دسترس",
    description: "",
    area: "",
    price: "",
    discount: "",
    address: {
      country: "",
      state: "",
      city: "",
      district: "",
      street: "",
      alley: "",
      buildingNumber: "",
      floor: "",
      unit: "",
      postalCode: "",
    },
    mainImage: null,
    gallery: [],
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMainImageChange = (e) => {
    setFormData((prev) => ({ ...prev, mainImage: e.target.files[0] }));
  };
  const handleGalleryChange = (e) => {
    setFormData((prev) => ({ ...prev, gallery: Array.from(e.target.files) }));
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(rawValue)) return;
    setFormData((prev) => ({ ...prev, price: rawValue }));
    e.target.value = Number(rawValue).toLocaleString("en-US");
  };

  const handleSubmit = async (e) => {
    console.log(req.body, req.files);
    e.preventDefault();
    try {
      const form = new FormData();
      if (formData.mainImage) form.append("mainImage", formData.mainImage);
      formData.gallery.forEach((file) => form.append("gallery", file));

      for (const key in formData) {
        if (key !== "mainImage" && key !== "gallery") {
          if (key === "address")
            form.append(key, JSON.stringify(formData[key]));
          else form.append(key, formData[key]);
        }
      }

      await addProperty(form).unwrap();
      Swal.fire({
        icon: "success",
        title: "ملک ایجاد شد",
        confirmButtonColor: "#22c55e",
      });
      router.push("/dashboard/main/properties");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطا در ایجاد ملک",
        confirmButtonColor: "#ef4444",
      });
    }
  };
  // گزینه‌ها
  const ownerOptions =
    owners?.map((owner) => ({
      value: owner._id,
      label: owner.name,
      nationalId: owner.nationalId,
    })) || [];

  // کامپوننت سفارشی برای نمایش گزینه‌ها
  const Option = (props) => {
    return (
      <components.Option {...props}>
        <span>{props.data.label}</span> - <span>{props.data.nationalId}</span>
      </components.Option>
    );
  };

  // کامپوننت سفارشی برای نمایش گزینه انتخاب‌شده
  const SingleValue = (props) => {
    return (
      <components.SingleValue {...props}>
        {props.data.label} - {props.data.nationalId}
      </components.SingleValue>
    );
  };

  // استایل‌ها
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#ccc",
      "&:hover": { borderColor: "#22c55e" },
      boxShadow: "none",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000", // متن مشکی
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6" // آبی پررنگ وقتی انتخاب شد
        : state.isFocused
        ? "#bfdbfe" // آبی کمرنگ وقتی موس روی گزینه است
        : "#fff",
      color: state.isSelected ? "#000" : "#000",
      cursor: "pointer",
    }),
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100"
    >
      <div>
        <label className="mb-1 font-semibold text-gray-700 block">
          عنوان ملک
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
          required
        />
      </div>

      {/* owner */}
      <Select
        options={ownerOptions}
        value={ownerOptions.find((o) => o.value === formData.owner) || null}
        onChange={(opt) =>
          setFormData((prev) => ({ ...prev, owner: opt?.value || "" }))
        }
        placeholder="انتخاب مالک..."
        isClearable
        components={{ Option, SingleValue }}
        styles={customStyles}
      />

      <TypeStatusFields
        type={formData.type}
        homeType={formData.homeType}
        status={formData.status}
        onChange={handleChange}
      />
      <PriceFields
        area={formData.area}
        price={formData.price}
        discount={formData.discount}
        onChange={handleChange}
        onPriceChange={handlePriceChange}
      />
      <AddressFields address={formData.address} onChange={handleChange} />
      <FileUpload
        label="تصویر اصلی ملک"
        files={formData.mainImage ? [formData.mainImage] : []}
        onChange={handleMainImageChange}
      />
      <FileUpload
        label="گالری تصاویر"
        multiple
        files={formData.gallery}
        onChange={handleGalleryChange}
      />

      <button
        type="submit"
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
      >
        ثبت ملک
      </button>
    </form>
  );
}

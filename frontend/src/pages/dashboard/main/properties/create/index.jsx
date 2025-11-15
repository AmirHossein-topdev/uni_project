"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";

import Select from "react-select";
import { useRouter } from "next/router";
import { useAddPropertyMutation } from "../../../../../redux/features/propertyApi";
import { useGetOwnersQuery } from "../../../../../redux/features/ownerApi";
import DashboardLayout from "../../../layout";
import Link from "next/link";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { MdDriveFolderUpload } from "react-icons/md";
import dynamic from "next/dynamic";

export default function CreatePropertyPage() {
  const Select = dynamic(() => import("react-select"), { ssr: false });
  const router = useRouter();
  const { data: owners } = useGetOwnersQuery(); // فرضاً RTK Query

  const [addProperty] = useAddPropertyMutation();

  const [formData, setFormData] = useState({
    propertyId: "",
    title: "",
    slug: "",
    type: "مسکونی",
    homeType: "آپارتمان",
    status: "در دسترس",
    description: "",
    area: "",
    price: "",
    discount: "",
    address: {
      country: "", // کشور
      city: "", // شهر
      state: "", // استان
      district: "", // محله / منطقه
      street: "", // خیابان و شماره پلاک
      alley: "", // محله / منطقه
      floor: "", // طبقه
      unit: "", // واحد
      buildingNumber: "", //شماره پلاک
      postalCode: "", // کدپستی
    },
    mainImage: null,
    gallery: [],
    tags: "",
    features: "",
    videoTourId: "",
    availableFrom: "",
    offerDate: {
      startDate: "",
      endDate: "",
    },
    featured: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // برای فیلدهای آدرس
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (name.startsWith("offerDate.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        offerDate: { ...prev.offerDate, [key]: value },
      }));
    } else if (name === "featured") {
      setFormData((prev) => ({ ...prev, featured: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMainImageChange = (e) => {
    setFormData((prev) => ({ ...prev, mainImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(); // حالا خارج از try تعریف شد

    try {
      for (const key in formData) {
        if (key === "address" || key === "offerDate") {
          form.append(key, JSON.stringify(formData[key]));
        } else if (key === "mainImage") {
          if (formData.mainImage) form.append("mainImage", formData.mainImage);
        } else if (key === "gallery") {
          if (formData.gallery.length > 0)
            formData.gallery.forEach((g, i) => {
              form.append(`gallery[${i}]`, JSON.stringify(g));
            });
        } else if (key === "tags" || key === "features") {
          if (formData[key])
            form.append(key, JSON.stringify(formData[key].split(",")));
        } else {
          form.append(key, formData[key]);
        }
      }

      console.log("Payload to send:");
      for (let pair of form.entries()) {
        console.log(pair[0], pair[1]);
      }

      await addProperty(form).unwrap();

      Swal.fire({
        icon: "success",
        title: "✅ موفقیت",
        text: "ملک با موفقیت ایجاد شد",
        confirmButtonColor: "#22c55e",
      });

      router.push("/dashboard/main/properties");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "❌ خطا",
        text: "خطا در ایجاد ملک",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handlePriceChange = (e) => {
    // مقدار ورودی کاربر (بدون فرمت)
    const rawValue = e.target.value.replace(/,/g, ""); // حذف کاماها
    // فقط اعداد معتبر
    if (!/^\d*$/.test(rawValue)) return;

    // به formData ذخیره می‌کنیم (بدون کاما)
    setFormData((prev) => ({ ...prev, price: rawValue }));

    // نمایش در input با کاما
    e.target.value = Number(rawValue).toLocaleString("en-US");
  };
  const ownerOptions =
    owners?.map((owner) => ({
      value: owner._id,
      label: `${owner.name} - ${owner.nationalId}`,
    })) || [];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <Link
            href="/dashboard/main/properties"
            className="text-green-600 hover:text-green-400 flex items-center gap-2"
          >
            <FaArrowLeft /> بازگشت به املاک
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">ایجاد ملک جدید</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100"
        >
          {/* Title */}
          <div>
            <label className="mb-1 font-semibold text-gray-700 block">
              عنوان ملک <span className="text-red-500">*</span>
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
          <div>
            <label className="mb-1 font-semibold text-gray-700 block">
              مالک
            </label>
            <Select
              options={ownerOptions}
              value={
                ownerOptions.find((opt) => opt.value === formData.owner) || null
              }
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  owner: selectedOption ? selectedOption.value : "",
                }))
              }
              placeholder="انتخاب مالک..."
              isClearable
              isSearchable
              className="text-gray-800 border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
              classNamePrefix="react-select"
            />
          </div>

          {/* Type + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* type */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                نوع ملک
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              >
                <option value="مسکونی">مسکونی</option>
                <option value="تجاری">تجاری</option>
                <option value="زمین">زمین</option>
                <option value="صنعتی">صنعتی</option>
                <option value="سایر">سایر</option>
              </select>
            </div>

            {/* home type – فقط وقتی type مسکونی است نمایش داده شود */}
            {formData.type === "مسکونی" && (
              <div>
                <label className="mb-1 font-semibold text-gray-700 block">
                  نوع خانه
                </label>
                <select
                  name="homeType"
                  value={formData.homeType}
                  onChange={handleChange}
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

            {/* status */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                وضعیت
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              >
                <option value="در دسترس">در دسترس</option>
                <option value="غیرفعال">غیرفعال</option>
                <option value="در حال تعمیر">در حال تعمیر</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 font-semibold text-gray-700 block">
              توضیحات
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
            />
          </div>

          {/* Area + Price + Discount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                مساحت (متر مربع)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                قیمت
              </label>
              <input
                type="text" // حتما text بگذارید تا کاما مشکلی ایجاد نکند
                name="price"
                value={
                  formData.price
                    ? Number(formData.price).toLocaleString("en-US")
                    : ""
                }
                onChange={handlePriceChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>

            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                تخفیف
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* کشور */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                کشور
              </label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>

            {/* استان */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                استان
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>

            {/* شهر */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                شهر
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>

            {/* محله */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                محله / منطقه
              </label>
              <input
                type="text"
                name="address.district"
                value={formData.address.district}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>

            {/* خیابان */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                خیابان
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>
            {/* کوچه */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                کوچه
              </label>
              <input
                type="text"
                name="address.alley"
                value={formData.address.alley}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>

            {/*  پلاک*/}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                پلاک
              </label>
              <input
                type="number"
                name="address.buildingNumber"
                value={formData.address.buildingNumber}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>

            {/* طبقه */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                طبقه
              </label>
              <input
                type="text"
                name="address.floor"
                value={formData.address.floor}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>

            {/* واحد */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                واحد
              </label>
              <input
                type="text"
                name="address.unit"
                value={formData.address.unit}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>

            {/* کدپستی */}
            <div>
              <label className="mb-1 font-semibold text-gray-700 block">
                کدپستی
              </label>
              <input
                type="text"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition duration-150"
              />
            </div>
          </div>

          {/* Main Image */}
          <div>
            <label className="mb-1 font-semibold text-gray-700 block">
              تصویر اصلی ملک
            </label>
            <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 cursor-pointer bg-gray-50 text-gray-700 hover:border-green-500 hover:ring-2 hover:ring-green-500 transition duration-150 w-full">
              <MdDriveFolderUpload size={24} className="text-green-600" />
              <span className="text-gray-600">
                {formData.mainImage
                  ? `فایل انتخاب شده: ${formData.mainImage.name}`
                  : "آپلود فایل (PNG, JPG)"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
            <span className="text-gray-700 font-semibold">ویژه</span>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <FaSave />
              <span>ایجاد و ثبت ملک</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // استفاده از ساختار استاندارد App Router
import { useAddOwnerMutation } from "../../../../redux/features/ownerApi";
import {
  FaSave,
  FaArrowLeft,
  FaUserTie,
  FaIdCard,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkedAlt,
  FaStickyNote,
} from "react-icons/fa";
import {
  MdDriveFolderUpload,
  MdOutlineCategory,
  MdSignalCellularAlt,
} from "react-icons/md";
import Link from "next/link";
import DashboardLayout from "../../layout";

export default function CreateOwnerPage() {
  const router = useRouter();
  const [addOwner] = useAddOwnerMutation();

  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    orgId: "",
    email: "",
    phone: "",
    type: "individual",
    address: "",
    status: "active",
    notes: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      }

      await addOwner(form).unwrap();
      // استفاده از استایل مسیج های امیر
      alert("✅ مالک با موفقیت ایجاد شد");
      router.push("/dashboard/owners");
    } catch (err) {
      console.error(err);
      alert("❌ خطا در ایجاد مالک");
    }
  };

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-[#f2fbfa] p-4 sm:p-8 lg:p-12 rounded-4xl"
        dir="rtl"
      >
        {/* هدر صفحه به سبک امیر */}
        <div className="max-w-5xl mx-auto flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard/owners"
              className="w-12 h-12 flex items-center justify-center bg-white text-[#1b4965] rounded-2xl shadow-sm hover:shadow-[#41bdbb]/20 hover:text-[#41bdbb] transition-all duration-300 border border-[#41bdbb]/10"
            >
              <FaArrowLeft size={18} />
            </Link>
            <div>
              <h2 className="text-3xl font-black text-[#1b4965] tracking-tighter">
                ایجاد <span className="text-[#41bdbb]">مالک</span> جدید
              </h2>
              <p className="text-xs font-bold text-[#1b4965]/50 mt-1 uppercase tracking-widest">
                Owner Management Terminal
              </p>
            </div>
          </div>
          <div className="hidden sm:block bg-[#1b4965] p-3 rounded-2xl shadow-lg shadow-[#1b4965]/20">
            <FaUserTie className="text-[#41bdbb]" size={24} />
          </div>
        </div>

        {/* بدنه فرم شیشه‌ای */}
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl rounded-[3rem] p-8 lg:p-12 shadow-[0_30px_100px_-20px_rgba(1,79,134,0.1)] border border-white relative overflow-hidden"
        >
          {/* المان تزیینی عمودی سمت راست */}
          <div className="absolute top-0 left-0 w-2 h-full bg-[#41bdbb]"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* بخش نام - تمام عرض */}
            <div className="md:col-span-2">
              <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                نام کامل مالک (شخص یا شرکت){" "}
                <span className="text-[#41bdbb]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold pr-12"
                  placeholder="مثلا: شرکت توسعه ابنیه امیر"
                />
                <FaUserTie className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1b4965]/20" />
              </div>
            </div>

            {/* بخش شناسه‌ها */}
            <div className="space-y-6">
              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  کد ملی / شناسه ملی <span className="text-[#41bdbb]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleChange}
                    className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold pr-12"
                    placeholder="1010XXXXXXX"
                  />
                  <FaIdCard className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1b4965]/20" />
                </div>
              </div>

              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  شناسه سازمانی (داخلی)
                </label>
                <input
                  type="text"
                  name="orgId"
                  value={formData.orgId}
                  onChange={handleChange}
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold"
                  placeholder="ORG-4400"
                />
              </div>
            </div>

            {/* بخش تماس */}
            <div className="space-y-6">
              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  پست الکترونیک
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold pr-12"
                    placeholder="owner@info.com"
                  />
                  <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1b4965]/20" />
                </div>
              </div>

              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  شماره تماس مستقیم <span className="text-[#41bdbb]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold pr-12"
                    placeholder="021XXXX / 0912XXX"
                  />
                  <FaPhoneAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1b4965]/20" />
                </div>
              </div>
            </div>

            {/* نوع و وضعیت */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#1b4965] font-black text-[11px] mb-2 mr-2 italic uppercase">
                  دسته‌بندی مالک
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-black appearance-none cursor-pointer"
                  >
                    <option value="individual">شخصی</option>
                    <option value="organization">سازمانی</option>
                  </select>
                  <MdOutlineCategory className="absolute left-4 top-1/2 -translate-y-1/2 text-[#41bdbb]" />
                </div>
              </div>

              <div>
                <label className="block text-[#1b4965] font-black text-[11px] mb-2 mr-2 italic uppercase">
                  وضعیت فعالیت
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-black appearance-none cursor-pointer"
                  >
                    <option value="active">فعال</option>
                    <option value="inactive">غیرفعال</option>
                    <option value="blocked">مسدود</option>
                  </select>
                  <MdSignalCellularAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#41bdbb]" />
                </div>
              </div>
            </div>

            {/* آدرس */}
            <div>
              <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                نشانی و موقعیت <span className="text-[#41bdbb]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold pr-12"
                  placeholder="استان، شهر، خیابان..."
                />
                <FaMapMarkedAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1b4965]/20" />
              </div>
            </div>

            {/* بخش یادداشت‌ها - تمام عرض */}
            <div className="md:col-span-2">
              <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                یادداشت‌ها و توضیحات سیستمی
              </label>
              <div className="relative">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-[2rem] p-5 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold pr-12 resize-none"
                  placeholder="توضیحات لازم را اینجا وارد کنید..."
                />
                <FaStickyNote className="absolute right-5 top-6 text-[#1b4965]/20" />
              </div>
            </div>

            {/* بخش آپلود عکس - استایل اختصاصی امیر */}
            <div className="md:col-span-2 mt-4">
              <div className="p-6 bg-[#f2fbfa] rounded-[2.5rem] border-2 border-dashed border-[#41bdbb]/20 group hover:border-[#41bdbb]/50 transition-all duration-500">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative h-28 w-28 bg-white rounded-[2rem] shadow-xl flex items-center justify-center overflow-hidden border-4 border-white">
                    {formData.photo ? (
                      <img
                        src={URL.createObjectURL(formData.photo)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MdDriveFolderUpload
                        size={40}
                        className="text-[#41bdbb]/30 group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-right">
                    <h4 className="text-[#1b4965] font-[1000] text-lg">
                      مستندات و تصویر مالک
                    </h4>
                    <p className="text-[#1b4965]/40 font-bold text-[10px] mt-1 mb-4 italic uppercase tracking-widest">
                      Upload Identification or Profile Photo
                    </p>
                    <label className="inline-block bg-[#1b4965] hover:bg-[#41bdbb] text-white px-8 py-3 rounded-xl font-black text-xs transition-all duration-300 cursor-pointer shadow-lg shadow-[#1b4965]/20 uppercase tracking-tighter">
                      {formData.photo
                        ? "تغییر فایل انتخاب شده"
                        : "انتخاب و آپلود فایل"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* دکمه ارسال نهایی */}
          <div className="mt-12">
            <button
              type="submit"
              className="group w-full py-6 rounded-[2.5rem] bg-[#1b4965] text-[#f2fbfa] font-black text-xl tracking-tighter transition-all duration-500 shadow-2xl shadow-[#1b4965]/30 hover:shadow-[#41bdbb]/40 border border-[#41bdbb]/20 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-4"
            >
              <FaSave
                className="text-[#41bdbb] group-hover:rotate-12 transition-transform duration-500"
                size={24}
              />
              <span>ایجاد و ثبت اطلاعات نهایی مالک</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

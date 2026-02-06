"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { useCreateUserMutation } from "../../../../redux/features/userApi";
import {
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaCloudUploadAlt,
} from "react-icons/fa";
import Link from "next/link";
import DashboardLayout from "../../layout";
import { useRouter } from "next/navigation"; // در Next 13+ از navigation استفاده کنید

const ROLE_OPTIONS = [
  { value: "Admin", label: "مدیر" },
  { value: "Manager", label: "مدیر ارشد" },
  { value: "Agent", label: "نماینده" },
  { value: "Customer Support", label: "پشتیبانی مشتری" },
  { value: "Accountant", label: "حسابدار" },
  { value: "Inspector", label: "بازرس" },
];

export default function CreateUserPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    employeeCode: "",
    password: "",
    role: "",
    email: "",
    contactNumber: "",
    address: "",
    profileImage: null,
    status: "inactive",
  });

  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("employeeCode", formData.employeeCode);
      form.append("password", formData.password);
      form.append("email", formData.email);
      form.append("role", formData.role);
      form.append("contactNumber", formData.contactNumber);
      form.append("address", formData.address);
      form.append("status", formData.status);

      if (formData.profileImage) {
        form.append("profileImage", formData.profileImage);
      }

      await createUser(form).unwrap();

      Swal.fire({
        icon: "success",
        title: "عملیات موفق",
        text: "کاربر جدید با موفقیت به سیستم اضافه شد",
        confirmButtonText: "تایید",
        confirmButtonColor: "#41bdbb",
        customClass: {
          popup: "rounded-[2rem] font-black",
        },
      }).then(() => {
        router.push("/dashboard/users");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطا در سیستم",
        text:
          err?.data?.message || err?.message || "مشکلی در ایجاد کاربر رخ داد",
        confirmButtonText: "تلاش مجدد",
        confirmButtonColor: "#1b4965",
      });
    }
  };

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-[#f2fbfa] p-4 sm:p-8 lg:p-12 rounded-4xl"
        dir="rtl"
      >
        {/* هدر صفحه */}
        <div className="max-w-5xl mx-auto flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard/users"
              className="w-12 h-12 flex items-center justify-center bg-white text-[#1b4965] rounded-2xl shadow-sm hover:shadow-[#41bdbb]/20 hover:text-[#41bdbb] transition-all duration-300 border border-[#41bdbb]/10"
            >
              <FaArrowRight size={18} />
            </Link>
            <div>
              <h2 className="text-3xl font-black text-[#1b4965] tracking-tighter">
                افزودن <span className="text-[#41bdbb]">کاربر</span> جدید
              </h2>
              <p className="text-xs font-bold text-[#1b4965]/50 mt-1 uppercase tracking-widest">
                User Registration Terminal
              </p>
            </div>
          </div>
          <div className="hidden sm:block bg-[#1b4965] p-3 rounded-2xl shadow-lg shadow-[#1b4965]/20">
            <FaUserPlus className="text-[#41bdbb]" size={24} />
          </div>
        </div>

        {/* بدنه فرم */}
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl rounded-[3rem] p-8 lg:p-12 shadow-[0_30px_100px_-20px_rgba(1,79,134,0.1)] border border-white relative overflow-hidden"
        >
          {/* المان تزیینی */}
          <div className="absolute top-0 left-0 w-2 h-full bg-[#41bdbb]"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ستون اول */}
            <div className="space-y-6">
              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold"
                  placeholder="مثلا: امیر حسین"
                />
              </div>

              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  کد پرسنلی / سازمانی
                </label>
                <input
                  type="text"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold"
                  placeholder="1234"
                />
              </div>

              <div className="relative">
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  گذرواژه سیستم
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute left-4 top-[46px] text-[#1b4965]/40 hover:text-[#41bdbb] transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>

              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  پست الکترونیک
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            {/* ستون دوم */}
            <div className="space-y-6">
              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  سطح دسترسی (نقش)
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold appearance-none cursor-pointer"
                >
                  <option value="">انتخاب کنید...</option>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  شماره تماس مستقیم
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold"
                  placeholder="0912..."
                />
              </div>

              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  وضعیت اکانت
                </label>
                <div className="flex gap-2">
                  {["active", "inactive", "blocked"].map((stat) => (
                    <button
                      key={stat}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: stat }))
                      }
                      className={`flex-1 p-3 rounded-xl font-black text-[10px] uppercase transition-all duration-300 ${
                        formData.status === stat
                          ? "bg-[#1b4965] text-[#41bdbb] shadow-lg"
                          : "bg-[#f2fbfa] text-[#1b4965]/40 hover:bg-[#e5f6f6]"
                      }`}
                    >
                      {stat === "active"
                        ? "فعال"
                        : stat === "inactive"
                          ? "غیرفعال"
                          : "مسدود"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#1b4965] font-black text-sm mb-2 mr-2 italic">
                  نشانی سکونت
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-[#f2fbfa] border-2 border-transparent text-[#1b4965] rounded-2xl p-4 focus:outline-none focus:border-[#41bdbb]/30 focus:bg-white transition-all shadow-inner font-bold"
                />
              </div>
            </div>
          </div>

          {/* بخش آپلود عکس پروفایل */}
          <div className="mt-10 p-6 bg-[#f2fbfa] rounded-[2rem] border-2 border-dashed border-[#41bdbb]/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-4 border-white flex items-center justify-center">
                  {formData.profileImage ? (
                    <img
                      src={URL.createObjectURL(formData.profileImage)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaCloudUploadAlt size={40} className="text-[#41bdbb]/30" />
                  )}
                </div>
                <label className="absolute inset-0 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1 text-center md:text-right">
                <h4 className="text-[#1b4965] font-black text-lg">
                  تصویر پروفایل کاربر
                </h4>
                <p className="text-[#1b4965]/50 font-bold text-xs mt-1 mb-4">
                  فرمت‌های مجاز: JPG, PNG (حداکثر ۲ مگابایت)
                </p>
                <label className="bg-[#41bdbb] hover:bg-[#1b4965] text-white px-6 py-3 rounded-xl font-black text-xs transition-all duration-300 cursor-pointer shadow-lg shadow-[#41bdbb]/30">
                  انتخاب فایل تصویر
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

          {/* دکمه ارسال */}
          <div className="mt-12">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-[2rem] font-black text-lg tracking-tighter transition-all duration-500 shadow-xl ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1b4965] text-[#f2fbfa] hover:bg-[#153a50] shadow-[#1b4965]/30 hover:shadow-[#41bdbb]/40 border border-[#41bdbb]/20"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-4 border-white/20 border-t-[#41bdbb] rounded-full animate-spin"></div>
                  در حال پردازش داده‌ها...
                </span>
              ) : (
                "تایید و ایجاد حساب کاربر"
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

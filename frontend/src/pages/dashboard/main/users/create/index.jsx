"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { useCreateUserMutation } from "../../../../../redux/features/userApi";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import DashboardLayout from "../../../layout";
import { useRouter } from "next/router";

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

    console.log("فرم قبل از ارسال:", formData);

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

      const response = await createUser(form).unwrap();
      console.log("پاسخ سرور:", response);

      Swal.fire({
        icon: "success",
        title: "کاربر با موفقیت ایجاد شد!",
        confirmButtonText: "باشه",
      }).then(() => {
        router.push("/dashboard/main/users");
      });
    } catch (err) {
      console.error("خطا در ایجاد کاربر:", err);
      Swal.fire({
        icon: "error",
        title: "خطا در ایجاد کاربر",
        text: err?.data?.message || err?.message || "لطفاً دوباره تلاش کنید",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-900">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
          <Link
            href="/dashboard/main/users"
            className="p-2 text-gray-300 hover:text-green-400 transition rounded-full hover:bg-gray-800"
          >
            <FaArrowRight size={20} />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            افزودن کاربر جدید
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-3xl mx-auto space-y-4"
        >
          {/* نام */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              نام کامل
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          {/* کد سازمانی */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              کد سازمانی
            </label>
            <input
              type="text"
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          {/* رمز عبور */}
          <div className="relative">
            <label className="block text-gray-300 font-medium mb-1">
              رمز عبور
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute bottom-3 left-3 transform -translate-y-1/2 text-gray-500 hover:text-green-500 transition"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* ایمیل */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              ایمیل
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="ایمیل بازنشانی"
            />
          </div>

          {/* نقش */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">نقش</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="">انتخاب نقش...</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* شماره تماس */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              شماره تماس
            </label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          {/* آدرس */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">آدرس</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          {/* تصویر پروفایل */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              تصویر پروفایل
            </label>
            <div className="flex items-center gap-4">
              <label className="w-1/5 min-w-[140px] flex items-center justify-center border border-gray-700 bg-gray-900 text-white rounded-xl p-3 cursor-pointer text-center hover:bg-gray-800 transition">
                {formData.profileImage ? "تغییر فایل" : "انتخاب فایل"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-gray-400 text-sm">
                {formData.profileImage
                  ? formData.profileImage.name
                  : "فایلی انتخاب نشده"}
              </span>
              {formData.profileImage && (
                <img
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                />
              )}
            </div>
          </div>

          {/* وضعیت */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              وضعیت
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="inactive">غیرفعال</option>
              <option value="active">فعال</option>
              <option value="blocked">مسدود</option>
            </select>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              {isLoading ? "در حال ارسال..." : "ایجاد کاربر"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

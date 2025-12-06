// frontend\src\pages\dashboard\main\users\[id]\edit\index.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import DashboardLayout from "../../../../layout";
import Link from "next/link";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../../../../redux/features/userApi";

const ROLE_OPTIONS = [
  { value: "Admin", label: "مدیر" },
  { value: "Manager", label: "مدیر ارشد" },
  { value: "Agent", label: "نماینده" },
  { value: "Customer Support", label: "پشتیبانی مشتری" },
  { value: "Accountant", label: "حسابدار" },
  { value: "Inspector", label: "بازرس" },
];

export default function EditUserPage() {
  const router = useRouter();
  const { id } = router.query;

  const [userId, setUserId] = useState(null);

  // وقتی id آماده شد userId ست میشه
  useEffect(() => {
    if (id) {
      setUserId(id);
    }
  }, [id]);

  const { data, isLoading, isError } = useGetUserByIdQuery(userId, {
    skip: !userId, // فقط وقتی userId ست شد query اجرا شود
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

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
  const [previewOld, setPreviewOld] = useState("");
  const [previewNew, setPreviewNew] = useState("");

  // بارگذاری اطلاعات کاربر وقتی data آماده شد
  useEffect(() => {
    if (!data) return;

    const user = data;

    setFormData({
      name: user.name ?? "",
      employeeCode: user.employeeCode ?? "",
      password: "", // خالی — فقط برای تغییر رمز جدید
      role: user.role?.name ?? "",
      email: user.email ?? "",
      contactNumber: user.contactNumber ?? "",
      address: user.address ?? "",
      profileImage: user.profileImage ?? null,
      status: user.status ?? "inactive",
    });

    setPreviewOld(user.profileImage ? `${user.profileImage}` : "");
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, profileImage: file }));
    setPreviewNew(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formToSend = new FormData();
      for (const key in formData) {
        const val = formData[key];
        // مهم: وقتی فایل انتخاب شده است (File object) آن را append کن، وقتی profileImage یک string (مسیر قدیمی) است
        // و کاربر فایل جدید انتخاب نکرده است، اگر می‌خواهی مسیر قدیمی را نگه داری نیازی به append نیست.
        if (val !== null && val !== undefined) {
          // اگر profileImage فایل است (object) append کن، وگرنه اگر رشته است (مسیر)، append کن هم پذیرفته می‌شود.
          formToSend.append(key, val);
        }
      }

      // مطابق RTK mutation: { id, formData }
      await updateUser({ id: userId, formData: formToSend }).unwrap();

      await Swal.fire({
        icon: "success",
        title: "ویرایش کاربر با موفقیت انجام شد",
        confirmButtonText: "باشه",
      });

      router.push("/dashboard/main/users");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: err?.data?.message || "مشکلی در ویرایش کاربر رخ داد",
      });
    }
  };

  if (!userId || isLoading)
    return (
      <DashboardLayout>
        <div className="text-white text-center py-10">در حال بارگذاری...</div>
      </DashboardLayout>
    );

  if (isError)
    return (
      <DashboardLayout>
        <div className="text-red-600 text-center py-10">
          خطا در دریافت اطلاعات کاربر
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard/main/users"
            className="text-green-400 hover:text-green-600 flex items-center gap-2"
          >
            <FaArrowRight /> بازگشت به کاربران
          </Link>
          <h2 className="text-2xl font-bold text-white">ویرایش کاربر</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4"
        >
          {/* نام */}
          <div>
            <label className="text-gray-300 mb-1 block">نام کامل</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* کد سازمانی */}
          <div>
            <label className="text-gray-300 mb-1 block">کد سازمانی</label>
            <input
              type="text"
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* رمز عبور */}
          <div className="relative">
            <label className="text-gray-300 mb-1 block">رمز عبور</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute bottom-3 left-3 transform -translate-y-1/2 text-gray-400 hover:text-green-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* ایمیل */}
          <div>
            <label className="text-gray-300 mb-1 block">ایمیل</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* نقش */}
          <div>
            <label className="text-gray-300 mb-1 block">نقش</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <label className="text-gray-300 mb-1 block">شماره تماس</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* آدرس */}
          <div>
            <label className="text-gray-300 mb-1 block">آدرس</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* تصویر پروفایل */}
          <div>
            <label className="text-gray-300 mb-1 block">تصویر پروفایل</label>
            <div className="flex items-center gap-4">
              <label className="w-1/5 min-w-[140px] flex items-center justify-center border border-gray-700 bg-gray-900 text-white rounded-xl p-3 cursor-pointer hover:bg-gray-800 transition">
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
              {previewNew ? (
                <img
                  src={previewNew}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                />
              ) : previewOld ? (
                <img
                  src={previewOld}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                />
              ) : null}
            </div>
          </div>

          {/* وضعیت */}
          <div>
            <label className="text-gray-300 mb-1 block">وضعیت</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="inactive">غیرفعال</option>
              <option value="active">فعال</option>
              <option value="blocked">مسدود</option>
            </select>
          </div>

          {/* دکمه ذخیره */}
          <div className="text-center mt-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              {isUpdating ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

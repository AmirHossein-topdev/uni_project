"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import DashboardLayout from "../../../layout";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  User,
  IdCard,
  Mail,
  Phone,
  MapPin,
  Shield,
  Activity,
  Camera,
  Save,
  Loader2,
  UserCheck,
} from "lucide-react";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../../../redux/features/userApi";

const ROLE_OPTIONS = [
  { value: "Admin", label: "مدیر کل" },
  { value: "Manager", label: "مدیر ارشد" },
  { value: "Agent", label: "نماینده عملیاتی" },
  { value: "Customer Support", label: "پشتیبانی" },
  { value: "Accountant", label: "امور مالی" },
  { value: "Inspector", label: "بازرس ویژه" },
];

export default function EditUserPage() {
  const router = useRouter();
  const { id } = router.query;
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (id) setUserId(id);
  }, [id]);

  const { data, isLoading, isError } = useGetUserByIdQuery(userId, {
    skip: !userId,
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
  const [previewNew, setPreviewNew] = useState("");

  useEffect(() => {
    if (!data) return;
    setFormData({
      name: data.name ?? "",
      employeeCode: data.employeeCode ?? "",
      password: "",
      role: data.role?.name ?? "",
      email: data.email ?? "",
      contactNumber: data.contactNumber ?? "",
      address: data.address ?? "",
      profileImage: data.profileImage ?? null,
      status: data.status ?? "inactive",
    });
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
        if (key === "password" && !formData[key]) continue;
        formToSend.append(key, formData[key]);
      }
      await updateUser({ id: userId, formData: formToSend }).unwrap();
      await Swal.fire({
        icon: "success",
        title: "بروزرسانی موفق",
        text: "شناسنامه کاربر با موفقیت اصلاح شد",
        confirmButtonText: "تایید",
        confirmButtonColor: "#41bdbb",
        customClass: { popup: "rounded-[2.5rem] font-black" },
      });
      router.push("/dashboard/users");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطا در سیستم",
        text: err?.data?.message || "مشکلی در ذخیره‌سازی رخ داد",
        confirmButtonColor: "#1b4965",
      });
    }
  };

  if (!userId || isLoading)
    return (
      <DashboardLayout>
        <div className="h-screen bg-[#f2fbfa] flex flex-col items-center rounded-4xl justify-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#1b4965]/10 border-t-[#41bdbb] rounded-full animate-spin"></div>
            <User
              className="absolute inset-0 m-auto text-[#1b4965]/20"
              size={32}
            />
          </div>
          <p className="text-[#1b4965] font-black animate-pulse tracking-tighter">
            در حال فراخوانی دیتای امنیتی کاربر...
          </p>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div
        className="min-h-screen rounded-4xl bg-[#f2fbfa] p-4 sm:p-8 lg:p-12"
        dir="rtl"
      >
        {/* هدر صفحه - استایل امیر */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard/users"
              className="w-14 h-14 flex items-center justify-center bg-white text-[#1b4965] rounded-[1.5rem] shadow-sm hover:shadow-[#41bdbb]/30 hover:text-[#41bdbb] transition-all duration-500 border border-white"
            >
              <ArrowRight size={22} />
            </Link>
            <div>
              <h2 className="text-4xl font-[1000] text-[#1b4965] tracking-[ -0.05em]">
                ویرایش <span className="text-[#41bdbb]">شناسنامه</span> کاربر
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-8 h-[3px] bg-[#41bdbb] rounded-full"></span>
                <p className="text-[#1b4965]/50 text-xs font-black uppercase tracking-[0.2em]">
                  Personnel Modification Terminal
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 bg-white/50 backdrop-blur-md p-3 rounded-[2rem] border border-white/50 shadow-sm">
            <div className="bg-[#1b4965] p-3 rounded-2xl shadow-lg">
              <UserCheck className="text-[#41bdbb]" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-[10px] font-black text-[#1b4965]/40 uppercase">
                Target ID
              </p>
              <p className="text-sm font-black text-[#1b4965]">
                {userId.slice(0, 12)}...
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-6xl mx-auto grid grid-cols-12 gap-8"
        >
          {/* بخش سمت راست: پروفایل کاربری */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(1,79,134,0.1)] border border-white flex flex-col items-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#f2fbfa] to-transparent"></div>

              <div className="relative">
                <div className="absolute inset-0 bg-[#41bdbb] rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-40 h-40 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden bg-[#f2fbfa]">
                  <img
                    src={
                      previewNew ||
                      formData.profileImage ||
                      "/assets/img/default-avatar.png"
                    }
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Profile"
                  />
                  <label className="absolute inset-0 bg-[#1b4965]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer backdrop-blur-sm">
                    <Camera className="text-[#41bdbb]" size={32} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <h3 className="mt-6 text-2xl font-black text-[#1b4965]">
                {formData.name || "پرسنل نامشخص"}
              </h3>
              <span className="mt-2 px-4 py-1.5 bg-[#f2fbfa] text-[#41bdbb] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#41bdbb]/10">
                {formData.role || "No Role Assigned"}
              </span>

              <div className="w-full mt-10 space-y-5">
                <div className="p-1 bg-[#f2fbfa] rounded-[2rem] flex gap-1">
                  {["active", "inactive", "blocked"].map((stat) => (
                    <button
                      key={stat}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: stat }))
                      }
                      className={`flex-1 py-3 rounded-[1.5rem] text-[10px] font-black transition-all duration-500 ${
                        formData.status === stat
                          ? "bg-[#1b4965] text-[#41bdbb] shadow-xl"
                          : "text-[#1b4965]/30 hover:text-[#1b4965]"
                      }`}
                    >
                      {stat === "active"
                        ? "فعال"
                        : stat === "inactive"
                          ? "آرشیو"
                          : "مسدود"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* بخش سمت چپ: فیلدهای اطلاعاتی */}
          <div className="col-span-12 lg:col-span-8 bg-white/80 backdrop-blur-2xl p-8 lg:p-14 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(1,79,134,0.1)] border border-white relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* نام کامل */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-[#1b4965]/40 mr-2 uppercase tracking-tighter italic">
                  <User size={14} className="text-[#41bdbb]" /> Full Name
                  Identity
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-5 rounded-[1.8rem] bg-[#f2fbfa] border-2 border-transparent focus:bg-white focus:border-[#41bdbb]/30 focus:shadow-[0_0_40px_rgba(65,189,187,0.1)] transition-all duration-500 text-sm font-black text-[#1b4965]"
                />
              </div>

              {/* کد سازمانی */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-[#1b4965]/40 mr-2 uppercase tracking-tighter italic">
                  <IdCard size={14} className="text-[#41bdbb]" /> Employee Badge
                  ID
                </label>
                <input
                  type="text"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  className="w-full p-5 rounded-[1.8rem] bg-[#f2fbfa] border-2 border-transparent focus:bg-white focus:border-[#41bdbb]/30 transition-all duration-500 text-sm font-black text-[#1b4965]"
                />
              </div>

              {/* ایمیل */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-[#1b4965]/40 mr-2 uppercase tracking-tighter italic">
                  <Mail size={14} className="text-[#41bdbb]" /> Digital Mailbox
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-5 rounded-[1.8rem] bg-[#f2fbfa] border-2 border-transparent focus:bg-white focus:border-[#41bdbb]/30 transition-all duration-500 text-sm font-black text-[#1b4965] text-left font-mono"
                />
              </div>

              {/* نقش */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-[#1b4965]/40 mr-2 uppercase tracking-tighter italic">
                  <Shield size={14} className="text-[#41bdbb]" /> Access
                  Clearance
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-5 rounded-[1.8rem] bg-[#f2fbfa] border-2 border-transparent focus:bg-white focus:border-[#41bdbb]/30 transition-all duration-500 text-sm font-black text-[#1b4965] appearance-none cursor-pointer"
                >
                  <option value="">Select Level...</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* تلفن */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-[#1b4965]/40 mr-2 uppercase tracking-tighter italic">
                  <Phone size={14} className="text-[#41bdbb]" /> Secure Line
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full p-5 rounded-[1.8rem] bg-[#f2fbfa] border-2 border-transparent focus:bg-white focus:border-[#41bdbb]/30 transition-all duration-500 text-sm font-black text-[#1b4965]"
                />
              </div>

              {/* آدرس */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-[#1b4965]/40 mr-2 uppercase tracking-tighter italic">
                  <MapPin size={14} className="text-[#41bdbb]" /> Operational
                  Base
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-5 rounded-[1.8rem] bg-[#f2fbfa] border-2 border-transparent focus:bg-white focus:border-[#41bdbb]/30 transition-all duration-500 text-sm font-black text-[#1b4965]"
                />
              </div>

              {/* رمز عبور */}
              <div className="col-span-1 md:col-span-2 mt-4 space-y-3 relative">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#41bdbb] mr-2 uppercase tracking-widest italic">
                  Update Encryption Password (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-6 rounded-[2rem] bg-[#1b4965]/5 border-2 border-transparent focus:border-[#41bdbb]/40 focus:bg-white transition-all duration-500 text-sm font-black text-[#1b4965] pl-16 shadow-inner"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1b4965]/30 hover:text-[#41bdbb] transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
            </div>

            {/* دکمه‌های عملیاتی */}
            <div className="mt-16 flex flex-col sm:flex-row gap-6 items-center">
              <button
                type="submit"
                disabled={isUpdating}
                className={`w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-4 py-6 rounded-[2rem] font-black text-lg transition-all duration-500 shadow-xl ${
                  isUpdating
                    ? "bg-[#1b4965]/50 cursor-not-allowed text-[#f2fbfa]/50"
                    : "bg-[#1b4965] text-[#f2fbfa] hover:bg-[#153a50] shadow-[#1b4965]/30 hover:shadow-[#41bdbb]/40 border border-[#41bdbb]/20"
                }`}
              >
                {isUpdating ? (
                  <Loader2 className="animate-spin text-[#41bdbb]" size={24} />
                ) : (
                  <Save size={24} className="text-[#41bdbb]" />
                )}
                {isUpdating ? "در حال بازنویسی..." : "ثبت نهایی اصلاحات"}
              </button>

              <div className="flex items-center gap-3 bg-[#f2fbfa] px-6 py-4 rounded-[1.5rem] border border-[#41bdbb]/10 shadow-inner">
                <Activity size={18} className="text-[#41bdbb]" />
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] font-black text-[#1b4965]/40 uppercase tracking-widest">
                    System Timestamp
                  </span>
                  <span className="text-xs font-black text-[#1b4965] mt-1 italic">
                    {new Date().toLocaleTimeString("fa-IR")} |{" "}
                    {new Date().toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

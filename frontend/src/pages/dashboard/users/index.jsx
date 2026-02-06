"use client";

import React, { useState } from "react";
import moment from "moment-jalaali";

import {
  useListUsersQuery,
  useDeleteUserMutation,
} from "../../../redux/features/userApi";
import {
  UserPlus,
  Search,
  ArrowRight,
  Edit3,
  Trash2,
  ShieldCheck,
  Phone,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../layout";
import Swal from "sweetalert2";

// --- کامپوننت کارت موبایل با پالت Deep Space & Sky Blue ---
const UserCard = ({ user, index, handleDelete }) => {
  const isActive = user.status === "active";

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(1,42,74,0.08)] border border-[#cfe7f2] hover:border-[#468faf]/40 transition-all duration-300">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt=""
                className="w-14 h-14 rounded-[1.2rem] object-cover border border-[#a9d6e5]"
              />
            ) : (
              <div className="w-14 h-14 bg-[#dfedf3] text-[#012a4a] rounded-[1.2rem] flex items-center justify-center font-black text-xl border border-[#cfe7f2]">
                {user.name.charAt(0)}
              </div>
            )}
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isActive ? "bg-[#025ca1]" : "bg-slate-300"}`}
            />
          </div>
          <div>
            <h3 className="font-black text-[#012a4a] text-base">{user.name}</h3>
            <p className="text-[11px] text-[#468faf] font-black uppercase tracking-widest">
              {user.role.name}
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-black ${isActive ? "bg-[#eef7fa] text-[#2a6f97]" : "bg-slate-50 text-slate-400"}`}
        >
          {isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {isActive ? "فعال" : "غیرفعال"}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-[#2c7da0] text-xs font-bold bg-[#f2fbfa]/30 p-2 rounded-lg">
          <ShieldCheck size={16} className="text-[#61a5c2]" />
          <span>کد پرسنلی: {user.employeeCode}</span>
        </div>
        <div className="flex items-center gap-3 text-[#2c7da0] text-xs font-bold bg-[#f2fbfa]/30 p-2 rounded-lg">
          <Phone size={16} className="text-[#61a5c2]" />
          <span>{user.contactNumber || "بدون شماره"}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/dashboard/users/${user._id}/edit`}
          className="flex-1 flex items-center justify-center gap-2 bg-[#01497c] text-white py-3 rounded-2xl text-xs font-bold hover:bg-[#012a4a] transition-all shadow-lg shadow-[#01497c]/20"
        >
          <Edit3 size={14} /> ویرایش
        </Link>
        <button
          onClick={() => handleDelete(user._id)}
          className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch } = useListUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  moment.loadPersian({ dialect: "persian-modern" });

  const users = Array.isArray(data) ? data : [];

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "حذف کاربر سیستم",
      text: "آیا از خروج این کاربر از لیست اطمینان دارید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
      confirmButtonColor: "#012a4a",
      cancelButtonColor: "#89c2d9",
      background: "#eef7fa",
      customClass: { popup: "rounded-[2.5rem] font-sans" },
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id).unwrap();
        Swal.fire({
          title: "حذف شد",
          icon: "success",
          confirmButtonColor: "#2c7da0",
        });
        refetch();
      } catch (err) {
        Swal.fire({ title: "خطا در برقراری ارتباط", icon: "error" });
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  console.log("====================================");
  console.log(filteredUsers);
  console.log("====================================");
  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-16 h-16 border-[6px] border-[#d9e9f0] border-t-[#014f86] rounded-full animate-spin mb-6" />
          <p className="text-[#014f86] font-black text-lg animate-pulse tracking-tighter">
            در حال بارگذاری پایگاه داده...
          </p>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-10 min-h-screen bg-[#eef7fa] rounded-[4rem] shadow-inner border border-white/50">
        {/* هدر صفحه */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="p-4 bg-white shadow-xl shadow-[#012a4a]/5 text-[#012a4a] rounded-[1.5rem] hover:bg-[#012a4a] hover:text-white transition-all duration-500 group"
            >
              <ArrowRight
                size={24}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </Link>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#012a4a] tracking-tighter">
                مدیریت پرسنل
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 w-10 bg-[#0179cf] rounded-full"></div>
                <p className="text-[#468faf] text-[11px] font-black uppercase tracking-widest">
                  System User Directory
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/users/create"
            className="group flex items-center gap-3 bg-gradient-to-br from-[#014f86] to-[#012a4a] text-white px-8 py-5 rounded-[2rem] text-sm font-black shadow-[0_20px_40px_-10px_rgba(1,42,74,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(1,42,74,0.4)] hover:-translate-y-1 transition-all active:scale-95"
          >
            <UserPlus size={20} className="text-[#89c2d9]" />
            ثبت کاربر جدید
          </Link>
        </div>

        {/* فیلد جستجو */}
        <div className="flex flex-row items-center gap-4 mb-10 w-full">
          {/* بخش جستجو */}
          <div className="relative group flex-1">
            <div className="absolute inset-0 bg-[#014f86]/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <Search
              className="absolute right-6 top-1/2 -translate-y-1/2 text-[#61a5c2] group-focus-within:text-[#012a4a] transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="جستجو بر اساس نام یا کد شناسایی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full bg-white/80 backdrop-blur-md border-2 border-[#cfe7f2] text-[#012a4a] rounded-2xl py-4 pr-14 pl-6 outline-none focus:border-[#014f86] focus:bg-white transition-all placeholder:text-[#61a5c2] font-bold shadow-sm text-sm"
            />
          </div>

          {/* دکمه فیلتر هوشمند */}
          <button
            className="group relative flex items-center justify-center bg-white border-2 border-[#cfe7f2] text-[#014f86] p-4 rounded-2xl hover:border-[#014f86] hover:bg-[#014f86] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
            title="فیلتر پیشرفته"
          >
            <div className="absolute -inset-1 bg-[#014f86]/10 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            {/* نشانگر تعداد فیلتر فعال (اختیاری) */}
            <span className="absolute -top-1 -left-1 w-4 h-4 bg-[#0d99fd] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-black shadow-sm">
              ۲
            </span>
          </button>
        </div>

        {/* جدول دسکتاپ با تم Deep Space */}
        <div className="hidden lg:block bg-white/70 backdrop-blur-md rounded-[2rem] shadow-[0_40px_100px_-30px_rgba(1,42,74,0.1)] border border-white overflow-hidden">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gradient-to-r from-[#012a4a] to-[#014f86] text-white">
                <th className="py-6 px-10 text-sm font-black uppercase tracking-[2px] opacity-90">
                  اطلاعات هویتی
                </th>
                <th className="py-6 px-6 text-sm font-black uppercase tracking-[2px] opacity-90">
                  شناسه سیستم
                </th>
                <th className="py-6 px-6 text-sm font-black uppercase tracking-[2px] opacity-90 text-center">
                  تاریخ عضویت
                </th>
                <th className="py-6 px-6 text-sm font-black uppercase tracking-[2px] opacity-90 text-center">
                  نقش کاربری
                </th>
                <th className="py-6 px-6 text-sm font-black uppercase tracking-[2px] opacity-90 text-center">
                  وضعیت دسترسی
                </th>

                <th className="py-6 px-10 text-sm font-black uppercase tracking-[2px] opacity-90 text-center">
                  عملیات مدیریت
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9e9f0]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Search size={64} />
                      <p className="text-2xl font-black">هیچ کاربری یافت نشد</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white transition-all group duration-300"
                  >
                    <td className="py-1 px-10 ">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profileImage}
                          className="w-14 h-14 rounded-2xl bg-[#dfedf3] flex items-center justify-center text-[#012a4a] font-black border-2 border-cyan-600 shadow-sm group-hover:rotate-6 transition-transform"
                        ></img>
                        <div>
                          <p className="text-[#012a4a] font-black text-base group-hover:text-[#0179cf] transition-colors">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-[#468faf] font-bold mt-0.5">
                            {user.contactNumber || "ثبت نشده"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-7 px-6">
                      <span className="font-mono text-xs font-black text-[#014f86] bg-[#eef7fa] px-3 py-1.5 rounded-lg border border-[#a9d6e5]">
                        {user.employeeCode}
                      </span>
                    </td>
                    <td className="py-7 px-6">
                      <span className="font-mono text-xs font-black text-[#014f86] bg-[#eef7fa] px-3 py-1.5 rounded-lg border border-[#a9d6e5]">
                        {moment(user.createdAt).format("jD jMMMM jYYYY")}
                      </span>
                    </td>

                    <td className="py-7 px-6 text-center">
                      <span className="bg-[#dfedf3] text-[#2c7da0] px-5 py-2 rounded-2xl text-[11px] font-black border border-[#cfe7f2]">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-7 px-6 text-center">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-tighter shadow-sm border ${user.status === "active" ? "bg-[#e7f3f7] text-[#025ca1] border-[#a0cee0]" : "bg-slate-50 text-slate-400 border-slate-100"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-[#0d99fd] animate-pulse" : "bg-slate-300"}`}
                          />
                          {user.status === "active" ? "دسترسی فعال" : "غیرفعال"}
                        </span>
                      </div>
                    </td>
                    <td className="py-7 px-10 text-center">
                      <div className="flex justify-center gap-3">
                        <Link
                          href={`/dashboard/users/${user._id}/edit`}
                          className="p-3 text-[#014f86] bg-[#eef7fa] hover:bg-[#014f86] hover:text-white rounded-2xl transition-all shadow-sm border border-[#a9d6e5]"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-2xl transition-all border border-rose-100 shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* نمایش کارت در موبایل */}
        <div className="lg:hidden grid grid-cols-1 gap-8">
          {filteredUsers.map((user, index) => (
            <UserCard
              key={user._id}
              user={user}
              index={index}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

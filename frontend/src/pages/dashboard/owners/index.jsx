"use client";

import React, { useState } from "react";
import {
  useGetOwnersQuery,
  useDeleteOwnerMutation,
} from "../../../redux/features/ownerApi";
import {
  Edit3,
  Trash2,
  Plus,
  Search,
  ArrowRight,
  User,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Briefcase,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../layout";

// --- کامپوننت کارت موبایل به سبک امیر ---
const OwnerCard = ({ owner, index, handleDelete }) => {
  const isActive = owner.status === "active";

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-sm hover:shadow-xl hover:shadow-[#014f86]/5 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-5 pb-4 border-b border-[#cfe7f2]">
        <div className="flex items-center gap-4">
          <div className="relative">
            {owner.photo ? (
              <img
                src={`http://localhost:7000${owner.photo}`}
                alt={owner.name}
                className="w-14 h-14 object-cover rounded-2xl border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-14 h-14 flex items-center justify-center bg-[#eef7fa] text-[#014f86] rounded-2xl border-2 border-white shadow-sm font-black text-xl">
                {owner.name.charAt(0)}
              </div>
            )}
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isActive ? "bg-[#41bdbb]" : "bg-gray-400"}`}
            ></div>
          </div>
          <div>
            <h3 className="font-black text-[#012a4a] text-lg leading-tight">
              {owner.name}
            </h3>
            <span className="text-[10px] text-[#468faf] font-black uppercase tracking-widest">
              {owner.type === "individual" ? "مالک حقیقی" : "مالک حقوقی"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs font-bold text-[#61a5c2]">
          <CreditCard size={14} className="text-[#014f86]" />
          <span>کد ملی: {owner.nationalId || "---"}</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-[#61a5c2]">
          <Phone size={14} className="text-[#014f86]" />
          <span>تماس: {owner.phone || "---"}</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-[#61a5c2] truncate">
          <Mail size={14} className="text-[#014f86]" />
          <span>{owner.email || "---"}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Link
          href={`/dashboard/owners/${owner._id}/edit`}
          className="flex-1 flex items-center justify-center gap-2 bg-[#eef7fa] text-[#014f86] py-3 rounded-2xl text-[11px] font-black hover:bg-[#014f86] hover:text-white transition-all"
        >
          <Edit3 size={14} /> ویرایش
        </Link>
        <button
          onClick={() => handleDelete(owner._id)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-2xl text-[11px] font-black hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 size={14} /> حذف
        </button>
      </div>
    </div>
  );
};

export default function OwnersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch } = useGetOwnersQuery();
  const owners = Array.isArray(data) ? data : data?.data?.owners || [];
  const [deleteOwner] = useDeleteOwnerMutation();

  const handleDelete = async (id) => {
    if (window.confirm("آیا از حذف این مالک در سامانه مطمئن هستید؟")) {
      try {
        await deleteOwner(id).unwrap();
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.nationalId?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-[#014f86] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-[#014f86] animate-pulse">
            در حال فراخوانی اطلاعات مالکین...
          </p>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#eef7fa] text-[#012a4a] p-4 lg:p-10 rounded-[3rem] border border-white/50 shadow-sm">
        {/* هدر صفحه به سبک امیر */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link
                href="/dashboard"
                className="p-2 bg-white rounded-xl text-[#014f86] shadow-sm hover:bg-[#014f86] hover:text-white transition-all"
              >
                <ArrowRight size={20} />
              </Link>
              <h1 className="text-3xl font-black text-[#012a4a] tracking-tighter">
                مدیریت ذینفعان
              </h1>
            </div>
            <p className="text-[#468faf] text-xs font-bold mr-11 tracking-widest uppercase">
              لیست جامع مالکین و مستاجرین سامانه
            </p>
          </div>

          <Link
            href="/dashboard/owners/create"
            className="flex items-center justify-center gap-3 bg-[#014f86] text-white px-8 py-4 rounded-[1.8rem] text-sm font-black shadow-lg shadow-[#014f86]/20 hover:scale-105 transition-all active:scale-95"
          >
            <Plus size={20} /> افزودن مالک جدید
          </Link>
        </div>

        {/* جستجوی هوشمند امیر */}
        <div className="relative group mb-10">
          <input
            type="text"
            placeholder="جستجوی سریع در اسناد (نام، کد ملی، شماره تماس...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/70 backdrop-blur-md border-2 border-white rounded-[2rem] py-5 px-14 text-sm font-bold focus:ring-4 focus:ring-[#014f86]/5 focus:border-[#014f86] outline-none transition-all shadow-sm placeholder:text-[#61a5c2]/50"
          />
          <Search
            className="absolute right-6 top-5.5 text-[#014f86]"
            size={22}
          />
        </div>

        {/* --- نمایش جدولی دسکتاپ (High-Tech Table) --- */}
        <div className="hidden md:block overflow-hidden bg-white/60 backdrop-blur-sm rounded-[3rem] border border-white shadow-xl shadow-[#014f86]/5">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#012a4a] text-white">
                <th className="py-6 px-6 text-xs font-black uppercase tracking-widest opacity-70">
                  مشخصات مالک
                </th>
                <th className="py-6 px-6 text-xs font-black uppercase tracking-widest opacity-70">
                  هویت ملی
                </th>
                <th className="py-6 px-6 text-xs font-black uppercase tracking-widest opacity-70">
                  ارتباطات
                </th>
                <th className="py-6 px-6 text-xs font-black uppercase tracking-widest opacity-70 text-center">
                  وضعیت
                </th>
                <th className="py-6 px-6 text-xs font-black uppercase tracking-widest opacity-70 text-center">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfe7f2]">
              {filteredOwners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <Search size={48} />
                      <p className="font-black text-xl">هیچ موردی یافت نشد</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner, index) => (
                  <tr
                    key={owner._id}
                    className="hover:bg-white transition-colors group"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#eef7fa] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm group-hover:rotate-3 transition-transform">
                          {owner.photo ? (
                            <img
                              src={`http://localhost:7000${owner.photo}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="text-[#014f86]" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-[#012a4a] text-sm">
                            {owner.name}
                          </p>
                          <p className="text-[10px] font-bold text-[#61a5c2]">
                            {owner.type === "individual" ? "حقیقی" : "حقوقی"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 font-bold text-sm text-[#014f86]">
                      {owner.nationalId || "---"}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#468faf]">
                          <Phone size={12} /> {owner.phone}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#61a5c2]">
                          <Mail size={12} /> {owner.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black ${
                          owner.status === "active"
                            ? "bg-[#e5f6f6] text-[#41bdbb] border border-[#41bdbb]/20"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${owner.status === "active" ? "bg-[#41bdbb] animate-pulse" : "bg-gray-400"}`}
                        ></div>
                        {owner.status === "active" ? "تایید شده" : "تعلیق شده"}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/dashboard/owners/${owner._id}/edit`}
                          className="p-3 bg-[#eef7fa] text-[#014f86] rounded-xl hover:bg-[#014f86] hover:text-white transition-all shadow-sm"
                          title="ویرایش"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(owner._id)}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- نمایش کارتی موبایل --- */}
        <div className="md:hidden grid grid-cols-1 gap-6">
          {filteredOwners.map((owner, index) => (
            <OwnerCard
              key={owner._id}
              owner={owner}
              index={index}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

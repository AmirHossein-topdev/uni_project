"use client";

import React, { useState } from "react";
import {
  useGetOwnersQuery,
  useDeleteOwnerMutation,
} from "../../../../redux/features/ownerApi";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaArrowRight, // تغییر جهت آیکون برای زبان فارسی
} from "react-icons/fa";
import Link from "next/link";
import DashboardLayout from "../../layout";

// کامپوننت کمکی برای نمایش یک مالک در حالت کارتی (مخصوص موبایل)
const OwnerCard = ({ owner, index, handleDelete }) => {
  const statusColor =
    owner.status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-200 text-gray-600";
  const statusText = owner.status === "active" ? "فعال" : "غیرفعال";

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-start mb-3 border-b pb-3 border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {owner.photo ? (
            <img
              src={`http://localhost:7000${owner.photo}`}
              alt={owner.name}
              className="w-12 h-12 object-cover rounded-full border-2 border-green-500"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-full text-lg font-bold">
              {owner.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              {owner.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              #{index + 1} - {owner.type === "individual" ? "شخصی" : "سازمانی"}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
        >
          {statusText}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-medium">کد ملی:</span> {owner.nationalId || "-"}
        </p>
        <p className="truncate">
          <span className="font-medium">شماره تماس:</span> {owner.phone || "-"}
        </p>
        <p className="col-span-2 truncate">
          <span className="font-medium">ایمیل:</span> {owner.email || "-"}
        </p>
        <p className="col-span-2 text-xs text-gray-500 dark:text-gray-400 truncate">
          <span className="font-medium">آدرس:</span> {owner.address || "-"}
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <Link
          href={`/dashboard/main/owners/${owner._id}/edit`}
          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs transition-all font-medium"
        >
          <FaEdit /> ویرایش
        </Link>
        <button
          onClick={() => handleDelete(owner._id)}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition-all font-medium"
        >
          <FaTrash /> حذف
        </button>
      </div>
    </div>
  );
};

export default function OwnersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch } = useGetOwnersQuery();
  // اطمینان از ساختار داده
  const owners = Array.isArray(data) ? data : data?.data?.owners || [];

  const [deleteOwner] = useDeleteOwnerMutation();

  const handleDelete = async (id) => {
    if (window.confirm("آیا از حذف این مالک مطمئن هستید؟")) {
      try {
        await deleteOwner(id).unwrap();
        alert("✅ مالک با موفقیت حذف شد");
        refetch();
      } catch (err) {
        console.error(err);
        alert("❌ خطا در حذف مالک");
      }
    }
  };

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.orgId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.nationalId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex justify-center py-10 text-green-600 dark:text-green-400 font-semibold text-lg animate-pulse">
          در حال بارگذاری مالکان... لطفاً صبر کنید.
        </div>
      </DashboardLayout>
    );

  if (isError)
    return (
      <DashboardLayout>
        <div className="flex justify-center py-10 text-red-600 dark:text-red-400 font-semibold text-lg">
          ❌ خطا در دریافت اطلاعات مالکان. لطفاً اتصال خود را بررسی کنید.
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header and Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            {/* دکمه بازگشت برای UX بهتر */}
            <Link
              href="/dashboard/main"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="بازگشت"
            >
              <FaArrowRight size={20} />
            </Link>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white">
              مدیریت مالکان
            </h2>
          </div>
          <Link
            href="/dashboard/main/owners/create"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-base font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <FaPlus /> افزودن مالک جدید
          </Link>
        </div>

        {/* Search Input */}
        <div className="mb-6 flex items-center relative">
          <input
            type="text"
            placeholder="جستجو بر اساس نام، ایمیل، کد ملی، شماره تماس یا شناسه سازمانی..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
            style={{ paddingRight: "2.5rem" }} // ایجاد فضای مناسب برای آیکون
          />
          <FaSearch className="absolute right-3 text-gray-400" />
        </div>

        {/* --- نمایش جدولی (برای دسکتاپ و تبلت) --- */}
        <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          <table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
              <tr className="text-right text-xs uppercase tracking-wider">
                <th className="py-3 px-4 w-10">#</th>
                <th className="py-3 px-4 text-center">نام مالک</th>
                <th className="py-3 px-4">کد ملی</th>
                <th className="py-3 px-4">شناسه سازمانی</th>
                <th className="py-3 px-4">ایمیل</th>
                <th className="py-3 px-4">شماره تماس</th>
                <th className="py-3 px-4">نوع</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">آدرس</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {filteredOwners.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-10 text-gray-400 dark:text-gray-300 font-medium text-lg"
                  >
                    🔍 هیچ مالکی با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner, index) => (
                  <tr
                    key={owner._id}
                    className="text-right border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3 px-4 font-mono">{index + 1}</td>
                    <td className="py-3 px-4 font-semibold text-center flex items-center justify-center gap-3">
                      {owner.photo ? (
                        <img
                          src={`http://localhost:7000${owner.photo}`}
                          alt={owner.name}
                          className="w-10 h-10 object-cover rounded-full shadow-md"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                          {owner.name.charAt(0)}
                        </div>
                      )}
                      {owner.name}
                    </td>
                    <td className="py-3 px-4">{owner.nationalId || "-"}</td>
                    <td className="py-3 px-4">{owner.orgId || "-"}</td>
                    <td className="py-3 px-4 truncate max-w-xs">
                      {owner.email || "-"}
                    </td>
                    <td className="py-3 px-4">{owner.phone || "-"}</td>
                    <td className="py-3 px-4">
                      {owner.type === "individual" ? "شخصی" : "سازمانی"}
                    </td>
                    <td className="py-3 px-4">
                      {owner.status === "active" ? (
                        <span className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                          فعال
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium">
                          غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-xs">
                      {owner.address || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/dashboard/main/owners/${owner._id}/edit`}
                          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs transition-all"
                        >
                          <FaEdit /> ویرایش
                        </Link>
                        <button
                          onClick={() => handleDelete(owner._id)}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition-all"
                        >
                          <FaTrash /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- نمایش کارتی (برای موبایل و تبلت‌های کوچک) --- */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {filteredOwners.length === 0 ? (
            <div className="text-center py-10 text-gray-400 dark:text-gray-300 font-medium text-lg">
              🔍 هیچ مالکی با این مشخصات یافت نشد.
            </div>
          ) : (
            filteredOwners.map((owner, index) => (
              <OwnerCard
                key={owner._id}
                owner={owner}
                index={index}
                handleDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import React, { useState } from "react";
import {
  useGetOwnersQuery,
  useDeleteOwnerMutation,
} from "../../../../redux/features/ownerApi";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import DashboardLayout from "../../layout";

export default function OwnersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch } = useGetOwnersQuery();
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
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.orgId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex justify-center py-10 text-blue-600 font-semibold text-lg">
          در حال بارگذاری مالکان...
        </div>
      </DashboardLayout>
    );

  if (isError)
    return (
      <DashboardLayout>
        <div className="flex justify-center py-10 text-red-600 font-semibold text-lg">
          خطا در دریافت اطلاعات مالکان
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-5 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            مدیریت مالکان
          </h2>
          <Link
            href="/dashboard/main/owners/create"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm transition-all"
          >
            <FaPlus /> افزودن مالک جدید
          </Link>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="جستجو بر اساس نام، ایمیل، شماره تماس یا شناسه سازمانی..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <FaSearch className="text-gray-500" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr className="text-center">
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-2">نام مالک</th>
                <th className="py-3 px-2">کد ملی</th>
                <th className="py-3 px-2">شناسه سازمانی</th>
                <th className="py-3 px-2">ایمیل</th>
                <th className="py-3 px-2">شماره تماس</th>
                <th className="py-3 px-2">نوع</th>
                <th className="py-3 px-2">وضعیت</th>
                <th className="py-3 px-2">آدرس</th>
                <th className="py-3 px-2">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {filteredOwners.length == 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-8 text-gray-400 dark:text-gray-300 font-medium"
                  >
                    هیچ مالکی یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner, index) => (
                  <tr
                    key={owner._id}
                    className="text-center border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3">{index + 1}</td>
                    <td className="font-semibold flex items-center gap-2">
                      {owner.photo ? (
                        <img
                          src={`http://localhost:7000${owner.photo}`} // توجه: آدرس سرور backend
                          alt={owner.name}
                          className="w-12 h-12 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      )}
                      {owner.name}
                    </td>
                    <td>{owner.nationalId || "-"}</td>
                    <td>{owner.orgId || "-"}</td>
                    <td>{owner.email || "-"}</td>
                    <td>{owner.phone || "-"}</td>
                    <td>{owner.type === "individual" ? "شخصی" : "سازمانی"}</td>
                    <td>
                      {owner.status === "active" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          فعال
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="max-w-xs truncate">
                      {owner.address || "-"}
                    </td>
                    <td>
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

        {/* Responsive note */}
        <p className="text-xs text-gray-500 mt-3 text-center md:hidden">
          برای مشاهده کامل جدول، صفحه را به چپ و راست بکشید ↔️
        </p>
      </div>
    </DashboardLayout>
  );
}

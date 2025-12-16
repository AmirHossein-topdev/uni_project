"use client";

import React, { useState } from "react";
import {
  useListUsersQuery,
  useDeleteUserMutation,
} from "../../../../redux/features/userApi";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";
import DashboardLayout from "../../layout";
import Swal from "sweetalert2";

// کارت کاربران برای موبایل
const UserCard = ({ user, index, handleDelete }) => {
  const statusColor =
    user.status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-200 text-gray-600";
  const statusText = user.status === "active" ? "فعال" : "غیرفعال";

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-start mb-3 border-b pb-3 border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-12 h-12 object-cover rounded-full border-2 border-green-500"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-full text-lg font-bold">
              {user.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              #{index + 1} - {user.role.name}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
        >
          {statusText}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-medium">کد سازمانی:</span> {user.employeeCode}
        </p>
        <p>
          <span className="font-medium">شماره تماس:</span>{" "}
          {user.contactNumber || "-"}
        </p>
        <p>
          <span className="font-medium">آدرس:</span> {user.address || "-"}
        </p>
        <p>
          <span className="font-medium">تاریخ تغییر رمز عبور:</span>{" "}
          {user.passwordChangedAt
            ? new Date(user.passwordChangedAt).toLocaleString()
            : "-"}
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <Link
          href={`/dashboard/main/users/${user._id}/edit`}
          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs transition-all font-medium"
        >
          <FaEdit /> ویرایش
        </Link>
        <button
          onClick={() => handleDelete(user._id)}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition-all font-medium"
        >
          <FaTrash /> حذف
        </button>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch } = useListUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const users = Array.isArray(data) ? data : [];

  // تابع حذف کاربر با SweetAlert2
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "آیا از حذف این کاربر مطمئن هستید؟",
      text: "این عملیات غیرقابل بازگشت است!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "خیر",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id).unwrap();
        Swal.fire("حذف شد!", "کاربر با موفقیت حذف شد.", "success");
        refetch();
      } catch (err) {
        console.error(err);
        Swal.fire("خطا!", "در حذف کاربر مشکلی پیش آمد.", "error");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex justify-center py-10 text-cyan-600  font-semibold text-lg animate-pulse">
          در حال بارگذاری کاربران... لطفاً صبر کنید.
        </div>
      </DashboardLayout>
    );

  if (isError)
    return (
      <DashboardLayout>
        <div className="flex justify-center py-10 text-red-600 font-semibold text-lg">
          ❌ خطا در دریافت اطلاعات کاربران. لطفاً اتصال خود را بررسی کنید.
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-cyan-950 rounded-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/main"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="بازگشت"
            >
              <FaArrowRight size={20} />
            </Link>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white">
              مدیریت کاربران
            </h2>
          </div>
          <Link
            href="/dashboard/main/users/create"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-base font-medium transition-all shadow-md hover:shadow-lg"
          >
            <FaPlus /> افزودن کاربر جدید
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center relative">
          <input
            type="text"
            placeholder="جستجو بر اساس نام، کد سازمانی، شماره تماس یا آدرس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
          />
          <FaSearch className="absolute right-3 text-gray-400" />
        </div>

        {/* جدول دسکتاپ */}
        <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          <table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
              <tr className="text-right text-xs uppercase tracking-wider">
                <th className="py-3 px-4 w-10">#</th>
                <th className="py-3 px-4">نام</th>
                <th className="py-3 px-4">کد سازمانی</th>
                <th className="py-3 px-4">شماره تماس</th>
                <th className="py-3 px-4">آدرس</th>
                <th className="py-3 px-4">نقش</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">تاریخ آخرین تغییر رمز عبور</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-10 text-gray-400 dark:text-gray-300 font-medium text-lg"
                  >
                    🔍 هیچ کاربری یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="text-right border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3 px-4 font-mono">{index + 1}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-10 h-10 object-cover rounded-full shadow-md"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      {user.name}
                    </td>
                    <td className="py-3 px-4">{user.employeeCode}</td>
                    <td className="py-3 px-4">{user.contactNumber || "-"}</td>
                    <td className="py-3 px-4">{user.address || "-"}</td>
                    <td className="py-3 px-4">{user.role.name}</td>
                    <td className="py-3 px-4">{user.status}</td>
                    <td className="py-3 px-4">
                      {user.passwordChangedAt
                        ? new Date(user.passwordChangedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      <Link
                        href={`/dashboard/main/users/${user._id}/edit`}
                        className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs transition-all"
                      >
                        <FaEdit /> ویرایش
                      </Link>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition-all"
                      >
                        <FaTrash /> حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* کارت موبایل */}
        <div className="md:hidden grid grid-cols-1 gap-4">
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

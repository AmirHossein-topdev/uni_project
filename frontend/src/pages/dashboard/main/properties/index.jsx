"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // در Next 13+ از navigation استفاده می‌شود
import {
  Plus,
  Search,
  Eye,
  Edit3,
  Building2,
  List as ListIcon,
  RefreshCw,
  ListFilter,
  Trash,
} from "lucide-react";
import DashboardLayout from "../../layout";
import Swal from "sweetalert2";
import PropertyQuickViewModal from "../../components/PropertyQuickViewModal";

// استایل‌های امضای X1
const glassCard =
  "bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)]";
const actionBtn =
  "p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm";

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (prop) => {
    setSelectedProperty(prop);
    setIsModalOpen(true);
  };
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      // مرحله 1: گرفتن لیست پایه
      const res = await fetch("http://localhost:7000/api/properties");
      if (!res.ok) throw new Error("خطا در دریافت لیست املاک");
      const data = await res.json();
      const propertiesArray = Array.isArray(data) ? data : data.data || [];

      // مرحله 2: گرفتن داده full برای هر ملک
      const fullProperties = await Promise.all(
        propertiesArray.map(async (p) => {
          try {
            const resFull = await fetch(
              `http://localhost:7000/api/properties/${p._id}/full`
            );
            if (!resFull.ok) return p; // اگر full نشد، حداقل status رو برگردون
            const fullData = await resFull.json();
            return {
              ...p,
              ...fullData, // این شامل ownership، identity، location و ... میشه
            };
          } catch (err) {
            return p;
          }
        })
      );

      setProperties(fullProperties);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // فیلتر کردن املاک بر اساس جستجو
  const filteredProperties = properties.filter(
    (p) =>
      p.identity?.title?.includes(searchTerm) ||
      p.status?.propertyIdCode?.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 md:p-8 space-y-8 bg-[#f8fafc] text-black rounded-2xl">
        {/* هدر هوشمند */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">
              مدیریت املاک
            </h1>
            <p className="text-slate-500 font-medium">
              لیست جامع و کنترل وضعیت دارایی‌های ملکی
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProperties}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all active:rotate-180 duration-500"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={() => router.push("/dashboard/main/properties/create")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95"
            >
              <Plus size={20} />
              ثبت ملک جدید
            </button>
          </div>
        </div>

        {/* نوار ابزار و جستجو */}
        <div
          className={`${glassCard} p-4 rounded-[2rem] flex flex-col md:flex-row gap-4 items-center`}
        >
          <div className="relative flex-1 w-full">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="جستجو در عنوان، کد ملک یا شناسه..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-slate-100/50 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700">
              <ListFilter size={18} />
              فیلتر
            </button>
          </div>
        </div>

        {/* محتوای اصلی */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-slate-500 font-bold animate-pulse">
              در حال فراخوانی لیست املاک...
            </span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] text-center">
            <p className="text-red-600 font-bold">{error}</p>
            <button
              onClick={fetchProperties}
              className="mt-4 text-red-700 underline font-bold"
            >
              تلاش مجدد
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className={`${glassCard} py-24 rounded-[3rem] text-center`}>
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              هیچ ملکی یافت نشد
            </h3>
            <p className="text-slate-500 mt-2">
              لیست املاک در حال حاضر خالی است یا جستجوی شما نتیجه‌ای نداشت.
            </p>
          </div>
        ) : (
          <div className={`${glassCard} rounded-[2.5rem] overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      نام کاربری
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      نام واحد
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      تاریخ ایجاد
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      نام استان
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      نام شهرستان
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      کد شناسایی ملک
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      اعیان
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      کد ملک
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      عنوان اعیان
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      عنوان عرصه
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      نوع ملک
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      وضعیت ملک
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      مالک
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      نوع بهره برداری
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      وضعیت پرونده
                    </th>
                    <th className="p-4 text-slate-400 font-bold text-xs text-center">
                      نمایش/ویرایش
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProperties.map((property) => (
                    <tr
                      key={property._id}
                      className="group hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="p-4 text-sm ">
                        {property.user?.name || "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.unit?.name || "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.createdAt
                          ? new Date(property.createdAt).toLocaleDateString(
                              "fa-IR"
                            )
                          : "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.location?.province || "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.location?.city || "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.status?.propertyIdCode || "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.isAyan ? "✔" : "❌"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.status?.propertyNumber || "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.identity?.ayanTitle || "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.identity?.arsehTitle || "---"}
                      </td>
                      <td className="p-4 text-sm ">{property.type || "---"}</td>
                      <td className="p-4 text-sm ">
                        {property.status?.statusText || "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.ownership?.ownerName || "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.ownership?.usageType || "---"}
                      </td>
                      <td className="p-4 text-sm ">
                        {property.caseStatus || "---"}
                      </td>
                      <td className="p-4 flex gap-2">
                        <div>
                          {/* دکمه شما در جدول */}
                          <button
                            onClick={() => handleOpenModal(property)} // به جای ریدایرکت مستقیم، مودال باز شود
                            className={`${actionBtn} bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white`}
                            title="مشاهده سریع"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/main/properties/${property._id}/edit`
                            )
                          }
                          className={`${actionBtn} bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white`}
                          title="ویرایش ملک"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: "حذف ملک",
                              text: "آیا مطمئن هستید که می‌خواهید این ملک و همه وابستگی‌های آن را حذف کنید؟",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "بله، حذف کن",
                              cancelButtonText: "لغو",
                              reverseButtons: true,
                            });

                            if (result.isConfirmed) {
                              try {
                                const res = await fetch(
                                  `http://localhost:7000/api/properties/${property._id}`,
                                  { method: "DELETE" }
                                );
                                if (!res.ok) throw new Error("خطا در حذف ملک");

                                Swal.fire({
                                  title: "حذف شد!",
                                  text: "ملک با موفقیت حذف شد.",
                                  icon: "success",
                                  timer: 2000,
                                  showConfirmButton: false,
                                });

                                fetchProperties(); // جدول دوباره بارگذاری می‌شود
                              } catch (err) {
                                Swal.fire("خطا", err.message, "error");
                              }
                            }
                          }}
                          className={`${actionBtn} bg-red-50 text-red-600 hover:bg-red-600 hover:text-white`}
                          title="حذف ملک"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* کامپوننت مودال */}
      <PropertyQuickViewModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
}

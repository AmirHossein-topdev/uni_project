"use client";
import XLSX from "xlsx-js-style";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  FileDownIcon,
  FileDown,
  ChevronLeft,
  Calendar,
  MapPin,
  ShieldCheck,
  Hash,
  Filter,
} from "lucide-react";
import DashboardLayout from "../layout";
import ExportExcelButton from "../components/ExportExcelButton";
import Swal from "sweetalert2";
import PropertyQuickViewModal from "../components/PropertyQuickViewModal";
import PropertyFilterModal from "../components/PropertyFilterModal";
import { useGetLocationEnumsQuery } from "@/redux/features/locationApi";
// --- امضای طراحی امیر: سیستم استایل‌دهی پیشرفته ---
const amirGlass =
  "bg-white/80 backdrop-blur-2xl border-2 border-white/60 shadow-[0_25px_50px_-12px_rgba(1,79,134,0.1)]";
const amirActionBtn =
  "p-3 rounded-2xl transition-all duration-500 hover:scale-110 active:scale-95 shadow-sm border border-white";
const amirHeaderLabel =
  "text-[10px] font-black uppercase tracking-[0.2em] text-[#468faf] mb-1 block";

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: locationData,
    isLoading: isLocationLoading,
    error: locationError,
  } = useGetLocationEnumsQuery();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]); // [{field, operator, value, province?}]
  const [appliedSort, setAppliedSort] = useState(null); // 'newest' | 'oldest' | null

  const handleOpenModal = (prop) => {
    setSelectedProperty(prop);
    setIsModalOpen(true);
  };

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:7000/api/properties");
      if (!res.ok) throw new Error("خطا در دریافت لیست املاک");
      const json = await res.json();
      const propertiesArray = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
          ? json.data
          : [];

      const fullProperties = await Promise.all(
        propertiesArray.map(async (p) => {
          try {
            const resFull = await fetch(
              `http://localhost:7000/api/properties/${p._id}/full`,
            );
            if (!resFull.ok) return p;

            const fullJson = await resFull.json();
            const payload = fullJson.data || fullJson; // payload === { property, sections }

            // Normalize: تبدیل داده‌ی برگشتی به ساختار مورد انتظار فرانت
            const normalized = {
              // نگه داشتن فیلدهای اصلی که از لیست آمدند
              ...p,
              // پایه/status: ممکن است بک‌اند property را برگرداند
              status: payload.property || payload.status || p.status || {},
              // بخش‌ها (sections) که هر کدام ممکن است empty باشند
              identity:
                payload.sections?.PropertyIdentity ||
                payload.sections?.PropertyIdentity ||
                payload.identity ||
                {},
              location:
                payload.sections?.PropertyLocationInfo ||
                payload.sections?.PropertyLocationInfo ||
                payload.location ||
                {},
              legalStatus:
                payload.sections?.PropertyLegalStatus ||
                payload.legalStatus ||
                {},
              ownership:
                payload.sections?.PropertyOwnership || payload.ownership || {},
              boundaries:
                payload.sections?.PropertyBoundariesInfo ||
                payload.boundaries ||
                {},
              additionalInfo:
                payload.sections?.PropertyAdditionalInfo ||
                payload.additionalInfo ||
                {},
            };

            return normalized;
          } catch (err) {
            // در صورت خطا، رکورد لیست را بازمی‌گردانیم (گفت‌وگوی مقاوم)
            return p;
          }
        }),
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

  const getByPath = (obj, path) => {
    if (!obj || !path) return undefined;
    // path ممکنه رشته‌ای مثل "location.province" یا "additionalInfo.utilities.water"
    const parts = path.split(".");
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  };
  const compareDate = (recordVal, filterVal, operator) => {
    if (!recordVal || !filterVal) return true;

    const recordDate = new Date(recordVal);
    const filterDate = new Date(filterVal);

    // فقط تاریخ بدون ساعت
    const recordDay = new Date(
      recordDate.getFullYear(),
      recordDate.getMonth(),
      recordDate.getDate(),
    );
    const filterDay = new Date(
      filterDate.getFullYear(),
      filterDate.getMonth(),
      filterDate.getDate(),
    );

    if (operator === "gte") return recordDay >= filterDay;
    if (operator === "lte") return recordDay <= filterDay;
    return recordDay.getTime() === filterDay.getTime();
  };
  const applyAdvancedFilters = (items, filters) => {
    console.log("=== Applied Filters ===", filters); // لاگ فیلترها
    if (!filters || filters.length === 0) return items;

    return items.filter((it) => {
      return filters.every((f) => {
        const field = f.field;
        const op = f.operator || "contains";
        const rawVal = f.value;

        if (rawVal === null || rawVal === undefined || rawVal === "")
          return true; // ignore empty

        // read nested by path (supports dot paths)
        const val = getByPath(it, field);

        // numeric range support for land/building area
        if (field.endsWith("landArea") || field.endsWith("buildingArea")) {
          const numFilter = Number(rawVal);
          const actual = Number(val || 0);
          if (Number.isNaN(numFilter)) return true;
          if (op === "gte") return actual >= numFilter;
          if (op === "lte") return actual <= numFilter;
          return actual === numFilter;
        }

        // boolean field (isAyan or utilities.*) — normalize to string
        if (typeof val === "boolean" || rawVal === true || rawVal === false) {
          return String(!!val) === String(rawVal);
        }

        const left = (val || "").toString().toLowerCase();
        const right = (rawVal || "").toString().toLowerCase();

        if (op === "equals") return left === right;
        if (op === "startsWith") return left.startsWith(right);
        if (op === "endsWith") return left.endsWith(right);
        if (field === "createdAt") {
          const itemDate = new Date(val).setHours(0, 0, 0, 0);
          const filterDate = new Date(rawVal).setHours(0, 0, 0, 0);
          console.log("Comparing dates:", itemDate, filterDate);
          if (op === "gte") return itemDate >= filterDate;
          if (op === "lte") return itemDate <= filterDate;
          return itemDate === filterDate;
        }
        if (field.endsWith("createdAt")) {
          return compareDate(val, rawVal, op);
        }

        // default contains
        console.log("Value from property:", val);
        return left.includes(right);
      });
    });
  };

  const applySort = (items, sortOption) => {
    if (!sortOption) return items;
    const copy = [...items];
    copy.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime() || 0;
      const tb = new Date(b.createdAt).getTime() || 0;
      return sortOption === "newest" ? tb - ta : ta - tb;
    });
    return copy;
  };

  // compute filteredProperties:
  const baseFiltered = properties.filter(
    (p) =>
      !searchTerm ||
      (p.identity?.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (p.status?.propertyIdCode || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(p.status?.propertyNumber || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const afterFilters = applyAdvancedFilters(baseFiltered, appliedFilters);
  console.log("Filtered after advanced filters:", afterFilters);

  const filteredProperties = applySort(afterFilters, appliedSort);

  // --- منطق اکسل (دست‌نخورده و دقیق) ---
  const handleExportExcel = () => {
    if (!Array.isArray(filteredProperties) || filteredProperties.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "هیچ رکوردی پیدا نشد",
        text: "هیچ رکوردی برای خروجی وجود ندارد.",
        confirmButtonText: "باشه",
        confirmButtonColor: "#1b4965",
      });
      return;
    }

    const rows = filteredProperties.map((p, index) => [
      index + 1,
      p.identity?.title || "---",
      p.createdAt ? new Date(p.createdAt).toLocaleDateString("fa-IR") : "---",
      p.location?.province || "---",
      p.location?.city || "---",
      p.status?.propertyIdCode || "---",
      p.status?.isAyan ? "✔" : "❌",
      p.status?.propertyNumber ?? "---",
      p.identity?.ayanTitle || "---",
      p.identity?.arsehTitle || "---",
      p.identity?.propertyType || "---",
      p.legalStatus?.legalStatus || "---",
      p.ownership?.ownerName || "---",
      p.identity?.usageType || "---",
      p.status?.caseStatus || "---",
    ]);

    const header = [
      "شماره",
      "نام واحد",
      "تاریخ ایجاد",
      "نام استان",
      "نام شهرستان",
      "کد شناسایی ملک",
      "اعیان",
      "کد ملک",
      "عنوان اعیان",
      "عنوان عرصه",
      "نوع ملک",
      "وضعیت ملک",
      "مالک",
      "نوع بهره برداری",
      "وضعیت پرونده",
    ];

    const aoa = [header, ...rows];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    ws["!rtl"] = true;
    ws["!views"] = [{ RTL: true }];
    ws["!cols"] = header.map((h, i) => ({ wch: i === 0 ? 8 : 22 }));
    ws["!rows"] = aoa.map((_, index) => ({ hpt: index === 0 ? 35 : 28 }));

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) ws[cellRef] = { t: "s", v: "" };
        const isHeader = R === 0;
        let bgColor = isHeader ? "014F86" : R % 2 !== 0 ? "F1F8FB" : "FFFFFF";

        ws[cellRef].s = {
          font: {
            name: "Tahoma",
            sz: isHeader ? 11 : 10,
            bold: isHeader,
            color: { rgb: isHeader ? "FFFFFF" : "000000" },
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
            readingOrder: 2,
          },
          fill: { patternType: "solid", fgColor: { rgb: bgColor } },
          border: {
            top: { style: "thin", color: { rgb: "D1E3F0" } },
            bottom: { style: "thin", color: { rgb: "D1E3F0" } },
            left: { style: "thin", color: { rgb: "D1E3F0" } },
            right: { style: "thin", color: { rgb: "D1E3F0" } },
          },
        };
      }
    }

    const first = filteredProperties[0];
    const statusId = first.status?._id || "NoID";
    const identityTitle = first.identity?.title || "NoTitle";
    const safeTitle = String(identityTitle).replace(/[/\\?%*:|"<>]/g, "-");
    const fileName =
      filteredProperties.length === 1
        ? `${statusId}-${safeTitle}.xlsx`
        : `گزارش_املاک_${new Date().toLocaleDateString("fa-IR").replace(/\//g, "-")}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, "لیست املاک");
    XLSX.writeFile(wb, fileName);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 md:p-10 space-y-10 bg-[#eef7fa] rounded-[3rem] border border-white/50">
        {/* --- هدر هوشمند استایل امیر --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="relative">
            <div className="absolute -right-4 top-0 w-1.5 h-full bg-[#41bdbb] rounded-full shadow-[0_0_15px_#41bdbb]"></div>
            <h1 className="text-4xl font-[1000] text-[#012a4a] tracking-tighter leading-none mb-2">
              مدیریت <span className="text-[#014f86]">املاک و مستغلات</span>
            </h1>
            <p className="text-[#468faf] font-bold text-sm tracking-wide pr-2">
              Intelligence Asset Management System • 2026
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/40 p-3 rounded-[2.5rem] border border-white">
            <button
              onClick={fetchProperties}
              className="p-4 bg-white text-[#014f86] rounded-2xl shadow-sm hover:rotate-180 transition-all duration-700 active:scale-90 border border-[#d1e3f0]"
              title="بروزرسانی داده‌ها"
            >
              <RefreshCw size={22} />
            </button>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-3 px-6 py-4 bg-[#41bdbb] text-white rounded-[1.8rem] font-black shadow-lg shadow-[#41bdbb]/20 hover:bg-[#1b4965] transition-all"
            >
              <FileDown size={22} />
              <span className="hidden sm:inline">خروجی اکسل</span>
            </button>

            <button
              onClick={() => router.push("/dashboard/properties/create")}
              className="flex items-center gap-3 bg-[#014f86] text-white px-8 py-4 rounded-[1.8rem] font-[1000] shadow-xl shadow-[#014f86]/20 hover:scale-[1.03] active:scale-95 transition-all"
            >
              <Plus size={22} />
              ثبت ملک جدید
            </button>
          </div>
        </div>
        {/* --- نوار ابزار جستجوی شیشه‌ای --- */}
        <div
          className={`${amirGlass} p-6 rounded-[2.8rem] flex flex-col md:flex-row gap-6 items-center`}
        >
          <div className="relative flex-1 w-full group">
            <Search
              className="absolute right-6 top-1/2 -translate-y-1/2 text-[#014f86] group-focus-within:text-[#41bdbb] transition-colors"
              size={22}
            />
            <input
              type="text"
              placeholder="جستجوی پیشرفته در شناسه، عنوان و کد واحد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-16 pl-6 py-5 bg-white border-2 border-[#d1e3f0] focus:border-[#41bdbb] rounded-[2rem] outline-none transition-all font-black text-[#012a4a] shadow-inner placeholder:text-[#61a5c2]/40"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-3 p-4 bg-[#41BDBB] cursor-pointer text-white rounded-[2rem] font-black hover:bg-[#1b4965] transition-all shadow-lg"
            title="فیلتر پیشرفته"
          >
            <Filter size={26} />
          </button>
        </div>
        {/* // سپس مودال فیلتر را صدا می‌زنیم */}
        <PropertyFilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          provinces={locationData?.provinces || []}
          citiesByProvince={locationData?.citiesByProvince || {}}
          initialFilters={appliedFilters}
          initialSort={appliedSort}
          onApply={(filters, sort) => {
            setAppliedFilters(filters || []);
            setAppliedSort(sort || null);
            setIsFilterOpen(false);
          }}
        />
        {/* --- محتوای اصلی (جدول فضایی) --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-[#41bdbb]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-[#014f86] rounded-full animate-spin"></div>
            </div>
            <span className="text-[#014f86] font-black text-xl animate-pulse tracking-widest">
              در حال تحلیل پایگاه داده دارایی‌ها…
            </span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-100 p-10 rounded-[3rem] text-center shadow-xl">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <p className="text-red-700 font-black text-lg mb-4">{error}</p>
            <button
              onClick={fetchProperties}
              className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all"
            >
              تلاش مجدد سیستم
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className={`${amirGlass} py-32 rounded-[4rem] text-center`}>
            <div className="bg-[#eef7fa] w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-white">
              <Building2 size={50} className="text-[#61a5c2] opacity-40" />
            </div>
            <h3 className="text-2xl font-black text-[#012a4a]">
              دیتابیس خالی است
            </h3>
            <p className="text-[#468faf] mt-3 font-bold">
              هیچ ملکی با این مشخصات در شبکه یافت نشد.
            </p>
          </div>
        ) : (
          <div
            className={`${amirGlass} rounded-[3.5rem] overflow-hidden shadow-2xl shadow-[#014f86]/5`}
          >
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#012a4a] text-white">
                    <th className="p-7 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">
                      اطلاعات پایه
                    </th>
                    <th className="p-7 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">
                      لوکیشن
                    </th>
                    <th className="p-7 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">
                      شناسنامه فنی
                    </th>
                    <th className="p-7 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">
                      وضعیت کلیدی
                    </th>

                    <th className="p-7 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">
                      عناوین ثبتی
                    </th>
                    <th className="p-7 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">
                      حقوقی و مالکیت
                    </th>
                    <th className="p-7 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">
                      مشخصات مکانی
                    </th>

                    <th className="p-7 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">
                      عملیات مدیریت
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1e3f0]">
                  {filteredProperties.map((property) => (
                    <tr
                      key={property._id}
                      className="group hover:bg-white transition-all duration-300"
                    >
                      {/* ستون ۱: اطلاعات پایه */}
                      <td className="p-6">
                        <div className="flex flex-col gap-1 text-center">
                          <span className="font-black text-[#012a4a] text-sm group-hover:text-[#014f86] transition-colors">
                            {property.identity?.title || "---"}
                          </span>
                          <span className="text-[10px] text-[#41bdbb] font-bold flex items-center justify-center gap-1">
                            <Calendar size={10} />{" "}
                            {property.createdAt
                              ? new Date(property.createdAt).toLocaleDateString(
                                  "fa-IR",
                                )
                              : "---"}
                          </span>
                        </div>
                      </td>

                      {/* ستون ۲: لوکیشن */}
                      <td className="p-6">
                        <div className="flex flex-col text-center">
                          <span className="font-black text-[#014f86] text-xs">
                            {property.location?.province || "---"}
                          </span>
                          <span className="text-[10px] text-[#468faf] font-bold">
                            {property.location?.city || "---"}
                          </span>
                        </div>
                      </td>

                      {/* ستون ۳: شناسنامه فنی */}
                      <td className="p-6">
                        <div className="flex flex-col gap-1 items-center">
                          <div className="flex items-center gap-2 bg-[#eef7fa] px-3 py-1 rounded-full border border-[#d1e3f0]">
                            <Hash size={12} className="text-[#41bdbb]" />
                            <span className="text-xs font-black text-[#012a4a]">
                              {property.status?.propertyIdCode || "---"}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-black px-3 py-0.5 rounded-md ${property.isAyan ? "bg-green-100 text-green-600" : "bg-red-50 text-red-400"}`}
                          >
                            {property.isAyan ? "دارای اعیان" : "بدون اعیان"}
                          </span>
                        </div>
                      </td>
                      {/* ستون جدید: وضعیت کلیدی */}
                      <td className="p-6">
                        <div className="flex flex-col gap-1 text-center text-[10px]">
                          <span className="font-black text-[#012a4a]">
                            کد ملک:
                            <span className="text-[#014f86] mr-1">
                              {property.status?.propertyNumber || "---"}
                            </span>
                          </span>

                          <span className="font-bold text-[#468faf]">
                            وضعیت پرونده: {property.status?.caseStatus || "---"}
                          </span>

                          <span className="text-gray-500">
                            نوع بهره‌برداری:{" "}
                            {property.identity?.usageType || "---"}
                          </span>

                          <span
                            className={`mx-auto w-fit px-2 py-0.5 rounded-md font-black
        ${
          property.legal?.legalStatus === "سند رسمی"
            ? "bg-green-100 text-green-600"
            : "bg-amber-100 text-amber-600"
        }`}
                          >
                            {property.legal?.legalStatus || "نامشخص"}
                          </span>
                        </div>
                      </td>

                      {/* ستون ۴: عناوین */}
                      <td className="p-6">
                        <div className="text-center">
                          <p className="text-[11px] font-black text-[#012a4a] truncate max-w-[120px] mx-auto">
                            {property.identity?.structureType || "---"}
                          </p>
                          <p className="text-[9px] font-bold text-[#61a5c2]">
                            {property.identity?.propertyType || "---"}
                          </p>
                        </div>
                      </td>

                      {/* ستون ۵: مالکیت */}
                      <td className="p-6 text-center">
                        <span className={amirHeaderLabel}>مالک فعلی</span>
                        <span className="text-xs font-black text-[#014f86] bg-[#eef7fa] px-4 py-2 rounded-xl border border-white shadow-sm">
                          {property.ownership?.ownerName || "نامشخص"}
                        </span>
                      </td>
                      {/* ستون جدید: مشخصات مکانی */}
                      <td className="p-6">
                        <div className="flex flex-col gap-1 text-center text-[10px]">
                          <span className="font-black text-[#012a4a]">
                            شهرستان:
                            <span className="text-[#014f86] mr-1">
                              {property.location?.county || "---"}
                            </span>
                          </span>

                          <span className="text-[#468faf] font-bold">
                            منطقه: {property.location?.region || "---"}
                          </span>

                          <span className="text-gray-500">
                            پلاک اصلی: {property.location?.mainPlate || "---"}
                          </span>

                          <span className="text-gray-500">
                            پلاک فرعی: {property.location?.subPlate || "---"}
                          </span>

                          {property.location?.postalCode && (
                            <span className="mt-1 mx-auto w-fit bg-[#eef7fa] text-[#012a4a] px-2 py-0.5 rounded-md font-black">
                              کد پستی: {property.location.postalCode}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ستون ۶: عملیات */}
                      <td className="p-6">
                        <div className="flex justify-center gap-3">
                          <ExportExcelButton data={filteredProperties} />

                          <button
                            onClick={() => handleOpenModal(property)}
                            className={`${amirActionBtn} bg-blue-50 text-[#014f86] hover:bg-[#014f86] hover:text-white`}
                            title="مشاهده سریع"
                          >
                            <Eye size={20} />
                          </button>

                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/properties/${property._id}/edit`,
                              )
                            }
                            className={`${amirActionBtn} bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white`}
                            title="ویرایش هوشمند"
                          >
                            <Edit3 size={20} />
                          </button>

                          <button
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: "تأیید حذف سیستمی",
                                text: "آیا از پاکسازی این ملک و تمامی وابستگی‌های دیتابیسی آن اطمینان کامل دارید؟",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#d33",
                                cancelButtonColor: "#014f86",
                                confirmButtonText: "بله، حذف قطعی",
                                cancelButtonText: "انصراف",
                                background: "#ffffff",
                                customClass: {
                                  popup: "rounded-[2rem] font-black",
                                },
                              });

                              if (result.isConfirmed) {
                                try {
                                  const res = await fetch(
                                    `http://localhost:7000/api/properties/${property._id}`,
                                    { method: "DELETE" },
                                  );
                                  if (!res.ok)
                                    throw new Error("خطا در پروتکل حذف");
                                  Swal.fire({
                                    title: "حذف شد!",
                                    text: "ملک با موفقیت از سیستم خارج شد.",
                                    icon: "success",
                                    timer: 2000,
                                    showConfirmButton: false,
                                  });
                                  fetchProperties();
                                } catch (err) {
                                  Swal.fire(
                                    "خطای سیستمی",
                                    err.message,
                                    "error",
                                  );
                                }
                              }
                            }}
                            className={`${amirActionBtn} bg-red-50 text-red-600 hover:bg-red-600 hover:text-white`}
                            title="حذف از دیتابیس"
                          >
                            <Trash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <PropertyQuickViewModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
}

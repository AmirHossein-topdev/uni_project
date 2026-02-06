"use client";

import React, { useState, useEffect } from "react";

import {
  X,
  Check,
  Filter,
  RotateCcw,
  MapPin,
  Home,
  ShieldCheck,
  Zap,
  Ruler,
  FileText,
  Scale,
  AlertTriangle,
  Building2,
  Calendar,
  Droplets,
  Flame,
  Waves,
} from "lucide-react";

/* === افزودن imports برای DatePicker شمسی === */
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
/* ========================================== */

export default function PropertyFilterModal({
  isOpen,

  onClose,

  onApply,

  provinces = [],

  citiesByProvince = {},

  initialFilters = [],
}) {
  // --- وضعیت‌های فیلتر گسترش یافته بر اساس Payload ---

  const [filters, setFilters] = useState({
    // Location

    province: "",

    city: "",

    administrativeDivision: "", // شهری/روستایی

    // Identity

    propertyType: "",

    usageType: "",

    // Status (Basic)

    caseStatus: "", // جاری/مختومه

    isArseh: null,

    isAyan: null,

    // Legal & Ownership

    legalStatus: "",

    ownershipAmount: "",

    dispute: "",

    // Boundaries

    minLandArea: "",

    maxLandArea: "",

    minBuildingArea: "",

    maxBuildingArea: "",

    // Additional & Utilities

    securityLevel: "",

    securityCouncilApproved: "",

    utilities: {
      water: false,

      electricity: false,

      gas: false,

      sewage: false,
    },

    // Date Filters & Sort
    // تغییر: نگهداری به‌صورت JS Date (یا null) تا با DatePicker هماهنگ شود
    minCreatedAt: null,
    maxCreatedAt: null,

    sortOrder: "", // 'asc' یا 'desc' برای مرتب‌سازی بر اساس createdAt
  });

  /* === Helper: تبدیل JS Date به ISO UTC شروع/پایان روز ===
     توضیح: وقتی تاریخ شمسی با DatePicker انتخاب می‌شود، به JS Date (معادل میلادی) تبدیل می‌شود.
     سپس برای حد پایین/بالا روز، شروع و پایان همان روز را بر حسب UTC می‌سازیم تا با createdAt ذخیره‌شده در دیتابیس (که UTC است) مقایسه درست انجام شود.
  */
  // جایگزین کن با این نسخهٔ ایمن:
  const toIsoStartOfDayUTC = (dateLike) => {
    if (!dateLike) return "";
    if (typeof dateLike?.toDate === "function") dateLike = dateLike.toDate();
    if (typeof dateLike === "string") dateLike = new Date(dateLike);
    if (!(dateLike instanceof Date) || isNaN(dateLike)) return "";

    const localMidnight = new Date(
      dateLike.getFullYear(),
      dateLike.getMonth(),
      dateLike.getDate(),
      0,
      0,
      0,
      0,
    );
    const iso = localMidnight.toISOString();
    console.log(
      "toIsoStartOfDayUTC -> localMidnight:",
      localMidnight,
      "iso:",
      iso,
    );
    return iso;
  };

  const toIsoEndOfDayUTC = (dateLike) => {
    if (!dateLike) return "";
    if (typeof dateLike?.toDate === "function") dateLike = dateLike.toDate();
    if (typeof dateLike === "string") dateLike = new Date(dateLike);
    if (!(dateLike instanceof Date) || isNaN(dateLike)) return "";

    const localEnd = new Date(
      dateLike.getFullYear(),
      dateLike.getMonth(),
      dateLike.getDate(),
      23,
      59,
      59,
      999,
    );
    const iso = localEnd.toISOString();
    console.log("toIsoEndOfDayUTC -> localEnd:", localEnd, "iso:", iso);
    return iso;
  };

  /* ========================================================= */

  useEffect(() => {
    if (initialFilters.length > 0) {
      // ایجاد یک شی جدید (نه clone ارجاعی) تا ریسک اصلاح ناخواسته state نباشد
      const newFilters = {
        province: "",

        city: "",

        administrativeDivision: "",

        propertyType: "",

        usageType: "",

        caseStatus: "",

        isArseh: null,

        isAyan: null,

        legalStatus: "",

        ownershipAmount: "",

        dispute: "",

        minLandArea: "",

        maxLandArea: "",

        minBuildingArea: "",

        maxBuildingArea: "",

        securityLevel: "",

        securityCouncilApproved: "",

        utilities: {
          water: false,

          electricity: false,

          gas: false,

          sewage: false,
        },

        minCreatedAt: null,

        maxCreatedAt: null,

        sortOrder: "",
      };

      initialFilters.forEach((f) => {
        if (!f || !f.field) return;

        // انشعابات
        if (f.field.startsWith("additionalInfo.utilities.")) {
          const utilKey = f.field.split(".").pop();

          if (
            Object.prototype.hasOwnProperty.call(newFilters.utilities, utilKey)
          ) {
            newFilters.utilities[utilKey] = Boolean(f.value);
          }
          return;
        }

        // sortOrder
        if (f.field === "sortOrder") {
          newFilters.sortOrder = f.value;
          return;
        }

        // فیلتر createdAt: اگر فیلد status.createdAt با operator gte/lte آمده باشد، آن را به JS Date تبدیل کن
        if (
          f.field === "status.createdAt" &&
          (f.operator === "gte" || f.operator === "lte")
        ) {
          if (f.value) {
            const parsed = new Date(f.value);
            if (!isNaN(parsed.getTime())) {
              if (f.operator === "gte") newFilters.minCreatedAt = parsed;
              if (f.operator === "lte") newFilters.maxCreatedAt = parsed;
            }
          }
          return;
        }

        // سایر فیلدها: نگاشت آخرین قسمت مسیر به فیلد محلی
        const fieldName = f.field.split(".").pop();
        if (Object.prototype.hasOwnProperty.call(newFilters, fieldName)) {
          newFilters[fieldName] = f.value;
        }
      });

      setFilters(newFilters);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters, isOpen]);

  const handleCheckboxChange = (name) => {
    setFilters((prev) => ({
      ...prev,

      utilities: { ...prev.utilities, [name]: !prev.utilities[name] },
    }));
  };

  const resetFilters = () => {
    setFilters({
      province: "",

      city: "",

      administrativeDivision: "",

      propertyType: "",

      usageType: "",

      caseStatus: "",

      isArseh: null,

      isAyan: null,

      legalStatus: "",

      ownershipAmount: "",

      dispute: "",

      minLandArea: "",

      maxLandArea: "",

      minBuildingArea: "",

      maxBuildingArea: "",

      securityLevel: "",

      securityCouncilApproved: "",

      utilities: {
        water: false,

        electricity: false,

        gas: false,

        sewage: false,
      },

      minCreatedAt: null,

      maxCreatedAt: null,

      sortOrder: "",
    });
  };

  const handleApply = () => {
    const result = [];

    // نگاشت دقیق فیلدها به ساختار دیتابیس (بر اساس Payload ارسالی شما)

    const mappings = [
      { key: "province", path: "location.province", op: "equals" },

      { key: "city", path: "location.city", op: "equals" },

      {
        key: "administrativeDivision",

        path: "identity.administrativeDivision",

        op: "equals",
      },

      { key: "propertyType", path: "identity.propertyType", op: "equals" },

      { key: "usageType", path: "identity.usageType", op: "equals" },

      { key: "caseStatus", path: "status.caseStatus", op: "equals" },

      { key: "legalStatus", path: "legalStatus.legalStatus", op: "equals" },

      {
        key: "ownershipAmount",

        path: "ownership.ownershipAmount",

        op: "equals",
      },

      { key: "dispute", path: "ownership.dispute", op: "equals" },

      {
        key: "securityLevel",

        path: "additionalInfo.securityLevel",

        op: "equals",
      },

      {
        key: "securityCouncilApproved",

        path: "additionalInfo.securityCouncilApproved",

        op: "equals",
      },
    ];

    mappings.forEach((m) => {
      if (
        filters[m.key] !== "" &&
        filters[m.key] !== null &&
        typeof filters[m.key] !== "undefined"
      ) {
        result.push({ field: m.path, operator: m.op, value: filters[m.key] });
      }
    });

    // منطق بولی عرصه و اعیان

    if (filters.isArseh !== null)
      result.push({
        field: "status.isArseh",

        operator: "equals",

        value: filters.isArseh,
      });

    if (filters.isAyan !== null)
      result.push({
        field: "status.isAyan",

        operator: "equals",

        value: filters.isAyan,
      });

    // فیلترهای بازه‌ای متراژ

    if (filters.minLandArea)
      result.push({
        field: "boundaries.landArea",

        operator: "gte",

        value: Number(filters.minLandArea),
      });

    if (filters.maxLandArea)
      result.push({
        field: "boundaries.landArea",

        operator: "lte",

        value: Number(filters.maxLandArea),
      });

    if (filters.minBuildingArea)
      result.push({
        field: "boundaries.buildingArea",

        operator: "gte",

        value: Number(filters.minBuildingArea),
      });

    if (filters.maxBuildingArea)
      result.push({
        field: "boundaries.buildingArea",

        operator: "lte",

        value: Number(filters.maxBuildingArea),
      });

    // انشعابات

    Object.keys(filters.utilities).forEach((key) => {
      if (filters.utilities[key]) {
        result.push({
          field: `additionalInfo.utilities.${key}`,

          operator: "equals",

          value: true,
        });
      }
    });

    // فیلترهای تاریخ (بر اساس createdAt در status)
    // تغییر: تاریخ‌های انتخاب‌شده (JS Date) را به ISO UTC شروع/پایان روز تبدیل و ارسال می‌کنیم
    if (filters.minCreatedAt) {
      const isoStart = toIsoStartOfDayUTC(filters.minCreatedAt);
      if (isoStart) {
        result.push({
          field: "status.createdAt",
          operator: "gte",
          value: isoStart,
        });
      }
    }

    if (filters.maxCreatedAt) {
      const isoEnd = toIsoEndOfDayUTC(filters.maxCreatedAt);
      if (isoEnd) {
        result.push({
          field: "status.createdAt",
          operator: "lte",
          value: isoEnd,
        });
      }
    }

    // سورت کردن (اضافه کردن به عنوان یک فیلد خاص برای سورت، فرض بر اینکه بک‌اند آن را مدیریت می‌کند)

    if (filters.sortOrder)
      result.push({
        field: "sortOrder",

        operator: "sort",

        value: filters.sortOrder, // 'asc' or 'desc' by status.createdAt
      });

    onApply(result);
    // قبل از onApply(result);
    console.log(
      "handleApply -> final result payload:",
      JSON.stringify(result, null, 2),
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 !h-screen z-[100] flex items-center justify-center p-4"
      dir="rtl"
    >
      <div
        className="absolute inset-0 bg-[#1b4965]/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl border border-white overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}

        <div className="flex items-center justify-between p-8 border-b border-[#f2fbfa]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1b4965] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1b4965]/20">
              <Filter className="text-[#41bdbb]" size={24} />
            </div>

            <div>
              <h3 className="text-2xl font-[1000] text-[#1b4965]">
                جستجوی پیشرفته ملک
              </h3>

              <p className="text-[10px] font-black text-[#41bdbb] uppercase tracking-[0.2em] mt-1">
                Advanced Property Intelligence Terminal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-xl bg-[#f2fbfa] text-[#1b4965]/40 hover:bg-red-500 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}

        <div className="p-8 overflow-y-auto bg-[#f2fbfa]/30 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* ستون اول: جغرافیا و هویت */}

          <div className="space-y-6">
            <SectionTitle
              icon={<MapPin size={16} />}
              title="موقعیت و تقسیمات"
            />

            <div className="grid grid-cols-1 gap-3">
              <SelectBox
                label="استان"
                value={filters.province}
                onChange={(v) =>
                  setFilters({ ...filters, province: v, city: "" })
                }
                options={provinces}
              />

              <SelectBox
                label="شهر"
                value={filters.city}
                onChange={(v) => setFilters({ ...filters, city: v })}
                options={
                  filters.province
                    ? citiesByProvince[filters.province] || []
                    : []
                }
              />

              <div className="flex gap-2">
                {["شهری", "روستایی"].map((div) => (
                  <Chip
                    key={div}
                    label={div}
                    active={filters.administrativeDivision === div}
                    onClick={() =>
                      setFilters({ ...filters, administrativeDivision: div })
                    }
                  />
                ))}
              </div>
            </div>

            <SectionTitle icon={<Home size={16} />} title="مشخصات کاربری" />

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {["زمین", "ساختمان", "محیط"].map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    active={filters.propertyType === type}
                    onClick={() =>
                      setFilters({ ...filters, propertyType: type })
                    }
                  />
                ))}
              </div>

              <select
                className="w-full p-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#41bdbb]/30 font-black text-sm text-[#1b4965] shadow-sm"
                value={filters.usageType}
                onChange={(e) =>
                  setFilters({ ...filters, usageType: e.target.value })
                }
              >
                <option value="">همه کاربری‌ها (اداری، مسکونی...)</option>

                <option value="اداری">اداری</option>

                <option value="آموزشی">آموزشی</option>

                <option value="درمانی">درمانی</option>

                <option value="مسکونی">مسکونی</option>
              </select>
            </div>
            <SectionTitle
              icon={<Calendar size={16} />}
              title="فیلتر و سورت بر اساس تاریخ ایجاد"
            />

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {/* === جایگزین input type="date" با DatePicker شمسی (غیردستی) === */}
                <DatePicker
                  value={filters.minCreatedAt}
                  onChange={(d) => {
                    // d از نوع DateObject یا JS Date می‌تونه باشه
                    console.log("Selected Date Object:", d); // لاگ شی DateObject خام
                    const jsDate = d ? (d.toDate ? d.toDate() : d) : null;
                    console.log("Converted JS Date:", jsDate); // لاگ JS Date نهایی
                    setFilters((prev) => ({ ...prev, minCreatedAt: jsDate }));
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  editable={false} // جلوگیری از تایپ دستی
                  inputClass="p-4 rounded-2xl bg-white text-xs font-black text-[#1b4965] border-none shadow-sm w-full"
                  containerClassName="w-full"
                  placeholder="از تاریخ (مثال: ۱۴۰۴/۱۱/۱۵)"
                  calendarPosition="top-center" // ← این خط اضافه شد
                />

                <DatePicker
                  value={filters.maxCreatedAt}
                  onChange={(d) => {
                    console.log("Selected Date Object:", d); // لاگ شی DateObject خام

                    const jsDate = d ? (d.toDate ? d.toDate() : d) : null;
                    console.log("Converted JS Date:", jsDate); // لاگ JS Date نهایی

                    setFilters((prev) => ({ ...prev, maxCreatedAt: jsDate }));
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  editable={false}
                  inputClass="p-4 rounded-2xl bg-white text-xs font-black text-[#1b4965] border-none shadow-sm w-full"
                  containerClassName="w-full"
                  placeholder="تا تاریخ (مثال: ۱۴۰۴/۱۱/۱۵)"
                  calendarPosition="top-center" // ← این خط اضافه شد
                />
                {/* ======================================================= */}
              </div>

              <div className="flex gap-2">
                {["asc", "desc"].map((order) => (
                  <button
                    key={order}
                    onClick={() => setFilters({ ...filters, sortOrder: order })}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${filters.sortOrder === order ? "bg-[#1b4965] text-[#41bdbb]" : "bg-white border-2 border-[#41bdbb]/50  text-[#1b4965]/40"}`}
                  >
                    {order === "asc" ? "صعودی" : "نزولی"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ستون دوم: وضعیت حقوقی و مالکیت */}

          <div className="space-y-6">
            <SectionTitle
              icon={<Scale size={16} />}
              title="وضعیت مالکیت و پرونده"
            />

            <div className="space-y-4">
              <div className="flex gap-2">
                {["جاری", "مختومه"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setFilters({ ...filters, caseStatus: status })
                    }
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${filters.caseStatus === status ? "bg-[#1b4965] text-[#41bdbb]" : "bg-white text-[#1b4965]/40"}`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ToggleButton
                  label="عرصه"
                  active={filters.isArseh}
                  onClick={(v) => setFilters({ ...filters, isArseh: v })}
                />

                <ToggleButton
                  label="اعیان"
                  active={filters.isAyan}
                  onClick={(v) => setFilters({ ...filters, isAyan: v })}
                />
              </div>

              <select
                className="w-full p-4 rounded-2xl bg-white border-none font-black text-sm text-[#1b4965] shadow-sm"
                value={filters.legalStatus}
                onChange={(e) =>
                  setFilters({ ...filters, legalStatus: e.target.value })
                }
              >
                <option value="">نوع سند (رسمی، عادی...)</option>

                <option value="سند رسمی">سند رسمی</option>

                <option value="عادی">عادی</option>

                <option value="بدون سند">بدون سند</option>
              </select>

              <select
                className="w-full p-4 rounded-2xl bg-white border-none font-black text-sm text-[#1b4965] shadow-sm"
                value={filters.ownershipAmount}
                onChange={(e) =>
                  setFilters({ ...filters, ownershipAmount: e.target.value })
                }
              >
                <option value="">میزان مالکیت (دانگ)</option>

                <option value="شش دانگ">شش دانگ</option>

                <option value="مشاع">مشاع</option>
              </select>
            </div>

            <SectionTitle
              icon={<AlertTriangle size={16} />}
              title="وضعیت حقوقی خاص"
            />

            <select
              className="w-full p-4 rounded-2xl bg-white border-none font-black text-sm text-[#1b4965] shadow-sm"
              value={filters.dispute}
              onChange={(e) =>
                setFilters({ ...filters, dispute: e.target.value })
              }
            >
              <option value="">وضعیت معارض...</option>

              <option value="بدون معارض">بدون معارض</option>

              <option value="معارض دارد">معارض دارد</option>
            </select>
          </div>

          {/* ستون سوم: فنی، ابعاد و تاسیسات */}

          <div className="space-y-6">
            <SectionTitle
              icon={<Ruler size={16} />}
              title="متراژ و ابعاد (متر مربع)"
            />

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="حداقل زمین"
                  className="p-4 rounded-2xl bg-white text-xs font-black text-[#1b4965] border-none shadow-sm"
                  value={filters.minLandArea}
                  onChange={(e) =>
                    setFilters({ ...filters, minLandArea: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="حداکثر زمین"
                  className="p-4 rounded-2xl bg-white text-xs font-black text-[#1b4965] border-none shadow-sm"
                  value={filters.maxLandArea}
                  onChange={(e) =>
                    setFilters({ ...filters, maxLandArea: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="حداقل بنا"
                  className="p-4 rounded-2xl bg-white text-xs font-black text-[#1b4965] border-none shadow-sm"
                  value={filters.minBuildingArea}
                  onChange={(e) =>
                    setFilters({ ...filters, minBuildingArea: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="حداکثر بنا"
                  className="p-4 rounded-2xl bg-white text-xs font-black text-[#1b4965] border-none shadow-sm"
                  value={filters.maxBuildingArea}
                  onChange={(e) =>
                    setFilters({ ...filters, maxBuildingArea: e.target.value })
                  }
                />
              </div>
            </div>

            <SectionTitle icon={<Zap size={16} />} title="انشعابات فعلی" />

            <div className="grid grid-cols-2 gap-2">
              <UtilityToggle
                label="آب"
                icon={<Droplets size={16} className="text-blue-500" />}
                active={filters.utilities.water}
                onClick={() => handleCheckboxChange("water")}
              />

              <UtilityToggle
                label="برق"
                icon={<Zap size={16} className="text-yellow-500" />}
                active={filters.utilities.electricity}
                onClick={() => handleCheckboxChange("electricity")}
              />

              <UtilityToggle
                label="گاز"
                icon={<Flame size={16} className="text-orange-600" />}
                active={filters.utilities.gas}
                onClick={() => handleCheckboxChange("gas")}
              />

              <UtilityToggle
                label="فاضلاب"
                icon={<Waves size={16} className="text-emerald-700" />}
                active={filters.utilities.sewage}
                onClick={() => handleCheckboxChange("sewage")}
              />
            </div>

            <SectionTitle
              icon={<ShieldCheck size={16} />}
              title="امنیت و پدافند"
            />

            <select
              className="w-full p-4 rounded-2xl bg-white border-none font-black text-sm text-[#1b4965] shadow-sm"
              value={filters.securityLevel}
              onChange={(e) =>
                setFilters({ ...filters, securityLevel: e.target.value })
              }
            >
              <option value="">سطح اهمیت امنیت...</option>

              <option value="حیاتی">حیاتی</option>

              <option value="حساس">حساس</option>

              <option value="مهم">مهم</option>

              <option value="عادی">عادی</option>
            </select>
          </div>
        </div>

        {/* Footer */}

        <div className="p-8 bg-white border-t border-[#f2fbfa] flex flex-col md:flex-row items-center justify-between gap-6">
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-[#1b4965]/40 hover:text-red-500 font-black text-sm transition-all group"
          >
            <RotateCcw
              size={18}
              className="group-hover:rotate-[-180deg] transition-all duration-500"
            />
            پاکسازی تمام فیلترها
          </button>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={onClose}
              className="flex-1 md:flex-none px-8 py-4 rounded-[1.5rem] font-black text-sm text-[#1b4965]/40 hover:bg-gray-50"
            >
              انصراف
            </button>

            <button
              onClick={handleApply}
              className="flex-1 md:flex-none px-12 py-4 bg-[#1b4965] text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-[#1b4965]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Check className="text-[#41bdbb]" size={20} />
              اعمال فیلترهای هوشمند
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- اجزای کمکی (Sub-components) ---

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 text-[#1b4965]/40 mb-3">
      <span className="text-[#41bdbb]">{icon}</span>

      <span className="text-[10px] font-black uppercase tracking-widest">
        {title}
      </span>
    </div>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-xs font-black transition-all border-2 ${
        active
          ? "bg-[#1b4965] text-[#41bdbb] border-[#1b4965]"
          : "bg-white text-[#1b4965]/60 border-transparent shadow-sm hover:border-[#1b4965]/10"
      }`}
    >
      {label}
    </button>
  );
}

function ToggleButton({ label, active, onClick }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white shadow-sm border border-transparent">
      <span className="text-xs font-black text-[#1b4965]/60">{label}</span>

      <div className="flex gap-1">
        <button
          onClick={() => onClick(true)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${active === true ? "bg-[#41bdbb] text-white" : "bg-[#f2fbfa] text-[#1b4965]/20"}`}
        >
          <Check size={14} />
        </button>

        <button
          onClick={() => onClick(false)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${active === false ? "bg-red-500 text-white" : "bg-[#f2fbfa] text-[#1b4965]/20"}`}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function UtilityToggle({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
        active
          ? "border-[#41bdbb] bg-[#41bdbb]/5 text-[#1b4965]"
          : "border-transparent bg-white text-[#1b4965]/50 hover:border-[#f2fbfa]"
      }`}
    >
      <div className="flex items-center gap-2">
        {/* اینجا آیکون رو نمایش می‌دهیم */}

        {icon && (
          <span className="flex items-center justify-center">{icon}</span>
        )}

        <span className="text-xs font-black">{label}</span>
      </div>

      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          active ? "bg-[#41bdbb] border-[#41bdbb]" : "border-slate-100"
        }`}
      >
        {active && <Check size={14} className="text-white" />}
      </div>
    </button>
  );
}

function SelectBox({ label, value, onChange, options = [] }) {
  return (
    <div className="relative group">
      <select
        className="w-full p-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#41bdbb]/30 font-black text-sm text-[#1b4965] shadow-sm appearance-none outline-none transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{label}...</option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1b4965]/20">
        <Building2 size={16} />
      </div>
    </div>
  );
}

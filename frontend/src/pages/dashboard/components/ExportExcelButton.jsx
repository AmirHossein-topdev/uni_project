"use client";

import { useState, useEffect } from "react";
import { FileDown, X, Check } from "lucide-react";
import XLSX from "xlsx-js-style";
import Swal from "sweetalert2";
import Portal from "./Portal";

/**
 * ExportExcelButton
 * - وقتی کاربر کلیک میکنه، یک مودال باز میشه و سرتیترها نمایش داده میشن
 * - کاربر انتخاب میکنه کدوم سرتیترها داخل اکسل باشند
 * - سپس بر اساس انتخاب، اکسل تولید و دانلود میشه
 *
 * طراحی و استایل ساده و سازگار با تم پروژه (دکمه‌ها، مودال، چک‌باکس‌ها)
 */

const actionBtn =
  "p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm";

const modalBg = "fixed inset-0 bg-black/40 z-[999]";
const modalCard =
  "relative z-[1000] w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-6";

// لیست بخش‌ها (عنوان نمایش داده شده به کاربر => کلید ساختار داده‌ای)
const DEFAULT_SECTIONS = [
  { key: "status", title: "وضعیت (Status)" },
  { key: "ownership", title: "مالکیت (Ownership)" },
  { key: "identity", title: "هویت (Identity)" },
  { key: "location", title: "مکان (Location)" },
  { key: "legalStatus", title: "وضعیت حقوقی (LegalStatus)" },
  { key: "boundaries", title: "مرزها (Boundaries)" },
  { key: "additionalInfo", title: "اطلاعات تکمیلی (AdditionalInfo)" },
];

export default function ExportExcelButton({ data = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(() =>
    // پیش‌فرض: همه انتخاب شده
    DEFAULT_SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: true }), {}),
  );
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    const allSelected = DEFAULT_SECTIONS.every((s) => selected[s.key]);
    setSelectAll(allSelected);
  }, [selected]);

  const toggleSection = (key) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSelectAll = () => {
    const newVal = !selectAll;
    const next = DEFAULT_SECTIONS.reduce(
      (acc, s) => ({ ...acc, [s.key]: newVal }),
      {},
    );
    setSelected(next);
    setSelectAll(newVal);
  };

  // utility helper برای تبدیل به تاریخ فارسی/ایران در نمایش (اختیاری)
  const toFaDateString = (iso) => {
    try {
      if (!iso) return "";
      const d = new Date(iso);
      return d.toLocaleDateString("fa-IR");
    } catch {
      return iso;
    }
  };

  // ساختار بخش‌ها برای هر رکورد (همانند کد اصلی شما، با فیلدها)
  const buildSectionsForItem = (p) => {
    return {
      status: {
        اعیان: p.status?.isAyan ?? "",
        عرصه: p.status?.isArseh ?? "",
        "شماره عرصه": p.status?.arsehNumber ?? "",
        "وضعیت پرونده": p.status?.caseStatus || "",
        "کد ملک": p.status?.propertyIdCode || "",
        "شماره ملک": p.status?.propertyNumber ?? "",
        "تاریخ ایجاد": p.status?.createdAt || "",
        "تاریخ بروزرسانی": p.status?.updatedAt || "",
      },
      ownership: {
        "وضعیت مالکیت": p.ownership?.ownershipStatus || "",
        "نوع مالک": p.ownership?.ownerType || "",
        "نام مالک": p.ownership?.ownerName || "",
        "میزان مالکیت": p.ownership?.ownershipAmount || "",
        "تایید مالکیت": p.ownership?.ownershipConfirmedStatus || "",
        "نوع دارنده": p.ownership?.possessorType || "",
        "نام دارنده": p.ownership?.possessorName || "",
        "سال مالکیت": p.ownership?.possessionYear || "",
        "دلیل مالکیت": p.ownership?.possessionReason || "",
        "طرف معارض": p.ownership?.disputeParty || "",
        "دارنده معارض": p.ownership?.disputePossessorName || "",
        اختلاف: p.ownership?.dispute || "",
        "تاریخ ایجاد مالکیت": p.ownership?.createdAt || "",
        "تاریخ بروزرسانی مالکیت": p.ownership?.updatedAt || "",
      },
      identity: {
        "نوع ساختار": p.identity?.structureType || "",
        "تقسیمات اداری": p.identity?.administrativeDivision || "",
        عنوان: p.identity?.title || "",
        "کد جمعیت": p.identity?.populationCode || "",
        "نوع ملک": p.identity?.propertyType || "",
        "نوع بهره‌برداری": p.identity?.usageType || "",
        "استفاده قبلی": p.identity?.previousUsage || "",
        "توضیحات هویت": p.identity?.notes || "",
        "تاریخ ایجاد هویت": p.identity?.createdAt || "",
        "تاریخ بروزرسانی هویت": p.identity?.updatedAt || "",
      },
      location: {
        استان: p.location?.province || "",
        شهرستان: p.location?.county || "",
        شهر: p.location?.city || "",
        بخش: p.location?.district || "",
        روستا: p.location?.village || "",
        دهستان: p.location?.ruralDistrict || "",
        منطقه: p.location?.region || "",
        محله: p.location?.neighborhood || "",
        "خیابان اصلی": p.location?.mainStreet || "",
        "خیابان فرعی": p.location?.subStreet || "",
        کوچه: p.location?.alley || "",
        پلاک: p.location?.plate || "",
        کدپستی: p.location?.postalCode || "",
        "پلاک جداگانه": p.location?.separatedPlate || "",
        "پلاک اصلی": p.location?.mainPlate || "",
        زیرپلاک: p.location?.subPlate || "",
        "قسمت پلاک": p.location?.sectionPlate || "",
        "شماره قطعه": p.location?.pieceNumber || "",
        "آدرس کامل": p.location?.fullAddress || "",
        "تاریخ ایجاد مکان": p.location?.createdAt || "",
        "تاریخ بروزرسانی مکان": p.location?.updatedAt || "",
      },
      legalStatus: {
        "وضعیت حقوقی": p.legalStatus?.legalStatus || "",
        "نوع سند رسمی": p.legalStatus?.officialDocumentType || "",
        "نوع سند قطعی": p.legalStatus?.definiteDocumentType || "",
        "شناسه ملی ملک": p.legalStatus?.nationalPropertyId || "",
        "شناسه صدا": p.legalStatus?.sadaId || "",
        "شماره ثبت": p.legalStatus?.registrationNumber || "",
        "تاریخ ثبت": p.legalStatus?.registrationDate || "",
        "شماره دفتر": p.legalStatus?.officeNumber || "",
        "شماره صفحه": p.legalStatus?.pageNumber || "",
        "شماره سند": p.legalStatus?.documentNumber || "",
        "مساحت سند": p.legalStatus?.area || "",
        "میزان مالکیت سند": p.legalStatus?.ownershipAmount || "",
        "بخش ثبت": p.legalStatus?.registrationSection || "",
        "پلاک ثبت": p.legalStatus?.registrationPlate || "",
        فروشنده: p.legalStatus?.seller || "",
        خریدار: p.legalStatus?.buyer || "",
        "روش انتقال": p.legalStatus?.transferMethod || "",
        "منتقل به سند جدید": p.legalStatus?.leadsToNewDeed ?? "",
        "توضیحات سند": p.legalStatus?.notes || "",
        "تاریخ ایجاد سند": p.legalStatus?.createdAt || "",
        "تاریخ بروزرسانی سند": p.legalStatus?.updatedAt || "",
      },
      boundaries: {
        "مختصات X": p.boundaries?.coordinates?.x ?? "",
        "مختصات Y": p.boundaries?.coordinates?.y ?? "",
        "وضعیت مرز": p.boundaries?.boundaryStatus || "",
        شرق: p.boundaries?.east || "",
        غرب: p.boundaries?.west || "",
        شمال: p.boundaries?.north || "",
        جنوب: p.boundaries?.south || "",
        "ارائه‌دهنده نقشه": p.boundaries?.mapProvider || "",
        "مساحت زمین": p.boundaries?.landArea ?? "",
        "مساحت ساختمان": p.boundaries?.buildingArea ?? "",
        "مساحت بافر تایید شده": p.boundaries?.approvedBufferArea ?? "",
        "توضیحات مرز": p.boundaries?.notes || "",
        "تاریخ ایجاد مرز": p.boundaries?.createdAt || "",
        "تاریخ بروزرسانی مرز": p.boundaries?.updatedAt || "",
      },
      additionalInfo: {
        برق: p.additionalInfo?.utilities?.electricity ?? "",
        آب: p.additionalInfo?.utilities?.water ?? "",
        گاز: p.additionalInfo?.utilities?.gas ?? "",
        فاضلاب: p.additionalInfo?.utilities?.sewage ?? "",
        "سایر خدمات": p.additionalInfo?.utilities?.otherUtilities || "",
        "تعداد ساختمان‌ها": p.additionalInfo?.numberOfBuildings ?? "",
        "شماره اشتراک": p.additionalInfo?.subscriptionNumber || "",
        "تصویب شورای امنیت": p.additionalInfo?.securityCouncilApproved || "",
        "سطح امنیتی": p.additionalInfo?.securityLevel || "",
        "تهدیدات بالقوه": p.additionalInfo?.potentialThreats || "",
        "ارزش محیطی": p.additionalInfo?.environmentValue || "",
        "توضیحات اضافی": p.additionalInfo?.notes || "",
        "تاریخ ایجاد AdditionalInfo": p.additionalInfo?.createdAt || "",
        "تاریخ بروزرسانی AdditionalInfo": p.additionalInfo?.updatedAt || "",
      },
    };
  };

  // ساخت اکسل فقط با بخش‌های انتخاب شده
  const createExcelWithSelected = (selectedSections) => {
    if (!Array.isArray(data) || data.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "هیچ رکوردی برای خروجی وجود ندارد.",
        confirmButtonText: "باشه",
        confirmButtonColor: "#1b4965",
      });
      return;
    }

    // تابع کمکی برای تبدیل تاریخ، تیک و ضربدر
    const formatCellValue = (val) => {
      if (val === true) return "✓";
      if (val === false) return "×";
      if (!val || typeof val !== "string") return val;
      if (val.includes("T") && val.includes("Z") && !isNaN(Date.parse(val))) {
        return new Intl.DateTimeFormat("fa-IR").format(new Date(val));
      }
      return val;
    };

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);
    let rowIndex = 0;
    const MAX_COLUMNS = 3;

    // استخراج نام ملک برای سربرگ
    const firstItem = data[0] || {};
    const propertyName = firstItem.identity?.title || "نامشخص";
    const persianDate = new Date().toLocaleDateString("fa-IR");

    // ۱. ایجاد کادر سربرگ رسمی (نامه اداری)
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        ["بسمه تعالی"],
        [""],
        [
          "موضوع: گزارش جزئیات فنی و وضعیت ملک", // جابه‌جا شده به راست
          "",
          "",
          "",
          "تاریخ: " + persianDate, // جابه‌جا شده به چپ
        ],
        [
          "نوع گزارش: خروجی سیستمی", // جابه‌جا شده به راست
          "",
          "",
          "",
          "نام ملک: " + propertyName, // جابه‌جا شده به چپ
        ],
        [""],
      ],
      { origin: { r: rowIndex, c: 0 } },
    );

    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push(
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // بسمه تعالی وسط
      // موضوع → از ستون 0 تا 3
      { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },

      // تاریخ → ستون‌های سمت چپ
      { s: { r: 2, c: 4 }, e: { r: 2, c: 5 } },

      // نوع گزارش → از ستون 0 تا 3
      { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },

      // تعداد رکورد → ستون‌های سمت چپ
      { s: { r: 3, c: 4 }, e: { r: 3, c: 5 } },
    );

    rowIndex += 6; // شروع جدول بعد از سربرگ

    data.forEach((p) => {
      const sections = buildSectionsForItem(p);
      DEFAULT_SECTIONS.forEach((sectionMeta) => {
        const key = sectionMeta.key;
        if (!selectedSections[key]) return;

        const fields = sections[key] || {};

        // عنوان بخش (سرمه‌ای)
        XLSX.utils.sheet_add_aoa(ws, [[sectionMeta.title]], {
          origin: { r: rowIndex, c: 0 },
        });
        ws["!merges"].push({
          s: { r: rowIndex, c: 0 },
          e: { r: rowIndex, c: 5 },
        });
        rowIndex++;

        const fieldEntries = Object.entries(fields);
        for (let i = 0; i < fieldEntries.length; i += MAX_COLUMNS) {
          const rowData = [];
          const chunk = fieldEntries.slice(i, i + MAX_COLUMNS);
          chunk.forEach(([keyName, value]) => {
            rowData.push(keyName + ":", formatCellValue(value) ?? "---");
          });
          XLSX.utils.sheet_add_aoa(ws, [rowData], {
            origin: { r: rowIndex, c: 0 },
          });
          rowIndex++;
        }
        rowIndex++;
      });
      if (data.length > 1) rowIndex += 1;
    });

    // تنظیمات عرض ستون‌ها (برای فیت شدن در A4 عمودی بدون فضای اضافه)
    ws["!cols"] = [
      { wch: 13 },
      { wch: 13 }, // ستون ۱ و مقدارش
      { wch: 13 },
      { wch: 13 }, // ستون ۲ و مقدارش
      { wch: 13 },
      { wch: 13 }, // ستون ۳ و مقدارش
    ];

    ws["!rows"] = [];
    const totalRows = rowIndex || 1;
    for (let i = 0; i < totalRows; i++) ws["!rows"][i] = { hpt: 32 }; // ارتفاع بهینه

    // استایل خاص برای سربرگ بسمه تعالی
    ws["!rows"][0] = { hpt: 40 };

    ws["!views"] = [{ RTL: true }];

    // تنظیمات چاپ و فوتر (شماره صفحه)
    ws["!pageSetup"] = {
      paperSize: 9,
      orientation: "portrait",
      fitToWidth: 1,
      fitToHeight: 0,
    };
    ws["!headerFooter"] = { oddFooter: "&Cصفحه &P از &N" };
    ws["!printOptions"] = { horizontalCentered: true };

    if (!ws["!ref"])
      ws["!ref"] = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: Math.max(0, totalRows - 1), c: 5 },
      });

    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      let isSpacerRow = true;
      for (let C = 0; C <= 5; C++) {
        const check_ref = XLSX.utils.encode_cell({ c: C, r: R });
        if (
          ws[check_ref] &&
          ws[check_ref].v !== "" &&
          ws[check_ref].v !== null
        ) {
          isSpacerRow = false;
          break;
        }
      }
      if (isSpacerRow) {
        ws["!rows"][R] = { hpt: 10 };
        continue;
      }

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[cell_ref]) ws[cell_ref] = { t: "s", v: "" };

        const isBismillah = R === 0;
        const isHeader = ws["!merges"]?.some(
          (m) => R === m.s.r && C >= m.s.c && C <= m.e.c && R > 5,
        );

        ws[cell_ref].s = {
          font: { name: "Tahoma", sz: 8.5 },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          border: {
            top: { style: "thin", color: { rgb: "BDC3C7" } },
            bottom: { style: "thin", color: { rgb: "BDC3C7" } },
            left: { style: "thin", color: { rgb: "BDC3C7" } },
            right: { style: "thin", color: { rgb: "BDC3C7" } },
          },
        };

        if (isBismillah) {
          ws[cell_ref].s.font = { name: "Tahoma", sz: 12, bold: true };
          ws[cell_ref].s.border = {}; // حذف حاشیه برای بسمه تعالی
        } else if (R < 5) {
          ws[cell_ref].s.font.bold = true;
          ws[cell_ref].s.border = {}; // حذف حاشیه برای اطلاعات سربرگ
          ws[cell_ref].s.alignment.horizontal = C < 2 ? "right" : "left";
        } else if (isHeader) {
          ws[cell_ref].s.fill = { fgColor: { rgb: "1B4965" } };
          ws[cell_ref].s.font = {
            color: { rgb: "41BDBB" },
            bold: true,
            sz: 10,
          };
        } else if (C % 2 === 0 && R >= 5) {
          ws[cell_ref].s.fill = { fgColor: { rgb: "F2FBFA" } };
          ws[cell_ref].s.font.bold = true;
          ws[cell_ref].s.font.color = { rgb: "1B4965" };
        }
      }
    }

    const statusId = firstItem.status?._id || "NoID";
    const safeTitle = String(propertyName).replace(/[/\\?%*:|"<>]/g, "-");
    const fileName =
      data.length === 1
        ? `گزارش_ملک_${safeTitle} تاریخ ${new Date().toLocaleDateString("fa-IR").replace(/\//g, "-")}.xlsx`
        : `گزارش_رسمی_املاک_${persianDate.replace(/\//g, "-")}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, "جزئیات");
    XLSX.writeFile(wb, fileName);
  };

  const onExportConfirm = () => {
    // چک کنیم حداقل یک بخش انتخاب شده باشد
    const anySelected = DEFAULT_SECTIONS.some((s) => selected[s.key]);
    if (!anySelected) {
      Swal.fire({
        icon: "warning",
        title: "باید حداقل یک سرعنوان انتخاب کنید",
        confirmButtonText: "باشه",
        confirmButtonColor: "#1b4965",
      });
      return;
    }

    // بستن مودال و ایجاد اکسل
    setIsOpen(false);
    // یک تاخیر خیلی کوتاه برای UX (اختیاری)
    setTimeout(() => {
      createExcelWithSelected(selected);
    }, 120);
  };

  return (
    <>
      {/* دکمه اصلی دانلود */}
      <button
        onClick={() => setIsOpen(true)}
        className={`${actionBtn} p-3 rounded-2xl transition-all duration-500 hover:scale-110 active:scale-95 shadow-sm border border-white bg-[#41BDBB]/15 text-[#014f86] hover:bg-[#41BDBB] hover:text-white`}
        title="تنظیمات و دانلود اکسل"
      >
        <FileDown size={18} />
      </button>

      {/* مودال انتخاب سرتیترها */}
      {isOpen && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay با تم تیره و بلور */}
            <div
              className="absolute inset-0 bg-[#1b4965]/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            {/* کارت مودال با دیزاین امیر */}
            <div
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 animate-in fade-in zoom-in duration-300"
              style={{ direction: "rtl" }}
            >
              {/* Header مودال */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#f2fbfa]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1b4965] rounded-xl flex items-center justify-center shadow-lg shadow-[#1b4965]/20">
                    <FileDown className="text-[#41bdbb]" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#1b4965]">
                      تنظیمات خروجی اکسل
                    </h3>
                    <p className="text-[10px] text-[#41bdbb] font-bold uppercase tracking-wider">
                      Custom Excel Export
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-red-50 text-red-400 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* بدنه مودال */}
              <div className="p-8">
                <p className="text-sm font-bold text-[#1b4965]/60 mb-6">
                  بخش‌هایی که مایل هستید در فایل اکسل نهایی قرار بگیرند را
                  انتخاب کنید:
                </p>

                {/* دکمه انتخاب همه */}
                <div
                  onClick={toggleSelectAll}
                  className="mb-6 border-2 border-dashed border-[#41bdbb]/30 rounded-2xl p-4 bg-[#f2fbfa] cursor-pointer hover:bg-[#41bdbb]/5 transition-colors group"
                >
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectAll ? "bg-[#1b4965] border-[#1b4965]" : "border-[#1b4965]/30"}`}
                    >
                      {selectAll && (
                        <Check size={14} className="text-[#41bdbb]" />
                      )}
                    </div>
                    <span className="font-black text-sm text-[#1b4965] group-hover:text-[#41bdbb] transition-colors">
                      انتخاب تمامی بخش‌ها
                    </span>
                  </label>
                </div>

                {/* لیست بخش‌ها */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-[40vh] overflow-y-auto px-1">
                  {DEFAULT_SECTIONS.map((s) => (
                    <div
                      key={s.key}
                      onClick={() => toggleSection(s.key)}
                      className={`flex items-center justify-between gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        selected[s.key]
                          ? "border-[#41bdbb] bg-[#f2fbfa] shadow-sm"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            selected[s.key]
                              ? "bg-[#1b4965] border-[#1b4965]"
                              : "border-gray-200"
                          }`}
                        >
                          {selected[s.key] && (
                            <Check size={14} className="text-[#41bdbb]" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-sm text-[#1b4965]">
                            {s.title}
                          </div>
                          <div className="text-[10px] font-bold text-[#41bdbb]/70">
                            بخش {s.title}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`text-[10px] px-2 py-1 rounded-md font-black ${
                          selected[s.key]
                            ? "bg-[#41bdbb]/10 text-[#41bdbb]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {selected[s.key] ? "شامل می‌شود" : "حذف شده"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* فوتر مودال */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-4 font-black text-sm text-[#1b4965]/40 hover:text-red-500 transition-colors"
                  >
                    انصراف
                  </button>

                  <button
                    onClick={onExportConfirm}
                    className="flex-[2.5] py-4 bg-[#1b4965] text-white rounded-2xl font-black text-sm shadow-xl shadow-[#1b4965]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                  >
                    <div className="w-6 h-6 bg-[#41bdbb] rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <Check size={16} className="text-[#1b4965]" />
                    </div>
                    ساخت و دریافت خروجی اکسل
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

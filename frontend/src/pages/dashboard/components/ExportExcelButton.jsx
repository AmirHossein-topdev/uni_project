"use client";

import { FileDown } from "lucide-react";
import XLSX from "xlsx-js-style";

const actionBtn =
  "p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm";

async function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default function ExportExcelButton({ data }) {
  const flattenProperty = (p) => {
    const s = p.status || {};
    const o = p.ownership || {};
    const id = p.identity || {};
    const loc = p.location || {};
    const legal = p.legalStatus || {};
    const b = p.boundaries || {};
    const add = p.additionalInfo || {};

    return {
      // --- Status ---
      "شناسه داخلی": s._id || "",
      اعیان: s.isAyan ?? "",
      عرصه: s.isArseh ?? "",
      "شماره عرصه": s.arsehNumber ?? "",
      "وضعیت پرونده": s.caseStatus || "",
      "کد ملک": s.propertyIdCode || "",
      "شماره ملک": s.propertyNumber ?? "",
      "تاریخ ایجاد": s.createdAt || "",
      "تاریخ بروزرسانی": s.updatedAt || "",

      // --- Ownership ---
      "مالک _id": o._id || "",
      "مالک ملک": o.property || "",
      "وضعیت مالکیت": o.ownershipStatus || "",
      "نوع مالک": o.ownerType || "",
      "نام مالک": o.ownerName || "",
      "میزان مالکیت": o.ownershipAmount || "",
      "تایید مالکیت": o.ownershipConfirmedStatus || "",
      "نوع دارنده": o.possessorType || "",
      "نام دارنده": o.possessorName || "",
      "سال مالکیت": o.possessionYear || "",
      "دلیل مالکیت": o.possessionReason || "",
      "طرف معارض": o.disputeParty || "",
      "دارنده معارض": o.disputePossessorName || "",
      اختلاف: o.dispute || "",
      "تاریخ ایجاد مالکیت": o.createdAt || "",
      "تاریخ بروزرسانی مالکیت": o.updatedAt || "",

      // --- Identity ---
      "هویت _id": id._id || "",
      "ملک هویت": id.property || "",
      "نوع ساختار": id.structureType || "",
      "تقسیمات اداری": id.administrativeDivision || "",
      عنوان: id.title || "",
      "کد جمعیت": id.populationCode || "",
      "نوع ملک": id.propertyType || "",
      "نوع بهره‌برداری": id.usageType || "",
      "استفاده قبلی": id.previousUsage || "",
      "توضیحات هویت": id.notes || "",
      "تاریخ ایجاد هویت": id.createdAt || "",
      "تاریخ بروزرسانی هویت": id.updatedAt || "",

      // --- Location ---
      "مکان _id": loc._id || "",
      "ملک مکان": loc.property || "",
      استان: loc.province || "",
      شهرستان: loc.county || "",
      شهر: loc.city || "",
      بخش: loc.district || "",
      روستا: loc.village || "",
      دهستان: loc.ruralDistrict || "",
      منطقه: loc.region || "",
      محله: loc.neighborhood || "",
      "خیابان اصلی": loc.mainStreet || "",
      "خیابان فرعی": loc.subStreet || "",
      کوچه: loc.alley || "",
      پلاک: loc.plate || "",
      کدپستی: loc.postalCode || "",
      "پلاک جداگانه": loc.separatedPlate || "",
      "پلاک اصلی": loc.mainPlate || "",
      زیرپلاک: loc.subPlate || "",
      "قسمت پلاک": loc.sectionPlate || "",
      "شماره قطعه": loc.pieceNumber || "",
      "آدرس کامل": loc.fullAddress || "",
      "تاریخ ایجاد مکان": loc.createdAt || "",
      "تاریخ بروزرسانی مکان": loc.updatedAt || "",

      // --- LegalStatus ---
      "وضعیت حقوقی _id": legal._id || "",
      "ملک حقوقی": legal.property || "",
      "وضعیت حقوقی": legal.legalStatus || "",
      "نوع سند رسمی": legal.officialDocumentType || "",
      "نوع سند قطعی": legal.definiteDocumentType || "",
      "شناسه ملی ملک": legal.nationalPropertyId || "",
      "شناسه صدا": legal.sadaId || "",
      "شماره ثبت": legal.registrationNumber || "",
      "تاریخ ثبت": legal.registrationDate || "",
      "شماره دفتر": legal.officeNumber || "",
      "شماره صفحه": legal.pageNumber || "",
      "شماره سند": legal.documentNumber || "",
      "مساحت سند": legal.area || "",
      "میزان مالکیت سند": legal.ownershipAmount || "",
      "بخش ثبت": legal.registrationSection || "",
      "پلاک ثبت": legal.registrationPlate || "",
      فروشنده: legal.seller || "",
      خریدار: legal.buyer || "",
      "روش انتقال": legal.transferMethod || "",
      "منتقل به سند جدید": legal.leadsToNewDeed ?? "",
      "فایل سند": legal.documentFile || "",
      "توضیحات سند": legal.notes || "",
      "تاریخ ایجاد سند": legal.createdAt || "",
      "تاریخ بروزرسانی سند": legal.updatedAt || "",

      // --- Boundaries ---
      "مختصات X": b.coordinates?.x ?? "",
      "مختصات Y": b.coordinates?.y ?? "",
      "مرز _id": b._id || "",
      "ملک مرز": b.property || "",
      "وضعیت مرز": b.boundaryStatus || "",
      شرق: b.east || "",
      غرب: b.west || "",
      شمال: b.north || "",
      جنوب: b.south || "",
      "ارائه‌دهنده نقشه": b.mapProvider || "",
      "مساحت زمین": b.landArea ?? "",
      "مساحت ساختمان": b.buildingArea ?? "",
      "مساحت بافر تایید شده": b.approvedBufferArea ?? "",
      "توضیحات مرز": b.notes || "",
      "تاریخ ایجاد مرز": b.createdAt || "",
      "تاریخ بروزرسانی مرز": b.updatedAt || "",

      // --- AdditionalInfo Utilities ---
      برق: add.utilities?.electricity ?? "",
      آب: add.utilities?.water ?? "",
      گاز: add.utilities?.gas ?? "",
      فاضلاب: add.utilities?.sewage ?? "",
      "سایر خدمات": add.utilities?.otherUtilities || "",
      "_id AdditionalInfo": add._id || "",
      "ملک AdditionalInfo": add.property || "",
      "تعداد ساختمان‌ها": add.numberOfBuildings ?? "",
      "شماره اشتراک": add.subscriptionNumber || "",
      "تصویب شورای امنیت": add.securityCouncilApproved || "",
      "سطح امنیتی": add.securityLevel || "",
      "تهدیدات بالقوه": add.potentialThreats || "",
      "ارزش محیطی": add.environmentValue || "",
      "توضیحات اضافی": add.notes || "",
      "تاریخ ایجاد AdditionalInfo": add.createdAt || "",
      "تاریخ بروزرسانی AdditionalInfo": add.updatedAt || "",
    };
  };

  // const handleExportExcel = () => {
  //   // فرض می‌کنیم data یک آرایه است، اما برای هر آیتم یک شیت جداگانه یا در یک شیت عمودی قرار می‌دهیم
  //   // اینجا همه داده‌ها را در یک شیت به صورت عمودی قرار می‌دهیم، با جداکننده بین آیتم‌ها اگر چندتا باشد
  //   const wb = XLSX.utils.book_new();
  //   const ws = XLSX.utils.aoa_to_sheet([]); // شیت خالی شروع می‌کنیم

  //   let rowIndex = 0; // شاخص ردیف فعلی

  //   data.forEach((p, index) => {
  //     if (index > 0) {
  //       rowIndex += 2; // فضای خالی بین آیتم‌های مختلف اگر چندتا باشد
  //     }

  //     const sections = {
  //       Status: {
  //         "شناسه داخلی": p.status?._id || "",
  //         اعیان: p.status?.isAyan ?? "",
  //         عرصه: p.status?.isArseh ?? "",
  //         "شماره عرصه": p.status?.arsehNumber ?? "",
  //         "وضعیت پرونده": p.status?.caseStatus || "",
  //         "کد ملک": p.status?.propertyIdCode || "",
  //         "شماره ملک": p.status?.propertyNumber ?? "",
  //         "تاریخ ایجاد": p.status?.createdAt || "",
  //         "تاریخ بروزرسانی": p.status?.updatedAt || "",
  //       },
  //       Ownership: {
  //         "مالک _id": p.ownership?._id || "",
  //         "مالک ملک": p.ownership?.property || "",
  //         "وضعیت مالکیت": p.ownership?.ownershipStatus || "",
  //         "نوع مالک": p.ownership?.ownerType || "",
  //         "نام مالک": p.ownership?.ownerName || "",
  //         "میزان مالکیت": p.ownership?.ownershipAmount || "",
  //         "تایید مالکیت": p.ownership?.ownershipConfirmedStatus || "",
  //         "نوع دارنده": p.ownership?.possessorType || "",
  //         "نام دارنده": p.ownership?.possessorName || "",
  //         "سال مالکیت": p.ownership?.possessionYear || "",
  //         "دلیل مالکیت": p.ownership?.possessionReason || "",
  //         "طرف معارض": p.ownership?.disputeParty || "",
  //         "دارنده معارض": p.ownership?.disputePossessorName || "",
  //         اختلاف: p.ownership?.dispute || "",
  //         "تاریخ ایجاد مالکیت": p.ownership?.createdAt || "",
  //         "تاریخ بروزرسانی مالکیت": p.ownership?.updatedAt || "",
  //       },
  //       Identity: {
  //         "هویت _id": p.identity?._id || "",
  //         "ملک هویت": p.identity?.property || "",
  //         "نوع ساختار": p.identity?.structureType || "",
  //         "تقسیمات اداری": p.identity?.administrativeDivision || "",
  //         عنوان: p.identity?.title || "",
  //         "کد جمعیت": p.identity?.populationCode || "",
  //         "نوع ملک": p.identity?.propertyType || "",
  //         "نوع بهره‌برداری": p.identity?.usageType || "",
  //         "استفاده قبلی": p.identity?.previousUsage || "",
  //         "توضیحات هویت": p.identity?.notes || "",
  //         "تاریخ ایجاد هویت": p.identity?.createdAt || "",
  //         "تاریخ بروزرسانی هویت": p.identity?.updatedAt || "",
  //       },
  //       Location: {
  //         "مکان _id": p.location?._id || "",
  //         "ملک مکان": p.location?.property || "",
  //         استان: p.location?.province || "",
  //         شهرستان: p.location?.county || "",
  //         شهر: p.location?.city || "",
  //         بخش: p.location?.district || "",
  //         روستا: p.location?.village || "",
  //         دهستان: p.location?.ruralDistrict || "",
  //         منطقه: p.location?.region || "",
  //         محله: p.location?.neighborhood || "",
  //         "خیابان اصلی": p.location?.mainStreet || "",
  //         "خیابان فرعی": p.location?.subStreet || "",
  //         کوچه: p.location?.alley || "",
  //         پلاک: p.location?.plate || "",
  //         کدپستی: p.location?.postalCode || "",
  //         "پلاک جداگانه": p.location?.separatedPlate || "",
  //         "پلاک اصلی": p.location?.mainPlate || "",
  //         زیرپلاک: p.location?.subPlate || "",
  //         "قسمت پلاک": p.location?.sectionPlate || "",
  //         "شماره قطعه": p.location?.pieceNumber || "",
  //         "آدرس کامل": p.location?.fullAddress || "",
  //         "تاریخ ایجاد مکان": p.location?.createdAt || "",
  //         "تاریخ بروزرسانی مکان": p.location?.updatedAt || "",
  //       },
  //       LegalStatus: {
  //         "وضعیت حقوقی _id": p.legalStatus?._id || "",
  //         "ملک حقوقی": p.legalStatus?.property || "",
  //         "وضعیت حقوقی": p.legalStatus?.legalStatus || "",
  //         "نوع سند رسمی": p.legalStatus?.officialDocumentType || "",
  //         "نوع سند قطعی": p.legalStatus?.definiteDocumentType || "",
  //         "شناسه ملی ملک": p.legalStatus?.nationalPropertyId || "",
  //         "شناسه صدا": p.legalStatus?.sadaId || "",
  //         "شماره ثبت": p.legalStatus?.registrationNumber || "",
  //         "تاریخ ثبت": p.legalStatus?.registrationDate || "",
  //         "شماره دفتر": p.legalStatus?.officeNumber || "",
  //         "شماره صفحه": p.legalStatus?.pageNumber || "",
  //         "شماره سند": p.legalStatus?.documentNumber || "",
  //         "مساحت سند": p.legalStatus?.area || "",
  //         "میزان مالکیت سند": p.legalStatus?.ownershipAmount || "",
  //         "بخش ثبت": p.legalStatus?.registrationSection || "",
  //         "پلاک ثبت": p.legalStatus?.registrationPlate || "",
  //         فروشنده: p.legalStatus?.seller || "",
  //         خریدار: p.legalStatus?.buyer || "",
  //         "روش انتقال": p.legalStatus?.transferMethod || "",
  //         "منتقل به سند جدید": p.legalStatus?.leadsToNewDeed ?? "",
  //         "فایل سند": p.legalStatus?.documentFile || "",
  //         "توضیحات سند": p.legalStatus?.notes || "",
  //         "تاریخ ایجاد سند": p.legalStatus?.createdAt || "",
  //         "تاریخ بروزرسانی سند": p.legalStatus?.updatedAt || "",
  //       },
  //       Boundaries: {
  //         "مختصات X": p.boundaries?.coordinates?.x ?? "",
  //         "مختصات Y": p.boundaries?.coordinates?.y ?? "",
  //         "مرز _id": p.boundaries?._id || "",
  //         "ملک مرز": p.boundaries?.property || "",
  //         "وضعیت مرز": p.boundaries?.boundaryStatus || "",
  //         شرق: p.boundaries?.east || "",
  //         غرب: p.boundaries?.west || "",
  //         شمال: p.boundaries?.north || "",
  //         جنوب: p.boundaries?.south || "",
  //         "ارائه‌دهنده نقشه": p.boundaries?.mapProvider || "",
  //         "مساحت زمین": p.boundaries?.landArea ?? "",
  //         "مساحت ساختمان": p.boundaries?.buildingArea ?? "",
  //         "مساحت بافر تایید شده": p.boundaries?.approvedBufferArea ?? "",
  //         "توضیحات مرز": p.boundaries?.notes || "",
  //         "تاریخ ایجاد مرز": p.boundaries?.createdAt || "",
  //         "تاریخ بروزرسانی مرز": p.boundaries?.updatedAt || "",
  //       },
  //       "AdditionalInfo Utilities": {
  //         برق: p.additionalInfo?.utilities?.electricity ?? "",
  //         آب: p.additionalInfo?.utilities?.water ?? "",
  //         گاز: p.additionalInfo?.utilities?.gas ?? "",
  //         فاضلاب: p.additionalInfo?.utilities?.sewage ?? "",
  //         "سایر خدمات": p.additionalInfo?.utilities?.otherUtilities || "",
  //         "_id AdditionalInfo": p.additionalInfo?._id || "",
  //         "ملک AdditionalInfo": p.additionalInfo?.property || "",
  //         "تعداد ساختمان‌ها": p.additionalInfo?.numberOfBuildings ?? "",
  //         "شماره اشتراک": p.additionalInfo?.subscriptionNumber || "",
  //         "تصویب شورای امنیت": p.additionalInfo?.securityCouncilApproved || "",
  //         "سطح امنیتی": p.additionalInfo?.securityLevel || "",
  //         "تهدیدات بالقوه": p.additionalInfo?.potentialThreats || "",
  //         "ارزش محیطی": p.additionalInfo?.environmentValue || "",
  //         "توضیحات اضافی": p.additionalInfo?.notes || "",
  //         "تاریخ ایجاد AdditionalInfo": p.additionalInfo?.createdAt || "",
  //         "تاریخ بروزرسانی AdditionalInfo": p.additionalInfo?.updatedAt || "",
  //       },
  //     };
  //     Object.entries(sections).forEach(([sectionName, fields]) => {
  //       // ۱. افزودن هدر بخش
  //       XLSX.utils.sheet_add_aoa(ws, [[sectionName]], {
  //         origin: { r: rowIndex, c: 0 },
  //       });
  //       // ادغام سلول A و B برای هدر بخش
  //       if (!ws["!merges"]) ws["!merges"] = [];
  //       ws["!merges"].push({
  //         s: { r: rowIndex, c: 0 },
  //         e: { r: rowIndex, c: 1 },
  //       });

  //       rowIndex++;

  //       // ۲. افزودن فیلدها
  //       Object.entries(fields).forEach(([key, value], index) => {
  //         XLSX.utils.sheet_add_aoa(ws, [[key, value ?? "---"]], {
  //           origin: { r: rowIndex, c: 0 },
  //         });
  //         rowIndex++;
  //       });

  //       rowIndex++; // یک ردیف فاصله بین بخش‌ها
  //     });
  //   });

  //   // تنظیم عرض ستون‌ها
  //   ws["!cols"] = [{ wch: 35 }, { wch: 55 }];
  //   ws["!views"] = [{ RTL: true }];

  //   // --- اعمال استایل رنگی ---
  //   const range = XLSX.utils.decode_range(ws["!ref"]);
  //   for (let R = range.s.r; R <= range.e.r; ++R) {
  //     for (let C = range.s.c; C <= range.e.c; ++C) {
  //       const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
  //       if (!ws[cell_ref]) continue;

  //       const cellValue = ws[cell_ref].v ? ws[cell_ref].v.toString() : "";

  //       // استایل پایه
  //       ws[cell_ref].s = {
  //         font: { name: "Tahoma", sz: 10 },
  //         alignment: {
  //           horizontal: "center",
  //           vertical: "center",
  //           wrapText: true,
  //         },
  //         border: {
  //           top: { style: "thin", color: { rgb: "CCCCCC" } },
  //           bottom: { style: "thin", color: { rgb: "CCCCCC" } },
  //           left: { style: "thin", color: { rgb: "CCCCCC" } },
  //           right: { style: "thin", color: { rgb: "CCCCCC" } },
  //         },
  //       };

  //       // ۱. استایل هدر بخش (رنگ سبز تیره)
  //       if (cellValue.startsWith("---")) {
  //         ws[cell_ref].s.fill = { fgColor: { rgb: "1B5E20" } };
  //         ws[cell_ref].s.font = {
  //           color: { rgb: "FFFFFF" },
  //           bold: true,
  //           sz: 11,
  //         };
  //       }
  //       // ۲. استایل نام ردیف (ستون اول - خاکستری ملایم)
  //       else if (C === 0 && cellValue !== "") {
  //         ws[cell_ref].s.fill = { fgColor: { rgb: "E8F5E9" } }; // سبز خیلی روشن برای نام فیلد
  //         ws[cell_ref].s.font.bold = true;
  //         ws[cell_ref].s.alignment.horizontal = "right";
  //       }
  //       // ۳. استایل یکی در میان مقادیر (ستون دوم)
  //       else if (C === 1 && cellValue !== "") {
  //         const isEven = R % 2 === 0;
  //         ws[cell_ref].s.fill = {
  //           fgColor: { rgb: isEven ? "FFFFFF" : "F9F9F9" },
  //         };
  //         ws[cell_ref].s.alignment.horizontal = "right";
  //       }
  //     }
  //   }

  //   // خروجی گرفتن
  //   const item = data[0] || {};
  //   const fileName =
  //     data.length === 1
  //       ? `${item.status?._id}-${item.identity?.title}.xlsx`
  //       : "Property_Full_Report.xlsx";

  //   XLSX.utils.book_append_sheet(wb, ws, "جزئیات ملک");
  //   XLSX.writeFile(wb, fileName);
  // };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    let rowIndex = 0;
    const MAX_COLUMNS = 4;

    data.forEach((p, pIndex) => {
      // تمام فیلدها دقیقاً مطابق لیست ارسالی شما
      const sections = {
        "Status (وضعیت)": {
          "شناسه داخلی": p.status?._id || "",
          اعیان: p.status?.isAyan ?? "",
          عرصه: p.status?.isArseh ?? "",
          "شماره عرصه": p.status?.arsehNumber ?? "",
          "وضعیت پرونده": p.status?.caseStatus || "",
          "کد ملک": p.status?.propertyIdCode || "",
          "شماره ملک": p.status?.propertyNumber ?? "",
          "تاریخ ایجاد": p.status?.createdAt || "",
          "تاریخ بروزرسانی": p.status?.updatedAt || "",
        },
        "Ownership (مالکیت)": {
          "مالک _id": p.ownership?._id || "",
          "مالک ملک": p.ownership?.property || "",
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
        "Identity (هویت)": {
          "هویت _id": p.identity?._id || "",
          "ملک هویت": p.identity?.property || "",
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
        "Location (مکان)": {
          "مکان _id": p.location?._id || "",
          "ملک مکان": p.location?.property || "",
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
        "LegalStatus (وضعیت حقوقی)": {
          "وضعیت حقوقی _id": p.legalStatus?._id || "",
          "ملک حقوقی": p.legalStatus?.property || "",
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
          "فایل سند": p.legalStatus?.documentFile || "",
          "توضیحات سند": p.legalStatus?.notes || "",
          "تاریخ ایجاد سند": p.legalStatus?.createdAt || "",
          "تاریخ بروزرسانی سند": p.legalStatus?.updatedAt || "",
        },
        "Boundaries (مرزها)": {
          "مختصات X": p.boundaries?.coordinates?.x ?? "",
          "مختصات Y": p.boundaries?.coordinates?.y ?? "",
          "مرز _id": p.boundaries?._id || "",
          "ملک مرز": p.boundaries?.property || "",
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
        "AdditionalInfo (اطلاعات تکمیلی)": {
          برق: p.additionalInfo?.utilities?.electricity ?? "",
          آب: p.additionalInfo?.utilities?.water ?? "",
          گاز: p.additionalInfo?.utilities?.gas ?? "",
          فاضلاب: p.additionalInfo?.utilities?.sewage ?? "",
          "سایر خدمات": p.additionalInfo?.utilities?.otherUtilities || "",
          "_id AdditionalInfo": p.additionalInfo?._id || "",
          "ملک AdditionalInfo": p.additionalInfo?.property || "",
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
      Object.entries(sections).forEach(([sectionName, fields]) => {
        XLSX.utils.sheet_add_aoa(ws, [[sectionName]], {
          origin: { r: rowIndex, c: 0 },
        });
        if (!ws["!merges"]) ws["!merges"] = [];
        ws["!merges"].push({
          s: { r: rowIndex, c: 0 },
          e: { r: rowIndex, c: 7 },
        });
        rowIndex++;

        const fieldEntries = Object.entries(fields);
        for (let i = 0; i < fieldEntries.length; i += MAX_COLUMNS) {
          const rowData = [];
          const chunk = fieldEntries.slice(i, i + MAX_COLUMNS);
          chunk.forEach(([key, value]) => {
            rowData.push(key + ":", value ?? "---");
          });
          XLSX.utils.sheet_add_aoa(ws, [rowData], {
            origin: { r: rowIndex, c: 0 },
          });
          rowIndex++;
        }
        rowIndex++; // ردیف فاصله
      });
      if (data.length > 1) rowIndex += 1;
    });

    // ۱. تنظیم عرض ستون‌ها (بیشتر شد برای خوانایی)
    ws["!cols"] = Array(8).fill({ wch: 25 });

    // ۲. تنظیم ارتفاع ردیف‌ها (hpt مقدار پیکسل است)
    const totalRows = rowIndex;
    ws["!rows"] = [];
    for (let i = 0; i < totalRows; i++) {
      ws["!rows"][i] = { hpt: 30 }; // ارتفاع ۳۰ پیکسل برای تمام ردیف‌ها
    }

    ws["!views"] = [{ RTL: true }];

    // --- اعمال استایل‌ها و وسط‌چین کردن ---
    const range = XLSX.utils.decode_range(ws["!ref"]);
    range.e.c = 7;

    for (let R = range.s.r; R <= range.e.r; ++R) {
      let isSpacerRow = true;
      for (let C = 0; C <= 7; C++) {
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

      // ردیف فاصله استایل نمی‌گیرد و ارتفاعش را کم می‌کنیم
      if (isSpacerRow) {
        ws["!rows"][R] = { hpt: 15 };
        continue;
      }

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[cell_ref]) ws[cell_ref] = { t: "s", v: "" };

        const isHeader = ws["!merges"]?.some(
          (m) => R === m.s.r && C >= m.s.c && C <= m.e.c
        );

        let borderStyle = {
          top: { style: "medium", color: { rgb: "000000" } },
          bottom: { style: "medium", color: { rgb: "000000" } },
          left: { style: "medium", color: { rgb: "000000" } },
          right: { style: "medium", color: { rgb: "000000" } },
        };

        // بوردر دو لایه برای حاشیه بیرونی
        if (R === range.s.r)
          borderStyle.top = { style: "double", color: { rgb: "000000" } };
        if (R === range.e.r)
          borderStyle.bottom = { style: "double", color: { rgb: "000000" } };
        if (C === range.s.c)
          borderStyle.right = { style: "double", color: { rgb: "000000" } };
        if (C === range.e.c)
          borderStyle.left = { style: "double", color: { rgb: "000000" } };

        ws[cell_ref].s = {
          font: { name: "Tahoma", sz: 10 },
          alignment: {
            horizontal: "center", // وسط‌چین افقی
            vertical: "center", // وسط‌چین عمودی
            wrapText: true,
          },
          border: borderStyle,
        };

        if (isHeader) {
          ws[cell_ref].s.fill = { fgColor: { rgb: "2E7D32" } };
          ws[cell_ref].s.font = {
            color: { rgb: "FFFFFF" },
            bold: true,
            sz: 12,
          };
        } else if (C % 2 === 0) {
          ws[cell_ref].s.fill = { fgColor: { rgb: "E8F5E9" } };
          ws[cell_ref].s.font.bold = true;
        }
      }
    }
    // ۱. استخراج داده‌ها از اولین مورد برای نام فایل
    const firstItem = data[0] || {};
    const statusId = firstItem.status?._id || "NoID";
    const identityTitle = firstItem.identity?.title || "NoTitle";

    // ۲. تمیز کردن نام فایل (حذف کاراکترهایی که سیستم عامل اجازه نمی‌دهد مثل / : * ?)
    const safeTitle = identityTitle.replace(/[/\\?%*:|"<>]/g, "-");

    // ۳. ساخت نام فایل به فرمت: شناسه-عنوان.xlsx
    const fileName = `${statusId}-${safeTitle}.xlsx`;

    // ۴. تنظیمات نهایی و خروجی
    XLSX.utils.book_append_sheet(wb, ws, "جزئیات");
    XLSX.writeFile(wb, fileName);
  };

  return (
    <>
      <button
        onClick={handleExportExcel}
        className={`${actionBtn} bg-green-50 text-green-600 hover:bg-green-600 hover:text-white flex items-center gap-2`}
        title="دانلود اکسل"
      >
        <FileDown size={18} />
      </button>
    </>
  );
}

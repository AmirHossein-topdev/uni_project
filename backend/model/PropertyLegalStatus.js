const mongoose = require("mongoose");
const { type } = require("os");
const { ObjectId } = mongoose.Schema.Types;

const propertyLegalStatusSchema = mongoose.Schema(
  {
    // لینک به ملک اصلی
    property: {
      type: ObjectId,
      ref: "PropertyBasicStatus",
      required: true,
    },

    /* =========================
       وضعیت کلی سند
    ========================= */
    legalStatus: {
      type: String,
      enum: ["سند رسمی", "سند عادی", "فاقد سند"],
      required: true,
    },

    /* =========================
       حالت سند رسمی
    ========================= */
    officialDocumentType: {
      type: String,
      enum: [
        "کاداستر",
        "وقف نامه",
        "دفترچه ای",
        "سند قطعی",
        "وصیت نامه",
        "وکالتنامه",
        "هبه نامه",
        "صلح نامه",
        "مبایعه نامه",
      ],
    },

    /* =========================
       نوع سند قطعی
    ========================= */
    definiteDocumentType: {
      type: String,
      enum: [
        "اجاره نامه- اوقاف و امور خیریه",
        "اجاره نامه - استان قدس رضوی",
        "اجاره نامه - سایر",
      ],
    },

    /* =========================
       حالت سند عادی
    ========================= */
    ordinaryDocumentType: {
      type: String,
      enum: [
        "وقف نامه",
        "هبه نامه",
        "صلح نامه",
        "مبایعه نامه",
        "صورتجلسه",
        "قرارداد واگذاری",
        "توافق نامه",
      ],
    },

    /* =========================
       حالت فاقد سند
    ========================= */
    noDocumentType: {
      type: String,
      enum: ["صورتجلسه", "مصوبه هیئت وزیران", "قرارداد واگذاری"],
    },

    /* =====================================================
       فیلدهای عمومی (برای سند رسمی / عادی)
    ===================================================== */
    nationalPropertyId: {
      type: Number, // شناسه ملی ملک
    },

    sadaId: {
      type: String, // شناسه سادا
      trim: true,
    },

    registrationNumber: {
      type: String, // شماره ثبت
      trim: true,
    },

    registrationDate: {
      type: String, // تاریخ شمسی
      trim: true,
    },

    officeNumber: {
      type: String, // شماره دفتر
      trim: true,
    },

    pageNumber: {
      type: String, // شماره صفحه
      trim: true,
    },

    documentNumber: {
      type: String, // شماره مدرک (متن/عدد/تاریخ)
      trim: true,
    },

    area: {
      type: Number, // مساحت
    },

    ownershipAmount: {
      type: String, // میزان مالکیت (مثلاً شش دانگ / 6 دانگ)
      trim: true,
    },

    registrationSection: {
      type: String, // بخش ثبتی
      trim: true,
    },

    registrationPlate: {
      type: String, // پلاک ثبتی
      trim: true,
    },

    seller: {
      type: String, // معامل
      trim: true,
    },

    buyer: {
      type: String, // متعامل
      trim: true,
    },

    transferMethod: {
      type: String,
      enum: ["هبه", "بیع", "صلح"], // نحوه انتقال
    },

    leadsToNewDeed: {
      type: Boolean, // منجر به صدور سند جدید
      default: false,
    },

    documentFile: {
      type: String, // مسیر یا URL فایل آپلودی
    },

    /* =====================================================
       فیلدهای اختصاصی فاقد سند
    ===================================================== */
    noDeedTransferDate: {
      type: Date, // تاریخ انتقال (فقط فاقد سند)
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const PropertyLegalStatus = mongoose.model(
  "PropertyLegalStatus",
  propertyLegalStatusSchema
);

module.exports = PropertyLegalStatus;

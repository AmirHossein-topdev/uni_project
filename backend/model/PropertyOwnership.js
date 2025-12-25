const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const propertyOwnershipSchema = mongoose.Schema(
  {
    // لینک به ملک اصلی
    property: {
      type: ObjectId,
      ref: "PropertyBasicStatus", // یا Property اصلی
      required: true,
    },

    // وضعیت مالکیت
    ownershipStatus: {
      type: String,
      enum: [
        "طلق",
        "استیجاری",
        "عقود ناقله",
        "سرقفلی / حق کسب و پیشه",
        "حق بهره برداری (تبصره 5 ماده96)",
        "امانی",
        "سایر",
      ],
      default: "سایر",
    },

    // مالک
    ownerType: {
      type: String,
      enum: [
        "جمعیت",
        "دولت",
        "شخصی حقیقی",
        "شخص حقوقی",
        "شرکت های تابعه",
        "سایر",
      ],
      default: "شخصی حقیقی",
    },
    ownerName: { type: String, trim: true }, // نام مالک
    ownershipAmount: { type: String, trim: true }, // میزان مالکیت (مثلاً "شش دانگ" یا "6 دانگ")
    ownershipConfirmedStatus: {
      type: String,
      enum: ["تثبیت شده", "تثبیت نشده", "مورد ندارد"],
      default: "مورد ندارد",
    },

    // متصرف
    possessorType: {
      type: String,
      enum: ["جمعیت", "اشخاص حقیقی", "اشخاص حقوقی", "سایر"],
      default: "اشخاص حقیقی",
    },
    possessorName: { type: String, trim: true },
    possessionYear: { type: Number }, // سال تصرف
    possessionReason: {
      type: String,
      enum: ["بخشنامه 1600", "مصوبه هیئت وزیران", "اجاره", "سایر", "عدوانی"],
      default: "اجاره",
    },

    dispute: {
      type: String,
      enum: ["معارض دارد", "ندارد"],
      default: "معارض دارد",
    },

    // طرف اختلاف
    disputeParty: {
      type: String,
      enum: [
        "اداره اوقاف و امور خیریه",
        "شهرداری",
        "ارتش",
        "سپاه",
        "وزارت بهداشت",
        "آموزش و پرورش",
        "انتقال خون",
        "دستگاههای اجرایی",
        "ستاد اجرایی فرمان امام",
        "اشخاص حقیقی",
        "سایر",
        "وزارت نیرو",
        "دانشگاه",
        "مسکن و شهرسازی",
        "سازمان آب",
        "تربیت بدنی",
        "اداره اوقاف",
        "جهاد کشاورزی",
        "حوزه علمیه",
        "بخشداری",
        "امام جمعه",
        "فرمانداری",
        "کشاورزان",
        "مجهول",
      ],
    },
    disputePossessorName: { type: String, trim: true }, // نام متصرف طرف اختلاف
  },
  { timestamps: true }
);

const PropertyOwnership = mongoose.model(
  "PropertyOwnership",
  propertyOwnershipSchema
);
module.exports = PropertyOwnership;

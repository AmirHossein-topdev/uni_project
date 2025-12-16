const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const propertyIdentitySchema = mongoose.Schema(
  {
    // لینک به ملک اصلی
    property: {
      type: ObjectId,
      ref: "PropertyBasicStatus", // یا Property اصلی
      required: true,
    },

    // ساختمان / محیط / ساختار سازمانی
    structureType: {
      type: String,
      enum: ["ساختمان", "محیط", "ساختار سازمانی", "ساختمان مرکزی", "پایش"],
    },

    // نوع تقسیمات کشوری
    administrativeDivision: {
      type: String,
      enum: ["شهری", "روستایی", "اراضی ملی"],
    },

    // عنوان ملک
    title: {
      type: String,
      trim: true,
      required: true,
    },

    // کد جمعیتی ملک
    populationCode: {
      type: String,
      trim: true,
    },

    // نوع ملک
    propertyType: {
      type: String,
      enum: [
        "زمین",
        "آپارتمان",
        "مستغلات",
        "مغازه",
        "کوره",
        "چاه",
        "آب",
        "بیمارستان",
        "باغ",
        "مسجد",
        "مغازه",
      ],
    },

    // نوع بهره‌برداری
    usageType: {
      type: String,
      enum: [
        "اداری",
        "ویلایی",
        "معدن",
        "نداشته است",
        "جوانان",
        "مجتمع تجاری",
        "پارکینگ",
        "اداری",
        "آموزشی",
        "انبار",
        "حمل و نقل",
        "مسکونی",
        "پایگاه - امدادی",
        "مغازه",
        "فضای سبز",
        "تکرار زیرمجموعه نوع بهره برداری",
        "اردوگاه - امدادی",
        "کشاورزی",
        "فرهنگی مذهبی",
        "بیمارستان",
        "مسکونی",
        "بهداشتی درمانی",
        "درمانگاه",
        "اداری- دولتی",
        "خدمات شهری",
        "توانبخشی",
        "تجاری",
        "تجهیزات شهری",
        "داروخانه",
        "صنعتی",
        "منازل سازمانی",
        "آپارتمان",
        "خدماتی",
        "املاک سازمانی",
        "فاقد بهره برداری",
      ],
    },

    // کاربری قبلی
    previousUsage: {
      type: String,
      enum: [
        "نداشته است",
        "اداری",
        "مسکونی",
        "تکرار زیرمجموعه نوع بهره برداری",
      ],
      default: "نداشته است",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const PropertyIdentity = mongoose.model(
  "PropertyIdentity",
  propertyIdentitySchema
);

module.exports = PropertyIdentity;

const mongoose = require("mongoose");

const propertyBasicStatusSchema = mongoose.Schema(
  {
    // انتخاب عرصه / عیان با چک‌باکس
    isArseh: {
      type: Boolean,
      default: false,
    },
    isAyan: {
      type: Boolean,
      default: false,
    },

    // شماره عرصه
    arsehNumber: {
      type: Number,
    },

    // وضعیت پرونده
    caseStatus: {
      type: String,
      enum: ["جاری", "تمام شده"],
      default: "جاری",
    },

    // کد شناسایی ملک (شماره پرونده)
    propertyIdCode: {
      type: String,
      required: true,
      unique: true,
    },

    // کد ملک
    propertyNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const PropertyBasicStatus = mongoose.model(
  "PropertyBasicStatus",
  propertyBasicStatusSchema
);

module.exports = PropertyBasicStatus;

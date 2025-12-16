const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const propertyBoundariesInfoSchema = mongoose.Schema(
  {
    // لینک به ملک اصلی
    property: {
      type: ObjectId,
      ref: "PropertyBasicStatus",
      required: true,
    },

    /* =========================
       وضعیت حدود اربعه
    ========================= */
    boundaryStatus: {
      type: String,
      enum: ["تحدید حدود شده", "تحدید حدود نشده"],
      required: true,
    },

    /* =========================
       مختصات برای نقشه
    ========================= */
    coordinates: {
      x: { type: Number }, // مقدار X
      y: { type: Number }, // مقدار Y
    },

    /* =========================
       جهت‌ها
    ========================= */
    east: { type: String, trim: true },
    west: { type: String, trim: true },
    north: { type: String, trim: true },
    south: { type: String, trim: true },

    mapProvider: {
      type: String,
      enum: ["Google Map"], // برای انتخاب نوع نقشه
      default: "Google Map",
    },

    /* =========================
       مساحت‌ها
    ========================= */
    landArea: { type: Number }, // مساحت عرصه
    buildingArea: { type: Number }, // مساحت اعیان
    approvedBufferArea: { type: Number }, // متراژ حریم مصوب

    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const PropertyBoundariesInfo = mongoose.model(
  "PropertyBoundariesInfo",
  propertyBoundariesInfoSchema
);

module.exports = PropertyBoundariesInfo;

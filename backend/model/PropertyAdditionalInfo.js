const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const propertyAdditionalInfoSchema = mongoose.Schema(
  {
    // لینک به ملک اصلی
    property: {
      type: ObjectId,
      ref: "PropertyBasicStatus",
      required: true,
    },

    /* =========================
       انشعابات
    ========================= */
    utilities: {
      electricity: { type: Boolean, default: false },
      water: { type: Boolean, default: false },
      gas: { type: Boolean, default: false },
      sewage: { type: Boolean, default: false },
      otherUtilities: { type: String, trim: true }, // سایر انشعابات
    },

    numberOfBuildings: { type: Number }, // تعداد ساختمان

    subscriptionNumber: {
      type: String, // شماره اشتراک
      trim: true,
    },

    /* =========================
       رده حفاظتی مصوب شورای امنیت کشور
    ========================= */
    securityCouncilApproved: {
      type: String,
      enum: ["دارد", "ندارد"],
    },

    securityLevel: {
      type: String,
      enum: ["حیاتی", "مهم", "حساس", "قابل حفاظت"],
    },

    potentialThreats: { type: String, trim: true }, // تهدیدات و آسیب‌پذیری‌های متصور

    environmentValue: { type: String, trim: true }, // ارزشمندی و اهمیت محیط

    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const PropertyAdditionalInfo = mongoose.model(
  "PropertyAdditionalInfo",
  propertyAdditionalInfoSchema
);

module.exports = PropertyAdditionalInfo;

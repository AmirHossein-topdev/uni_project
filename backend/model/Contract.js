const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const contractSchema = new mongoose.Schema(
  {
    tenant: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: ObjectId,
      ref: "Property",
      required: true,
    },
    contractNumber: {
      type: Number,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["نقدی", "کارت بانکی", "انتقال بانکی", "چک"],
      required: true,
    },
    documents: [
      {
        fileName: String,
        fileURL: String,
      },
    ],
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["در انتظار", "در حال اجرا", "تکمیل‌شده", "لغو شده"],
      default: "در انتظار",
    },
  },
  {
    timestamps: true,
  }
);

// شماره قرارداد خودکار
contractSchema.pre("save", async function (next) {
  if (!this.contractNumber) {
    try {
      const lastContract = await mongoose
        .model("Contract")
        .find({})
        .sort({ contractNumber: -1 })
        .limit(1)
        .select({ contractNumber: 1 });
      this.contractNumber =
        lastContract.length === 0 ? 1000 : lastContract[0].contractNumber + 1;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;

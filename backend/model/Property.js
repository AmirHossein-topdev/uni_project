const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require("validator");

const propertySchema = mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: [true, "Please provide a title for this property."],
      trim: true,
      minLength: [3, "Title must be at least 3 characters."],
      maxLength: [200, "Title is too large"],
    },
    slug: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["مسکونی", "تجاری", "زمین", "صنعتی", "سایر"],
    },
    homeType: {
      type: String,
      required: true,
      enum: ["آپارتمان", "ویلایی", "دوبلکس", "پنت‌هاوس", "سوئیت"],
    },

    status: {
      type: String,
      required: true,
      enum: ["در دسترس", "غیرفعال", "در حال تعمیر"],
      default: "در دسترس",
    },
    description: {
      type: String,
      required: true,
    },
    area: {
      type: Number,
      required: true,
      min: [0, "Area can't be negative"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price can't be negative"],
    },
    discount: {
      type: Number,
      min: [0, "Discount can't be negative"],
    },
    address: {
      street: { type: String, required: true },
      floor: { type: Number },
      unit: { type: String },
      buildingNumber: { type: Number },
      district: { type: String },
      alley: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: "ایران" },
      postalCode: { type: Number, required: true },
    },
    owner: {
      type: ObjectId,
      ref: "Owner",
      required: true,
    },
    contracts: [
      {
        type: ObjectId,
        ref: "Contract",
      },
    ],
    mainImage: {
      type: String,
      required: true,
      validate: [validator.isURL, "Please provide a valid URL for main image"],
    },
    gallery: [
      {
        img: {
          type: String,
          validate: [validator.isURL, "Please provide valid URL(s)"],
        },
        description: String,
      },
    ],
    tags: [String],
    features: [{}], // مثل پارکینگ، آسانسور، استخر و ...
    videoTourId: String, // اگر تور ویدیویی موجود است
    availableFrom: Date,
    offerDate: {
      startDate: Date,
      endDate: Date,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;

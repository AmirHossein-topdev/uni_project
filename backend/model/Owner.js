const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ownerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide owner's name"],
      trim: true,
      maxLength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["individual", "organization"],
      default: "individual",
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    properties: [
      {
        type: ObjectId,
        ref: "Property",
      },
    ],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Owner = mongoose.model("Owner", ownerSchema);
module.exports = Owner;

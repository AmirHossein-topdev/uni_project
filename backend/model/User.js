// backend/model/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema(
  {
    // نام کامل کاربر
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [100, "Name is too large"],
    },

    // ایمیل کاربر
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },

    // کد سازمانی منحصر به فرد (شناسه ورود)
    employeeCode: {
      type: String,
      required: [true, "Employee code is required"],
      unique: true,
      trim: true,
      minLength: [3, "Employee code must be at least 3 characters."],
      maxLength: [50, "Employee code is too long"],
    },

    // رمز عبور هش‌شده
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 6,
    },

    // نقش کاربر (مدیر / کاربر معمولی / ... )
    role: {
      type: ObjectId,
      ref: "Role",
      required: true,
    },

    // شماره تماس اختیاری
    contactNumber: {
      type: String,
      trim: true,
    },

    // آدرس اختیاری
    address: {
      type: String,
      trim: true,
    },

    // تصویر پروفایل اختیاری
    profileImage: {
      type: String,
    },

    // وضعیت دسترسی کاربر
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "inactive",
    },

    // تاریخ آخرین تغییر رمز عبور
    passwordChangedAt: Date,

    // توکن و تاریخ انقضای ریست رمز عبور
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// هش کردن پسورد قبل از ذخیره
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// بررسی پسورد
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// تولید توکن ریست رمز عبور
userSchema.methods.generatePasswordResetToken = function () {
  const crypto = require("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = token;
  const date = new Date();
  date.setHours(date.getHours() + 1); // اعتبار 1 ساعت
  this.passwordResetExpires = date;
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;

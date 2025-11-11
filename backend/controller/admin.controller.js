const User = require("../model/User");
const Role = require("../model/Role");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// ثبت ادمین یا پرسنل جدید
exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({ name, email, password, phone, role });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ورود ادمین
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role");

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// تغییر رمز عبور
exports.changePassword = async (req, res, next) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// افزودن پرسنل جدید
exports.addStaff = async (req, res, next) => {
  try {
    const { name, email, phone, role } = req.body;
    const staff = await User.create({ name, email, phone, role });
    res.status(201).json({
      success: true,
      message: "Staff added successfully",
      staff,
    });
  } catch (error) {
    next(error);
  }
};

// گرفتن همه پرسنل
exports.getAllStaff = async (req, res, next) => {
  try {
    const staffList = await User.find().populate("role");
    res.status(200).json({ success: true, data: staffList });
  } catch (error) {
    next(error);
  }
};

// گرفتن پرسنل خاص با ID
exports.getStaffById = async (req, res, next) => {
  try {
    const staff = await User.findById(req.params.id).populate("role");
    if (!staff)
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

// بروزرسانی پرسنل
exports.updateStaff = async (req, res, next) => {
  try {
    const staff = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!staff)
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Staff updated successfully",
        data: staff,
      });
  } catch (error) {
    next(error);
  }
};

// حذف پرسنل
exports.deleteStaff = async (req, res, next) => {
  try {
    const staff = await User.findByIdAndDelete(req.params.id);
    if (!staff)
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    res
      .status(200)
      .json({ success: true, message: "Staff deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// فراموشی رمز عبور (ایجاد توکن)
exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const token = user.generateConfirmationToken();
    await user.save();

    // TODO: ارسال ایمیل با لینک ریست پسورد حاوی token
    res
      .status(200)
      .json({
        success: true,
        message: "Reset password token generated",
        token,
      });
  } catch (error) {
    next(error);
  }
};

// تایید ریست رمز عبور
exports.confirmAdminForgetPass = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      confirmationToken: token,
      confirmationTokenExpires: { $gt: new Date() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    user.password = newPassword;
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

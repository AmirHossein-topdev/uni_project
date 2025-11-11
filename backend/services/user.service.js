const User = require("../model/User");
const Role = require("../model/Role");
const ApiError = require("../errors/api-error");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// ثبت‌نام کاربر
exports.registerUserService = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new ApiError(400, "Email already exists");

  const user = await User.create(data);
  return user;
};

// ورود کاربر
exports.loginUserService = async (email, password) => {
  const user = await User.findOne({ email }).populate("role");
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = jwt.sign({ id: user._id, role: user.role._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
  return { user, token };
};

// تغییر پسورد
exports.changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new ApiError(401, "Old password is incorrect");

  user.password = newPassword;
  await user.save();
  return { message: "Password updated successfully" };
};

// افزودن کاربر توسط Admin/Manager
exports.addUserService = async (data) => {
  const role = await Role.findById(data.role);
  if (!role) throw new ApiError(400, "Role not found");
  const user = await User.create(data);
  return user;
};

// دریافت همه کاربران
exports.getAllUsersService = async () => {
  return await User.find().populate("role");
};

// دریافت یک کاربر
exports.getUserByIdService = async (id) => {
  const user = await User.findById(id).populate("role");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// ویرایش کاربر
exports.updateUserService = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, { new: true }).populate(
    "role"
  );
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// تغییر وضعیت کاربر
exports.updateUserStatusService = async (id, status) => {
  const user = await User.findByIdAndUpdate(id, { status }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// حذف کاربر
exports.deleteUserService = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// فراموشی پسورد
exports.forgetPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const token = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 ساعت
  await user.save();
  return token;
};

// ریست پسورد با توکن
exports.resetPasswordService = async (token, newPassword) => {
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, "Invalid or expired token");

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return { message: "Password reset successfully" };
};

// تایید ایمیل
exports.confirmEmailService = async (token) => {
  const user = await User.findOne({
    confirmationToken: token,
    confirmationTokenExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, "Invalid or expired token");

  user.status = "active";
  user.confirmationToken = undefined;
  user.confirmationTokenExpires = undefined;
  await user.save();
  return { message: "Email confirmed successfully" };
};

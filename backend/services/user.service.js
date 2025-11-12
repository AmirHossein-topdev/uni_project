// backend/service/user.service.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../model/User");

class UserService {
  // ایجاد کاربر جدید
  async createUser(data) {
    try {
      const user = new User(data);
      await user.save();
      return user;
    } catch (err) {
      if (err.code === 11000 && err.keyValue.email) {
        throw new Error("Email already exists");
      }
      throw err;
    }
  }

  // پیدا کردن کاربر بر اساس ایمیل
  async getUserByEmail(email) {
    const user = await User.findOne({ email }).populate("role");
    if (!user) throw new Error("User not found");
    return user;
  }

  // پیدا کردن کاربر بر اساس آی‌دی
  async getUserById(id) {
    const user = await User.findById(id).populate("role");
    if (!user) throw new Error("User not found");
    return user;
  }

  // آپدیت اطلاعات کاربر
  async updateUser(id, data) {
    try {
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      if (!updatedUser) throw new Error("User not found");
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  // حذف کاربر
  async deleteUser(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) throw new Error("User not found");
    return deletedUser;
  }

  // بررسی پسورد
  async verifyPassword(user, password) {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid password");
    return true;
  }

  // تولید توکن تایید ایمیل
  async generateConfirmationToken(user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.confirmationToken = token;
    const date = new Date();
    date.setDate(date.getDate() + 1); // 24 ساعت اعتبار
    user.confirmationTokenExpires = date;
    await user.save();
    return token;
  }

  // پیدا کردن کاربر با توکن تایید ایمیل
  async getUserByConfirmationToken(token) {
    const user = await User.findOne({
      confirmationToken: token,
      confirmationTokenExpires: { $gt: new Date() },
    });
    if (!user) throw new Error("Invalid or expired token");
    return user;
  }

  // ریست کردن پسورد
  async resetPassword(user, newPassword) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return user;
  }

  // تغییر وضعیت کاربر (active, inactive, blocked)
  async changeUserStatus(id, status) {
    if (!["active", "inactive", "blocked"].includes(status)) {
      throw new Error("Invalid status");
    }
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) throw new Error("User not found");
    return user;
  }

  // لیست کاربران با فیلتر و pagination
  async listUsers({ page = 1, limit = 10, status, role }) {
    const query = {};
    if (status) query.status = status;
    if (role) query.role = role;

    const users = await User.find(query)
      .populate("role")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    return { users, total, page, limit };
  }
}

module.exports = new UserService();

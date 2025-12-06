// backend/services/user.service.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../model/User");

class UserService {
  // =====================================
  // ✅ ایجاد کاربر جدید با ذخیره ایمیل + عکس
  // =====================================
  async createUser(data) {
    try {
      const {
        name,
        employeeCode,
        password,
        email,
        role,
        contactNumber,
        address,
        status,
        profileImage,
      } = data;

      // بررسی یکتا بودن کد کارمند
      const exist = await User.findOne({ employeeCode });
      if (exist) throw new Error("Employee code already exists");

      // بررسی یکتا بودن ایمیل
      const emailExist = await User.findOne({ email });
      if (emailExist) throw new Error("Email already exists");

      // **اینجا هش نمیکنیم** — مدل User.pre('save') یکبار هش خواهد کرد
      const user = new User({
        name,
        employeeCode,
        email,
        password, // plaintext -> model pre('save') will hash it
        role,
        contactNumber,
        address,
        status,
        profileImage,
      });

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ آپدیت کاربر + آپلود تصویر جدید
  // =====================================
  async updateUser(id, data) {
    try {
      // اگر پسورد جدید داده شد → اینجا باید هش شود (findByIdAndUpdate pre('save') را صدا نمیکند)
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) throw new Error("User not found");

      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  // بقیه متدها بدون تغییر
  async getUserByEmployeeCode(code) {
    const user = await User.findOne({ employeeCode: code }).populate("role");
    if (!user) throw new Error("User not found");
    return user;
  }

  async getUserById(id) {
    const user = await User.findById(id).populate("role");
    if (!user) throw new Error("User not found");
    return user;
  }

  async deleteUser(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) throw new Error("User not found");
    return deletedUser;
  }

  async verifyPassword(user, password) {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid password");
    return true;
  }

  async generatePasswordResetToken(user) {
    const token = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 ساعت

    await user.save();
    return token;
  }

  async getUserByResetToken(token) {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) throw new Error("Invalid or expired token");
    return user;
  }

  async resetPassword(user, newPassword) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    return user;
  }

  async changeUserStatus(id, status) {
    if (!["active", "inactive", "blocked"].includes(status)) {
      throw new Error("Invalid status");
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) throw new Error("User not found");

    return user;
  }

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

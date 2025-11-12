// backend/controller/user.controller.js
const UserService = require("../services/user.service");

class UserController {
  // ایجاد کاربر جدید
  async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // دریافت کاربر با ایمیل
  async getUserByEmail(req, res) {
    try {
      const user = await UserService.getUserByEmail(req.params.email);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // دریافت کاربر با آی‌دی
  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // آپدیت کاربر
  async updateUser(req, res) {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: updatedUser });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // حذف کاربر
  async deleteUser(req, res) {
    try {
      const deletedUser = await UserService.deleteUser(req.params.id);
      res.json({ success: true, data: deletedUser });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // بررسی پسورد
  async verifyPassword(req, res) {
    try {
      const { password } = req.body;
      const user = await UserService.getUserById(req.params.id);
      await UserService.verifyPassword(user, password);
      res.json({ success: true, message: "Password is correct" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // تولید توکن تایید ایمیل
  async generateConfirmationToken(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      const token = await UserService.generateConfirmationToken(user);
      res.json({ success: true, token });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // ریست پسورد با توکن
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const user = await UserService.getUserByConfirmationToken(token);
      await UserService.resetPassword(user, newPassword);
      res.json({ success: true, message: "Password reset successful" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // تغییر وضعیت کاربر
  async changeUserStatus(req, res) {
    try {
      const { status } = req.body;
      const user = await UserService.changeUserStatus(req.params.id, status);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // لیست کاربران با فیلتر و pagination
  async listUsers(req, res) {
    try {
      const { page, limit, status, role } = req.query;
      const result = await UserService.listUsers({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        status,
        role,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new UserController();

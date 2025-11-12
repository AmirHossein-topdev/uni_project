// backend/controller/owner.controller.js
const OwnerService = require("../services/owner.service");

class OwnerController {
  // ایجاد مالک جدید
  async createOwner(req, res) {
    try {
      const owner = await OwnerService.createOwner(req.body);
      res.status(201).json({ success: true, data: owner });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // دریافت مالک با آی‌دی
  async getOwnerById(req, res) {
    try {
      const owner = await OwnerService.getOwnerById(req.params.id);
      res.json({ success: true, data: owner });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // دریافت مالک با ایمیل
  async getOwnerByEmail(req, res) {
    try {
      const owner = await OwnerService.getOwnerByEmail(req.params.email);
      res.json({ success: true, data: owner });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // آپدیت مالک
  async updateOwner(req, res) {
    try {
      const updatedOwner = await OwnerService.updateOwner(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: updatedOwner });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // حذف مالک
  async deleteOwner(req, res) {
    try {
      const deletedOwner = await OwnerService.deleteOwner(req.params.id);
      res.json({ success: true, data: deletedOwner });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // تغییر وضعیت مالک
  async changeOwnerStatus(req, res) {
    try {
      const { status } = req.body;
      const owner = await OwnerService.changeOwnerStatus(req.params.id, status);
      res.json({ success: true, data: owner });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // لیست مالکان با فیلتر و pagination
  async listOwners(req, res) {
    try {
      const { page, limit, status, type } = req.query;
      const result = await OwnerService.listOwners({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        status,
        type,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new OwnerController();

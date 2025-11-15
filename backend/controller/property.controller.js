// backend/controller/property.controller.js
const PropertyService = require("../services/property.service");

class PropertyController {
  // ایجاد ملک جدید
  async createProperty(req, res) {
    try {
      const data = { ...req.body };

      // mainImage
      if (req.file) {
        data.mainImage = req.file.filename; // یا مسیر کامل
      }

      // gallery
      if (req.files && req.files.gallery) {
        data.gallery = req.files.gallery.map((f) => f.filename);
      }

      const property = await PropertyService.createProperty(data);
      res.status(201).json({ success: true, data: property });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // دریافت ملک با آی‌دی
  async getPropertyById(req, res) {
    try {
      const property = await PropertyService.getPropertyById(req.params.id);
      res.json({ success: true, data: property });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // آپدیت ملک
  async updateProperty(req, res) {
    try {
      const updatedProperty = await PropertyService.updateProperty(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: updatedProperty });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // حذف ملک
  async deleteProperty(req, res) {
    try {
      const deletedProperty = await PropertyService.deleteProperty(
        req.params.id
      );
      res.json({ success: true, data: deletedProperty });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // تغییر وضعیت ملک
  async changePropertyStatus(req, res) {
    try {
      const { status } = req.body;
      const property = await PropertyService.changePropertyStatus(
        req.params.id,
        status
      );
      res.json({ success: true, data: property });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // افزایش شمارنده بازدید
  async incrementViews(req, res) {
    try {
      const property = await PropertyService.incrementViews(req.params.id);
      res.json({ success: true, data: property });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // لیست ملک‌ها با فیلتر و pagination
  async listProperties(req, res) {
    try {
      const { page, limit, status, type, owner } = req.query;
      const result = await PropertyService.listProperties({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        status,
        type,
        owner,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // جستجو ملک‌ها
  async searchProperties(req, res) {
    try {
      const { keyword, page, limit } = req.query;
      if (!keyword)
        return res
          .status(400)
          .json({ success: false, message: "Keyword is required" });

      const result = await PropertyService.searchProperties({
        keyword,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new PropertyController();

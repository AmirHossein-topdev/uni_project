// backend/controller/owner.controller.js
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const OwnerService = require("../services/owner.service");

/* ------------------------- تنظیمات multer برای آپلود عکس ------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/owners");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `owner-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // حداکثر ۵ مگابایت
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("فرمت فایل باید JPG یا PNG باشد"));
    }
    cb(null, true);
  },
});

class OwnerController {
  /* -------------------------- ایجاد مالک جدید -------------------------- */
  async createOwner(req, res) {
    try {
      const {
        name,
        nationalId,
        orgId,
        email,
        phone,
        type,
        address,
        status,
        notes,
      } = req.body;

      // ✅ ولیدیشن پایه
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: "فیلدهای نام، ایمیل و شماره تماس الزامی هستند.",
        });
      }
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      const ownerData = {
        name,
        nationalId,
        orgId,
        email,
        phone,
        type,
        address,
        status,
        notes,
      };

      // ✅ اگر فایل آپلود شده بود، مسیر ذخیره را ثبت کن
      if (req.file) {
        ownerData.photo = `/uploads/owners/${req.file.filename}`;
      }

      const owner = await OwnerService.createOwner(ownerData);
      res.status(201).json({ success: true, data: owner });
    } catch (err) {
      console.error("❌ خطا در createOwner:", err.message);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  /* -------------------------- دریافت مالک با آی‌دی -------------------------- */
  async getOwnerById(req, res) {
    try {
      const owner = await OwnerService.getOwnerById(req.params.id);
      if (!owner)
        return res
          .status(404)
          .json({ success: false, message: "مالک یافت نشد" });
      res.json({ success: true, data: owner });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  /* -------------------------- دریافت مالک با ایمیل -------------------------- */
  async getOwnerByEmail(req, res) {
    try {
      const owner = await OwnerService.getOwnerByEmail(req.params.email);
      if (!owner)
        return res
          .status(404)
          .json({ success: false, message: "مالک با این ایمیل یافت نشد" });
      res.json({ success: true, data: owner });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  /* -------------------------- ویرایش مالک -------------------------- */
  async updateOwner(req, res) {
    try {
      const updatedData = req.body;
      if (req.file) {
        updatedData.photo = `/uploads/owners/${req.file.filename}`;
      }
      const updatedOwner = await OwnerService.updateOwner(
        req.params.id,
        updatedData
      );
      res.json({ success: true, data: updatedOwner });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  /* -------------------------- حذف مالک -------------------------- */
  async deleteOwner(req, res) {
    try {
      const deletedOwner = await OwnerService.deleteOwner(req.params.id);
      res.json({ success: true, data: deletedOwner });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  /* -------------------------- تغییر وضعیت مالک -------------------------- */
  async changeOwnerStatus(req, res) {
    try {
      const { status } = req.body;
      const owner = await OwnerService.changeOwnerStatus(req.params.id, status);
      res.json({ success: true, data: owner });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  /* -------------------------- لیست مالکان با فیلتر و pagination -------------------------- */
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
module.exports.upload = upload;

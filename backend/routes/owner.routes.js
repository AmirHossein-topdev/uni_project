// backend/routes/owner.routes.js
const express = require("express");
const router = express.Router();
const OwnerController = require("../controller/owner.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// اطمینان از وجود پوشه uploads/owners
const uploadPath = path.join(__dirname, "../uploads/owners");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// تنظیم مسیر ذخیره فایل‌ها
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // حداکثر حجم: 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
    }
    cb(null, true);
  },
});

// Middleware نمونه برای احراز هویت و نقش‌ها
const authMiddleware = (req, res, next) => {
  // بعداً JWT validation اضافه می‌شود
  next();
};

const roleMiddleware = (roles) => (req, res, next) => {
  // بررسی نقش کاربر در آینده اضافه می‌شود
  next();
};

// ✅ ایجاد مالک جدید
router.post("/add", upload.single("photo"), async (req, res, next) => {
  try {
    if (req.file) {
      req.body.photo = `/uploads/owners/${req.file.filename}`;
    }
    await OwnerController.createOwner(req, res);
  } catch (err) {
    console.error("❌ Error in /add route:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// دریافت مالک با ایمیل
router.get("/email/:email", authMiddleware, OwnerController.getOwnerByEmail);

// دریافت مالک با آی‌دی
router.get("/:id", authMiddleware, OwnerController.getOwnerById);

// آپدیت مالک
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  OwnerController.upload.single("photo"), // ← اضافه شد
  OwnerController.updateOwner
);

// حذف مالک
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  OwnerController.deleteOwner
);

// تغییر وضعیت مالک
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  OwnerController.changeOwnerStatus
);

// لیست مالکان با فیلتر و pagination
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  OwnerController.listOwners
);

module.exports = router;

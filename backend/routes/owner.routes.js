// backend/routes/owner.routes.js
const express = require("express");
const router = express.Router();
const OwnerController = require("../controller/owner.controller");

// Middleware placeholder برای احراز هویت و بررسی دسترسی
const authMiddleware = (req, res, next) => {
  // اینجا JWT یا session validation بذار
  // req.user = decoded user
  next();
};

const roleMiddleware = (roles) => (req, res, next) => {
  // بررسی کن req.user.role در roles باشه
  // اگر نبود:
  // return res.status(403).json({ success: false, message: "Forbidden" });
  next();
};

// ایجاد مالک جدید
router.post(
  "/add",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  OwnerController.createOwner
);

// دریافت مالک با آی‌دی
router.get("/:id", authMiddleware, OwnerController.getOwnerById);

// دریافت مالک با ایمیل
router.get("/email/:email", authMiddleware, OwnerController.getOwnerByEmail);

// آپدیت مالک
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
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

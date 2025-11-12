// backend/routes/property.routes.js
const express = require("express");
const router = express.Router();
const PropertyController = require("../controller/property.controller");

// Middleware placeholder برای احراز هویت و بررسی دسترسی
const authMiddleware = (req, res, next) => {
  // اینجا می‌تونی JWT یا session validation بذاری
  // req.user = decoded user
  next();
};

const roleMiddleware = (roles) => (req, res, next) => {
  // اینجا بررسی کن req.user.role در roles باشه
  // اگر نبود:
  // return res.status(403).json({ success: false, message: "Forbidden" });
  next();
};

// ایجاد ملک جدید
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  PropertyController.createProperty
);

// دریافت ملک با آی‌دی
router.get("/:id", authMiddleware, PropertyController.getPropertyById);

// آپدیت ملک
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  PropertyController.updateProperty
);

// حذف ملک
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  PropertyController.deleteProperty
);

// تغییر وضعیت ملک
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  PropertyController.changePropertyStatus
);

// افزایش شمارنده بازدید
router.patch("/:id/views", PropertyController.incrementViews);

// لیست ملک‌ها با فیلتر و pagination
router.get("/", authMiddleware, PropertyController.listProperties);

// جستجو ملک‌ها
router.get("/search", authMiddleware, PropertyController.searchProperties);

module.exports = router;

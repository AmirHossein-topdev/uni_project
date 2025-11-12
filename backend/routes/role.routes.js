// backend/routes/role.routes.js
const express = require("express");
const router = express.Router();
const RoleController = require("../controller/role.controller");

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

// ایجاد نقش جدید
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  RoleController.createRole
);

// دریافت نقش با آی‌دی
router.get("/:id", authMiddleware, RoleController.getRoleById);

// دریافت نقش با نام
router.get("/name/:name", authMiddleware, RoleController.getRoleByName);

// آپدیت نقش
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  RoleController.updateRole
);

// حذف نقش
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  RoleController.deleteRole
);

// تغییر وضعیت نقش
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin"]),
  RoleController.changeRoleStatus
);

// لیست نقش‌ها با فیلتر و pagination
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  RoleController.listRoles
);

module.exports = router;

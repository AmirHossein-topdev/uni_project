// backend/routes/role.routes.js
const express = require("express");
const router = express.Router();
const RoleController = require("../controller/role.controller");

// Middleware placeholder
const authMiddleware = (req, res, next) => {
  next();
};

const roleMiddleware = (roles) => (req, res, next) => {
  next();
};

// ایجاد نقش جدید
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  RoleController.createRole
);

// لیست نقش‌ها (باید قبل از :id بیاد)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  RoleController.listRoles
);

// دریافت نقش با نام (باید قبل از :id)
router.get("/name/:name", authMiddleware, RoleController.getRoleByName);

// دریافت نقش با آی‌دی
router.get("/:id", authMiddleware, RoleController.getRoleById);

// آپدیت نقش
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  RoleController.updateRole
);

// تغییر وضعیت نقش
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin"]),
  RoleController.changeRoleStatus
);

// حذف نقش
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  RoleController.deleteRole
);

module.exports = router;

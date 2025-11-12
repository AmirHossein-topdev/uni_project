// backend/routes/contract.routes.js
const express = require("express");
const router = express.Router();
const ContractController = require("../controller/contract.controller");

// Middleware placeholder برای احراز هویت و بررسی دسترسی
const authMiddleware = (req, res, next) => {
  // JWT یا session validation بذار
  // req.user = decoded user
  next();
};

const roleMiddleware = (roles) => (req, res, next) => {
  // بررسی کن req.user.role در roles باشه
  // اگر نبود:
  // return res.status(403).json({ success: false, message: "Forbidden" });
  next();
};

// ایجاد قرارداد جدید
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  ContractController.createContract
);

// دریافت قرارداد با آی‌دی
router.get("/:id", authMiddleware, ContractController.getContractById);

// آپدیت قرارداد
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  ContractController.updateContract
);

// حذف قرارداد
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  ContractController.deleteContract
);

// تغییر وضعیت قرارداد
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  ContractController.changeContractStatus
);

// لیست قراردادها با فیلتر و pagination
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "agent"]),
  ContractController.listContracts
);

module.exports = router;

// backend/routes/user.routes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");

// Middleware placeholder برای احراز هویت و رول
const authMiddleware = (req, res, next) => {
  // اینجا می‌تونی JWT یا session validation بذاری
  // req.user = decoded user
  next();
};

const roleMiddleware = (roles) => (req, res, next) => {
  // اینجا چک کن که req.user.role در roles باشه
  // اگر نبود:
  // return res.status(403).json({ success: false, message: "Forbidden" });
  next();
};

// ایجاد کاربر
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  UserController.createUser
);

// دریافت کاربر با ایمیل
router.get("/email/:email", authMiddleware, UserController.getUserByEmail);

// دریافت کاربر با آی‌دی
router.get("/:id", authMiddleware, UserController.getUserById);

// آپدیت کاربر
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  UserController.updateUser
);

// حذف کاربر
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  UserController.deleteUser
);

// بررسی پسورد
router.post(
  "/:id/verify-password",
  authMiddleware,
  UserController.verifyPassword
);

// تولید توکن تایید ایمیل
router.post(
  "/:id/generate-confirmation-token",
  authMiddleware,
  UserController.generateConfirmationToken
);

// ریست پسورد با توکن
router.post("/reset-password", UserController.resetPassword);

// تغییر وضعیت کاربر
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin"]),
  UserController.changeUserStatus
);

// لیست کاربران با فیلتر و pagination
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  UserController.listUsers
);

module.exports = router;

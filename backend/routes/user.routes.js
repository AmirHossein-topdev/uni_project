const express = require("express");
const router = express.Router();
const createUploader = require("../middleware/uploader");
const UserController = require("../controller/user.controller");

// Middleware ساده (بعداً JWT و نقش‌ها اضافه می‌کنیم)
const authMiddleware = (req, res, next) => next();
const roleMiddleware = (roles) => (req, res, next) => next();

// نقش‌های مجاز مطابق enum مدل User
const ALLOWED_ROLES = [
  "Admin",
  "Manager",
  "Agent",
  "Customer Support",
  "Accountant",
  "Inspector",
];

// ساخت uploader مخصوص کاربران
const userUpload = createUploader("users");

// =======================
// ✅ ایجاد کاربر با آپلود تصویر
// =======================
router.post("/", userUpload.single("profileImage"), async (req, res) => {
  try {
    // ✅ اعتبارسنجی role (بدون Role model)
    if (req.body.role && !ALLOWED_ROLES.includes(req.body.role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    await UserController.createUser(req, res);
  } catch (err) {
    console.error("❌ Error in POST /users:", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// =======================
// ✅ آپدیت کاربر با امکان آپلود تصویر جدید
// =======================
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  userUpload.single("profileImage"),
  async (req, res) => {
    try {
      // ✅ اعتبارسنجی role
      if (req.body.role && !ALLOWED_ROLES.includes(req.body.role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }

      await UserController.updateUser(req, res);
    } catch (err) {
      console.error("❌ Error in PUT /users/:id:", err.message);
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
);

// =======================
// ✅ دریافت کاربر با employeeCode
// =======================
router.get(
  "/employee/:code",
  authMiddleware,
  UserController.getUserByEmployeeCode,
);

// =======================
// ✅ دریافت کاربر با ID
// =======================
router.get("/:id", authMiddleware, UserController.getUserById);

// =======================
// ✅ حذف کاربر
// =======================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  UserController.deleteUser,
);

// =======================
// ✅ بررسی پسورد کاربر
// =======================
router.post(
  "/:id/verify-password",
  authMiddleware,
  UserController.verifyPassword,
);

// =======================
// ✅ تولید توکن ریست رمز عبور
// =======================
router.post(
  "/:id/reset-token",
  authMiddleware,
  UserController.generatePasswordResetToken,
);

// =======================
// ✅ ریست پسورد با توکن
// =======================
router.post("/reset-password", UserController.resetPassword);

// =======================
// ✅ تغییر وضعیت کاربر
// =======================
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin"]),
  UserController.changeUserStatus,
);

// =======================
// ✅ لیست کاربران
// =======================
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  UserController.listUsers,
);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUser,
  changePassword,
  addUser,
  getAllUsers,
  deleteUser,
  getUserById,
  forgetPassword,
  confirmEmail,
  resetPassword,
  updateUserStatus,
} = require("../controller/user.controller");

// ثبت‌نام کاربر
router.post("/register", registerUser);

// ورود کاربر
router.post("/login", loginUser);

// تغییر پسورد کاربر
router.patch("/change-password", changePassword);

// افزودن کاربر توسط Admin/Manager
router.post("/add", addUser);

// دریافت همه کاربران
router.get("/all", getAllUsers);

// دریافت یک کاربر خاص
router.get("/get/:id", getUserById);

// ویرایش اطلاعات کاربر
router.patch("/update/:id", updateUser);

// تغییر وضعیت فعال/غیرفعال کاربر
router.patch("/update-status/:id", updateUserStatus);

// فراموشی پسورد
router.patch("/forget-password", forgetPassword);

// تایید ایمیل / تایید درخواست ریست پسورد
router.patch("/confirm-email", confirmEmail);
router.patch("/reset-password", resetPassword);

// حذف کاربر
router.delete("/:id", deleteUser);

module.exports = router;

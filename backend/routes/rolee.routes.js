const express = require("express");
const router = express.Router();

// internal
const roleController = require("../controller/role.controller");

// ایجاد نقش جدید
router.post("/add", roleController.addRole);

// افزودن چند نقش همزمان
router.post("/add-all", roleController.addAllRoles);

// دریافت نقش‌های فعال
router.get("/active", roleController.getActiveRoles);

// دریافت تمام نقش‌ها
router.get("/all", roleController.getAllRoles);

// حذف نقش
router.delete("/delete/:id", roleController.deleteRole);

// دریافت یک نقش خاص
router.get("/get/:id", roleController.getSingleRole);

// ویرایش نقش
router.patch("/edit/:id", roleController.updateRole);

module.exports = router;

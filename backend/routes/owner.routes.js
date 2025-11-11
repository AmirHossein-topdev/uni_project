const express = require("express");
const router = express.Router();
const multer = require("multer");
const ownerController = require("../controller/owner.controller");

// تنظیم multer برای آپلود تصویر (در حافظه)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🟢 دریافت تک مالک
router.get("/get/:id", ownerController.getOwnerById);

// 🟢 افزودن مالک جدید (با تصویر اختیاری)
router.post("/add", upload.single("img"), ownerController.addOwner);

// 🟢 افزودن چند مالک همزمان
router.post("/add-all", ownerController.addAllOwner);

// 🟢 دریافت همه مالکان
router.get("/all", ownerController.getAllOwners);

// 🟢 دریافت مالکان فعال
router.get("/active", ownerController.getActiveOwners);

// 🔴 حذف مالک
router.delete("/delete/:id", ownerController.deleteOwner);

// 🟡 بروزرسانی مالک (PATCH) همراه با آپلود تصویر
router.patch("/edit/:id", upload.single("img"), ownerController.updateOwner);

module.exports = router;

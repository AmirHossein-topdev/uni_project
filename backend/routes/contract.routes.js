const express = require("express");
const {
  addContract,
  getContracts,
  getSingleContract,
  updateContractStatus,
  addDocumentsOrNotes,
  deleteContract,
} = require("../controller/contract.controller");

// router
const router = express.Router();

// 🟢 ایجاد قرارداد جدید
router.post("/add", addContract);

// 📃 دریافت همه قراردادها
router.get("/all", getContracts);

// 📄 دریافت یک قرارداد خاص
router.get("/:id", getSingleContract);

// 🔄 بروزرسانی وضعیت قرارداد
router.patch("/update-status/:id", updateContractStatus);

// 📝 افزودن اسناد یا یادداشت‌ها
router.patch("/add-documents-notes/:id", addDocumentsOrNotes);

// 🗑 حذف قرارداد
router.delete("/delete/:id", deleteContract);

module.exports = router;

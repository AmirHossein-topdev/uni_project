const express = require("express");
const router = express.Router();
const multer = require("multer");
const propertyController = require("../controller/property.controller");
const Property = require("../model/Property");

// 🔹 Multer برای آپلود تصاویر
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ➕ Add single property
router.post("/add", upload.array("images", 10), propertyController.addProperty);

// ➕ Add multiple properties
router.post("/add-all", propertyController.addAllProperties);

// 📋 Get all properties
router.get("/all", propertyController.getAllProperties);

// 🏷 Featured properties
router.get("/featured", propertyController.getFeaturedProperties);

// 📅 Properties with active offers
router.get("/offer", propertyController.getOfferProperties);

// 🔎 Single property
router.get("/single/:id", propertyController.getSingleProperty);

// 🔄 Update property
router.patch("/edit/:id", upload.array("images", 10), async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, property });
  } catch (err) {
    console.error("Edit Property Error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "خطا در ویرایش ملک",
        error: err.message,
      });
  }
});

// ❌ Delete property
router.delete("/:id", propertyController.deleteProperty);

// 🔎 Related properties
router.get("/related/:id", propertyController.getRelatedProperties);

// 🔍 Filter properties by query
router.get("/filter", propertyController.filterProperties);

module.exports = router;

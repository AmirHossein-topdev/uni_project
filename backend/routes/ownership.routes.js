// frontend\src\redux\features\ownershipApi.js
const express = require("express");
const router = express.Router();
const PropertyOwnership = require("../model/PropertyOwnership");

// GET schema و enum ها برای فرم داینامیک
router.get("/schema", async (req, res) => {
  try {
    const schema = PropertyOwnership.schema.obj;

    const schemaWithEnums = {};

    for (const key in schema) {
      const field = schema[key];

      // تشخیص نوع داده
      const type = field.type?.name || typeof field;

      schemaWithEnums[key] = {
        type,
        enum: field.enum || null,
        required: field.required || false,
      };
    }

    res.json(schemaWithEnums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
